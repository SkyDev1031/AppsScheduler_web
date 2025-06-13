<?php

namespace App\Http\Controllers;

use App\Models\AppUseInfo;
use App\Models\PhoneUseInfo;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\PurchaseLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // $purchasedLog = PurchaseLog::all();

        // return view('admin', compact('purchasedLog'));
    }

//     public function appUseInfos()
//     {
//         $sql = "SELECT
//         phonenumber,
//         username,
//         app_package_name,
//         app_last_item_used,
//         `from`,
//         `to`,
//         MAX(`date`) AS `date`
//         FROM
//           app_use_infos
//             GROUP BY phonenumber
//         ORDER BY phonenumber ASC";
//         $appuseinfos = DB::select($sql);
//         return view('appuseinfo', compact('appuseinfos'));
// }
//     public function appUseInfoByPhonenumber(Request $request)
//     {
//         $phonenumber = $request->phonenumber;
//         // $phonenumber = $request->phonenumber;
//         $appuseinfos = AppUseInfo::where('phonenumber', '+' . $phonenumber)->orderBy('date')->orderBy('username')->orderBy('app_package_name')->get();
//         return view('appuseinfodetail', ['appuseinfos' => $appuseinfos, 'phonenumber' => $phonenumber]);
//     }
//     public function appUseInfoFreq(Request $request)
//     {
//         $phonenumber = $request->phonenumber;
//         $sql = "select
//                 id,
//                 phonenumber,
//                 username,
//                 app_package_name,
//                 count(app_package_name) as frequency_app_openings,
//                 `date`
//                 from
//                 app_use_infos
//                 where phonenumber='+$phonenumber'
//                 group by app_package_name
//                 order by app_package_name";
//         $appuseinfos = DB::select($sql);
//         return view('appuseinfofreq', ['appuseinfos' => $appuseinfos, 'phonenumber' => $phonenumber]);
//     }
//     public function phoneuseinfos()
//     {
//         $sql = "SELECT
//         phonenumber,
//         username,
//         SUM(phone_frequency_unlock) as phone_frequency_unlock,
//         MAX(`date`) AS `date`
//         FROM
//           phone_use_infos
//             GROUP BY phonenumber
//         ORDER BY phonenumber ASC";
//         $phoneuseinfos = DB::select($sql);
//         return view('phoneuseinfo', ['phoneuseinfos' => $phoneuseinfos]);
//     }

//     public function phoneUseInfoNyPhonenumber(Request $request)
//     {
//         $phonenumber = $request->phonenumber;
//         // echo $phonenumber;
//         // return $phonenumber;
//         // $phonenumber = $request->phonenumber;
//         $phoneuseinfos = PhoneUseInfo::where('phonenumber', '+' . $phonenumber)->orderBy('date')->orderBy('username')->orderBy('phone_frequency_unlock')->get();
//         return view('phoneuseinfodetail', ['phoneuseinfos' => $phoneuseinfos, 'phonenumber' => $phonenumber]);
//     }

}
