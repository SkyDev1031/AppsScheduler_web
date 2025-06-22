<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppPackageController extends Controller
{
    //
    public function getAllPackages()
    {
        try {
            $packages = DB::table('app_use_infos')
                ->select(
                    'app_package_name as value',
                    'app_name as label'
                )
                ->distinct()
    
                ->union(
                    DB::table('default_apps')
                        ->select(
                            'app_package_name as value',
                            'app_name as label'
                        )
                        ->distinct()
                )
                ->orderBy('label')
                ->get();
    
            return response()->json([
                'success' => true,
                'packages' => $packages
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch packages',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    

}
