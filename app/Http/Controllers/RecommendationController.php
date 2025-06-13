<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recommendation;
use App\Models\RecommendedSchedule;
use App\Models\SendRecommendation;

class RecommendationController extends Controller
{
    public function index()
    {
        return Recommendation::with('schedules', 'sends')->get();
    }

    // public function store(Request $request)
    // {
    //     $data = $request->validate([
    //         'researcher_id' => 'required|exists:users,id',
    //         'title' => 'required|string|max:255',
    //         'content' => 'required|string',
    //         'schedules' => 'nullable|array',
    //         'schedules.*.app_packages' => 'required|string',
    //         'schedules.*.app_schedule_days' => 'required|string',
    //         'schedules.*.app_schedule_times' => 'required|string',
    //     ]);

    //     $recommendation = Recommendation::create($request->only('researcher_id', 'title', 'content'));

    //     foreach ($data['schedules'] ?? [] as $schedule) {
    //         $recommendation->schedules()->create($schedule);
    //     }

    //     return response()->json([
    //         'message' => 'Recommendation created',
    //         'data' => $recommendation->load('schedules')
    //     ], 201);
    // }
    
    // public function update(Request $request, $id)
    // {
    //     $recommendation = Recommendation::findOrFail($id);

    //     $recommendation->update($request->only('title', 'content'));

    //     return response()->json([
    //         'message' => 'Updated successfully',
    //         'data' => $recommendation
    //     ]);
    // }
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
}