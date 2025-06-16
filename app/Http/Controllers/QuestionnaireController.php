<?php

namespace App\Http\Controllers;
use App\Models\{Questionnaire, Question, QuestionOption, QuestionnaireAssignment, AppUser};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuestionnaireController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'researcher_id' => 'required|exists:users,id',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'questions' => 'required|array',
            'questions.*.text' => 'required|string',
            'questions.*.type' => 'required|in:single_choice,multi_choice,rating',
            'questions.*.rating_scale_max' => 'nullable|integer',
            'questions.*.options' => 'array'
        ]);

        $questionnaire = Questionnaire::create($request->only(['researcher_id', 'title', 'description']));

        foreach ($data['questions'] as $q) {
            $question = $questionnaire->questions()->create([
                'text' => $q['text'],
                'type' => $q['type'],
                'rating_scale_max' => $q['rating_scale_max'] ?? null,
            ]);

            if (in_array($q['type'], ['single_choice', 'multi_choice']) && isset($q['options'])) {
                foreach ($q['options'] as $opt) {
                    $question->options()->create(['text' => $opt]);
                }
            }
        }

        return response()->json($questionnaire->load('questions.options'), 201);
    }

    public function assignToParticipants(Request $request, $id)
    {
        $request->validate([
            'participants' => 'required|array',
            'participants.*' => 'exists:appusers,id',
        ]);

        $questionnaire = Questionnaire::findOrFail($id);

        foreach ($request->participants as $pid) {
            QuestionnaireAssignment::firstOrCreate([
                'questionnaire_id' => $id,
                'participant_id' => $pid,
            ], [
                'assigned_at' => now(),
            ]);

            // Optional: Push notification logic
        }

        return response()->json(['message' => 'Questionnaire assigned successfully.']);
    }

    public function show($id)
    {
        return Questionnaire::with('questions.options')->findOrFail($id);
    }

    public function getResponses($id)
    {
        $questionnaire = Questionnaire::with('assignments.responses.question')->findOrFail($id);
        return response()->json($questionnaire);
    }

    public function summary()
    {
        try {
            $questionnaires = Questionnaire::withCount([
                'assignments',
                'assignments as completed_count' => function($query) {
                    $query->whereNotNull('completed_at');
                },
                'assignments as pending_count' => function($query) {
                    $query->whereNull('completed_at');
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get();

            return response()->json(["success" => true, "data" =>
                $questionnaires->map(function($questionnaire) {
                    return [
                        'id' => $questionnaire->id,
                        'title' => $questionnaire->title,
                        'total_assigned' => $questionnaire->assignments_count,
                        'completed' => $questionnaire->completed_count,
                        'pending' => $questionnaire->pending_count
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching summary',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
