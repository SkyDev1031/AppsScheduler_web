<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudyParticipantRequest extends Model
{
    use HasFactory;
    protected $fillable = [
        'study_id',
        'participant_id',
        'study_status', // Pending, Approved, Declined
    ];
    public function study()
    {
        return $this->belongsTo(Study::class);
    }

    public function participant()
    {
        return $this->belongsTo(AppUser::class, 'participant_id');
    }

    
}
