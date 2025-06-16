<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionnaireResponse extends Model
{
    protected $fillable = ['assignment_id', 'question_id', 'answer'];

    public function assignment()
    {
        return $this->belongsTo(QuestionnaireAssignment::class, 'assignment_id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
