<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DynamicRule extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'track_targets',
        'restrict_targets',
        'condition',
        'action',
        'evaluation_window',
        'effective_days'
    ];

    protected $casts = [
        'track_targets' => 'array',
        'restrict_targets' => 'array',
        'condition' => 'array',
        'action' => 'array',
        'effective_days' => 'array',
    ];
    public function assignments()
    {
        return $this->hasMany(RuleAssignment::class, 'rule_id');
    }

    public function participants()
    {
        return $this->belongsToMany(AppUser::class, 'rule_assignments', 'rule_id', 'participant_id');
    }

    public function researchers()
    {
        return $this->belongsToMany(User::class, 'rule_assignments', 'rule_id', 'researcher_id');
    }
}
