<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminTemplateSettings extends Model
{
    use HasFactory;
    protected $table = 'tbl_admin_template_settings';
    protected $fillable = [
        'id',
        'field',
        'value',
    ];
}
