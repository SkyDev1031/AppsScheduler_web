<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SendRecommendation extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'recommendation_id',
        'researcher_id',
        'participant_id',
        'send_time',
        'accept_time',
        'status'
    ];

    public function recommendation() {
        return $this->belongsTo(Recommendation::class);
    }

    public function researcher() {
        return $this->belongsTo(User::class, 'researcher_id');
    }

    public function participant() {
        return $this->belongsTo(AppUser::class, 'participant_id');
    }
}
