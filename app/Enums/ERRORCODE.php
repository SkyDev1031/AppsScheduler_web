<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ERRORCODE extends Enum
{
    const INVALID_INPUT = 4001;
    const NO_ENOUGH_BALANCE = 4002;
    const NO_PRICE = 4003;

    const UKNOWN_ERROR = 3000;
    const NETWORK_ERROR = 5001;
    const AUTH_NETWORK_ERROR = 5002;
    const CHECK_2ND_ERROR = 5003;
    const DEPOSIT_ERROR = 5004;
    const WITHDRAW_ERROR = 5005;
    const PAYOUT_ERROR = 5006;
    const UPDATE_USER_ERROR = 5007;
    const SEND_TEXT_ERROR = 5008;
    const DELETE_PURCHASE_ERROR = 5009;
    const CONTRACT_ERROR = 5010;

    const INVALID_TWILIO = 6001;
    const NO_BALANCE_PRIVATEKEY = 6002;
}