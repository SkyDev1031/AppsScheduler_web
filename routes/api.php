<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AppController;
use App\Http\Controllers\AppUserController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StudyController;
use App\Http\Controllers\StudyParticipantRequestController;
use App\Http\Controllers\RecommendationController;
use App\Models\AppUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\QuestionnaireController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->group(function () {    
    // study group management
    Route::prefix('studies')->group(function () {
        Route::get('/',                             [StudyController::class, 'index']);
        Route::post('/',                            [StudyController::class, 'store']);
        Route::get('/{study}',                      [StudyController::class, 'show']);
        Route::put('/{study}',                      [StudyController::class, 'update']);
        Route::delete('/{study}',                   [StudyController::class, 'destroy']);
        Route::post('/with-participants',           [StudyController::class, 'getStudiesWithParticipants']);
    });

    Route::prefix('study-requests')->group(function () {
        Route::post('/',                            [StudyParticipantRequestController::class, 'invite']);   // researcher
        Route::post('/cancel',                      [StudyParticipantRequestController::class, 'cancel']);   // researcher
    });    

    Route::prefix('categories')->group(function () {
        Route::get('/',                                 [CategoryController::class, 'index']);
        Route::post('/',                                [CategoryController::class, 'store']);
        Route::get('/{id}',                             [CategoryController::class, 'show']);
        Route::put('/{id}',                             [CategoryController::class, 'update']);
        Route::delete('/{id}',                          [CategoryController::class, 'destroy']);
    });
    
    Route::prefix('recommendations')->group(function () {
        Route::get('/',                                 [RecommendationController::class, 'index']);
        Route::post('/',                                [RecommendationController::class, 'store']);
        Route::get('/{id}',                             [RecommendationController::class, 'show']);
        Route::put('/{id}',                             [RecommendationController::class, 'update']);
        Route::delete('/{id}',                          [RecommendationController::class, 'destroy']);
        Route::post('/packages',                        [RecommendationController::class, 'getAllPackages']);
        Route::post('/send-to-participants',            [RecommendationController::class, 'sendToParticipants']);
    });
    
    
    Route::prefix('questionnaires')->group(function () {
        Route::get('/',                             [QuestionnaireController::class, 'index']);
        Route::post('/',                            [QuestionnaireController::class, 'store']);
        Route::post('/{id}/assign',                 [QuestionnaireController::class, 'assignToParticipants']);
        Route::get('/{id}',                         [QuestionnaireController::class, 'show']);
        Route::put('/{id}',                         [QuestionnaireController::class, 'update']);
        Route::delete('/{id}',                      [QuestionnaireController::class, 'destroy']);
        Route::get('/{id}/responses',               [QuestionnaireController::class, 'getResponses']);
        Route::post('/summary',                     [QuestionnaireController::class, 'summary']);
    });

});


// UserController
Route::post("/login",                               [UserController::class, 'login']);
Route::post("/register",                            [UserController::class, 'register']);
Route::post("/users",                               [UserController::class, 'getUsers']);
Route::get("/users",                                [UserController::class, 'users']);
Route::get("/user",                                 [UserController::class, 'user']);
Route::post("/users/allow",                         [UserController::class, 'allowUser']);
Route::post("/users/block",                         [UserController::class, 'blockUser']);
Route::post("/users/delete",                        [UserController::class, 'deleteUser']);



// AppUserController
Route::prefix('/appusers')->group(function () {
    Route::post("/registerAppUser",                 [AppUserController::class, 'registerAppUser']);
    Route::post("/",                                [AppUserController::class, 'getAppUsers']);
    Route::post("/approved",                        [AppUserController::class, 'getApprovedAppUsers']);
    Route::post("/allow",                           [AppUserController::class, 'allowAppUser']);
    Route::post("/block",                           [AppUserController::class, 'blockAppUser']);
    Route::post("/delete",                          [AppUserController::class, 'deleteAppUser']);
    Route::post("/isActive",                        [AppUserController::class, 'isAllowParticipant']);
    Route::post("/send",                            [AppUserController::class, 'sendNotification']); 
});

// App Api Router
Route::prefix('/app')->group(function () {

    Route::get("/", [AppController::class, 'index']);
    Route::post("/checkOnlineState",                [AppController::class, 'checkOnlineState']);
    // Not used         
    Route::post("/login",                           [AppController::class, 'login']);
    Route::post("/signup",                          [AppController::class, 'signup']);
    Route::post("/phonecheckCreate",                [AppController::class, 'phonecheckCreate']);
    Route::post("/phonecheckValidate",              [AppController::class, 'phonecheckValidate']);
    Route::post("/alreadyexist",                    [AppController::class, 'isAlreadyExist']);
    // Not used    

    Route::post("/insertAppUseInfo",                [AppController::class, 'insertAppUseInfo']);
    Route::post("/insertPhoneUseInfo",              [AppController::class, 'insertPhoneUseInfo']);
    Route::post('/deleteAppInfoByPhonenumber',      [AppController::class, 'deleteAppInfoByPhonenumber']);
    Route::post('/removeall',                       [AppController::class, 'truncateAppInfo']);
    Route::post('/deletepPhoneInfoByPhonenumber',   [AppController::class, 'deletePhoneInfoByPhonenumber']);
    Route::post('/removeallphoneinfo',              [AppController::class, 'truncatePhoneInfo']);
    Route::post("/downloadToCSV",                   [AppController::class, 'downloadToCSV']);
    Route::post('/export-csv',                      [AppController::class, 'exportToCSV']);

    Route::post('/appUseInfos',                     [AppController::class, 'appUseInfos']);
    Route::post('/appUseInfoDuration',              [AppController::class, 'appUseInfoDuration']);
    Route::post('/appUseInfoFreq',                  [AppController::class, 'appUseInfoFreq']);
    Route::post('/phoneuseinfos',                   [AppController::class, 'phoneuseinfos']);
    Route::post('/phoneUseInfoByPhonenumber',       [AppController::class, 'phoneUseInfoByPhonenumber']);
});

Route::prefix('invitations')->group(function () {
    Route::get('/',                                 [StudyParticipantRequestController::class, 'myInvitations']);
    Route::post('{id}/approve',                     [StudyParticipantRequestController::class, 'approve']);
    Route::post('{id}/decline',                     [StudyParticipantRequestController::class, 'decline']);
});

Route::prefix('notifications')->group(function () {
    Route::get('/',                                 [NotificationController::class, 'index']);
    Route::post('/',                                [NotificationController::class, 'store']);
    Route::get('/{id}',                             [NotificationController::class, 'show']);
    Route::put('/{id}',                             [NotificationController::class, 'update']);
    Route::delete('/{id}',                          [NotificationController::class, 'destroy']);
    Route::post('/clear',                           [NotificationController::class, 'clear']);
    Route::put('/{id}/mark-as-read',                [NotificationController::class, 'markAsRead']);
    Route::put('/{id}/mark-as-unread',              [NotificationController::class, 'markAsUnread']);
    Route::put('/{id}/mark-all-as-read',            [NotificationController::class, 'markAllAsRead']);    
});

Route::get('/participants/{id}/questionnaires',     [AppUserController::class, 'getAssignedQuestionnaires']);
Route::post('/questionnaire-responses',             [AppUserController::class, 'submitResponses']); 
