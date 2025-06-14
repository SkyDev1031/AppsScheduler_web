<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Study;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StudyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    // Get all studies
    public function index(Request $request)
    {
        $query = Study::with(['researcher', 'invitations.participant']); // ← key update
    
        if ($request->has('researcher_id')) {
            $query->where('researcher_id', $request->researcher_id);
        }
    
        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%'.$request->search.'%')
                  ->orWhere('study_code', 'like', '%'.$request->search.'%');
            });
        }
    
        return response()->json($query->paginate(10));
    }

    // Create a new study
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'study_code' => 'nullable|string|unique:studies',
        ]);

        $study = Study::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'study_code' => $validated['study_code'] ?? $this->generateStudyCode(),
            'researcher_id' => Auth::user()->id
        ]);

        return response()->json($study, 201);
    }

    // Generate unique study code
    protected function generateStudyCode()
    {
        do {
            $code = Str::upper(Str::random(6));
        } while (Study::where('study_code', $code)->exists());

        return $code;
    }

    // Get a single study
    public function show(Study $study)
    {
        return response()->json($study->load(['researcher', 'participants', 'requests']));
    }

    // Update a study
    public function update(Request $request, Study $study)
    {
        $this->authorize('update', $study);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'study_code' => [
                'sometimes',
                'string',
                Rule::unique('studies')->ignore($study->id)
            ]
        ]);

        $study->update($validated);

        return response()->json($study);
    }

    // Delete a study
    public function destroy(Study $study)
    {
        // $this->authorize('delete', $study);
        
        $study->delete();
        
        return response()->json(null, 204);
    }

    public function getStudiesWithParticipants(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Fetch studies for the current researcher along with their participants
        // $studies = Study::where('researcher_id', $user->id)->get();
        // return response()->json($studies);

        $studies = Study::with(['participants:id,userID'])
            ->where('researcher_id', $user->id)
            ->get()
            ->map(function ($study) {
                return [
                    'studyGroup' => $study->title,
                    'participants' => $study->participants->map(function ($participant) {
                        return [
                            'id' => $participant->id,
                            'userID' => $participant->userID,
                        ];
                    }),
                ];
            });

        return response()->json(['data' => $studies, 'success' => true]);
    }
}
