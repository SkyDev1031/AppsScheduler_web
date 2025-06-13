<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // Import Log for debugging
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User; // Import the User model

class UserController extends Controller
{
    public function login(Request $request)
    {
        $username = $request->username;
        $password = $request->password;

        $user = User::where('username', $username)->orWhere('ScreenName', $username)->first();
        $message = null;
        if (!$user || !Hash::check($password, $user->password)) $message = 'These credentials do not match our records.';
        else if ($user->status == 'Pending') $message = 'Your account activation is pending!';
        else if ($user->status == 'Suspended') $message = 'Your accont has been suspended! Please contact with administrator!';
        else if ($user->status == 'Block') $message = 'Your accont has been suspended! Please contact with administrator!';

        if ($message) {
            return response(['message' => $message, 'success' => false], 200);
        }
        $ip = $request->ip();

        $token = $user->createToken('Personal Access Token')->accessToken;
        $userdata = array(
            'LoginIP' => $ip,
            'LoginStatus' => 1,
            'Token' => $token
        );
        User::find($user->id)->update($userdata);

        $response = ['user' => $user, 'token' => $token, 'success' => true];
        return response($response, 200);
    }


    public function register(Request $request)
    {
        $username = $request->email;
        $screenname = $request->screenName;
        $fullname = $screenname;

        $isExits = User::where('username', $username)->orwhere('ScreenName', $screenname)->orwhere('fullname', $fullname)->count() > 0;
        if ($isExits) return response(['message' => "Email or Screen Name already exits.", 'success' => false], 200);

        $phone = '';
        $password = $request->password;
        $secPassword = $request->secPassword;

        $code = rand(111111, 999999);
        $data = array(
            'username' => $username,
            'fullname' => $fullname,
            'ScreenName' => $screenname,
            'phone' => $phone,
            'password' => Hash::make($password),
            'secPassword' => Hash::make($secPassword),
            'activation_code' => $code,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
            'status' => 'Pending',
            'LoginIP' => $request->ip(),
        );
        $user = User::create($data);

        if ($user && $user->id) {
            $response = ['message' => 'You have registered successfully!', 'success' => true];
            return response($response, 200);
        } else {
            $message = 'There was a problem creating your new account. Please try again.';
            return response(['message' => $message, 'success' => false], 200);
        }
    }

    public function user()
    {
        $user = Auth::user();
        return response(['success' => true, 'data' => $user], 200);
    }
    public function users()
    {
        $users = User::get();
        return response(['success' => true, 'data' => $users], 200);
    }
    public function updatePassword(Request $request)
    {
        $user = Auth::user();
        $cur = $request->cur_pwd;
        $new_pwd = $request->new_pwd;
        $conf_new_pwd = $request->conf_new_pwd;

        $message = null;
        if (!Hash::check($cur, $user->password)) $message = 'Current password is wrong';
        if (!$new_pwd) $message = 'You must put new password';
        if (strlen($new_pwd) < 6) $message = 'Your password must be at least 6 characters long.';
        if ($new_pwd != $conf_new_pwd) $message = 'Confirm password is wrong.';

        if ($message) return response(['success' => false, 'message' => $message], 200);

        User::find($user->id)->update(['password' => Hash::make($new_pwd)]);
        return response(['success' => true, 'message' => 'Successfully updated the password.'], 200);
    }
    public function updateSecPassword(Request $request)
    {
        $user = Auth::user();
        $cur = $request->cur_pwd;
        $new_pwd = $request->new_pwd;
        $conf_new_pwd = $request->conf_new_pwd;

        $message = null;
        if (!Hash::check($cur, $user->secPassword)) $message = 'Current Secondary password is wrong';
        if (!$new_pwd) $message = 'You must put new Secondary password';
        if (strlen($new_pwd) < 6) $message = 'Your Secondary password must be at least 6 characters long.';
        if ($new_pwd != $conf_new_pwd) $message = 'Confirm Secondary password is wrong.';

        if ($message) return response(['success' => false, 'message' => $message], 200);

        User::find($user->id)->update(['secPassword' => Hash::make($new_pwd)]);
        return response(['success' => true, 'message' => 'Successfully updated the Secondary password.'], 200);
    }

    public function checkPassword(Request $request)
    {
        $check = Hash::check($request->password, Auth::user()->secPassword);
        return response(['success' => $check, 'message' => $check ? '' : 'Secondary password is wrong'], 200);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        $ScreenName = $request->ScreenName;
        $fullname = $ScreenName;
        $username = $request->username;
        User::find($user->id)->update(compact('fullname', 'ScreenName', 'username'));
        return response(['success' => true, 'message' => 'Successfully updated the profile.'], 200);
    }


    public function getUsers()
    {
        try {
            Log::info('Fetching app users...'); // Log the start of the method

            $sql = "SELECT id, 
                        ROW_NUMBER() OVER (ORDER BY id) AS `no`,
                        fullname,
                        username as email,
                        ScreenName,
                        phone,
                        `status`,
                        LoginIP,
                        LoginStatus,
                        `created_at` as registeredTime,
                        `role`
                    FROM
                        users";

            // Execute the query and fetch results
            $users = DB::select($sql);

            Log::info('Users fetched successfully', ['data' => $users]); // Log the results

            // Return the results as JSON
            return response()->json(['data' => $users]);
        } catch (\Exception $e) {
            Log::error('Error fetching users', ['error' => $e->getMessage()]); // Log any errors
            return response()->json(['error' => 'Failed to fetch users'], 500);
        }
    }

    public function allowUser(Request $request)
    {
        $id = $request->id;

        try {
            $user = User::find($id);

            if ($user) {
                $user->status = 'Active'; // Set status to Active
                $user->save();

                Log::info("User with ID {$id} has been allowed.");
                return response()->json(['message' => 'User allowed successfully.', 'success' => true], 200);
            } else {
                Log::warning("User with ID {$id} not found.");
                return response()->json(['message' => 'User not found.', 'success' => false], 404);
            }
        } catch (\Exception $e) {
            Log::error("Error allowing user with ID {$id}: " . $e->getMessage());
            return response()->json(['message' => 'Failed to allow user.', 'success' => false], 500);
        }
    }

    public function blockUser(Request $request)
    {
        $id = $request->id;

        try {
            $user = User::find($id);

            if ($user) {
                $user->status = 'Block'; // Set status to Block
                $user->save();

                Log::info("User with ID {$id} has been blocked.");
                return response()->json(['message' => 'User blocked successfully.', 'success' => true], 200);
            } else {
                Log::warning("User with ID {$id} not found.");
                return response()->json(['message' => 'User not found.', 'success' => false], 404);
            }
        } catch (\Exception $e) {
            Log::error("Error blocking user with ID {$id}: " . $e->getMessage());
            return response()->json(['message' => 'Failed to block user.', 'success' => false], 500);
        }
    }

    public function deleteUser(Request $request)
    {
        $id = $request->id;

        try {
            $user = User::find($id);

            if ($user) {
                $user->delete(); // Delete the user

                Log::info("User with ID {$id} has been deleted.");
                return response()->json(['message' => 'User deleted successfully.', 'success' => true], 200);
            } else {
                Log::warning("User with ID {$id} not found.");
                return response()->json(['message' => 'User not found.', 'success' => false], 404);
            }
        } catch (\Exception $e) {
            Log::error("Error deleting user with ID {$id}: " . $e->getMessage());
            return response()->json(['message' => 'Failed to delete user.', 'success' => false], 500);
        }
    }
}
