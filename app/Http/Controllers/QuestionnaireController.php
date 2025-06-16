<?php

namespace App\Http\Controllers;
use App\Models\{Questionnaire, Question, QuestionOption, QuestionnaireAssignment, AppUser};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuestionnaireController extends Controller
{
    public function index()
    {
        try {
            $questionnaires = Questionnaire::withCount(['assignments', 'responses'])->latest()->get();

            return response()->json(["data" => $questionnaires], 200);    
        } 
        catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching questionnaires',
                'error' => $e->getMessage()
            ], 500);
        }
    }

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
        return response()->json(['data' => Questionnaire::with('questions.options')->findOrFail($id)], 200);
    }
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'researcher_id' => 'required|exists:users,id',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'questions' => 'required|array',
            'questions.*.id' => 'nullable|integer|exists:questions,id', // for existing questions
            'questions.*.text' => 'required|string',
            'questions.*.type' => 'required|in:single_choice,multi_choice,rating',
            'questions.*.rating_scale_max' => 'nullable|integer',
            'questions.*.options' => 'array', // array of text strings
            'questions.*.options.*' => 'string', // each option is just text
        ]);
    
        $questionnaire = Questionnaire::findOrFail($id);
        $questionnaire->update($request->only(['researcher_id', 'title', 'description']));
    
        // Get all current question IDs to detect deletions
        $currentQuestionIds = $questionnaire->questions()->pluck('id')->toArray();
        $updatedQuestionIds = [];
    
        foreach ($data['questions'] as $q) {
            // Update or create question
            $question = isset($q['id']) 
                ? $questionnaire->questions()->findOrFail($q['id'])
                : $questionnaire->questions()->create([
                    'text' => $q['text'],
                    'type' => $q['type'],
                    'rating_scale_max' => $q['rating_scale_max'] ?? null,
                ]);
    
            $question->update([
                'text' => $q['text'],
                'type' => $q['type'],
                'rating_scale_max' => $q['rating_scale_max'] ?? null,
            ]);
    
            $updatedQuestionIds[] = $question->id;
    
            // Handle options for choice questions
            if (in_array($q['type'], ['single_choice', 'multi_choice']) && isset($q['options'])) {
                // Delete all existing options and create new ones
                $question->options()->delete();
                
                foreach ($q['options'] as $optionText) {
                    $question->options()->create(['text' => $optionText]);
                }
            } else {
                // If question type changed from choice to rating, delete all options
                $question->options()->delete();
            }
        }
    
        // Delete questions that were removed
        $questionsToDelete = array_diff($currentQuestionIds, $updatedQuestionIds);
        if (!empty($questionsToDelete)) {
            $questionnaire->questions()->whereIn('id', $questionsToDelete)->delete();
        }
    
        return response()->json($questionnaire->load('questions.options'), 200);
    }
    
    public function destroy($id)
    {
        try {
            $questionnaire = Questionnaire::findOrFail($id);
            $questionnaire->delete();
    
            return response()->json(['message' => 'Questionnaire deleted successfully.'], 200);    
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting questionnaire',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getResponses($id)
    {
        $questionnaire = Questionnaire::with('assignments.responses.question')->findOrFail($id);
        return response()->json(['data' => $questionnaire], 200);
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
