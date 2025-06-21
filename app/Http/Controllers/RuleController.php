<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RuleAssignment;
use Illuminate\Support\Facades\Auth;
use App\Models\DynamicRule;

class RuleController extends Controller
{
    //
    public function getUserRules(Request $request)
    {
        $researcherId = Auth::user()->id ?? $request->user()->id;
        $assignments = RuleAssignment::with('rule', 'participant')
        ->where('researcher_id', $researcherId)
        ->get();

        return response()->json([
            'success' => true,
            'assignments' => $assignments
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
            'effective_days' => 'required|array'
        ]);

        $rule = DynamicRule::create($validated);

        return response()->json([
            'success' => true,
            'rule' => $rule
        ]);
    }

    public function assign(Request $request)
    {
        $validated = $request->validate([
            'rule_id' => 'required|exists:dynamic_rules,id',
            'researcher_id' => 'required|exists:users,id',
            'participant_id' => 'required|exists:appusers,id'
        ]);

        $assignment = RuleAssignment::create($validated);

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

    public function getRulesForResearcher($researcherId)
    {
        $assignments = RuleAssignment::with('rule', 'participant')
            ->where('researcher_id', $researcherId)
            ->get();

        return response()->json([
            'success' => true,
            'assignments' => $assignments
        ]);
    }
}
