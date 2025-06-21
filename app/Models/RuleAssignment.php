<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RuleAssignment extends Model
{
    use HasFactory;
    protected $fillable = [
        'rule_id',
        'researcher_id',
        'participant_id'
    ];
    
    public function rule()
    {
        return $this->belongsTo(DynamicRule::class, 'rule_id');
    }

    public function researcher()
    {
        return $this->belongsTo(User::class, 'researcher_id');
    }

    public function participant()
    {
        return $this->belongsTo(AppUser::class, 'participant_id');
    }
}
