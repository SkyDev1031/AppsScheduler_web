<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'researcher_id',
        'title',
        'content',
        'role'
    ];

    public function researcher()
    {
        return $this->belongsTo(User::class, 'researcher_id');
    }
}
