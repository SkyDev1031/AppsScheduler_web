<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppUseInfo extends Model
{
    use HasFactory;
    protected $table = 'app_use_infos';
    protected $fillable = [
        'phonenumber',
        'userID',
        'app_name',
        'app_start_time',
        'app_end_time',
        'app_duration',
        'app_scheduled_flag',
        'saved_time'
    ];


}
