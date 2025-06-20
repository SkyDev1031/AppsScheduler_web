<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {

        if (!$request->expectsJson()) {
            if ($request->is('api/*')) {
                abort(response()->json(['message' => "Your personal access token expired", "logout" => true, 'success' => false], 200));
            }
            return route('login');
        }
    }
}
