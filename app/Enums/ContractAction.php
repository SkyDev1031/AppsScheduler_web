<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class ContractAction extends Enum
{
    const DEPLOY =   0;
    const VERIFY =   1;
    const ACTIVE =   2;
    const DEACTIVE = 3;
    const DELETE =   4;
}