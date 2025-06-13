<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\AppUser; // Ensure you have the correct namespace for AppUser
class Notification extends Model
{
    use HasFactory;
    // Specify the primary key if not 'id'
    protected $primaryKey = 'id';

    // If your primary key is not auto-incrementing integer, add this:
    // public $incrementing = true;

    // If your primary key is not an integer (e.g., UUID), specify key type:
    // protected $keyType = 'string';

    // Mass assignable attributes
    protected $fillable = [
        'id_appuser',
        'title',
        'content',
        'read_status',
        'accept_time',
        'read_time',
    ];

    // Cast read_status to boolean and times to datetime
    protected $casts = [
        'read_status' => 'boolean',
        'accept_time' => 'datetime',
        'read_time' => 'datetime',
    ];

    public function appUser()
    {
        return $this->belongsTo(AppUser::class, 'id_appuser');
    }
}
