<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recommendation;
use Illuminate\Support\Facades\DB;
use App\Jobs\SendPushNotification;
use App\Models\AppUser;
use Google\Service\CloudControlsPartnerService\Console;
use Google\Service\Slides\Autofit;
use App\Models\SendRecommendation;
use Illuminate\Support\Facades\Auth;

class RecommendationController extends Controller
{
    public function index()
    {
        $researcherId = Auth::id();
        if (!$researcherId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return Recommendation::with('schedules', 'sends')->where('researcher_id', $researcherId)->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'researcher_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'schedules' => 'array',
            'schedules.*.app_packages' => 'required|string',
            'schedules.*.app_schedule_days' => 'required|string',
            'schedules.*.app_schedule_times' => 'required|string',
        ]);

        // Create recommendation
        $recommendation = Recommendation::create([
            'researcher_id' => $data['researcher_id'],
            'title' => $data['title'],
            'content' => $data['content'],
        ]);

        // Create schedules if any
        if (!empty($data['schedules'])) {
            foreach ($data['schedules'] as $schedule) {
                $recommendation->schedules()->create($schedule);
            }
        }

        return response()->json($recommendation->load('schedules'), 201);
    }

    public function update(Request $request, $id)
    {
        $recommendation = Recommendation::findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'schedules' => 'array',
            'schedules.*.id' => 'sometimes|exists:recommended_schedules,id',
            'schedules.*.app_packages' => 'required_with:schedules|string',
            'schedules.*.app_schedule_days' => 'required_with:schedules|string',
            'schedules.*.app_schedule_times' => 'required_with:schedules|string',
        ]);

        // Update recommendation data
        $recommendation->update($request->only('title', 'content'));

        if (isset($data['schedules'])) {
            // Simple approach: Delete existing and recreate
            $recommendation->schedules()->delete();

            foreach ($data['schedules'] as $schedule) {
                $recommendation->schedules()->create($schedule);
            }
        }

        return response()->json($recommendation->load('schedules'));
    }
    public function show($id)
    {
        return Recommendation::with('schedules', 'sends')->findOrFail($id);
    }


    public function destroy($id)
    {
        Recommendation::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }


    public function sendToParticipants(Request $request)
    {
        $participants = $request->participants;
        $payload = $request->payload;

        foreach ($participants as $participant) {
            $appuser = AppUser::where('id', $participant)->first();
            $fcmToken = $appuser->fcm_token ?? null;
            if (!$appuser || !$fcmToken) {
                continue;
            }
            // // 1. Create send_recommendations entry
            foreach($payload as $item) {
                $sendRecommendation = SendRecommendation::create([
                    'recommendation_id' => $item["id"],
                    'researcher_id'     => $item["researcher_id"],
                    'participant_id'    => $participant,
                    'send_time'         => now(),
                    'status'            => 'pending',
                ]);
            }

            // Dispatch the job to send push notification
            SendPushNotification::dispatch(
                $fcmToken,
                'Recommendations',
                'New recommendations arrived. Please click here to view them.',
                0,
                'recommendation',
                $payload
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Notifications sent to participants.'
        ]);
    }
}