<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Study extends Model
{
    use HasFactory;    
    protected $fillable = [
        'title',
        'study_code',
        'description',
        'researcher_id'
    ];

    // App\Models\StudyParticipantRequest.php
    // Columns: id, appuser_id, study_id, type ('join', 'leave'), status ('pending', 'approved', 'declined')
    public function researcher()
    {
        return $this->belongsTo(User::class, 'researcher_id');
    }

    public function participants()
    {
        return $this->belongsToMany(AppUser::class, 'study_participant_requests', 'study_id', 'participant_id')
            ->withPivot('study_status')
            ->withTimestamps();
    }

    public function requests()
    {
        return $this->hasMany(StudyParticipantRequest::class);
    }
    
    public function invitations()
    {
        return $this->hasMany(StudyParticipantRequest::class, 'study_id')
                    ->where('type', 'join') // or 'invite' if you’re using that
                    ->with('participant');  // eager load the participant (AppUser)
    }

    protected static function booted()
    {
        static::deleting(function ($study) {
            $study->invitations()->delete();
        });
    }
}
