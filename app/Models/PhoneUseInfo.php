<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhoneUseInfo extends Model
{
    use HasFactory;
    protected $table = 'phone_use_infos';
    protected $fillable = [
        'phonenumber',
        'userID',
        'phone_frequency_unlock',
        'date'
    ];
}