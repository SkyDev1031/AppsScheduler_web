<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppUser extends Model
{
    use HasFactory;

    protected $table = 'appusers';

    protected $fillable = [
        'userID',
        'phonenumber',
        'password',
        'status',
        'fcm_token', // Add fcm_token to the fillable array
    ];

    public function study()
    {
        return $this->belongsTo(Study::class);
    }
    public function studies()
    {
        return $this->belongsToMany(Study::class, 'study_participant_requests', 'participant_id', 'study_id')
            ->withPivot('study_status')
            ->withTimestamps();
    }
    public function invitations()
    {
        return $this->hasMany(StudyParticipantRequest::class, 'participant_id');
    }

    public function participant()
    {
        return $this->belongsTo(AppUser::class, 'participant_id');
    }

    public function assignedRules()
    {
        return $this->belongsToMany(DynamicRule::class, 'rule_assignments', 'participant_id', 'rule_id');
    }

    public function ruleAssignments()
    {
        return $this->hasMany(RuleAssignment::class, 'participant_id');
    }
}
