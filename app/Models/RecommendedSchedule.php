<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecommendedSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'recommendation_id',
        'app_packages',
        'app_schedule_days',
        'app_schedule_times',
    ];

    public function recommendation() {
        return $this->belongsTo(Recommendation::class);
    }
}
