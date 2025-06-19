<?php
// namespace App\Http\Controllers;

// use App\Enums\ContractAction;
// use App\Enums\ERRORCODE;
// use App\Enums\SettingsKey;
// use App\Models\AdminSettings;
// use App\Models\AdminTemplateSettings;
// use App\Models\ClientsModel;
// use App\Models\Faq;
// use App\Models\FeesNetwork;
// use App\Models\Package;
// use App\Models\Purchase;
// use App\Models\Settings;
// use App\Models\TblAdminPayoutLog;
// use Illuminate\Http\Request;
// use App\Models\User;
// use App\Models\TblAdminReferralSetting;
// use App\Models\TblCategory;
// use App\Models\TblClientToAdminTransferLog;
// use App\Models\TblCoinComment;
// use App\Models\TblContract;
// use App\Models\TblCrypto;
// use App\Models\TblCryptoAddr;
// use App\Models\TblCryptoReferralLink;
// use App\Models\TblCryptoReferralLinkTransaction;
// use App\Models\TblFromnumber;
// use App\Models\TblMarketplace;
// use App\Models\TblNetworkCurrent;
// use App\Models\TblNetworkSetting;
// use App\Models\TblReferralLinkSetting;
// use App\Models\TblSaleLog;
// use App\Models\TblSellerRating;
// use App\Models\TblSmsSendLog;
// use App\Models\TblSponsorPayoutLog;
// use App\Models\TblStaked;
// use App\Models\TblTransfer;
// use App\Models\TblTransferPackage;
// use App\Models\TblTwilioSetting;
// use App\Models\TblWallet;
// use App\Models\TblDiscussion;
// use App\Models\TblSupportBuy;
// use App\Models\PurchaseLog;
// use Carbon\Carbon;
// use Illuminate\Support\Facades\Artisan;
// use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Facades\Auth;
// use stdClass;
// use Twilio\Rest\Client;
// use Illuminate\Support\Facades\Http; // Laravel HTTP client
// class ApiController extends Controller
// {

//     public function find_last_child($UserID, $PlaceReferralOn)
//     {
//         $LastUserID = $UserID;
//         $NewUserID = User::where(['Leg' => $PlaceReferralOn, 'ParentID' => $UserID])->value('id');
//         if (!isset($NewUserID))
//             return $LastUserID;
//         do {
//             $LastUserID = $NewUserID;
//             $NewUserID = User::where(['Leg' => $PlaceReferralOn, 'ParentID' => $NewUserID])->value('id');
//         } while (isset($NewUserID));
//         return $LastUserID;
//     }

//     public function find_least_child($UserID)
//     {
//         $PlaceReferralOn = 'Left';

//         $LeftUserID = User::where(['Leg' => $PlaceReferralOn, 'ParentID' => $UserID])->value('id');
//         $countLeftLeg = 0;
//         do {
//             $LastLeftUserID = $LeftUserID;
//             $LeftUserID = User::where(['Leg' => $PlaceReferralOn, 'ParentID' => $LeftUserID])->value('id');
//             $countLeftLeg++;
//         } while (isset($LeftUserID));

//         $PlaceReferralOn = 'Right';
//         $RightUserID = User::where(['Leg' => $PlaceReferralOn, 'ParentID' => $UserID])->value('id');
//         $countRightLeg = 0;
//         do {
//             $LastRightUserID = $RightUserID;
//             $RightUserID = User::where(['Leg' => $PlaceReferralOn, 'ParentID' => $RightUserID])->value('id');
//             $countRightLeg++;
//         } while (isset($RightUserID));

//         if ($countLeftLeg <= $countRightLeg) {
//             $LastLeftUserID = $LastLeftUserID == '' ? $UserID : $LastLeftUserID;
//             return [$LastLeftUserID, 'Left'];
//         } else {
//             $LastRightUserID = $LastRightUserID == '' ? $UserID : $LastRightUserID;
//             return [$LastRightUserID, 'Right'];
//         }
//     }

//     function updateNetworkCurrent($userid, $ParentID, $Leg, $CryptoAmount, $CryptoID, $BinaryPayoutEligible)
//     {
//         if ($ParentID != 0) {
//             $userDetails = User::find($userid);
//             $ParentID = $userDetails->ParentID;
//             if ($userDetails->Leg == 'Left') {
//                 $LeftBalance = $CryptoAmount;
//                 $RightBalance = 0;
//             } else {
//                 $RightBalance = $CryptoAmount;
//                 $LeftBalance = 0;
//             }

//             if ($userid != 0 && $userDetails->status == 'Active' && $BinaryPayoutEligible == 'Y') {
//                 $networkCurrentBalance = TblNetworkCurrent::where(['CryptoID' => $CryptoID, 'UserID' => $userid])->get();
//                 if (!empty($networkCurrentBalance) && count($networkCurrentBalance) > 0) {
//                     foreach ($networkCurrentBalance as $value) {
//                         TblNetworkCurrent::find($value->id)->update(['LeftBalance' => $value->LeftBalance + $LeftBalance, 'LeftBalance' => $value->RightBalance + $RightBalance]);
//                     }
//                 } else {
//                     $networkdata = array(
//                         'CryptoID'     => $CryptoID,
//                         'UserID'    => $userid,
//                         'LeftBalance'   => $LeftBalance,
//                         'RightBalance'  => $RightBalance
//                     );
//                     TblNetworkCurrent::create($networkdata);
//                 }
//             }
//             $this->updateNetworkCurrent($userid, $ParentID, $Leg, $CryptoAmount, $CryptoID, $BinaryPayoutEligible);
//         }
//     }

//     /**
//      * Confirm Deposit
//      */
//     public function confirmDeposit(Request $request)
//     {
//         $user_id = Auth::user()->id;
//         $cid = $request->cid;
//         $amount = $request->DepositAmount;
//         $addr = $request->ToReceiveWallet ?? '';
//         $transID = $request->TransID ?? '';
//         $hkey = $request->hkey ?? '';
//         $fee = $amount * TblCrypto::find($cid)->DepositFee / 100;

//         $deposit_id = ClientsModel::insert_deposit($cid, $amount, $addr, $transID, $user_id);
//         $this->getSponsor3Level($user_id, $deposit_id, $amount, $cid, 'D', 0);
//         ClientsModel::fees2Network($user_id, Auth::user()->sponsor, $fee, $cid, 'D', 1);

//         TblCryptoAddr::create([
//             'cid' => $cid,
//             'addr' => $addr,
//             'coin_current_bal' => 0,
//             'coin_key' => $hkey,
//             'status' => 1,
//         ]);

//         return response(['message' => 'Deposit successfully!', 'success' => true], 200);
//     }

//     /**
//      * Confirm Withdrawal
//      */
//     public function confirmWithdrawal(Request $request)
//     {
//         $user_id = Auth::user()->id;
//         $cid = $request->cid;
//         $amount = $request->HiddenActualwithdrawalAmount;
//         $withdrawalFeeType = 'Expedited';
//         $toReceiveWallet = $request->ToReceiveWallet ?? '';
//         $transID = $request->TransID ?? '';
//         $fee = $amount * TblCrypto::find($cid)->WithdrawalFee / 100;

//         $withdrawal_id = ClientsModel::insert_withdrawal($user_id, $cid, $amount, $withdrawalFeeType, $toReceiveWallet, $transID);
//         $this->getSponsor3Level($user_id, $withdrawal_id, $amount, $cid, 'W', 0);
//         ClientsModel::fees2Network($user_id, Auth::user()->sponsor, $fee, $cid, 'W', 1);

//         return response(['message' => 'Withdrawal successfully!', 'success' => true], 200);
//     }

//     /**
//      * Confirm Transfer
//      */
//     public function confirmTransfer(Request $request)
//     {
//         $user_id = Auth::user()->id;
//         $screenNamePhoneEmail = $request->ScreenNamePhoneEmail;

//         $toClientDetails = ClientsModel::get_clientByScreenNamePhoneEmail($screenNamePhoneEmail);
//         if (!$toClientDetails) {
//             return response(['message' => 'Client not found!', 'success' => false], 200);
//         } elseif ($user_id == $toClientDetails->id) {
//             return response(['message' => 'You tried to transfer to your own account!', 'success' => false], 200);
//         }

//         $cid = $request->cid;
//         $amount = $request->TransferAmount;
//         $transferFee = $request->TransferAmount * ($request->TransferFee / 100);
//         $feesType = $request->TransferFeeType;

//         $transfer_id = ClientsModel::insert_transfer($user_id, $toClientDetails->id, $cid, $amount, $transferFee, $feesType, $screenNamePhoneEmail);
//         if ($transfer_id) {
//             ClientsModel::update_sender_balance($user_id, $amount);
//             $this->getSponsor3Level($user_id, $transfer_id, $amount, $cid, 'T', 0);
//         }

//         ClientsModel::fees2Network($user_id, Auth::user()->sponsor, $transferFee, $cid, 'T', 1);

//         return response(['message' => 'Transfer confirmed successfully!', 'success' => true], 200);
//     }

//     /**
//      * Get All Cryptos
//      */
//     public function getAllCryptos()
//     {
//         $cryptos = ClientsModel::get_cryptos();
//         foreach ($cryptos as $value) {
//             $user_id = Auth::user()->id;
//             $value->balance = ClientsModel::get_final_walletsBalance($user_id, $value->id);
//             $value->total_balance = ClientsModel::get_final_walletsBalance(0, $value->id);
//             $value->staked_balance = TblStaked::where(['CryptoID' => $value->id, 'UserID' => $user_id])->sum('StakeAmount');
//         }

//         return response(['data' => $cryptos, 'success' => true], 200);
//     }

//     /**
//      * Get Discussions
//      */
//     public function discussions()
//     {
//         return response(['data' => TblDiscussion::get(), 'success' => true], 200);
//     }

//     /**
//      * Delete Discussion
//      */
//     public function deleteDiscussion($id)
//     {
//         TblDiscussion::find($id)->delete();
//         return response(['message' => 'Successfully deleted discussion', 'success' => true], 200);
//     }

//     /**
//      * Get Marketplace Items
//      */
//     public function getMarketplaceItems()
//     {
//         return response(['data' => TblMarketplace::get(), 'success' => true], 200);
//     }

//     /**
//      * Delete Marketplace Item
//      */
//     public function deleteMarketplaceItem($id)
//     {
//         TblMarketplace::find($id)->delete();
//         return response(['message' => 'Marketplace item deleted successfully!', 'success' => true], 200);
//     }
// }
