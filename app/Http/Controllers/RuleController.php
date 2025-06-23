<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RuleAssignment;
use Illuminate\Support\Facades\Auth;
use App\Models\DynamicRule;
use App\Models\AppUser;
use App\Jobs\SendPushNotification;

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
            'effective_days' => 'required|array'
        ]);
    
        $rule = DynamicRule::create(array_merge($validated, [
            'researcher_id' => Auth::id()
        ]));
    
        return response()->json([
            'success' => true,
            'rule' => $rule
        ]);
    }

    public function update(Request $request, $id)
    {
        $rule = DynamicRule::findOrFail($id);

        // Optional: Ensure only the owner can update
        if ($rule->researcher_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'track_targets' => 'required|array',
            'restrict_targets' => 'required|array',
            'condition' => 'required|array',
            'action' => 'required|array',
            'evaluation_window' => 'required|string',
            'effective_days' => 'required|array'
        ]);

        $rule->update($validated);

        return response()->json([
            'success' => true,
            'rule' => $rule
        ]);
    }

    public function destroy($id)
    {
        try {
            $rule = DynamicRule::findOrFail($id);
    
            // Ensure only the owner can delete the rule
            if ($rule->researcher_id !== Auth::id()) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Unauthorized to delete this rule'
                ], 403);
            }
    
            // Delete associated assignments first
            RuleAssignment::where('rule_id', $id)->delete();
    
            // Delete the rule
            $rule->delete();
    
            return response()->json([
                'success' => true,
                'message' => 'Rule and its assignments deleted successfully'
            ]);
    
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete rule: ' . $e->getMessage()
            ], 500);
        }
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

    public function sendRulesToParticipants(Request $request)
    {
        $participants = $request->participants;
        $payload = $request->payload;

        foreach ($participants as $participant) {
            $appuser = AppUser::where('id', $participant)->first();
            $fcmToken = $appuser->fcm_token ?? null;
            if (!$appuser || !$fcmToken) {
                continue;
            }

            // Dispatch the job to send push notification
            SendPushNotification::dispatch(
                $fcmToken,
                'Dynamic Rules',
                'New Dynamic Rules arrived. Please click here to view them.',
                0,
                'rule',
                $payload
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Notifications sent to participants.'
        ]);

    }
}
