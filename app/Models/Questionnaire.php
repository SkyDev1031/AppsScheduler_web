<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Questionnaire extends Model
{
    protected $fillable = ['researcher_id', 'title', 'description'];

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function assignments()
    {
        return $this->hasMany(QuestionnaireAssignment::class);
    }

    public function researcher()
    {
        return $this->belongsTo(User::class, 'researcher_id');
    }

    public function responses()
    {
        return $this->hasManyThrough(
            QuestionnaireResponse::class,
            QuestionnaireAssignment::class,
            'questionnaire_id',     // Foreign key on QuestionnaireAssignment
            'assignment_id',        // Foreign key on QuestionnaireResponse
            'id',                   // Local key on Questionnaire
            'id'                    // Local key on QuestionnaireAssignment
        );
    }

}