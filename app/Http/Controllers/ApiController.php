<?php

namespace App\Http\Controllers;

use App\Enums\ContractAction;
use App\Enums\ERRORCODE;
use App\Enums\SettingsKey;
use App\Models\AdminSettings;
use App\Models\AdminTemplateSettings;
use App\Models\ClientsModel;
use App\Models\Faq;
use App\Models\FeesNetwork;
use App\Models\Package;
use App\Models\Purchase;
use App\Models\Settings;
use App\Models\TblAdminPayoutLog;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TblAdminReferralSetting;
use App\Models\TblCategory;
use App\Models\TblClientToAdminTransferLog;
use App\Models\TblCoinComment;
use App\Models\TblContract;
use App\Models\TblCrypto;
use App\Models\TblCryptoAddr;
use App\Models\TblCryptoReferralLink;
use App\Models\TblCryptoReferralLinkTransaction;
use App\Models\TblFromnumber;
use App\Models\TblMarketplace;
use App\Models\TblNetworkCurrent;
use App\Models\TblNetworkSetting;
use App\Models\TblReferralLinkSetting;
use App\Models\TblSaleLog;
use App\Models\TblSellerRating;
use App\Models\TblSmsSendLog;
use App\Models\TblSponsorPayoutLog;
use App\Models\TblStaked;
use App\Models\TblTransfer;
use App\Models\TblTransferPackage;
use App\Models\TblTwilioSetting;
use App\Models\TblWallet;
use App\Models\TblDiscussion;
use App\Models\TblSupportBuy;
use App\Models\PurchaseLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use stdClass;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Http; // Laravel HTTP client
class ApiController extends Controller
{
    // Bitquery Settings
    public function getBitquerySettings()
    {
        $data = Settings::where('key', SettingsKey::BITQUERY)->get();
        return response(['data' => $data, 'success' => true], 200);
    }
    public function updateBitquerySettings(Request $request)
    {
        $id = $request->id;
        $data = $request->except("id");
        $data['key']  = SettingsKey::BITQUERY;
        Settings::updateOrCreate(['id' => $id], $data);
        return response(['message' => $id == 0 ? 'Successfully added the api' : 'Successfully updated the api', 'success' => true], 200);
    }
    public function deleteBitquerySettings($id)
    {
        Settings::find($id)->delete();
        return response(['message' => 'Successfully deleted the api!', 'success' => true], 200);
    }
    public function getBitqueryTemplateSettings()
    {
        $isRegistration = AdminTemplateSettings::where('field', SettingsKey::ADMINTEMPLATEISREGISTRATION)->get()->first();
        $register = AdminTemplateSettings::where('field', SettingsKey::ADMINTEMPLATEUSERLIMIT)->get()->first();
        $data = ["isRegistration" => $isRegistration->value, "register" => $register->value];
        return response(['success' => true, 'data' => $data], 200);
    }
    public function updateBitqueryTemplateSettings(Request $request)
    {
        $data = $request->except("id");
        $result = AdminTemplateSettings::updateOrCreate(["field" => $data["key"]], ["value" => $data["value"]]);
        return response(['message' => 'Successfully Updated', 'success' => true], 200);
    }


    public function find_last_child($UserID, $PlaceReferralOn)
    {
        $LastUserID = $UserID;
        $NewUserID = User::where(['Leg' => $PlaceReferralOn, 'ParentID' => $UserID])->value('id');
        if (!isset($NewUserID))
            return $LastUserID;
        do {
            $LastUserID = $NewUserID;
            $NewUserID = User::where(['Leg' => $PlaceReferralOn, 'ParentID' => $NewUserID])->value('id');
        } while (isset($NewUserID));
        return $LastUserID;
    }

    public function find_least_child($UserID)
    {
        $PlaceReferralOn = 'Left';

        $LeftUserID = User::where(['Leg' => $PlaceReferralOn, 'ParentID' => $UserID])->value('id');
        $countLeftLeg = 0;
        do {
            $LastLeftUserID = $LeftUserID;
            $LeftUserID = User::where(['Leg' => $PlaceReferralOn, 'ParentID' => $LeftUserID])->value('id');
            $countLeftLeg++;
        } while (isset($LeftUserID));

        $PlaceReferralOn = 'Right';
        $RightUserID = User::where(['Leg' => $PlaceReferralOn, 'ParentID' => $UserID])->value('id');
        $countRightLeg = 0;
        do {
            $LastRightUserID = $RightUserID;
            $RightUserID = User::where(['Leg' => $PlaceReferralOn, 'ParentID' => $RightUserID])->value('id');
            $countRightLeg++;
        } while (isset($RightUserID));

        if ($countLeftLeg <= $countRightLeg) {
            $LastLeftUserID = $LastLeftUserID == '' ? $UserID : $LastLeftUserID;
            return [$LastLeftUserID, 'Left'];
        } else {
            $LastRightUserID = $LastRightUserID == '' ? $UserID : $LastRightUserID;
            return [$LastRightUserID, 'Right'];
        }
    }

    public function checkRefLink($key)
    {
        $crypto_ref = TblCryptoReferralLink::where(['ReferralUrl' => $key, 'Status' => 'Pending'])->first();
        if ($crypto_ref) {
            if ($crypto_ref->Quantity > 0)
                return response(['message' => 'crypto_referral', 'success' => true], 200);
            else
                return response(['message' => 'No quantity for crypto referral link', 'success' => false], 200);
        }
        $normal_ref = TblReferralLinkSetting::where(['ReferralLink' => $key, 'Status' => 'A'])->count();
        if ($normal_ref > 0) {
            return response(['message' => 'referral', 'success' => true], 200);
        }
        return response(['message' => 'Can\'t find crypto referral link', 'success' => false], 200);
    }
    public function wallet()
    {
        $user_id = Auth::user()->id;
        $wallets = ClientsModel::get_wallets();
        $staked_wallet = ClientsModel::get_current_stacked();

        foreach ($wallets as $wallet) {
            $balance = ClientsModel::get_final_walletsBalance($user_id, $wallet->id);
            $finalbinaryholdamount = ClientsModel::get_binary_hold_balance($user_id, $wallet->id) ?? 0;
            $finalsponsorholdamount = ClientsModel::get_sponsor_hold_balance($user_id, $wallet->id) ?? 0;
            $finalholdtransferamount = ClientsModel::get_transfer_amount($user_id, $wallet->id, 'H') ?? 0;

            $wallet['balance'] = $balance;
            $wallet['hold_amount'] = $finalbinaryholdamount + $finalsponsorholdamount - $finalholdtransferamount;
            $wallet['sponsor_amount'] = $finalsponsorholdamount;
        }
        foreach ($staked_wallet as $wallet) {
            $wallet->swap_balance = ClientsModel::get_staked_network_balance($wallet->CryptoID);
        }

        return response(['wallets' => $wallets, 'staked_wallet' => $staked_wallet, 'success' => true], 200);
    }

    public function getSupportCredits(Request $request)
    {
        $user_id = Auth::user()->id;
        $amount = ClientsModel::get_SupportCredits($request->product_id);

        return response(['amount' => $amount, 'success' => true], 200);
    }
    public function staked()
    {
        $user_id = Auth::user()->id;
        $wallets = ClientsModel::get_wallets();

        $wallets_data = [];
        $my_staked_data = [];

        foreach ($wallets as $wallet) {
            $swapCoin = ClientsModel::get_swaped($wallet->id);

            $balance = ClientsModel::get_staked_network_balance($wallet->id);
            $final_wallet_balance = ClientsModel::get_final_walletsBalance($user_id, $wallet->id);
            $StakeAmount = ClientsModel::get_stake_amount($wallet->id);
            $wallets_data[] = [
                'id' => $wallet->id,
                'Image' => $wallet->Image,
                'CryptoName' => $wallet->CryptoName,
                'StakeAmount' => $StakeAmount,
                'SwapAmountInCrypto' => $swapCoin['SwapAmountInCrypto'],
                'SwapAmount' => $swapCoin['SwapAmount'],
                'FeesInCrypto' => $swapCoin['FeesInCrypto'],
                'SwapFeesCollected' => $swapCoin['SwapFeesCollected'],
                'balance' => $balance,
                'final_wallet_balance' => $final_wallet_balance,
            ];
        }

        $myStaked = ClientsModel::get_my_staked($user_id);

        foreach ($myStaked as $staked) {
            $percentage = ClientsModel::getPercentage($staked->UserID, $staked->CryptoID);
            $UnstakeAmount = ClientsModel::getUnstakedAmount($staked->UserID, $staked->CryptoID);
            $balance = $staked->StakeAmount - $UnstakeAmount;
            $NetworkBalance = ClientsModel::get_staked_network_balance($staked->CryptoID);

            $my_staked_data[] = [
                'id' => $staked->id,
                'Image' => $staked->Image,
                'CryptoName' => $staked->CryptoName,
                'StakeAmount' => $staked->StakeAmount,
                'UnstakeAmount' => $UnstakeAmount,
                'CryptoID' => $staked->CryptoID,
                'balance' => $balance,
                'dollar' => $staked->Price,
                'percentage' => $percentage,
                'NetworkBalance' => $NetworkBalance
            ];
        }

        return response(['wallets' => $wallets_data, 'myStaked' => $my_staked_data, 'success' => true], 200);
    }
    function dateDifferent($date1, $date2)
    {
        $diff = strtotime($date2) - strtotime($date1);
        if ($diff < 0) return -1;
        $years = floor($diff / (365 * 60 * 60 * 24));
        $months = floor(($diff - $years * 365 * 60 * 60 * 24) / (30 * 60 * 60 * 24));
        $days = floor(($diff - $years * 365 * 60 * 60 * 24 - $months * 30 * 60 * 60 * 24) / (60 * 60 * 24));
        $days = floor($diff / (60 * 60 * 24));
        return $days;
    }
    public function packages()
    {
        $user_id = Auth::user()->id;
        $packages = ClientsModel::get_packages();
        foreach ($packages as $key => $package) {
            $nowNum = Purchase::select("id")->where("package_id", $package->id)->get();
            $limit = AdminTemplateSettings::select("value")->where("field", $package->PackageName)->get()->first();
            // Log::debug(__FUNCTION__ . " == " . __LINE__ . " limit = : " . json_encode($limit));
            $packages[$key]["userNum"] = count($nowNum);
            $packages[$key]["limit"] = $limit["value"];
            $packages[$key]->purchase = ClientsModel::getPurchaseByPackageID($package->id, $user_id);
            $packages[$key]->CurrentPrice = ClientsModel::get_crypto($package->CryptoID);
        }

        return response(['packages' => $packages, 'success' => true], 200);
    }
    public function purchases()
    {
        $purchases = ClientsModel::get_purchases(Auth::user()->id);
        $Expire = ClientsModel::get_settings_for_frontend();
        $binaryExpireDays = $Expire->binaryExpireDays;
        $purchase_data = [];

        foreach ($purchases as $purchase) {
            $transfered = TblTransferPackage::where(['PurchaseID' => $purchase->id, 'FromClientID' => Auth::user()->id])->where('Status', '!=', 'C')->count() > 0;
            if ($transfered) continue;
            $purchase['cost'] = $purchase->BillingAmount == 0 ? $purchase->CryptoAmount : $purchase->BillingAmount;
            $purchase['spent'] = number_format($purchase->price, 5) . ' ' . $purchase->CryptoName;
            $purchase['exp_days'] = $purchase->BillingIntervalDays != 0 ? $this->dateDifferent(date("Y-m-d"), $purchase->expiry_date) : 'Unlimited!';

            $purchase['is_renew'] = strtotime($purchase->expiry_date . ' + ' . $binaryExpireDays . ' days') - strtotime(date("Y-m-d")) >= 0;
            $purchase['is_transfer'] = strtotime($purchase->expiry_date) - strtotime(date("Y-m-d")) >= 0;
            $purchase_data[] = $purchase;
        }
        return response(['purchases' => $purchase_data, 'success' => true], 200);
    }
    public function transfers()
    {
        $user_id = Auth::user()->id;
        $transfers = ClientsModel::get_package_transfer($user_id);
        foreach ($transfers as $key => $transferlog) {
            if ($transferlog->FromClientID != $user_id) {
                $transfers[$key]['sender'] =  ClientsModel::getClientName($transferlog->FromClientID);
            } else {
                $transfers[$key]['sender'] = $transferlog->ScreenNamePhoneEmail;
            }
            $status = 'Confirmed';
            if ($transferlog->Status == 'T') $status = 'Pending';
            else if ($transferlog->Status == 'A') $status = 'Completed';
            else if ($transferlog->Status == 'C') $status = 'Canceled';
            $transfers[$key]['status_text'] = $status;
            $transfers[$key]['is_accept'] = $transferlog->FromClientID != $user_id && $transferlog->Status == 'T';
        }
        return response(['transfers' => $transfers, 'success' => true], 200);
    }
    public function ads($id)
    {
        $marketplace = ClientsModel::get_marketplaces($id);
        $CategoryList = ClientsModel::getCategoryList();
        if ($id == 0) {
            foreach ($marketplace as $key => $value) {
                $marketplace[$key]->user = ClientsModel::getUserByID($value->UserID);
                $marketplace[$key]->rating = ClientsModel::get_allrating($value->UserID);
                $marketplace[$key]->ShipCountries = json_decode($value->ShipCountries);
                $marketplace[$key]->faq = Faq::where('product_id', $value->id)->get();
            }
        } else {
            $marketplace->user = ClientsModel::getUserByID($marketplace->UserID);
            $marketplace->rating = ClientsModel::get_allrating($marketplace->UserID);
            $marketplace->ShipCountries = json_decode($marketplace->ShipCountries);
            $marketplace->faq = Faq::where('product_id', $marketplace->id)->get();
            $marketplace->BuyCredits = ClientsModel::get_SupportCredits($marketplace->id);
        }

        return response(['marketplace' => $marketplace, 'CategoryList' => $CategoryList, 'success' => true], 200);
    }
    public function marketplace($id)
    {
        $user_id = Auth::user()->id;
        $typeOfItem = array('Physical' => 'Physical', 'DigitalBuyNow' => 'Digital Buy Now', '7Days' => '7 Days', '30Days' => '30 Days');
        $marketplace = ClientsModel::get_marketplaces_byuid($user_id, $id);
        $CategoryList = ClientsModel::getCategoryList();
        if ($id == 0) {
            foreach ($marketplace as $key => $value) {
                $marketplace[$key]['item_type'] = $typeOfItem[$value->TypeOfItem];
                $marketplace[$key]['Feature'] = $value->Feature == 'N' ? 'No' : 'Yes';
                $marketplace[$key]['Status'] = $value->Status == 'A' ? 'Active' : 'Inactive';
                $marketplace[$key]['ShipCountries'] = json_decode($value['ShipCountries']);
                $marketplace[$key]['faq'] = Faq::where('product_id', $value['id'])->get();
                $marketplace[$key]['BuyCredits'] = ClientsModel::get_SupportCredits($value['id']);
            }
        } else {
            $marketplace['ShipCountries'] = json_decode($marketplace['ShipCountries']);
            $marketplace['faq'] = Faq::where('product_id', $marketplace['id'])->get();
        }
        return response(['marketplace' => $marketplace, 'CategoryList' => $CategoryList, 'success' => true], 200);
    }
    public function all_marketplace($id)
    {
        $marketplace = ClientsModel::get_marketplaces($id);
        return response(['marketplace' => $marketplace, 'success' => true], 200);
    }
    public function saleslog()
    {
        $user_id = Auth::user()->id;
        $logs = ClientsModel::get_product_sales($user_id);
        return response(['logs' => $logs, 'success' => true], 200);
    }

    public function myorder()
    {
        $user_id = Auth::user()->id;
        $orders = ClientsModel::get_product_order($user_id)->toArray();
        $typeOfItem = ['Physical' => 'Physical', 'DigitalBuyNow' => 'Digital Buy Now', '7Days' => '7 Days Access', '30Days' => '30 Days Access'];
        foreach ($orders as $key => $value) {
            $orders[$key]->item_type = $typeOfItem[$value->TypeOfItem];
            if ($value->TypeOfItem == '7Days')
                $days = (strtotime($value->SaleDate) + (7 * 86400)) - strtotime(date("Y-m-d"));
            else if ($value->TypeOfItem == '30Days')
                $days = (strtotime($value->SaleDate) + (30 * 86400)) - strtotime(date("Y-m-d"));
            else
                $days = 0;

            $orders[$key]->expire_days_left =
                $value->TypeOfItem == 'Physical' ? 'Never Expire'
                : ($days <= 0 ? 'Expired !'
                    : floor($days / 86400) . 'Days ');

            $orders[$key]->rated = TblSellerRating::where('OrderID', $value->id)->count() > 0;
        }
        return response(['orders' => $orders, 'success' => true], 200);
    }
    public function salesfeedback()
    {
        $user_id = Auth::user()->id;
        $feedback = ClientsModel::get_allrating($user_id);
        foreach ($feedback as $key => $value) {
            $feedback[$key]->username = ClientsModel::getUserByID($value->BuyerID)->fullname;
        }
        return response(['feedback' => $feedback, 'success' => true], 200);
    }
    public function cryptoreferrallinklog()
    {
        $user_id = Auth::user()->id;
        $links = ClientsModel::get_cryptoreferrallinklog($user_id);
        foreach ($links as $key => $value) {
            $links[$key]->wallet = ClientsModel::get_wallet($value->UID, $value->CID);
        }
        return response(['links' => $links, 'success' => true], 200);
    }

    public function networklog()
    {
        $user_id = Auth::user()->id;
        $isAdmin = Auth::user()->role == 1;
        $wallets = ClientsModel::get_wallets($isAdmin ? null : $user_id);
        $network_settings = ClientsModel::get_network_settings();
        $network_logs = ClientsModel::get_network_logs($isAdmin ? null : $user_id);
        $sponsor = ClientsModel::getClientName($user_id);
        $rank = ClientsModel::findRank($user_id);
        $total_left = ClientsModel::getTotalLeg($user_id, 'Left');
        $total_right = ClientsModel::getTotalLeg($user_id, 'Right');
        $direct_referrals = ClientsModel::getDirectReferrals($sponsor);
        $success =  true;

        $data = [];

        $Expire = ClientsModel::get_settings_for_frontend();
        $binaryExpireDays = $Expire->binaryExpireDays;

        foreach ($wallets as $key => $wallet) {
            $balance = ClientsModel::get_current_network_balance($user_id, $wallet->id);
            $wallets[$key]->LeftAmount = 0;
            $wallets[$key]->RightAmount = 0;
            if ($balance) {
                $wallets[$key]->LeftAmount = isset($balance->LeftBalance) ? $balance->LeftBalance : 0;
                $wallets[$key]->RightAmount = isset($balance->RightBalance) ? $balance->RightBalance : 0;
            }
        }

        foreach ($network_logs as $key => $NetworkLog) {
            if (isset($NetworkLog->PackageID) && $NetworkLog->PackageID > 0)
                $UserDetails = ClientsModel::get_client_details($NetworkLog->UserID, $NetworkLog->PackageID);
            else if ($NetworkLog->TransType == 'T')
                $UserDetails = ClientsModel::get_for_transfer_client_details($NetworkLog->UserID, $NetworkLog->PurchaseID, $NetworkLog->CryptoID);
            else if ($NetworkLog->TransType == 'R')
                $UserDetails = ClientsModel::get_for_cryptoreferal_client_details($NetworkLog->UserID, $NetworkLog->PurchaseID, $NetworkLog->CryptoID);
            else if ($NetworkLog->TransType == 'W')
                $UserDetails = ClientsModel::get_withdrawal_client_details($NetworkLog->UserID, $NetworkLog->PurchaseID, $NetworkLog->CryptoID);
            else if ($NetworkLog->TransType == 'D')
                $UserDetails = ClientsModel::get_deposit_client_details($NetworkLog->UserID, $NetworkLog->PurchaseID, $NetworkLog->CryptoID);
            else if ($NetworkLog->TransType == 'B')
                $UserDetails = ClientsModel::get_purchase_client_details($NetworkLog->UserID, $NetworkLog->PurchaseID, $NetworkLog->CryptoID);
            else
                $UserDetails = User::where('id', $NetworkLog->UserID)->get();
            $detail = '';
            if ($UserDetails && count($UserDetails) > 0) {
                $UserDetails = $UserDetails[0];
            } else {
                $UserDetails = new stdClass();
                $UserDetails->PackageName = '-';
                $UserDetails->fullname = '-';
                $UserDetails->fromClientName = '-';
                $UserDetails->toClientName = '-';
                $UserDetails->price = '0';
            }
            if ($NetworkLog->PayoutType == 'S') {
                if ($NetworkLog->PayoutHold == 'H') {
                    $detail .= '<span style="color:orange;font-weight:bold;">Hold!</span>';
                    $detail .= '<b> Your Sponsor Payout is about to expire on ' . date('Y-m-d', strtotime($NetworkLog->DateOfTrans . ' + ' . $binaryExpireDays . ' days')) . '</b>';
                } else if ($NetworkLog->PayoutHold == 'E') {
                    $detail .= '<b style="color:red;"> Your Sponsor Payout is expired on ' . date('Y-m-d', strtotime($NetworkLog->DateOfTrans . ' + ' . $binaryExpireDays . ' days')) . '</b>';
                } else if (!empty($NetworkLog->PackageID)) {
                    $detail .= '<div>' . $UserDetails->fullname . ' ' . $UserDetails->price . ' ' . $NetworkLog->CryptoName . ' paid for ' . $UserDetails->PackageName . ' Package</div>';
                } else if (empty($NetworkLog->PackageID) && $NetworkLog->TransType == 'T') {
                    $detail .= '<div>' . $UserDetails->fromClientName . ' transfer ' . $UserDetails->price . ' ' . $NetworkLog->CryptoName . ' to ' . $UserDetails->toClientName . ' </div>';
                } else if ($NetworkLog->TransType == 'R') {
                    $detail .= '<div>' . $UserDetails->fullname . ' ' . $UserDetails->price . ' ' . $NetworkLog->CryptoName . ' paid for crypto referral link </div>';
                } else if ($NetworkLog->TransType == 'W') {
                    $detail .= '<div>' . $UserDetails->fullname . ' ' . $UserDetails->price . ' ' . $NetworkLog->CryptoName . ' withdrawal ! </div>';
                } else if ($NetworkLog->TransType == 'D') {
                    $detail .= '<div>' . $UserDetails->fullname . ' ' . $UserDetails->price . ' ' . $NetworkLog->CryptoName . ' deposited ! </div>';
                } else if ($NetworkLog->TransType == 'B') {
                    $detail .= '<div>' . $UserDetails->fullname . ' ' . $UserDetails->price . ' ' . $NetworkLog->CryptoName . ' spent for product purchased ! </div>';
                }
            } else {
                if ($NetworkLog->PayoutHold == 'H') {
                    $detail .= '<span style="color:orange;font-weight:bold;">Hold!</span>';
                    $detail .= '<b> Your Binary Payout is about to expire on ' . date('Y-m-d', strtotime($NetworkLog->DateOfTrans . ' + ' . $binaryExpireDays . ' days')) . '</b>';
                } else if ($NetworkLog->PayoutHold == 'E') {
                    $detail .= '<b style="color:red;"> Your Binary Payout is expired on ' . date('Y-m-d', strtotime($NetworkLog->DateOfTrans . ' + ' . $binaryExpireDays . ' days')) . '</b>';
                } else {
                    $crypto = TblCrypto::find($NetworkLog->CryptoID)->value('CryptoName');
                    $RankSettings = ClientsModel::getRankSettingByRank($NetworkLog->SponsorRank);
                    $pro = 0;
                    if ($RankSettings->LevelBinary) $pro = $RankSettings->LevelBinary;
                    $amount = $NetworkLog->Amount / $pro * 100;
                    $detail = $pro . '% rank ' . $NetworkLog->SponsorRank . ' of ' . $amount . ' ' . $crypto . ' = ' . $NetworkLog->Amount . ' ' . $crypto . ' credit';
                    // $detail .=  'Deducted ' . $NetworkLog->Amount . ' ' . $crypto;
                }
            }

            $data[] = [
                'id' => $NetworkLog->id,
                'DateOfTrans' => $NetworkLog->DateOfTrans,
                'rank' => $NetworkLog->SponsorRank,
                'level' => $NetworkLog->SponsorLevel,
                'leg' => $NetworkLog->PayoutType == 'S' ? "-" : $NetworkLog->Leg,
                'wallet' => $NetworkLog->Amount . ' ' . $NetworkLog->CryptoName,
                'payout_type' => $NetworkLog->PayoutType == 'S' ? 'Sponsor' : 'Rebalancing Credit',
                'detail' => $detail,
            ];
        };
        return response(compact('rank', 'data', 'total_left', 'total_right', 'direct_referrals', 'network_settings', 'wallets', 'binaryExpireDays', 'success'), 200);
    }
    private function getpayoutpercentBinary()
    {
        $payoutPercent = 0;
        // $sponsorLevels = TblSponsorPayoutLog::select("SponsorLevel")->where("PayoutType", "S")->distinct()->get();
        $rankLevels = TblSponsorPayoutLog::select("SponsorRank")->distinct()->get();
        // Log::debug(__FUNCTION__ . " == " . __LINE__ . " = : " . json_encode($rankLevels));
        // Log::debug(__FUNCTION__ . " == " . __LINE__ . " = : " . json_encode($sponsorLevels));
        $volumeMax = 0;
        $eachBinarys = [];
        foreach ($rankLevels as $rankLevel) {
            $weightRow = TblNetworkSetting::select("LevelBinary")->where("Rank", $rankLevel->SponsorRank)->get()->first();
            $binarys = TblSponsorPayoutLog::where("PayoutType", "B")->where("SponsorRank", $rankLevel->SponsorRank)->get();
            $volume = 0;
            foreach ($binarys as $binary) {
                $cryptoID = $binary->CryptoID;
                $amount = $binary->Amount;
                $priceRow = TblCrypto::where("id", $cryptoID)->get()->first();
                $volume = $volume + ($priceRow->Price) * $amount;
            }
            $eachBinarys[] = ["rank" => $rankLevel->SponsorRank, "volumne" => $volume, "weight" => $weightRow["LevelBinary"]];
            if ($volumeMax < $volume) $volumeMax = $volume;
            if ($volumeMax > 0) {
                if (count($eachBinarys) > 0) {
                    foreach ($eachBinarys as  $eachBinary) {
                        $payoutPercent  = $payoutPercent + floatval($eachBinary["volumne"]) / floatval($volumeMax) * floatval($eachBinary["weight"]);
                        // Log::debug(__FUNCTION__ . " == " . __LINE__ . " payoutPercent = : " . $payoutPercent);
                    }
                }
            }
        }
        return $payoutPercent;
    }

    public function getpayoutpercentSponsor()
    {
        $payoutPercent = 0;
        $sponsorLevels = TblSponsorPayoutLog::select("SponsorLevel")->where("PayoutType", "S")->distinct()->get();
        $rankLevels = TblSponsorPayoutLog::select("SponsorRank")->distinct()->get();
        foreach ($sponsorLevels as $sponsorLevel) {
            if ($sponsorLevel->SponsorLevel == 0) {
                continue;
            }
            $volumeMax = 0;
            $eachSponRanks = [];
            foreach ($rankLevels as $rankLevel) {
                $weightRow = TblNetworkSetting::select("Level" . strval($sponsorLevel->SponsorLevel))->where("Rank", $rankLevel->SponsorRank)->get()->first();
                // Log::debug(__FUNCTION__ . " == " . __LINE__ . " = : " . json_encode($weightRow));
                $sponsors = TblSponsorPayoutLog::where("PayoutType", "S")->where("SponsorLevel", $sponsorLevel->SponsorLevel)->where("SponsorRank", $rankLevel->SponsorRank)->get();
                $volume = 0;
                foreach ($sponsors as $sponsor) {
                    $cryptoID = $sponsor->CryptoID;
                    $amount = $sponsor->Amount;
                    $priceRow = TblCrypto::where("id", $cryptoID)->get()->first();
                    $volume = $volume + ($priceRow->Price) * $amount;
                }
                $eachSponRanks[] = ["rank" => $rankLevel->SponsorRank, "volumne" => $volume, "weight" => $weightRow["Level" . strval($sponsorLevel->SponsorLevel)]];
                if ($volumeMax < $volume) $volumeMax = $volume;
            }
            if ($volumeMax > 0) {
                if (count($eachSponRanks) > 0) {
                    foreach ($eachSponRanks as  $eachSponRank) {
                        $payoutPercent  = $payoutPercent + floatval($eachSponRank["volumne"]) / floatval($volumeMax) * floatval($eachSponRank["weight"]);
                        // Log::debug(__FUNCTION__ . " == " . __LINE__ . " payoutPercent = : " . $payoutPercent);
                    }
                }
            }
            // Log::debug(__FUNCTION__ . " == " . __LINE__ . " payoutPercent = : " . $payoutPercent);
        }
        return $payoutPercent;
    }
    public function getpayoutpercent()
    {
        $getpayoutpercentBinary = $this->getpayoutpercentBinary();
        $getpayoutpercentSponsor = $this->getpayoutpercentSponsor();
        return response(['payoutPercent' => floatval($getpayoutpercentSponsor + $getpayoutpercentBinary), 'success' => true], 200);
    }
    public function depositlog()
    {
        $user_id = Auth::user()->id;
        $isAdmin = Auth::user()->role == 1;

        $logs = ClientsModel::get_deposit($isAdmin ? null : $user_id);
        foreach ($logs as $key => $depositlog) {
            $wallet = ClientsModel::get_wallet($depositlog->UID, $depositlog->CID);
            $logs[$key]->wallet = $wallet;
            $logs[$key]->Sent = $depositlog->TransType == 'D' ? ($depositlog->Amount + ($depositlog->Amount * ($wallet ? $wallet->DepositFee / 100 : 0))) : 0;
            $logs[$key]->Deposited = $depositlog->Status != 'P' ? $depositlog->Amount : 0;
        }
        return response(['logs' => $logs, 'success' => true], 200);
    }
    public function sponsorlog()
    {
        $user_id = Auth::user()->id;

        if (Auth::user()->role == 1) {
            $logs = FeesNetwork::get();
        } else {
            $logs = FeesNetwork::where('userid', $user_id)->get();
        }
        foreach ($logs as $key => $log) {
            $logs[$key]->wallet = ClientsModel::get_wallet($log->userid, $log->cryptoid);;
            $logs[$key]->user = User::find($log->senderid)->ScreenName;
        }
        return response(['logs' => $logs, 'success' => true], 200);
    }
    public function withdrawallog()
    {
        $user_id = Auth::user()->id;
        $isAdmin = Auth::user()->role == 1;
        $logs = ClientsModel::get_withdrawal($isAdmin ? null : $user_id);
        foreach ($logs as $key => $withdrawallog) {
            $wallet = ClientsModel::get_wallet($withdrawallog->UID, $withdrawallog->CID);
            $logs[$key]->wallet = $wallet;
            $logs[$key]->withdarw_amount = $withdrawallog->TransType == 'W' ? ($withdrawallog->Amount + ($withdrawallog->Amount *  ($wallet ? $wallet->WithdrawalFee / 100 : 0))) : 0;
            $logs[$key]->receive_amount = $withdrawallog->TransType == 'W' ? $withdrawallog->Amount : 0;
        }
        return response(['logs' => $logs, 'success' => true], 200);
    }
    public function transferlog()
    {
        $user_id = Auth::user()->id;
        $isAdmin = Auth::user()->role == 1;
        $logs = ClientsModel::get_transfer($isAdmin ? null : $user_id);
        foreach ($logs as $key => $transferlog) {
            $wallet = ClientsModel::get_wallet($transferlog->FromClientID, $transferlog->CID);
            $logs[$key]->wallet = $wallet;
            $logs[$key]->withdarw_amount = $transferlog->FromClientID == $user_id ? $transferlog->Amount : 0;
            $logs[$key]->receive_amount = $transferlog->TransType == 'S' ? $transferlog->Amount - $transferlog->TransferFee : 0;
            $logs[$key]->Fees = $transferlog->TransferFee;

            $logs[$key]->isAccept = $transferlog->FromClientID != $user_id && $transferlog->Status == 'P';
            $logs[$key]->isCancel_bysender = $transferlog->Status == 'P' && $transferlog->Status != 'A';
            $logs[$key]->isCancel_byreceiver = $transferlog->FromClientID != $user_id && $transferlog->Status != 'C' && $transferlog->Status != 'A';

            if ($transferlog->FromClientID != $user_id) {
                $logs[$key]->ScreenName = ClientsModel::getClientName($transferlog->FromClientID);
            } else {
                $logs[$key]->ScreenName = $transferlog->ScreenNamePhoneEmail;
            }
        }
        return response(['logs' => $logs, 'success' => true], 200);
    }
    public function swaplog()
    {
        $user_id = Auth::user()->id;
        $logs = ClientsModel::get_swap($user_id);
        foreach ($logs as $key => $value) {
            $logs[$key]->wallet = ClientsModel::get_wallet(0, $value->CryptoID);
            $logs[$key]->walletForFees = ClientsModel::get_wallet(0, $value->SwapToCryptoID);
        }
        return response(['logs' => $logs, 'success' => true], 200);
    }
    function swapfeecollectedlog()
    {
        $user_id = Auth::user()->id;
        $logs = ClientsModel::get_swap_fees_collected($user_id);
        return response(['logs' => $logs, 'success' => true], 200);
    }
    public function stakedlog()
    {
        $user_id = Auth::user()->id;
        $logs = ClientsModel::get_staked($user_id);
        foreach ($logs as $key => $value) {
            $logs[$key]->wallet = ClientsModel::get_wallet(0, $value->CryptoID);
            $logs[$key]->NetworkEligibile = $value->NetworkEligibile == 'Y' ? 'Yes' : 'No';
            $logs[$key]->Status = $value->Status == 'A' ? 'Active' : 'Inactive';
        }
        return response(['logs' => $logs, 'success' => true], 200);
    }
    public function clienttoadmintransferlog()
    {
        $user_id = Auth::user()->id;
        $isAdmin = Auth::user()->role == 1;
        $logs = ClientsModel::get_client_admintransferlog($isAdmin ? null : $user_id);
        foreach ($logs as $key => $value) {
            $logs[$key]->wallet = ClientsModel::get_wallet($value->UserID, $value->CoinID);
        }
        return response(['logs' => $logs, 'success' => true], 200);
    }
    public function profile()
    {
        return response(['profile' => Auth::user(), 'success' => true], 200);
    }

    function getSponsor3Level($userid, $TransID, $CryptoAmount, $CryptoID, $TransType, $PackageID)
    {
        ClientsModel::get_any_purchase($userid);
        $level = 3;
        $result = '';
        $package = Package::find($PackageID);

        $userDetails = User::find($userid);
        // Log::debug(__FUNCTION__ . " == " . __LINE__ . " getSponsor3Level UserDetails = : " . json_encode($userDetails));
        for ($i = 0; $i < $level; $i++) {
            if (isset($userDetails->ParentID) && $userDetails->ParentID > 0) {
                $sponsor = ClientsModel::getSponsor($userDetails->sponsor);
                $ParentID = $userDetails->ParentID;
                $userid = $sponsor->id;
                $rank = ClientsModel::findRank($userid);
                $finallevel = 'Level' . ($i + 1);
                $RankSettings = ClientsModel::getRankSettingByRank($rank);
                $Amount = $RankSettings->$finallevel / 100 * $CryptoAmount;
                if ($sponsor->status == 'Active') $PayoutHold = 'O';
                else $PayoutHold = 'H';
                $data = array(
                    'SponsorID'     => $sponsor->id,
                    'SponsorName'    => $userDetails->sponsor,
                    'SponsorRank'   => $rank,
                    'SponsorLevel'  => ($i + 1),
                    'PayoutHold'    => $PayoutHold,
                    'DateOfTrans'   => date("Y-m-d"),
                    'Amount'        => $Amount,
                    'UserID'        => Auth::User()->id,
                    'Leg'            => $userDetails->Leg,
                    'PackageID'        => $PackageID ?? 0,
                    'CryptoID'    => $CryptoID ?? 0,
                    'TransType' => $TransType,
                    'PurchaseID'    => $TransID
                );
                TblSponsorPayoutLog::create($data);
                if ($sponsor->ParentID == 0) break;
            }
        }
        // $UserDetails = Auth::user();
        // Log::debug(__FUNCTION__ . " == " . __LINE__ . " getSponsor3Level UserDetails = : " . json_encode($UserDetails));
        $BinaryPayoutEligible = 'Y';
        // if ($package) {
        //     $BinaryPayoutEligible = $package->BinaryPayoutEligible;
        // }
        $this->updateNetworkCurrent($userid, $userDetails->ParentID, $userDetails->Leg, $CryptoAmount, $CryptoID, $BinaryPayoutEligible);
    }

    function updateNetworkCurrent($userid, $ParentID, $Leg, $CryptoAmount, $CryptoID, $BinaryPayoutEligible)
    {
        if ($ParentID != 0) {
            $userDetails = User::find($userid);
            $ParentID = $userDetails->ParentID;
            if ($userDetails->Leg == 'Left') {
                $LeftBalance = $CryptoAmount;
                $RightBalance = 0;
            } else {
                $RightBalance = $CryptoAmount;
                $LeftBalance = 0;
            }

            if ($userid != 0 && $userDetails->status == 'Active' && $BinaryPayoutEligible == 'Y') {
                $networkCurrentBalance = TblNetworkCurrent::where(['CryptoID' => $CryptoID, 'UserID' => $userid])->get();
                if (!empty($networkCurrentBalance) && count($networkCurrentBalance) > 0) {
                    foreach ($networkCurrentBalance as $value) {
                        TblNetworkCurrent::find($value->id)->update(['LeftBalance' => $value->LeftBalance + $LeftBalance, 'LeftBalance' => $value->RightBalance + $RightBalance]);
                    }
                } else {
                    $networkdata = array(
                        'CryptoID'     => $CryptoID,
                        'UserID'    => $userid,
                        'LeftBalance'   => $LeftBalance,
                        'RightBalance'  => $RightBalance
                    );
                    TblNetworkCurrent::create($networkdata);
                }
            }
            $this->updateNetworkCurrent($userid, $ParentID, $Leg, $CryptoAmount, $CryptoID, $BinaryPayoutEligible);
        }
    }

    public function confirmdeposit(Request $request)
    {
        $user_id = Auth::user()->id;
        $cid = $request->cid;
        $Amount = $request->DepositAmount;
        $addr = $request->ToReceiveWallet ?? '';
        $TransID = $request->TransID ?? '';
        $hkey = $request->hkey ?? '';
        $fee = $Amount * TblCrypto::find($cid)->DepositFee / 100;
        $deposit_id = ClientsModel::insert_deposit($cid, $Amount, $addr, $TransID, $user_id);
        $this->getSponsor3Level($user_id, $deposit_id, $Amount, $cid, 'D', 0);
        ClientsModel::fees2Network($user_id, Auth::user()->sponsor, $fee, $cid, 'D', 1);
        TblCryptoAddr::create(['cid' => $cid, 'addr' => $addr, 'coin_current_bal' => 0, 'coin_key' => $hkey, 'status' => 1]);
        return response(['message' => 'Deposit successfully!', 'success' => true], 200);
    }


    public function confirmwithdrawal(Request $request)
    {
        $user_id = Auth::user()->id;
        $CID = $request->cid;
        $Amount = $request->HiddenActualwithdrawalAmount;
        $WithdrawalFeeType = 'Expedited';
        $ToReceiveWallet = $request->ToReceiveWallet ?? '';
        $TransID = $request->TransID ?? '';
        $fee = $Amount * TblCrypto::find($CID)->WithdrawalFee / 100;
        $widthdrawal_id = ClientsModel::insert_withdrawal($user_id, $CID, $Amount, $WithdrawalFeeType, $ToReceiveWallet, $TransID);
        $this->getSponsor3Level($user_id, $widthdrawal_id, $Amount, $CID, 'W', 0);
        ClientsModel::fees2Network($user_id, Auth::user()->sponsor, $fee, $CID, 'W', 1);
        return response(['message' => 'Withdrawal successfully!', 'success' => true], 200);
    }

    public function conformtranfer(Request $request)
    {
        $user_id = Auth::user()->id;
        $ScreenNamePhoneEmail = $request->ScreenNamePhoneEmail;

        $ToClientDetails = ClientsModel::get_clientByScreenNamePhoneEmail($ScreenNamePhoneEmail);
        if (!$ToClientDetails) {
            return response(['message' => 'Client not found!', 'success' => false], 200);
        } else if ($user_id == $ToClientDetails->id) {
            return response(['message' => 'You tried to tranfer to your own account!', 'success' => false], 200);
        }
        $CID = $request->cid;
        $Amount = $request->TransferAmount;
        $TransferFee = $request->TransferAmount * ($request->TransferFee / 100);
        $FeesType = $request->TransferFeeType;
        $transfer_id =  ClientsModel::insert_transfer($user_id, $ToClientDetails->id, $CID, $Amount, $TransferFee, $FeesType, $ScreenNamePhoneEmail);
        if ($transfer_id) {
            ClientsModel::update_sender_balance($user_id, $Amount);
            $this->getSponsor3Level($user_id, $transfer_id, $Amount, $CID, 'T', 0);
        }
        ClientsModel::fees2Network($user_id, Auth::user()->sponsor, $TransferFee, $CID, 'T', 1);
        return response(['message' => 'Tranfer confirm successfully!', 'success' => true], 200);
    }

    public function support_conformtranfer(Request $request)
    {
        $user_id = Auth::user()->id;
        $product_id = $request->product_id;
        $ScreenNamePhoneEmail = $request->ScreenNamePhoneEmail;

        $ToClientDetails = ClientsModel::get_clientByScreenNamePhoneEmail($ScreenNamePhoneEmail);
        if (!$ToClientDetails) {
            return response(['message' => 'Client not found!', 'success' => false], 200);
        }
        $CID = $request->cid;
        $CID_info = TblCrypto::where('id', $CID)->first();
        $Amount = $request->TransferAmount / $CID_info->Price;
        $seller_id = $request->seller_id;
        $TransferFee = $request->TransferFee / $CID_info->Price;
        $FeesType = $request->TransferFeeType;

        $supportCredits = TblSupportBuy::where('tbl_support_buy.status', 1)
            ->where('tbl_support_buy.product_id', $product_id)->sum('tbl_support_buy.BusdAmount');

        if (($supportCredits - $Amount) <= 0) {
            return response(['message' => 'end', 'success' => true], 200);
        }

        $transfer_id =  ClientsModel::insert_transfer($seller_id, $ToClientDetails->id, $CID, $Amount, $TransferFee, $FeesType, $ScreenNamePhoneEmail);
        if ($transfer_id) {
            ClientsModel::update_sender_balance($seller_id, $Amount);
            $this->getSponsor3Level($seller_id, $transfer_id, $Amount, $CID, 'T', 0);
        }
        $seller_info = User::where('id', $seller_id)->first();
        ClientsModel::fees2Network($seller_id, $seller_info->sponsor, $TransferFee, $CID, 'T', 1);

        $data = array(
            'UID' => $user_id,
            'buy_date' => date('Y-m-d h:i:s'),
            'product_id' => $product_id,
            'BusdAmount' => $Amount * (-1),
        );

        ClientsModel::insert_support_buy($data);

        return response(['message' => 'Tranfer confirm successfully!', 'success' => true], 200);
    }

    public function confirmswap(Request $request)
    {
        $user_id = Auth::user()->id;
        $data = array(
            'UserID' => $user_id,
            'CryptoID' => $request->cid,
            'SwapAmount' => $request->SwapAmount - $request->HiddenFeesInCrypto,
            'DateOfSwap' => date('Y-m-d h:i:s'),
            'SwapToCryptoID' => $request->CryptoID,
            'SwapAmountInCrypto' => $request->HiddenSwapCoin,
            'FeesInCrypto' => $request->HiddenFeesInCrypto,

        );
        ClientsModel::insert_swap($data);;
        ClientsModel::fees2Network($user_id, Auth::user()->sponsor, $request->HiddenFeesInCrypto, $request->cid, 'S', 1);
        return response(['message' => 'Swap confirm successfully!', 'success' => true], 200);
    }

    public function confirmsupportswap(Request $request)
    {
        $user_id = Auth::user()->id;
        $data = array(
            'UID' => $user_id,
            'CID' => $request->CryptoID,
            'Amount' => $request->HiddenSwapCoin,
            'buy_date' => date('Y-m-d h:i:s'),
            'FeesInCrypto' => $request->HiddenFeesInCrypto,
            'product_id' => $request->product_id,
            'BusdAmount' => $request->BusdAmount,
        );
        ClientsModel::insert_support_buy($data);
        ClientsModel::fees2Network($user_id, Auth::user()->sponsor, $request->HiddenFeesInCrypto, $request->CryptoID, 'S', 1);
        return response(['message' => 'Swap confirm successfully!', 'success' => true], 200);
    }

    public function confirmcancelsupport(Request $request)
    {
        $user_id = Auth::user()->id;
        $data = array(
            'UID' => $user_id,
            'buy_date' => date('Y-m-d h:i:s'),
            'product_id' => $request->product_id,
            'BusdAmount' => $request->supportCredits * (-1),
        );
        if ($request->supportCredits > 0)
            ClientsModel::insert_support_buy($data);
        return response(['message' => 'Cansel support confirm successfully!', 'success' => true], 200);
    }
    public function confirmstake(Request $request)
    {
        $data = array(
            'CryptoID' => $request->cid,
            'StakeAmount' => $request->StakeAmount,
            'TransDate' => date('Y-m-d h:i:s'),
            'UserID' => Auth::user()->id
        );
        ClientsModel::insert_stake($data);
        return response(['message' => 'Stake confirm successfully!', 'success' => true], 200);
    }
    function confirmunstake(Request $request)
    {
        $data = array(
            'UserID' => Auth::user()->id,
            'StakedID' => $request->StakedID,
            'DateOfTrans' => date('Y-m-d h:i:s'),
            'CryptoID' => $request->CryptoID,
            'UnstakeAmount' => $request->UnstakeAmount
        );
        ClientsModel::insert_unstake($data);
        return response(['message' => 'Unstake successfully!', 'success' => true], 200);
    }

    public function cancelTransfer($TID)
    {
        ClientsModel::cancel_transfer($TID);
        return response(['message' => 'Tranfer canceled successfully!', 'success' => true], 200);
    }
    public function acceptTransfer($TID)
    {
        ClientsModel::accept_transfer($TID);
        return response(['message' => 'Tranfer accepted successfully!', 'success' => true], 200);
    }

    public function acceptTransaction($TID)
    {
        ClientsModel::update_transfer($TID);
        return response(['message' => 'Transfer accepted successfully!', 'success' => true], 200);
    }
    public function cancelTransaction($TID)
    {
        ClientsModel::cancel_transaction($TID);
        return response(['message' => 'Tranfer canceled successfully!', 'success' => true], 200);
    }
    public function getAllCryptos()
    {
        $cryptos = ClientsModel::get_cryptos();
        foreach ($cryptos as $value) {
            $user_id = Auth::user()->id;
            // if ($user_id == 1) $user_id = 2;
            $value->balance = ClientsModel::get_final_walletsBalance($user_id, $value->id);
            $value->total_balance = ClientsModel::get_final_walletsBalance(0, $value->id);
            if (Auth::user()->role == 1) {
                $value->staked_balance = ClientsModel::get_staked_network_balance($value->id);
            } else {
                $value->staked_balance = TblStaked::where(['CryptoID' => $value->id, 'UserID' => $user_id])->sum('StakeAmount');
            }
        }
        // Log::debug(__FUNCTION__ . " == " . __LINE__ . " getAllCryptos cryptos = : " . json_encode($cryptos));
        return response(['data' => $cryptos, 'success' => true], 200);
    }
    public function getCoinPulses($type)
    {
        $data = [];
        if ($type == 'cryptopulse') {
            $data = TblCrypto::where('pulse', 1)->get();
        } else if ($type == 'cryptoexplorer') {
            $data = TblCrypto::where('explorer', 1)->get();
        }
        $user_id = Auth::user()->id;
        foreach ($data as $value) {
            if ($value->buy == null) $value->buy = 0;
            if ($value->sell == null) $value->sell = 0;
            if ($value->hold == null) $value->hold = 0;
            if ($value->GeneralInfo == null) $value->GeneralInfo = 0;

            $all_comments = TblCoinComment::where(['CoinID' => $value->id, 'UserID' => $user_id])->get();
            if (Auth::user()->role == 1) {
                $all_comments = TblCoinComment::where(['CoinID' => $value->id])->get();
            }
            foreach ($all_comments as $comment) {
                switch ($comment->CommentType) {
                    case 'BUY':
                        $value->buy++;
                        break;
                    case 'SELL':
                        $value->sell++;
                        break;
                    case 'HOLD':
                        $value->hold++;
                        break;
                    case 'GENERAL INFO':
                        $value->GeneralInfo++;
                        break;
                }
            }
        }
        // Get Discussions
        $discussions = TblDiscussion::get();
        return response(['data' => $data, 'discussions' => $discussions, 'success' => true], 200);

        return response(['data' => $data, 'success' => true], 200);
    }
    public function deleteCoinPulses($id)
    {
        TblCrypto::find($id)->update(['pulse' => 0]);
        return response(['message' => "Successfully deleted item", 'success' => true], 200);
    }
    public function buyPackage(Request $request)
    {
        $user = Auth::user();
        $package_id = $request->package_id;
        $CryptoID = $request->CryptoID;
        $price = $request->price;
        $billing_price = $request->billing_price;
        $billing_interval = $request->billing_interval;
        $exists = $request->exists;
        $package = Package::find($package_id);
        $days = trim($billing_interval);
        $expiry_date = Carbon::now()->addDays($days)->format("Y-m-d");
        $current_date = date("Y-m-d");
        $renew_date = $expiry_date;
        $exist = Purchase::where("user_id", $user->id)->where("status", "Active")->where("package_id", $package_id)->where('expiry_date', ">", now())->first();
        // Log::debug(__FUNCTION__ . " == " . __LINE__ . " Purchase exist = : " . json_encode($exist));
        if (!is_null($exist)) {
            $expiry_date = Carbon::createFromFormat('Y-m-d H:i:s', $exist->expiry_date)->addDays($exist->BillingIntervalDays)->format("Y-m-d");
        }
        $TransID = Purchase::create([
            'user_id' => $user->id,
            'txn_id' => '',
            'activation_code' => 0,
            'gateway_name' => '',
            'purchase_date' => $current_date,
            // 'purchase_date' => $renew_date,
            'package_id' => $package_id,
            'BillingIntervalDays' => $billing_interval,
            'BillingAmount' => $billing_price,
            'CryptoID' => $CryptoID,
            'CryptoSpent' => json_encode([array("id" => $CryptoID, "amount" => round(floatval($price), 2))]),
            'price' => $price,
            'expiry_date' => $expiry_date,
            'RenewDate' => $renew_date,
            'autoPay' => "0",
            'status' => 'Active',
            'active' => $exists ? 1 : 0,
            'IsBinaryPayout' => $package->BinaryPayoutEligible || 'Y'
        ])->id;
        ClientsModel::update_ReceiveBinaryPayoutStatus($user->id);
        $this->getSponsor3Level($user->id, $TransID, $price, $CryptoID, 'P', $package_id);
        ClientsModel::update_hold_to_open_status($user->id);
        return response(['message' => "Successfully buy package", 'success' => true], 200);
    }
    public function renewPackage(Request $request)
    {
        $user_id = Auth::user()->id;

        $PackageID = $request->PackageID;
        $PurchaseID = $request->PurchaseID;
        $price = $request->price;
        $CryptoID = $request->CryptoID;


        $package = Package::where('id', $PackageID)->first();
        $days = trim($package->BillingIntervalDays);

        $purchase = Purchase::where('id', $PurchaseID)->first();
        $expireDate = $purchase->expiry_date;
        $BillingIntervalDays = $purchase->BillingIntervalDays + $days;

        // get purchase expire date
        if (date("Y-m-d") > $expireDate) {
            $expiry_date = Carbon::now()->addDays($days)->format("Y-m-d");
        } else {
            $expiry_date = date('Y-m-d', strtotime($expireDate . ' + ' . $days . ' days'));
        }
        $current_date = date("Y-m-d");

        Purchase::find($PurchaseID)
            ->update([
                'RenewDate' => $current_date,
                'CryptoID' => $CryptoID,
                'price' => $price,
                'expiry_date' => $expiry_date,
                'BillingIntervalDays' => $BillingIntervalDays,
                'status' => 'Active',
            ]);

        ClientsModel::update_ReceiveBinaryPayoutStatus($user_id);
        $this->getSponsor3Level($user_id, $PurchaseID, $price, $CryptoID, 'P', $PackageID);
        return response(['message' => "Package purchased successfully!", 'success' => true], 200);
    }
    public function getPackages($id)
    {
        // Log::debug(__FUNCTION__ . " == " . __LINE__ . " = : " . json_encode($id));
        return response(['data' => Package::find($id), 'success' => true], 200);
    }
    public function discussions()
    {
        return response(['data' => TblDiscussion::get(), 'packages' => Package::select("PackageName")->get(), 'success' => true], 200);
    }
    public function getDiscussions($id)
    {
        return response(['data' => TblDiscussion::find($id), 'success' => true], 200);
    }
    public function updateDiscussion(Request $request)
    {
        $id = $request->id;
        $user_id = Auth::user()->id;
        $data = $request->except("id");
        // Log::debug(__FUNCTION__ . " == " . __LINE__ . " = : " . json_encode($data));
        $data["uid"] = $user_id;
        // $packageName = $data["PackageName"];
        // $packageLimit = round(floatval($data["limit"]));
        // AdminTemplateSettings::updateOrCreate(['field' => $packageName], ['value' => $packageLimit]);
        TblDiscussion::updateOrCreate(['id' => $id], $data);
        return response(['message' => $id == 0 ? 'Successfully added the discussion' : 'Successfully updated the discussion', 'success' => true], 200);
    }
    public function deleteDiscussion($id)
    {
        TblDiscussion::find($id)->delete();
        return response(['message' => 'Successfully Deleted discussion', 'success' => true], 200);
    }
    public function transferPackage(Request $request)
    {
        $ScreenNamePhoneEmail = $request->to_client;
        $PackageID = $request->PackageID;
        $PurchaseID = $request->PurchaseID;
        $user_id = Auth::user()->id;
        $ToClientDetails = ClientsModel::get_clientByScreenNamePhoneEmail($ScreenNamePhoneEmail);
        if (!$ToClientDetails) {
            return response(['message' => 'Client not found!', 'success' => false], 200);
        } else if ($user_id == $ToClientDetails->id) {
            return response(['message' => 'You tried to tranfer to your own account!', 'success' => false], 200);
        }

        TblTransferPackage::create([
            'TransDate' => date('Y-m-d h:i:s'),
            'PackageID' => $PackageID,
            'PurchaseID' => $PurchaseID,
            'FromClientID' => $user_id,
            'ToClientID' => $ToClientDetails->id,
            'Status' => 'T',
            'ScreenNamePhoneEmail' => $ScreenNamePhoneEmail
        ]);
        return response(['message' => 'Package Tranfer confirm successfully!', 'success' => true], 200);
    }
    public function cancelRefLink($id)
    {
        ClientsModel::cancel_cryptoreferrallink($id);
        return response(['message' => 'Crypto referral link canceled successfully!', 'success' => true], 200);
    }

    public function deletemarketplace($id)
    {
        TblMarketplace::find($id)->delete();
        return response(['message' => 'Marketplace deleted successfully!', 'success' => true], 200);
    }
    public function uploadMedia(Request $request)
    {
        $path = $request->path;
        $filename = $request->filename;
        $file = $request->file('file');
        if ($file) {
            $path = public_path($path);
            $file->move($path, $filename);
            return response(['message' => 'Upload successfully!', 'success' => true], 200);
        } else {
            return response(['message' => 'No file!', 'success' => false], 200);
        }
    }
    public function marketPlaceForm(Request $request)
    {
        $id = $request->id;
        $questions = $request->questions;
        $created = $id == 0;
        $data = $request->except("id");
        $data["InsertDate"] = date("Y-m-d");
        if (!isset($data["UserID"])) {
            $data["UserID"] = Auth::user()->id;
        }
        if (isset($data["ShipCountries"])) {
            $data["ShipCountries"] = json_encode($data["ShipCountries"]);
        }
        // Log::debug(__FUNCTION__ . " == " . __LINE__ . " = : " . json_encode($data));
        $id = TblMarketplace::updateOrCreate(['id' => $id], $data)->id;
        if ($questions && count($questions) > 0) {
            foreach ($questions as $qust) {
                Faq::updateOrCreate(['id' => $qust['id']], ['product_id' => $id, 'question' => $qust['question'], 'answer' => $qust['answer']]);
            }
        }
        return response(['message' => "marketplace" . ($created ? 'Created' : 'Updated') . ' successfully!', 'success' => true], 200);
    }
    public function getSettings()
    {
        $Settings = ClientsModel::get_settings_for_frontend();
        return response(['settings' => $Settings, 'success' => true], 200);
    }
    public function buyProduct(Request $request)
    {
        $user_id = Auth::user()->id;

        $cryptoId = $request->cryptoId;
        $CryptoName = TblCrypto::find($cryptoId)->CryptoName;
        $cryptoPrice = $request->cryptoPrice;
        $buyerName = $request->buyerName;
        $address = $request->address;
        $city = $request->city;
        $state = $request->state;
        $country = $request->country;
        $zip = $request->zip;
        $productId = $request->productId;

        $buyerFees = ClientsModel::get_settings_for_frontend()->BuyersFee;
        $balance = ClientsModel::get_final_walletsBalance($user_id, $cryptoId);

        if ($balance < $cryptoPrice) {
            return response(['message' => 'Insufficient Balance!', 'code' => ERRORCODE::NO_ENOUGH_BALANCE, 'success' => false], 200);
        }

        $productDetails = TblMarketplace::find($productId);
        $cryptoDetail = TblCrypto::find($cryptoId);

        $current_date = date("Y-m-d");
        $expireDate = null;
        if ($productDetails->TypeOfItem == '7Days') {
            $expireDate = date('Y-m-d', strtotime($current_date . ' + 7 days'));
        } else if ($productDetails->TypeOfItem == '30Days') {
            $expireDate = date('Y-m-d', strtotime($current_date . ' + 30 days'));
        }
        $productDetails->update(['Quantity' => ($productDetails->Quantity - 1)]);

        $TransId = TblSaleLog::create([
            'SellerID' => $productDetails->UserID,
            'BuyerID' => $user_id,
            'ProductID' => $productId,
            'SaleDate' => $current_date,
            'ProductPrice' => $productDetails->Price,
            'BuyerFees' => $buyerFees,
            'CryptoID' => $cryptoId,
            'CryptoName' => $CryptoName,
            'BillingAmount' => $cryptoPrice,
            'BuyerName' => $buyerName,
            'Address' => $address,
            'City' => $city,
            'State' => $state,
            'Country' => $country,
            'Zip' => $zip,
            'ExpiryDate' => $expireDate,
            'Status' => 'Active'
        ])->id;

        $feesInCoin = $cryptoPrice * $buyerFees / 100;
        $this->getSponsor3Level($user_id, $TransId, $feesInCoin, $cryptoId, 'B', 0);
        return response(['message' => 'Pruduct purchased successfully!', 'success' => true], 200);
    }
    public function getReferralLink()
    {
        $referralLink = ClientsModel::get_referral_setting(Auth::user()->id);
        return response(['data' => $referralLink, 'success' => true], 200);
    }
    public function updateRefPlace(Request $request)
    {
        $user_id = Auth::user()->id;
        $ReferralLink = Auth::user()->fullname;
        $PlaceReferralOn = $request->PlaceReferralOn;

        TblReferralLinkSetting::updateOrCreate(['UID' => $user_id], [
            'ReferralLink' => $ReferralLink,
            'PlaceReferralOn' => $PlaceReferralOn,
            'Status' => 'A',
            'UID' =>  $user_id,
        ]);

        return response(['message' => "Referral Link updated successfully!", 'success' => true], 200);
    }
    public function saveRefLink(Request $request)
    {
        $ReferralUrl =  ClientsModel::getLink(15);
        $Status = 'Pending';
        $CID = $request->CID;
        $Amount = $request->Amount;
        $Quantity = $request->Quantity;
        $fee_pro = $request->Fees;
        $Note = $request->Note;
        $PlaceReferralOn = $request->PlaceReferralOn;
        $UID = Auth::user()->id;
        $Fees = $Amount * $Quantity * ($fee_pro / 100);
        $data = compact('CID', 'Amount', 'Quantity', 'Fees', 'Note', 'PlaceReferralOn', 'UID', 'ReferralUrl', 'Status');

        $TransID = TblCryptoReferralLink::create($data)->id;

        $this->getSponsor3Level($UID, $TransID, $Amount * $Quantity, $CID, 'R', 0);
        return response(['message' => "Crypto Referral Link saved successfully!", 'success' => true], 200);
    }
    public function getNetworkTree($user_id)
    {
        $referralUsers = ClientsModel::get_clients_for_tree($user_id);

        $store_all_id = [];
        foreach ($referralUsers as $user) $store_all_id[] = $user->ParentID;
        $network_tree = [];

        if (in_array($user_id, $store_all_id)) {
            $network_tree = $this->in_parent($user_id, $store_all_id, 0, $user_id);
        } else {
            $user = ClientsModel::getUserByID($user_id);

            $sponsor = $user->sponsor;
            $left = ClientsModel::getTotalLeg($user_id, "Left");
            $right = ClientsModel::getTotalLeg($user_id, "Right");
            $rank = ClientsModel::findRank($user_id);
            $referrals = ClientsModel::getDirectReferrals($user->ScreenName);
            $network_tree = [
                "key" => $user->id,
                "leg" => $user->Leg,
                "label" => $user->fullname,
                "data" => compact("sponsor", "left", "right", "rank", "referrals"),
                "expanded" => true,
                "children" => []
            ];
        }
        return $network_tree;
    }
    public function network()
    {
        $user_id = Auth::user()->id;
        $isAdmin = Auth::user()->role == 1;
        $data = [];
        if ($isAdmin) {
            $users = User::where('ParentID', 0)->get();
            foreach ($users as $user) {
                $data[] = $this->getNetworkTree($user->id);
            }
        } else {
            $data = [$this->getNetworkTree($user_id)];
        }

        return response(['data' => $data, 'success' => true], 200);
    }
    function in_parent($in_parent, $store_all_id, $level, $user_id)
    {
        $level++;
        $expanded = $level < 3;
        $data = [];

        if (in_array($in_parent, $store_all_id)) {
            $users = ClientsModel::getUser($in_parent);

            foreach ($users as $user) {
                $sponsor = $user->sponsor;
                $left = ClientsModel::getTotalLeg($user->id, "Left");
                $right = ClientsModel::getTotalLeg($user->id, "Right");
                $rank = ClientsModel::findRank($user->id);
                $referrals = ClientsModel::getDirectReferrals($user->ScreenName);
                $data[] = [
                    "key" => $user->id,
                    "leg" => $user->Leg,
                    "label" => $user->fullname,
                    "data" => compact("sponsor", "left", "right", "rank", "referrals"),
                    "expanded" => $expanded,
                    "children" => $this->in_parent($user->id, $store_all_id, $level, $user_id)
                ];
            }
            if ($in_parent == $user_id) {
                $user = ClientsModel::getUserByID($user_id);
                $sponsor = $user->sponsor;
                $left = ClientsModel::getTotalLeg($user_id, "Left");
                $right = ClientsModel::getTotalLeg($user_id, "Right");
                $rank = ClientsModel::findRank($user_id);
                $referrals = ClientsModel::getDirectReferrals($user->ScreenName);
                $data = [
                    "key" => $user->id,
                    "leg" => $user->Leg,
                    "label" => $user->fullname,
                    "data" => compact("sponsor", "left", "right", "rank", "referrals"),
                    "expanded" => $expanded,
                    "children" => $data
                ];
            }
        }
        return $data;
    }

    // ------------------admin---------------------------------
    public function getContracts()
    {
        $contracts = TblContract::orderby('id')->get();
        foreach ($contracts as $contract) {
            $cryptos = TblCrypto::where('contractId', $contract->id)->get();
            $str_balance = '';
            foreach ($cryptos as $crypto) {
                $balance = ClientsModel::get_final_walletsBalance(0, $crypto->id);
                $balance = number_format($balance, 5);
                if ($balance > 0) {
                    if ($str_balance) $str_balance .= ', ';
                    $str_balance .= $balance . $crypto->CryptoName;
                }
            }
            $contract->balance = $str_balance;
        }
        return response(['data' => $contracts, 'success' => true], 200);
    }
    public function adminWallets($user_id)
    {
        // $user_id = 1;
        if ($user_id == 2) $user_id = 1;
        $wallets = ClientsModel::get_wallets();

        foreach ($wallets as $wallet) {
            $balance = ClientsModel::get_walletsBalance($user_id, $wallet->id);

            $rightBalance = ClientsModel::get_sponsor_wallet($user_id, $wallet->id) ?? 0;
            $purchaseBalance = ClientsModel::get_purchases_for_wallet($user_id, $wallet->id) ?? 0;
            $balance = $balance + $rightBalance - $purchaseBalance;

            $finalAmount = ClientsModel::get_transfer_amount($user_id, $wallet->id, 'R');
            $client2admin = $user_id == 1 ? ClientsModel::get_all_transfer_amount($wallet->id) : 0;
            $payoutLog = $user_id == 1 ?  ClientsModel::get_all_payout_amount($wallet->id) : 0;

            $finalbinaryholdamount = ClientsModel::get_binary_hold_balance($user_id, $wallet->id);
            $finalsponsorholdamount = ClientsModel::get_sponsor_hold_balance($user_id, $wallet->id);
            $finalHoldAmount = ClientsModel::get_transfer_amount($user_id, $wallet->id, 'H');

            $staked_amount = TblStaked::where('CryptoID', $wallet->id)->where('status', 'A')->sum('StakeAmount');
            $wallet['balance'] = $balance - $finalAmount + $client2admin - $payoutLog;
            $wallet['hold_amount'] = $finalbinaryholdamount + $finalsponsorholdamount - $finalHoldAmount;
            $wallet['final_sponsor_hold_amount'] = $finalsponsorholdamount;
            $wallet['staked_amount'] = $staked_amount;
        }

        return response(['wallets' => $wallets, 'success' => true], 200);
    }
    public function confirmPayout(Request $request)
    {
        $crypto_id = $request->crypto_id;
        $amount = $request->amount;
        $transaction_id = $request->transaction_id;

        TblAdminPayoutLog::create([
            'CryptoID' => $crypto_id,
            'FirstAmount' => $amount,
            'SecondAmount' => 0,
            'DateOfTrans' => date('Y-m-d H:i:s'),
            "transaction_id" => $transaction_id,
        ]);
        return response(['message' => 'Payout Successfully', 'success' => true], 200);
    }
    public function transfer2Admin(Request $request)
    {
        $user_id = $request->user_id;
        $crypto_id = $request->crypto_id;
        $balance = $request->balance;
        $amount = $request->amount;
        $isHold = $request->isHold;

        if ($amount > $balance) {
            return response(['message' => 'Transfer amount must be less than or equal to Current Balance!', 'success' => false], 200);
        }

        TblClientToAdminTransferLog::create([
            'CoinID' => $crypto_id,
            'UserID' => $user_id,
            'AmountType' => $isHold ? 'H' : 'R',
            'Amount' => $amount,
            'DateOfTransfer' => date('Y-m-d')
        ]);
        return response(['message' => 'Transfer ' . ($isHold ? 'hold' : '') . ' amount to admin successfully!', 'success' => true], 200);
    }
    public function deleteTransfer($id)
    {
        TblTransfer::find($id)->delete();
        return response(['message' => 'Successfully Deleted the transaction history', 'success' => true], 200);
    }
    public function getClients()
    {
        $data = User::where('role', "!=", 1)->orderby('id')->get();
        foreach ($data as $user) {
            $user->rank = ClientsModel::findRank($user->id);
            $user->left = ClientsModel::getTotalLeg($user->id, "Left");
            $user->right = ClientsModel::getTotalLeg($user->id, "Right");
            $user->direct_referral = ClientsModel::getDirectReferrals($user->ScreenName);
            $user->last_login_ip = '::1';
            $user->just_login = true;
        }
        return response(['data' => $data, 'success' => true], 200);
    }
    public function updateUser(Request $request)
    {
        $id = $request->id;
        $data = $request->except("id");
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }
        if ($request->has('secondary_password')) {
            $data['secPassword'] = Hash::make($request->secondary_password);
        }
        $data['activation_code'] = '';
        $data['created_at'] = date('Y-m-d');
        User::updateOrCreate(['id' => $id], $data);
        return response(['message' => $id == 0 ? 'Successfully added the user' : 'Successfully updated the user', 'success' => true], 200);
    }
    public function deleteUser($id)
    {
        User::find($id)->delete();
        return response(['message' => 'Successfully deleted User', 'success' => true], 200);
    }
    public function getPurchases($id)
    {
        $data = ClientsModel::get_purchases($id);
        return response(['data' => $data, 'success' => true], 200);
    }
    public function deletePurchase($id)
    {
        Purchase::find($id)->delete();
        return response(['message' => 'Successfully Deleted purchase', 'success' => true], 200);
    }
    public function updatePackage(Request $request)
    {
        $id = $request->id;
        $data = $request->except("id");
        // Log::debug(__FUNCTION__ . " == " . __LINE__ . " = : " . json_encode($data));
        $packageName = $data["PackageName"];
        $packageLimit = round(floatval($data["limit"]));
        AdminTemplateSettings::updateOrCreate(['field' => $packageName], ['value' => $packageLimit]);
        Package::updateOrCreate(['id' => $id], $data);
        return response(['message' => $id == 0 ? 'Successfully added the package' : 'Successfully updated the package', 'success' => true], 200);
    }
    public function deletePackage($id)
    {
        Package::find($id)->delete();
        return response(['message' => 'Successfully Deleted package', 'success' => true], 200);
    }
    public function getCategories()
    {
        $data = TblCategory::get();
        return response(['data' => $data, 'success' => true], 200);
    }
    public function updateCategory(Request $request)
    {
        $ID = $request->ID;
        $data = $request->except("ID");
        TblCategory::updateOrCreate(['ID' => $ID], $data);
        return response(['message' => $ID == 0 ? 'Successfully added the category' : 'Successfully updated the category', 'success' => true], 200);
    }
    public function deleteCategory($id)
    {
        TblCategory::find($id)->delete();
        return response(['message' => 'Successfully Deleted the category', 'success' => true], 200);
    }
    public function getTwilioAccounts()
    {
        $account = TblTwilioSetting::first();
        $numbers = TblFromnumber::get();
        return response(['account' => $account, 'numbers' => $numbers, 'success' => true], 200);
    }
    public function getTwilioLogs()
    {
        $sendLogs = TblSmsSendLog::where('message', 'not like', "Incoming%")
            ->where('message', 'not like', "Reply%")
            ->orderby('datetime', 'desc')
            ->get();
        $receiveLogs = TblSmsSendLog::where('message', 'like', "Incoming%")
            ->orwhere('message', 'like', "Reply%")
            ->orderby('datetime', 'desc')
            ->get();
        return response(['sendLogs' => $sendLogs, 'receiveLogs' => $receiveLogs, 'success' => true], 200);
    }
    public function saveTwilioAccounts(Request $request)
    {
        TblTwilioSetting::first()->update($request->all());
        return response(['message' => 'Successfully updated the twilio account settings', 'success' => true], 200);
    }
    public function saveTwilioNumbers(Request $request)
    {
        $id = $request->id;
        $data = $request->except("id");
        TblFromnumber::updateOrCreate(['id' => $id], $data);
        $message = $id == 0 ? 'Successfully added the number' : 'Successfully updated the number';
        return response(['message' => $message, 'success' => true], 200);
    }
    public function deleteTwilioNumber($id)
    {
        TblFromnumber::find($id)->delete();
        return response(['message' => 'Successfully Deleted the number', 'success' => true], 200);
    }
    public function getFaqs()
    {
        $data = Faq::orderby('id')->get();
        return response(['data' => $data, 'success' => true], 200);
    }
    public function updateFaq(Request $request)
    {
        $id = $request->id;
        $data = $request->except("id");
        Faq::updateOrCreate(['id' => $id], $data);
        return response(['message' => $id == 0 ? 'Successfully added the Faq' : 'Successfully updated the Faq', 'success' => true], 200);
    }
    public function deleteFaq($id)
    {
        Faq::find($id)->delete();
        return response(['message' => 'Successfully Deleted Faq', 'success' => true], 200);
    }
    public function sendText(Request $request)
    {
        $id = $request->id;
        $message = $request->message;
        $user = User::find($id);
        $settings = TblTwilioSetting::select('*')->first();

        $account_sid = $settings->sid;
        $auth_token = $settings->token;

        $sendto = "+1" . $user->phone;

        $fromnumber = TblFromnumber::inRandomOrder()->where('status', 'Active')->value('fromnumber');
        $fromnumber = "+1" . $fromnumber;

        $date = date("Y-m-d h:i:s");

        $sentData = TblSmsSendLog::create([
            'datetime' => $date,
            'fromnumber' => $fromnumber,
            'sendto' => $sendto,
            'message' => $message,
            'status' => 'N',
            "sid" => $account_sid,
        ]);
        try {
            $client = new Client($account_sid, $auth_token);
            $client->messages->create($sendto, [
                'from' => $fromnumber,
                'body' => $message,
                'statusCallback' => env('APP_URL') . 'admin/sms-callback'
            ]);
        } catch (\Exception $e) {
            $sentData->update(['status' => 'I']);
            return response(['message' => $e->getMessage(), 'code' => $e->getCode(), 'success' => false], 200);
        }
        return response(['message' => 'Message send to cleint successfully!', 'success' => true], 200);
    }
    public function saveTextStatus(Request $request)
    {
        $datetime = date("Y-m-d h:i:s");
        $sid = $request->MessageSid;
        $sendto = $request->To;
        $status = $request->MessageStatus == 'sent' ? 'Y' : 'N';

        TblSmsSendLog::where('sendto', $sendto)
            ->where('sid', $sid)
            ->where('status', 'N')
            ->update(compact('datetime', 'status'));
        return 1;
    }
    public function deleteTwilioLog($id)
    {
        TblSmsSendLog::find($id)->delete();
        return response(['message' => 'Successfully deleted the sms log!', 'success' => true], 200);
    }
    public function saveConfig($data)
    {
        $config_path = base_path('hardhat/config.js');
        $content = '';
        foreach ($data as $key => $value) $content .= "$key: \"$value\",";
        $content = "module.exports = { $content }";
        file_put_contents($config_path, $content);
        return true;
    }
    public function processContract($address, $network, $type) //$type => 0: deploy, 1: verify
    {
        $deploy_network = $network == "BSC" ? 'bscmainnet' : 'ethmainnet';
        // Log::debug(__FUNCTION__ . " == " . __LINE__ . " APP_ENV = : " . env('APP_ENV', 'dev'));
        if (env('APP_ENV', 'dev') == 'dev') {
            $deploy_network = $network == "BSC" ? 'tbinance' : 'goerli';
        }
        $api_key = $network == "BSC" ? 'AAEAMPVYXP57ZBT4HJTKZMFDQIF1SDPE2B' : '3DRFXQQZVXECEJUS8SDC1BK75GCRWQXUDW';
        $splitter = " ; ";
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $splitter = " & ";
        }
        $path = base_path('hardhat');
        if ($type == 0) {
            $data = [
                'ETHERSCAN_API_KEY' => $api_key,
                'PRIVATE_KEY' => $address,
                'NETWORK' => $network
            ];
            $this->saveConfig($data);
            $cmd = "cd \"$path\" $splitter npx hardhat run --network $deploy_network scripts/deployAll.js 2>&1 $splitter echo $?";
        } else {
            $cmd = "cd \"$path\" $splitter npx hardhat verify --network $deploy_network $address 2>&1 $splitter echo $?";
        }
        // Log::debug(__FUNCTION__ . " == " . __LINE__ . " processContract path = : " . $cmd);
        $res = shell_exec($cmd);
        // Log::debug(__FUNCTION__ . " == " . __LINE__ . " processContract res = : " . json_encode($res));
        if ($type == 0 && str_contains(strtolower($res), 'error')) {
            return [
                'message' => 'Error while deploy contract. Check wallet balance.',
                'code' => ERRORCODE::NO_BALANCE_PRIVATEKEY,
                'success' => false,
            ];
        }
        return [
            'message' => $type == 0 ? 'Successfully deployed contract' : 'Successfully verified contract',
            'code' => 200,
            'success' => true,
        ];
    }
    public function contractAction(Request $request)
    {
        $id = $request->id;
        $type = $request->type;
        $contract = TblContract::find($id);
        $response = [];
        if ($type == ContractAction::DEPLOY) {
            $address = $request->address;
            $network = $request->network;
            $response = $this->processContract($address, $network, 0);
        } else if ($type == ContractAction::VERIFY) {
            $response = $this->processContract($contract->address, $contract->network, 1);
            $contract->update(['verified' => 1]);
        } else if ($type == ContractAction::ACTIVE || $type == ContractAction::DEACTIVE) {
            $actived = $contract->actived == 0;
            $contract->update(['actived' => $actived ? 1 : 0]);
            $response = ['message' => $actived ? 'Contract successfully actived' : 'Contract successfully deactived', 'success' => true];
        } else if ($type == ContractAction::DELETE) {
            $contract->delete();
            $activedCount = TblContract::where('actived', 1)->count();
            if ($activedCount <= 0) {
                TblContract::where('active', 0)->first()->update(['actived' => 1]);
            }
            $response = ['message' => 'Contract successfully deleted', 'success' => true];
        }
        return response($response, 200);
    }
    public function updateCrypto(Request $request)
    {
        $id = $request->id;
        $data = $request->except("id");
        if ($id == 0) {
            $data['Price'] = 0;
            $data['BlockchainName'] = 0;
        }
        TblCrypto::updateOrCreate(['id' => $id], $data);
        return response(['message' => $id == 0 ? 'Successfully added the crypto' : 'Successfully updated the crypto', 'success' => true], 200);
    }
    public function updateShowCrypto(Request $request)
    {
        $type = $request->type;
        $id = $request->id;
        $crypto = TblCrypto::find($id);

        if ($type == 3) {
            $visible = $crypto->visible;
            $crypto->update(['visible' => $visible == 0 ? 1 : 0]);
            return response(['message' => $visible == 0 ? 'Crypto set to visible' : 'Crypto set to invisible', 'success' => true], 200);
        } else if ($type == 4) {
            $pulse = $crypto->pulse;
            $crypto->update(['pulse' => $pulse == 0 ? 1 : 0]);
            return response(['message' => $pulse == 0 ? 'Crypto set to pulse' : 'Crypto removed from pulse', 'success' => true], 200);
        } else if ($type == 5) {
            $crypto = TblCrypto::find($id);
            $explorer = $crypto->explorer;
            $crypto->update(['explorer' => $explorer == 0 ? 1 : 0]);
            return response(['message' => $explorer == 0 ? 'Crypto set to explorer' : 'Crypto removed from explorer', 'success' => true], 200);
        } else if ($type == 6) {
            $value = $request->value;
            $crypto->update(['discount' => $value]);
            return response(['message' =>  'Successfully updated the discount', 'success' => true], 200);
        }
        return response(['message' => 'Invalid action', 'success' => false], 200);
    }
    public function deleteCrypto($id)
    {
        TblCrypto::find($id)->delete();
        return response(['message' => 'Successfully Deleted the crypto', 'success' => true], 200);
    }
    public function updateNetworkSettings(Request $request)
    {
        $id = $request->id;
        $data = $request->except("id");
        TblNetworkSetting::find($id)->update($data);
        return response(['message' => 'Successfully updated the network settings', 'success' => true], 200);
    }
    public function runBinaryPayout()
    {
        Artisan::call('command:binary_payout');
        return response(['message' => 'Binary Payout run successfully!', 'success' => true], 200);
    }
    public function getReferralSettings()
    {
        $data = TblAdminReferralSetting::where('id', 1)->first();
        return response(['data' => $data, 'success' => true], 200);
    }
    public function updateReferralSettings(Request $request)
    {
        TblAdminReferralSetting::where('id', 1)->update($request->all());
        return response(['message' => 'Non Referral Signup settings saved successfully!', 'success' => true], 200);
    }
    public function getAdminData()
    {
        $data = AdminSettings::first();
        return response(['data' => $data, 'success' => true], 200);
    }
    public function updateAdminData(Request $request)
    {
        $username = $request->username;

        $editablePassword = $request->editablePassword;
        $password = $request->password;

        $editable2ndPassword = $request->editable2ndPassword;
        $secondaryPassword = $request->secondaryPassword;

        $adminData = $request->adminData;

        $data = ['username' => $username];
        if ($editablePassword) $data['password'] = Hash::make($password);
        if ($editable2ndPassword) $data['secPassword'] = Hash::make($secondaryPassword);
        User::find(Auth::user()->id)->update($data);

        unset($adminData['created_at']);
        unset($adminData['updated_at']);
        AdminSettings::where('id', 1)->update($adminData);
        return response(['message' => 'Successfully updated the admin settings!', 'success' => true], 200);
    }
    public function getTransactions()
    {
        $res_data = [];
        $userid = Auth::user()->id;
        // coin, transtype, date, status, amount, 
        // Log::debug(__FUNCTION__ . " == " . __LINE__ . " getTransactions userid = : " . json_encode($userid));
        if ($userid === 1) {
            $data = TblWallet::get();
        } else {
            $data = TblWallet::where('UID', $userid)->get();
        }

        foreach ($data as $value) {
            $crypto = TblCrypto::find($value->CID);
            $tmp['coin'] = 'Deleted Crypto';
            if ($crypto) $tmp['coin'] = $crypto->CryptoName;
            $tmp['TransType'] = $value->TransType; //D, W, T
            $tmp['date'] = $value->TransDate;
            $tmp['status'] = $value->Status; //P, C(confirm), R
            $tmp['amount'] = $value->Amount;
            $tmp['plus'] = $value->TransType == 'D';
            $tmp['upcomming'] = $value->Status == 'P';
            $res_data[] = $tmp;
        }
        if ($userid === 1) {
            $data = TblTransfer::get();
        } else {
            $data = TblTransfer::where('FromClientID', $userid)->orwhere('ToClientID', $userid)->get();
        }
        foreach ($data as $value) {
            $crypto = TblCrypto::find($value->CID);

            $tmp['coin'] = 'Deleted Crypto';
            if ($crypto) $tmp['coin'] = $crypto->CryptoName;
            $tmp['TransType'] = $value->TransType; //S, R
            $tmp['date'] = $value->TransDate;
            $tmp['status'] = $value->Status; //P, A, CA(cancel), R
            $tmp['amount'] = $value->Amount;
            $tmp['plus'] = $value->TransType == 'R';
            $tmp['upcomming'] = $value->Status == 'P';
            $res_data[] = $tmp;
        }
        if ($userid === 1) {
            $holding = TblSponsorPayoutLog::where('PayoutHold', 'H')->get();
        } else {
            $holding = TblSponsorPayoutLog::where('SponsorID', $userid)->where('PayoutHold', 'H')->get();
        }
        foreach ($holding as $value) {
            $value->cryptoName = TblCrypto::find($value->CryptoID)->value('CryptoName');
            $type = '';
            if ($value->TransType == 'D') $type = 'Deposit';
            if ($value->TransType == 'W') $type = 'Withdrawal';
            if ($value->TransType == 'T') $type = 'Transfer';
            if ($value->TransType == 'R') $type = 'Renew';
            if ($value->TransType == 'P') $type = 'Package';
            if ($value->TransType == 'B') $type = 'Buy product';
            if ($value->TransType == 'C') $type = 'Rebalance Credit';
            $value->type = $type;
            $value->plus = true;
        }
        return response(['data' => $res_data, 'holding' => $holding, 'success' => true], 200);
    }
    public function getContacts()
    {
        $user = Auth::user();
        $data = User::where('sponsor', $user->ScreenName)->where('id', '!=', $user->id)->get();
        return response(['data' => $data, 'success' => true], 200);
    }

    /**  
     * Insert the Log of Purchase the App
     * @author Richard Kei
     * @param userid, money, purchased date
     * @since 2024-05-15
     * @return boolean true or false
     */
    public function insert_PurchaseLog(Request $request)
    {
        $data = [];
        $data['card_lastFourDigits'] = $request->card_lastFourDigits;
        $data['card_brand'] = $request->card_brand;
        $data['card_prepaidType'] = $request->card_prepaidType;
        $data['card_type'] = $request->card_type;
        $data['money'] = $request->money;
        $data['purchased_date'] = date('Y-m-d H:i:s');

        if (PurchaseLog::savePurchaseLog($data)) {
            $status = 200;
            $result = true;
            $msg = "Successfully saved the purchase log.";
        } else {
            $status = 500;
            $result = false;
            $msg = "Unfortunately failed to save the purchase log.";
        }

        return response(['message' => $msg, 'success' => $result], $status);
    }
}
