<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RuleAssignment;
use Illuminate\Support\Facades\Auth;
use App\Models\DynamicRule;

class RuleController extends Controller
{
    //
    public function getUserRules(Request $request, $researcherId)
    {
        $rules = DynamicRule::with('assignments.participant')
        ->where('researcher_id', $researcherId)
        ->get();

        return response()->json([
            'success' => true,
            'rules' => $rules
        ]);
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'track_targets' => 'required|array',
            'restrict_targets' => 'required|array',
            'condition' => 'required|array',
            'action' => 'required|array',
            'evaluation_window' => 'required|string',
            'effective_days' => 'required|array',
            'notes' => 'required|string'
        ]);
    
        $rule = DynamicRule::create(array_merge($validated, [
            'researcher_id' => Auth::id()
        ]));
    
        return response()->json([
            'success' => true,
            'rule' => $rule
        ]);
    }
    public function assign(Request $request)
    {
        $validated = $request->validate([
            'rule_id' => 'required|exists:dynamic_rules,id',
            'participant_id' => 'required|exists:appusers,id'
        ]);
    
        $rule = DynamicRule::find($validated['rule_id']);
    
        // Confirm the authenticated user is the owner
        if ($rule->researcher_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }
    
        $assignment = RuleAssignment::firstOrCreate([
            'rule_id' => $rule->id,
            'researcher_id' => $rule->researcher_id,
            'participant_id' => $validated['participant_id']
        ]);
    
        return response()->json([
            'success' => true,
            'assignment' => $assignment
        ]);
    }
    public function getRulesForParticipant($participantId)
    {
        $rules = RuleAssignment::with('rule')
            ->where('participant_id', $participantId)
            ->get()
            ->pluck('rule');

        return response()->json([
            'success' => true,
            'rules' => $rules
        ]);
    }
}
