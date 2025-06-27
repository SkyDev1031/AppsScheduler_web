<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudyParticipantRequest;
use App\Models\Study;
use App\Models\AppUser;
use App\Jobs\SendPushNotification;
use App\Services\FirebaseNotificationService;
use App\Events\StudyInviteStatusUpdated;
use Illuminate\Support\Facades\Notification;

class StudyParticipantRequestController extends Controller
{
    public function invite(Request $request)
    {
        $data = $request->validate([
            'study_id'       => 'required|exists:studies,id',
            'participant_id' => 'required|exists:appusers,id',
        ]);
    
        $study = Study::findOrFail($data['study_id']);
    
        // Make sure the authenticated user owns the study
        abort_unless($study->researcher_id === $request->user()->id, 403);
    
        // // Check if participant is already invited to any other study
        // $existingInvite = StudyParticipantRequest::where('participant_id', $data['participant_id'])
        //     ->whereHas('study', function ($query) use ($request) {
        //         $query->where('researcher_id', '!=', $request->user()->id);
        //     })
        //     ->whereIn('study_status', ['Pending', 'Approved'])
        //     ->first();
    
        // if ($existingInvite) {
        //     return response()->json([
        //         'status' => 'error',
        //         'message' => 'This participant is already invited to another study.',
        //         'existing_invite' => [
        //             'study_title' => $existingInvite->study->title,
        //             'status' => $existingInvite->study_status
        //         ]
        //     ], 200);
        // }
    
        // Try to find or create the invite
        [$invite, $created] = StudyParticipantRequest::firstOrCreate(
            $data,
            ['study_status' => 'Pending']
        )->wasRecentlyCreated
            ? [$invite = StudyParticipantRequest::where($data)->first(), true]
            : [$invite = StudyParticipantRequest::where($data)->first(), false];
    
        if ($created) {
            // Send a notification to the participant
            SendPushNotification::dispatch(
                $invite->participant->fcm_token,
                'Study Invitation',
                "You have been invited to participate in the study: {$study->title}.",
                $study->id,
                "invitation"
            );
            return response()->json([
                'status' => 'success',
                'message' => 'Invite sent successfully.',
                'invite' => $invite,
            ], 201);
        } else {
            return response()->json([
                'status' => 'duplicate',
                'message' => 'This participant has already been invited to this study.',
                'invite' => $invite,
            ], 200);
        }
    }
    
    public function cancel(Request $request)
    {
        // 1. Validate the incoming study & participant IDs
        $data = [
            'study_id'       => $request->study_id,
            'participant_id' => $request->participant_id
        ];

        // 2. Locate the invite that matches BOTH ids
        $invite = StudyParticipantRequest::where($data)->firstOrFail();
        // print_r($invite);
        if (!$invite) {
            return response()->json(['message' => 'No matching invite found.'], 404);
        }
        // 3. Make sure the caller owns the study
        abort_unless(
            $invite->study->researcher_id === $request->user()->id, 
            403, 
            'Unauthorized'
        );

        // // 4. (Optional) only allow cancelling if still pending
        // abort_if(
        //     $invite->status !== 'pending',
        //     400,
        //     'Cannot cancel processed invite'
        // );

        $invite->delete();
        SendPushNotification::dispatch(
            $invite->participant->fcm_token,
            'Invitation Cancelled',
            "The invitation to participate in the study: {$invite->study->title} has been cancelled.",
            $invite->study->id,
            "invitation-cancel"
        );
        return response()->json(['message' => 'deleted successfully.', 'invite' => $invite], 200);
    }

    /* ───────────────────────────── PARTICIPANT SIDE ────────────────────────── */

    // GET /api/my-invitations
    public function myInvitations(Request $request)
    {
        $appUser = AppUser::find($request->user()->id); // Retrieve the authenticated user directly
        if (!$appUser) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return $appUser->invitations()
                       ->with('study:id,title,description')
                       ->orderByDesc('created_at')
                       ->get();
    }

    public function approve(Request $request, $id)
    {
        $request->validate([
            'study_id' => 'required|exists:studies,id',
        ]);
    
        $appUserId = (int) $id;
        $studyId = (int) $request->study_id;
        $invite = StudyParticipantRequest::where('participant_id', $appUserId)
                                         ->where('study_id', $studyId)
                                         ->whereIn('study_status', ['Pending', 'Declined'])
                                         ->first();
    
        if (!$invite) {
            return response()->json(['message' => 'Invitation not found or already processed'], 404);
        }
    
        $invite->update(['study_status' => 'Approved']);
        
        // Send a notification to the researcher
         
        // $notificationData = [
        //     'id_appuser' => $appUserId,
        //     'title' => 'Invitation Approved',
        //     'content' => "The participant has approved the invitation for the study: {$invite->study->title}.",
        //     'read_status' => 0,
        //     'type' => 'invitation-approved'
        // ];
    
        // app('App\Http\Controllers\NotificationController')->store(new Request($notificationData));
    

        return response()->json(['message' => 'Invitation approved']);
    }
    
    public function decline(Request $request, $id)
    {
        $request->validate([
            'study_id' => 'required|exists:studies,id',
        ]);
    
        $appUserId = (int) $id;
        $studyId = (int) $request->study_id;
    
        $invite = StudyParticipantRequest::where('participant_id', $appUserId)
                                         ->where('study_id', $studyId)
                                         ->whereIn('study_status', ['Pending', 'Approved'])
                                         ->first();
    
        if (!$invite) {
            return response()->json(['message' => 'Invitation not found or already processed'], 404);
        }
    
        $invite->update(['study_status' => 'Declined']);
        // Send a notification to the researcher
         
        // $notificationData = [
        //     'id_appuser' => $appUserId,
        //     'title' => 'Invitation Declined',
        //     'content' => "The participant has declined the invitation for the study: {$invite->study->title}.",
        //     'read_status' => 0,
        //     'type' => 'invitation-declined'
        // ];
    
        // app('App\Http\Controllers\NotificationController')->store(new Request($notificationData));

        return response()->json(['message' => 'Invitation declined']);
    }
    
}
