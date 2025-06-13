<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // Import Log for debugging
use Illuminate\Support\Facades\Http; // Import Http for making HTTP requests
use Google\Client; // Import the Google Client class for Firebase
use Illuminate\Http\Request;
use App\Models\AppUser; // Import the AppUser model
use App\Jobs\SendStudyNotification;
use Google\Service\Monitoring\SendNotificationChannelVerificationCodeRequest;
use App\Models\StudyParticipantRequest; // Import the StudyParticipantRequest model

class AppUserController extends Controller
{

    
    public function registerAppUser(Request $request)
    {
        $userID = $request->userID ?? $request->username;
        $phonenumber = $request->phonenumber;
        $fcmToken = $request->fcm_token; // Retrieve the fcm_token from the request

        // Check if the phone number already exists
        $isExits = AppUser::where('phonenumber', $phonenumber)->count() > 0;
        if ($isExits) {
            return response()->json(['message' => "PhoneNumber already exists.", 'success' => false], 200);
        }

        // Prepare the data for the new user
        $data = [
            'userID' => $userID,
            'phonenumber' => $phonenumber,
            'password' => "", // Default password (can be updated later)
            'fcm_token' => $fcmToken, // Save the fcm_token
        ];

        // Create the new user
        $user = AppUser::create($data);

        if ($user && $user->id) {
            // Return a success response
            return response()->json(['message' => $user->id, 'success' => true], 200);
        } else {
            // Return an error response
            return response()->json(['message' => 'There was a problem creating your new account. Please try again.', 'success' => false], 200);
        }
    }

    public function getAppUsers()
    {
        try {
            Log::info('Fetching app users...'); // Log the start of the method

            $sql = "SELECT
                id,
                ROW_NUMBER() OVER (ORDER BY id) AS `no`,
                userID,
                `status`,
                created_at
            FROM
            appusers";

            // Execute the query and fetch results
            $appusers = DB::select($sql);

            Log::info('App users fetched successfully', ['data' => $appusers]); // Log the results

            // Return the results as JSON
            return response()->json(['data' => $appusers]);
        } catch (\Exception $e) {
            Log::error('Error fetching app users', ['error' => $e->getMessage()]); // Log any errors
            return response()->json(['error' => 'Failed to fetch app users'], 500);
        }
    }

    public function getApprovedAppUsers(Request $request)
    {
        $studyID = $request->studyID;

        try {
            // \Log::info("Fetching approved app users for study ID: $studyID");
    
            $approvedParticipants = StudyParticipantRequest::with('participant')
                ->where('study_id', $studyID)
                ->where('study_status', 'Approved')
                ->get()
                ->map(function ($request, $index) {
                    return [
                        'no' => $index + 1,
                        'id' => $request->participant->id,
                        'userID' => $request->participant->userID,
                        'phonenumber' => $request->participant->phonenumber,
                        'status' => $request->participant->status,
                        'created_at' => $request->participant->created_at->format('Y-m-d H:i:s'),
                        'updated_at' => $request->participant->updated_at->format('Y-m-d H:i:s'),
                    ];
                });
    
            return response()->json(['data' => $approvedParticipants]);
    
        } catch (\Exception $e) {
            // \Log::error('Error fetching approved app users', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to fetch approved app users'], 500);
        }
    }

    public function allowAppUser(Request $request) 
    {
        $id = $request->appUserID;

        if ($id) {
            try {
                $appUser = AppUser::find($id);

                if ($appUser) {
                    $appUser->status = 'active';
                    $appUser->save();

                    // Retrieve the fcm_token and send notification
                    $fcmToken = $appUser->fcm_token;
                    if ($fcmToken) {
                        SendStudyNotification::dispatch($fcmToken, 'Account Activated', 'Your account has been activated.');
                    } else {
                        Log::warning("FCM token not found for user {$appUser->userID}");
                    }

                    Log::info("App user with ID {$id} has been allowed.");
                    return response()->json(['message' => 'App user allowed successfully.', 'status' => true]);
                } else {
                    Log::warning("App user with ID {$id} not found.");
                    return response()->json(['error' => 'App user not found.', 'status' => false], 404);
                }
            } catch (\Exception $e) {
                Log::error("Error allowing app user with ID {$id}: " . $e->getMessage());
                return response()->json(['error' => 'Failed to allow app user.', 'status' => false], 500);
            }
        } else {
            return response()->json(['error' => 'App user ID is required.', 'status' => false], 400);
        }
    }

    public function blockAppUser(Request $request)
    {
        $id = $request->appUserID;

        if ($id) {
            try {
                $appUser = AppUser::find($id);

                if ($appUser) {
                    $appUser->status = 'disenrolled';
                    $appUser->save();

                    // Retrieve the fcm_token and send notification
                    $fcmToken = $appUser->fcm_token;
                    if ($fcmToken) {
                        SendStudyNotification::dispatch($fcmToken, 'Account disenrolled', 'Your account has been disenrolled.');
                    } else {
                        Log::warning("FCM token not found for user {$appUser->userID}");
                    }

                    Log::info("App user with ID {$id} has been blocked.");
                    return response()->json(['message' => 'App user disenrolled successfully.', 'status' => true]);
                } else {
                    Log::warning("App user with ID {$id} not found.");
                    return response()->json(['error' => 'App user not found.', 'status' => false], 404);
                }
            } catch (\Exception $e) {
                Log::error("Error blocking app user with ID {$id}: " . $e->getMessage());
                return response()->json(['error' => 'Failed to disenroll app user.', 'status' => false], 500);
            }
        } else {
            return response()->json(['error' => 'App user ID is required.', 'status' => false], 400);
        }
    }

    public function deleteAppUser(Request $request)
    {
        $id = $request->appUserID;

        if ($id) {
            try {
                $appUser = AppUser::find($id);

                if ($appUser) {
                    $userID = $appUser->userID;
                    $fcmToken = $appUser->fcm_token; // Retrieve the fcm_token before deleting the user
                    $appUser->delete();

                    // Send notification using the retrieved fcm_token
                    if ($fcmToken) {
                        SendStudyNotification::dispatch($fcmToken, 'Account Deleted', 'Your account has been deleted.');
                    }

                    Log::info("App user with ID {$id} has been deleted.");
                    return response()->json(['message' => 'App user deleted successfully.', 'status' => true]);
                } else {
                    Log::warning("App user with ID {$id} not found.");
                    return response()->json(['error' => 'App user not found.', 'status' => false], 404);
                }
            } catch (\Exception $e) {
                Log::error("Error deleting app user with ID {$id}: " . $e->getMessage());
                return response()->json(['error' => 'Failed to delete app user.', 'status' => false], 500);
            }
        } else {
            return response()->json(['error' => 'App user ID is required.', 'status' => false], 400);
        }
    }


    public function isAllowParticipant(Request $request)
    {
        $participantID = $request->username;
        if ($participantID) {
            try {
                // Check if the participant is allowed
                $appUser = AppUser::where('userID', $participantID)->first();

                if ($appUser && $appUser->status === 'Active') {
                    Log::info("Participant with ID {$participantID} is allowed.");
                    return response()->json(['message' => 'Participant is allowed.', 'status' => true]);
                } else {
                    Log::warning("Participant with ID {$participantID} is not allowed.");
                    return response()->json(['error' => 'Participant is not allowed.', 'status' => false], 403);
                }
            } catch (\Exception $e) {
                Log::error("Error checking participant with ID {$participantID}: " . $e->getMessage());
                return response()->json(['error' => 'Failed to check participant status.', 'status' => false], 500);
            }
        } else {
            return response()->json(['error' => 'Participant ID is required.', 'status' => false], 400);
        }
    }
}
