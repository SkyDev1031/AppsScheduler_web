<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionnaireAssignment extends Model
{
    protected $fillable = ['questionnaire_id', 'participant_id', 'assigned_at', 'completed_at'];

    public function questionnaire()
    {
        return $this->belongsTo(Questionnaire::class);
    }

    public function participant()
    {
        return $this->belongsTo(AppUser::class, 'participant_id');
    }

    public function responses()
    {
        return $this->hasMany(QuestionnaireResponse::class, 'assignment_id');
    }
}
