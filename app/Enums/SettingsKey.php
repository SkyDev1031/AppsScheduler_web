<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class SettingsKey extends Enum
{
    const BITQUERY =   0;
    const ADMINTEMPLATESETTINGSID = 1;

    const ADMINTEMPLATEISREGISTRATION = "isRegistration";
    const ADMINTEMPLATEISMARKETPLACE = "isMarketplace";
    const ADMINTEMPLATEISSTACKINGTAB = "isStackingTab";
    const ADMINTEMPLATEUSERLIMIT = "register";
}
