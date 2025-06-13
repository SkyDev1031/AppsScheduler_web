<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model
{
    use HasFactory;
    protected $fillable = ['researcher_id', 'title', 'content'];
    public function researcher() {
        return $this->belongsTo(User::class, 'researcher_id');
    }

    public function schedules() {
        return $this->hasMany(RecommendedSchedule::class);
    }

    public function sends() {
        return $this->hasMany(SendRecommendation::class);
    }
}
