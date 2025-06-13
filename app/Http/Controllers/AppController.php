<?php

namespace App\Http\Controllers;

use App\Models\AppUseInfo;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\AppUser;
use App\Models\PhoneUseInfo;
use Doctrine\DBAL\Query\QueryException;
use Illuminate\Support\Facades\Hash;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\DB;

class AppController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    private array $credentials;
    public function __construct(array $credentials = [])
    {
        $this->credentials = $credentials;
    }

    public function getCredentials(): array
    {
        return $this->credentials;
    }

    public function setCredentials(array $credentials): void
    {
        $this->credentials = $credentials;
    }

    public function index()
    {
        return view('dashboard');
    }

    public function checkOnlineState()
    {
        return response('success', 200);
    }

    public function phonecheckCreate(Request $request)
    {
        /** old version using TWILIO**/
        // $sid = getenv("TWILIO_ACCOUNT_SID");
        // $token = getenv("TWILIO_AUTH_TOKEN");
        // $verificationToken = getenv("TWILIO_SERVICE_SID");
        // $phone_number = $request->phone_number;
        // $twilio = new Client($sid, $token);

        // $verification = $twilio->verify->v2
        //     ->services($verificationToken)
        //     ->verifications->create(
        //         $phone_number, // To
        //         "sms" // Channel
        //     );
        // if ($verification->status == "pending") {
        //     $response = json_encode(['message' => $verification->status, 'success' => 1]);
        //     return response($response, 200);
        // } else {
        //     $response = json_encode(['message' => 'Failed to create verification', 'success' => 0]);
        //     return response($response, 200);
        // }
        /** end old version **/

        /**new version using Vonage
        $api_key = getenv("API_KEY");
        $secret = getenv("SECRET");
        $phone_number = $request->phone_number;
        $basic  = new \Vonage\Client\Credentials\Basic("f03a6449", "h0guUkZB6nd7wZBO");
        $client = new \Vonage\Client($basic);
        // $container = new \Vonage\Client\Credentials\Container($basic);
        // $client = new \Vonage\Client($container);
        $request1 = new \Vonage\Verify\Request($phone_number, "Vonage");
        try {
            $response = $client->verify()->start($request1);
            print_r($response);
        } catch (\Exception $e) {
            echo "Error: " . $e->getMessage();
        } */
        // if ($verification->status == "pending") {
        //     $response = json_encode(['message' => $verification->status, 'success' => 1]);
        //     return response($response, 200);
        // } else {
        //     $response = json_encode(['message' => 'Failed to create verification', 'success' => 0]);
        //     return response($response, 200);
        // }

        // echo "Started verification, `request_id` is " . $response->getRequestId();
    }

    public function phonecheckValidate(Request $request)
    {
        // $sid = getenv("TWILIO_ACCOUNT_SID");
        // $token = getenv("TWILIO_AUTH_TOKEN");
        // $verificationToken = getenv("TWILIO_SERVICE_SID");
        // $twilio = new Client($sid, $token);

        // $verification_check = $twilio->verify->v2
        //     ->services($verificationToken)
        //     ->verificationChecks->create([
        //         "to" => $request->phone_number,
        //         "code" => $request->code,
        //     ]);

        // if ($verification_check->status == "approved") {
        //     $response = json_encode(['message' => "Your phone is approved", 'success' => 1]);
        //     return response($response, 200);
        // } else {
        //     $response = json_encode(['message' => "Failed to check verification", 'success' => 0]);
        //     return response($response, 200);
        // }
		/*
        $api_key = getenv("API_KEY");
        $secret = getenv("SECRET");

        $request_id = $request->request_id;
        $code = $request->code;
        $basic  = new \Vonage\Client\Credentials\Basic("f03a6449", "h0guUkZB6nd7wZBO");
        $client = new \Vonage\Client(new \Vonage\Client\Credentials\Container($basic));
        $result = $client->verify()->check($request_id, $code);
        print_r($result);*/
    }

    public function login(Request $request)
    {
        $useremail = $request->useremail;
        $password = $request->password;
        $user = AppUser::where('useremail', $useremail)->first();
        if (!$user) {
            $response = json_encode(['message' => 'Your account does not exist!', 'success' => false]);
            return response($response, 200);
        } else if (!Hash::check($password, $user->password)) {
            $response = json_encode(['message' => 'Password is incorrect!', 'success' => false]);
            return response($response, 200);
        } else {
            $response = json_encode(['message' => 'Login Success!', 'success' => true]);
            return response($response, 200);
        }
    }

    public function logout() {}
    public function signup(Request $request)
    {
        $userID = $request->userID ?? $request->username;
        $useremail = $request->useremail;
        $password = $request->password;
        $isExits = AppUser::where('useremail', $useremail)->count() > 0;
        // return response([
        //     "userID" => $userID,
        //     "useremail" => $useremail,
        //     "password" => $password
        // ], 200);
        if ($isExits) return response(json_encode(['message' => "Email already exists.", 'success' => false]), 200);

        $data = array(
            'userID' => $userID,
            'useremail' => $useremail,
            'password' => Hash::make($password)
        );
        $user = AppUser::create($data);
        if ($user && $user->id) {
            $response =  json_encode(['message' => 'You have registered successfully!', 'success' => true]);
            return response($response, 200);
        } else {
            $message = 'There was a problem creating your new account. Please try again.';
            return response(json_encode(['message' => $message, 'success' => false]), 200);
        }
        // $message = 'There was a problem creating your new account. Please try again.';
        // return response(['message' => $message, 'success' => false], 200);
    }


    public function appUseInfos()
    {
        // Define the SQL query using a readable format with updated column names
        $sql = "
            SELECT
                phonenumber,
                userID,
                app_name,
                app_start_time,
                app_end_time,
                MIN(saved_time) AS from_period,
                MAX(saved_time) AS to_period
            FROM
                app_use_infos
            GROUP BY
                phonenumber
            ORDER BY
                phonenumber ASC
        ";

        // Execute the query using the database connection
        $appUseInfos = DB::select($sql);

        // Return the response with the data
        return response()->json(['data' => $appUseInfos]);
    }


    // public function appUseInfoDuration(Request $request)
    // {
    //     // Extract request parameters
    //     $phonenumber = $request->input('phonenumber');
    //     $startDate = $request->input('startDate');
    //     $endDate = $request->input('endDate');
    //     $studyId = $request->input("studyId");

    //     // Base query using raw SQL with updated column names
    //     $sql = "
    //         SELECT
    //             phonenumber,
    //             userID,
    //             app_name,
    //             app_start_time,
    //             app_end_time,
    //             app_duration,
    //             CASE
    //                 WHEN app_scheduled_flag = 1 THEN 'Scheduled time'
    //                 WHEN app_scheduled_flag = -1 THEN 'Unscheduled time'
    //                 WHEN app_scheduled_flag = 0 THEN 'Not scheduled App'
    //                 ELSE 'Unknown Flag'
    //             END AS app_scheduled_status,
    //             saved_time
    //         FROM
    //             app_use_infos
    //     ";

    //     // Add conditions dynamically
    //     $bindings = [];
    //     if (!empty($phonenumber)) {
    //         $sql .= " WHERE phonenumber = ?";
    //         $bindings[] = $phonenumber;
    //     }

    //     if (!empty($phonenumber) && !empty($startDate) && !empty($endDate)) {
    //         $sql .= " AND saved_time >= ? AND saved_time < DATE_ADD(?, INTERVAL 1 DAY)";
    //         $bindings[] = $startDate;
    //         $bindings[] = $endDate;
    //     }

    //     // Add ordering
    //     $sql .= " ORDER BY saved_time ASC, app_name ASC";

    //     // Execute the query with parameter binding to prevent SQL injection
    //     $appUseInfos = DB::select($sql, $bindings);

    //     // Return the response
    //     return response()->json([
    //         'data' => $appUseInfos,
    //         'phonenumber' => $phonenumber,
    //     ]);
    // }


    // public function appUseInfoFreq(Request $request)
    // {
    //     // Extract request parameters
    //     $phonenumber = $request->input('phonenumber');
    //     $startDate = $request->input('startDate');
    //     $endDate = $request->input('endDate');

    //     // Base query using raw SQL with updated column names
    //     $sql = "
    //         SELECT
    //             id,
    //             phonenumber,
    //             userID,
    //             app_name,
    //             COUNT(app_name) AS frequency_app_openings,
    //             CASE
    //                 WHEN app_scheduled_flag = 1 THEN 'Scheduled time'
    //                 WHEN app_scheduled_flag = -1 THEN 'Unscheduled time'
    //                 WHEN app_scheduled_flag = 0 THEN 'Not scheduled App'
    //                 ELSE 'Unknown Flag'
    //             END as scheduled_status,
    //             DATE(saved_time) as savedTime
    //         FROM
    //             app_use_infos
    //         WHERE
    //             phonenumber = ?
    //     ";

    //     // Add conditions dynamically
    //     $bindings = [$phonenumber];

    //     if (!empty($startDate) && !empty($endDate)) {
    //         $sql .= " AND saved_time >= ? AND saved_time < DATE_ADD(?, INTERVAL 1 DAY)";
    //         $bindings[] = $startDate;
    //         $bindings[] = $endDate;
    //     }

    //     // Group by and order by
    //     $sql .= "
    //         GROUP BY
    //             app_name, app_scheduled_flag, DATE(saved_time)
    //         ORDER BY
    //             savedTime ASC,
    //             app_name ASC,
    //             frequency_app_openings DESC
    //     ";

    //     // Execute the query with parameter binding to prevent SQL injection
    //     $appUseInfos = DB::select($sql, $bindings);

    //     // Return the response
    //     return response()->json([
    //         'data' => $appUseInfos,
    //         'phonenumber' => $phonenumber,
    //     ]);
    // }


    public function appUseInfoDuration(Request $request)
    {
        $phonenumber = $request->input('phonenumber');
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $studyId = $request->input("studyId", 0);

        $bindings = [];
        $whereClauses = [];

        $sql = "
            SELECT
                a.phonenumber,
                a.userID,
                a.app_name,
                a.app_start_time,
                a.app_end_time,
                a.app_duration,
                CASE
                    WHEN a.app_scheduled_flag = 1 THEN 'Scheduled time'
                    WHEN a.app_scheduled_flag = -1 THEN 'Unscheduled time'
                    WHEN a.app_scheduled_flag = 0 THEN 'Not scheduled App'
                    ELSE 'Unknown Flag'
                END AS app_scheduled_status,
                a.saved_time
            FROM app_use_infos a
        ";

        if ($studyId > 0) {
            // Step 1: Get appusers.id from study participants
            $participantIds = DB::table('study_participant_requests')
                ->where('study_id', $studyId)
                ->where('study_status', 'Approved')
                ->pluck('participant_id')
                ->toArray();
        
            if (empty($participantIds)) {
                return response()->json([
                    'data' => [],
                    'message' => 'No approved participants found for this study.',
                    'studyId' => $studyId,
                ]);
            }
        
            // Step 2: Map those IDs to userIDs from appusers
            $userIds = DB::table('appusers')
                ->whereIn('id', $participantIds)
                ->pluck('userID')
                ->toArray();
        
            if (empty($userIds)) {
                return response()->json([
                    'data' => [],
                    'message' => 'No userIDs found in appusers table for the study participants.',
                    'studyId' => $studyId,
                ]);
            }
        
            // Step 3: Build IN clause for userID filtering in app_use_infos
            $placeholders = implode(',', array_fill(0, count($userIds), '?'));
            $whereClauses[] = "a.userID IN ($placeholders)";
            $bindings = array_merge($bindings, $userIds);
        }
        

        if (!empty($phonenumber)) {
            $whereClauses[] = "a.phonenumber = ?";
            $bindings[] = $phonenumber;
        }

        if (!empty($startDate) && !empty($endDate)) {
            $whereClauses[] = "a.saved_time >= ? AND a.saved_time < DATE_ADD(?, INTERVAL 1 DAY)";
            $bindings[] = $startDate;
            $bindings[] = $endDate;
        }

        if (!empty($whereClauses)) {
            $sql .= " WHERE " . implode(" AND ", $whereClauses);
        }

        $sql .= " ORDER BY a.saved_time ASC, a.app_name ASC";

        $appUseInfos = DB::select($sql, $bindings);

        return response()->json([
            'data' => $appUseInfos,
            'phonenumber' => $phonenumber,
            'studyId' => $studyId
        ]);
    }

    
    
    public function appUseInfoFreq(Request $request)
    {
        // Extract request parameters
        $phonenumber = $request->input('phonenumber');
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $studyId = $request->input("studyId", 0);
    
        $bindings = [];
        $whereClauses = [];
    
        // Base query
        $sql = "
            SELECT
                a.id,
                a.phonenumber,
                a.userID,
                a.app_name,
                COUNT(a.app_name) AS frequency_app_openings,
                CASE
                    WHEN a.app_scheduled_flag = 1 THEN 'Scheduled time'
                    WHEN a.app_scheduled_flag = -1 THEN 'Unscheduled time'
                    WHEN a.app_scheduled_flag = 0 THEN 'Not scheduled App'
                    ELSE 'Unknown Flag'
                END as scheduled_status,
                DATE(a.saved_time) as savedTime
            FROM
                app_use_infos a
        ";
    
        // Handle study filtering
        if ($studyId > 0) {
            // Step 1: Get participant IDs from study_participant_requests
            $participantIds = DB::table('study_participant_requests')
                ->where('study_id', $studyId)
                ->where('study_status', 'Approved')
                ->pluck('participant_id')
                ->toArray();
    
            if (empty($participantIds)) {
                return response()->json([
                    'data' => [],
                    'message' => 'No approved participants found for this study.',
                    'studyId' => $studyId,
                ]);
            }
    
            // Step 2: Get userIDs from appusers table
            $userIds = DB::table('appusers')
                ->whereIn('id', $participantIds)
                ->pluck('userID')
                ->toArray();
    
            if (empty($userIds)) {
                return response()->json([
                    'data' => [],
                    'message' => 'No userIDs found in appusers table for the study participants.',
                    'studyId' => $studyId,
                ]);
            }
    
            // Step 3: Add IN clause
            $placeholders = implode(',', array_fill(0, count($userIds), '?'));
            $whereClauses[] = "a.userID IN ($placeholders)";
            $bindings = array_merge($bindings, $userIds);
        }
    
        // Filter by phone number
        if (!empty($phonenumber)) {
            $whereClauses[] = "a.phonenumber = ?";
            $bindings[] = $phonenumber;
        }
    
        // Filter by date range
        if (!empty($startDate) && !empty($endDate)) {
            $whereClauses[] = "a.saved_time >= ? AND a.saved_time < DATE_ADD(?, INTERVAL 1 DAY)";
            $bindings[] = $startDate;
            $bindings[] = $endDate;
        }
    
        // Attach WHERE clause
        if (!empty($whereClauses)) {
            $sql .= " WHERE " . implode(" AND ", $whereClauses);
        }
    
        // Finalize with GROUP BY and ORDER BY
        $sql .= "
            GROUP BY
                a.app_name, a.app_scheduled_flag, DATE(a.saved_time)
            ORDER BY
                savedTime ASC,
                a.app_name ASC,
                frequency_app_openings DESC
        ";
    
        // Execute query
        $appUseInfos = DB::select($sql, $bindings);
    
        return response()->json([
            'data' => $appUseInfos,
            'phonenumber' => $phonenumber,
            'studyId' => $studyId
        ]);
    }
    



    public function phoneuseinfos()
    {
        $sql = "SELECT
        phonenumber,
        userID,
        SUM(phone_frequency_unlock) as phone_frequency_unlock,
        MIN(`date`) AS `periodFrom`,
        MAX(`date`) AS `periodTo`
        FROM
          phone_use_infos
            GROUP BY phonenumber
        ORDER BY phonenumber ASC";
        $phoneuseinfos = DB::select($sql);
        return response(['data' => $phoneuseinfos]);
    }

    public function phoneUseInfoByPhonenumber(Request $request)
    {
        $phonenumber = $request->phonenumber;
        if ($phonenumber == "")
            $phoneuseinfos = PhoneUseInfo::orderBy('phonenumber')->orderBy('date')->orderBy('userID')->orderBy('phone_frequency_unlock')->get();
        else
            $phoneuseinfos = PhoneUseInfo::where('phonenumber', $phonenumber)->orderBy('date')->orderBy('userID')->orderBy('phone_frequency_unlock')->get();

        return response(['data' => $phoneuseinfos, 'phonenumber' => $phonenumber]);
    }




    public function isAlreadyExist(Request $request)
    {
        $phonenumber = $request->phonenumber;
        $userID = $request->userID ?? $request->username;
        $date = $request->date;
        $exists = AppUseInfo::where('phonenumber', $phonenumber)
            ->where('userID', $userID)
            ->where('date', $date)
            ->exists();
        if ($exists)
            return response(json_encode(['message' => "true", 'success' => 1]), 200);
        return response(json_encode(['message' => "false", 'success' => 0]), 200);
    }
    public function deleteExistsData($phone_number, $userID, $date)
    {
        return true;
    }

    public function insertAppUseInfo(Request $request)
    {
        // Prepare the data to be inserted
        $data = [
            'phonenumber' => $request->phonenumber,
            'userID' => $request->userID ?? $request->username,
            'app_name' => $request->appName,
            'app_package_name' => $request->appPackageName,
            'app_start_time' => $request->appStartTime,
            'app_end_time' => $request->appEndTime,
            'app_duration' => $request->appDuration,
            'app_scheduled_flag' => $request->appScheduledFlag,
            'saved_time' => $request->savedTime ?? $request->saveTime
        ];

        // Check for duplicate based on specific fields
        $exists = AppUseInfo::where('phonenumber', $data['phonenumber'])
            ->where('userID', $data['userID'])
            ->where('app_name', $data['app_name'])
            ->where('app_start_time', $data['app_start_time'])
            ->where('app_end_time', $data['app_end_time'])
            ->where('app_duration', $data['app_duration'])
            ->where('app_scheduled_flag', $data['app_scheduled_flag'])
            ->where('saved_time', $data['saved_time'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Duplicate entry. This app usage info already exists.',
                'success' => true,
            ], 200);
        }

        try {
            // Insert the data
            $appUseInfo = AppUseInfo::create($data);
    
            if ($appUseInfo && $appUseInfo->id) {
                return response()->json([
                    'message' => 'Info registered successfully!',
                    'success' => true,
                ], 200);
            } else {
                return response()->json([
                    'message' => 'There was a problem. Please try again.',
                    'success' => false,
                ], 200);
            }
        } catch (QueryException $e) {
            if ($e->getCode() == 23000) { // Integrity constraint violation
                return response()->json([
                    'message' => 'Duplicate entry. This app usage info already exists.',
                    'success' => true, // still true because no need to re-send
                ], 200);
            }
            return response()->json([
                'message' => 'Database error.',
                'success' => false,
            ], 500);
        }
    }


    public function deleteAppInfoByPhonenumber(Request $request)
    {
        $phonenumber = $request->phonenumber;
        $res = 0;
        $res = AppUseInfo::where('phonenumber', $phonenumber)->delete();
        if ($res)
            return response("success", 200);
        else
            return response("failed", 200);
    }


    public function truncateAppInfo()
    {
        AppUseInfo::truncate();
        return response("success", 200);
    }

    public function deletePhoneInfoByPhonenumber(Request $request)
    {
        $phonenumber = $request->phonenumber;
        $res = 0;
        $res = PhoneUseInfo::where('phonenumber', $phonenumber)->delete();
        if ($res)
            return response("success", 200);
        else
            return response("failed", 200);
    }

    public function truncatePhoneInfo()
    {
        PhoneUseInfo::truncate();
        return response("success", 200);
    }

    public function insertPhoneUseInfo(Request $request)
    {
        // Extract data from the request
        $phoneNumber = $request->phonenumber;
        $userID = $request->userID ?? $request->username;
        $frequency = $request->phoneFrequencyUnlock;
        $date = $request->date;

        try {
            // Use updateOrCreate to handle both cases: update existing or create new
            $phoneUseInfo = PhoneUseInfo::updateOrCreate(
                [
                    'phonenumber' => $phoneNumber,
                    'userID' => $userID,
                    'date' => $date, // Check for an existing record with the same date
                ],
                [
                    'phone_frequency_unlock' => DB::raw("phone_frequency_unlock + $frequency"), // Increment frequency
                ]
            );

            // Check if the operation was successful
            if ($phoneUseInfo) {
                $response = json_encode(['message' => 'Info updated successfully!', 'success' => true]);
                return response($response, 200);
            } else {
                $message = 'There was a problem. Please try again.';
                return response(json_encode(['message' => $message, 'success' => false]), 200);
            }
        } catch (\Exception $e) {
            // Handle any exceptions
            $message = 'An error occurred: ' . $e->getMessage();
            return response(json_encode(['message' => $message, 'success' => false]), 500);
        }

        $message = 'There was a problem. Please try again';
        return response(json_encode(['message' => $message, 'success' => false]), 200);
    }
}
// end table -> csv // deprecated
