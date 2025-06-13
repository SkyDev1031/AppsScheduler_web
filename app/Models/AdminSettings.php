<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminSettings extends Model
{
    use HasFactory;
    protected $table = 'tbl_admin_settings';
    protected $fillable = [
        'binaryExpireDays',
        'TransferFeeTransferDelay',
        'ReferralLinkGeneratorFee',
        'PackageTransferFee',
        'BuyersFee',
        'FeatureItemFee',
        'stakePro',
        'networkPro',
        'featured_video',
        'about_us',
        'terms_and_conditions',
        'facebook_url',
        'twitter_url',
        'instagram_url',
        'COIN_LTC',
        'COIN_LTC_KEY',
        'COIN_BTC',
        'COIN_BTC_KEY',
        'COIN_DOGE',
        'COIN_DOGE_KEY',
        'COIN_USDT',
        'COIN_ETH',
        'COIN_BNB',
        'GAS_ETH',
        'GAS_ETH_KEY',
        'GAS_BSC',
        'GAS_BSC_KEY',
    ];
}