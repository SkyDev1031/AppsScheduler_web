<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Session;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/clearapp', function () {
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    Artisan::call('view:clear');
    Artisan::call('optimize');
    Session::flush();
    return "success";
});
Route::get('/', function () {
    return view('dashboard');
});
Route::get('/login', function () {
    return view('dashboard');
});
Route::get('/login', function () {
    return view('dashboard');
});
Route::get('/logout', function () {
    Auth::logout();
    return redirect('/');
});
Route::get('/user', function () {
    return redirect('/user/dashboard');
});
Route::get('/admin', function () {
    return redirect('/admin/dashboard');
});


Route::any('user/{path}', function () {
    return view('user');
})->where('path', '.+');
Route::any('admin/{path}', function () {
    return view('admin');
})->where('path', '.+');

Route::any('/{path}', function () {
    return view('dashboard');
});
Route::any('/{path}', function () {
    return view('dashboard');
})->where('path', '.+');

