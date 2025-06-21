<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
	use HasFactory, Notifiable, HasApiTokens;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array<int, string>
	 */
	public $timestamps = false;
	protected $fillable = [
		'fullname',
		'username',
		'ScreenName',
		'phone',
		'password',
		'secPassword',
		'activation_code',
		'status',
		'LoginIP',
		'LoginStatus',
		'Token',
		'role',
		'support',
		'created_at',
		'updated_at'
	];

	/**
	 * The attributes that should be hidden for serialization.
	 *
	 * @var array<int, string>
	 */
	protected $hidden = [
		'password',
		'remember_token',
		'secPassword'
	];

	/**
	 * The attributes that should be cast.
	 *
	 * @var array<string, string>
	 */
	protected $casts = [
		'email_verified_at' => 'datetime',
	];
	public function accessTokens()
	{
		return $this->hasMany('App\Models\OauthAccessToken');
	}

	public static function getUserNameByID($ID) {
		$result = User::where('id', $ID)->first();

		return $result->fullname;
	}

	public function studies()
	{
		return $this->hasMany(Study::class, 'researcher_id');
	}

	public function createdRuleAssignments()
    {
        return $this->hasMany(RuleAssignment::class, 'researcher_id');
    }

    public function assignedRules()
    {
        return $this->belongsToMany(DynamicRule::class, 'rule_assignments', 'researcher_id', 'rule_id');
    }
}