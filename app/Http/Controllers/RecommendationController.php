<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recommendation;
use Illuminate\Support\Facades\DB;
use App\Jobs\SendPushNotification;
use App\Models\AppUser;
use Google\Service\CloudControlsPartnerService\Console;

class RecommendationController extends Controller
{
    public function index()
    {
        return Recommendation::with('schedules', 'sends')->get();
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

    public function getAllPackages()
    {
        try {
            $packages = DB::table('app_use_infos')
                ->select(
                    'app_package_name as value', 
                    'app_name as label'
                )
                ->distinct()
                ->orderBy('app_name')
                ->get();
                
            return response()->json([
                'success' => true,
                'packages' => $packages
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch packages',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function sendToParticipants(Request $request)
    {
        $participants = $request->participants;
        $payload = $request->payload;
        foreach ($participants as $participant) {
            $appuser = AppUser::where('id', $participant)->first();
            $fcmToken = $appuser->fcm_token ?? null;
            if ($fcmToken) {
                // Dispatch the job to send push notification
                SendPushNotification::dispatch(
                    $fcmToken,
                    'Recommendations',
                    'You can select recommendation.',
                    0, // Assuming studyId is not needed here
                    'recommendation',
                    $payload
                );
            }
        }

        // return response()->json([
        //     'participants' => $request->participants,
        //     'payload' => $request->payload,
        // ], 501);
        return response()->json([
            'success' => true,
            'message' => 'Notifications sent to participants.'
        ]);
    }
}