<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use App\Services\WebSocketNotifier;
use App\Events\NotificationSent; // Import the event
use Illuminate\Support\Facades\Log; // Import Log for debugging
use App\Models\StudyParticipantRequest;
use App\Models\Study;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    // public function index(Request $request)
    // {
    //     $userId = $request->user_id;
    
    //     if (!$userId) {
    //         // If no user_id is provided, return all notifications
    //         $notifications = Notification::orderBy('accept_time', 'desc')->get();
    //     } else {
    //         // Get studies managed by this user
    //         $studyIds = Study::where('researcher_id', $userId)->pluck('id');
    
    //         // Get participant IDs from those studies
    //         $participantIds = StudyParticipantRequest::whereIn('study_id', $studyIds)
    //             ->pluck('participant_id');
    
    //         // Get notifications for those AppUsers
    //         $notifications = Notification::whereIn('id_appuser', $participantIds)
    //             ->orderBy('accept_time', 'desc')
    //             ->get();
    //     }
    
    //     return response()->json([
    //         'data' => $notifications,
    //         'message' => 'Notifications retrieved successfully.',
    //         'success' => true,
    //     ], 200);
    // }
    
    public function index(Request $request)
    {
        $userId = $request->user_id;
        if (!$userId) {
            // Return all notifications joined with appusers
            $notifications = DB::table('notifications')
                ->join('appusers', 'notifications.id_appuser', '=', 'appusers.id')
                ->orderBy('notifications.accept_time', 'desc')
                ->select(
                    'notifications.*',
                    'appusers.userID as userID'
                )
                ->get();
        } else {
            // Get studies managed by this researcher
            $studyIds = DB::table('studies')
                ->where('researcher_id', $userId)
                ->pluck('id');
    
            // Get participant IDs in those studies
            $participantIds = DB::table('study_participant_requests')
                ->whereIn('study_id', $studyIds)
                ->pluck('participant_id');
    
            // Get notifications joined with appusers, filtered by those participant IDs
            $notifications = DB::table('notifications')
                ->join('appusers', 'notifications.id_appuser', '=', 'appusers.id')
                ->whereIn('notifications.id_appuser', $participantIds)
                ->orderBy('notifications.accept_time', 'desc')
                ->select(
                    'notifications.*',
                    'appusers.userID as userID'
                )
                ->get();
        }
    
        return response()->json([
            'data' => $notifications,
            'message' => 'Notifications retrieved successfully.',
            'success' => true,
        ], 200);
    }


    public function store(Request $request, WebSocketNotifier $notifier)
    {
        $validated = $request->validate([
            'id_appuser' => 'required|integer',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'read_status' => 'boolean',
            'accept_time' => 'nullable|date',
            'read_time' => 'nullable|date',
        ]);
    
        $validated['accept_time'] = now();
        // print_r($validated);
        try {
            $notification = Notification::create($validated);
    
            // ✅ Get userID from appusers
            $userID = DB::table('appusers')
                ->where('id', $validated['id_appuser'])
                ->value('userID');
    
            // Step 1: Get studies where the AppUser is a participant
            $studyIds = DB::table('study_participant_requests')
                ->where('participant_id', $validated['id_appuser'])
                ->pluck('study_id');
    
            // Step 2: Get unique researcher_ids for those studies
            $researcherIds = DB::table('studies')
                ->whereIn('id', $studyIds)
                ->pluck('researcher_id')
                ->unique();
    
            // ✅ Include userID in the message
            $message = [
				'id' => $notification->id,
                'title' => $validated['title'],
                'content' => $validated['content'],
                'read_status' => false,
                'accept_time' => $validated['accept_time'],
                'userID' => $userID,
            ];
    
            // Step 3: Send to each researcher via WebSocket
            foreach ($researcherIds as $researcherId) {
                try {
                    $notifier->sendToUser($researcherId, $message);
//                    event(new NotificationSent($message, $researcherId));

                } catch (\Exception $e) {
                    return response()->json(['error' => "Failed to notify researcher $researcherId: " . $e->getMessage()], 500);
                }
            }
    
            return response()->json([
                'data' => $message,
                'message' => 'Notification created and sent to researchers successfully.',
                'success' => true,
            ], 200);
        } catch (\Exception $e) {
            print_r($e->getMessage());
            return response()->json([
                'message' => 'There was a problem creating the notification. Please try again.',
                'success' => false,
            ], 200);
        }
    }
        

    public function show($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json([
                'message' => 'Notification not found.',
                'success' => false,
            ], 200);
        }

        return response()->json([
            'data' => $notification,
            'message' => 'Notification retrieved successfully.',
            'success' => true,
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json([
                'message' => 'Notification not found.',
                'success' => false,
            ], 200);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'read_status' => 'sometimes|boolean',
            'accept_time' => 'nullable|date',
            'read_time' => 'nullable|date',
        ]);

        try {
            $notification->update($validated);

            return response()->json([
                'data' => $notification,
                'message' => 'Notification updated successfully.',
                'success' => true,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'There was a problem updating the notification. Please try again.',
                'success' => false,
            ], 200);
        }
    }

    public function destroy($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json([
                'message' => 'Notification not found.',
                'success' => false,
            ], 200);
        }

        try {
            $notification->delete();

            return response()->json([
                'message' => 'Notification deleted successfully.',
                'success' => true,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'There was a problem deleting the notification. Please try again.',
                'success' => false,
            ], 200);
        }
    }

    public function clear()
    {
        try {
            // Delete all notifications
            Notification::truncate();
    
            return response()->json([
                'message' => 'All notifications cleared successfully.',
                'success' => true,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'There was a problem clearing notifications. Please try again.',
                'success' => false,
            ], 500);
        }
    }

    public function markAsRead($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json([
                'message' => 'Notification not found.',
                'success' => false,
            ], 200);
        }

        try {
            $notification->read_status = true;
            $notification->read_time = now();
            $notification->save();

            return response()->json([
                'data' => $notification,
                'message' => 'Notification marked as read successfully.',
                'success' => true,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'There was a problem marking the notification as read. Please try again.',
                'success' => false,
            ], 200);
        }
    }
    public function markAsUnread($id) 
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json([
                'message' => 'Notification not found.',
                'success' => false,
            ], 200);
        }

        try {
            $notification->read_status = false;
            $notification->read_time = null;
            $notification->save();

            return response()->json([
                'data' => $notification,
                'message' => 'Notification marked as unread successfully.',
                'success' => true,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'There was a problem marking the notification as unread. Please try again.',
                'success' => false,
            ], 200);
        }

    }
    public function markAllAsRead()
    {
        try {
            $notifications = Notification::where('read_status', false)->get();

            foreach ($notifications as $notification) {
                $notification->read_status = true;
                $notification->read_time = now();
                $notification->save();
            }

            return response()->json([
                'message' => 'All notifications marked as read successfully.',
                'success' => true,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'There was a problem marking all notifications as read. Please try again.',
                'success' => false,
            ], 200);
        }
    }
}
