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
}