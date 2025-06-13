<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Faq
 * 
 * @property int $id
 * @property string $user_id
 * @property string $client_id
 * @property string $name
 * @property string $scopes
 * @property string $revoked
 * @property string $created_at
 * @property string $updated_at
 * @property string $expires_at
 *
 * @package App\Models
 */
class OauthAccessToken extends Model
{
  protected $table = 'oauth_access_tokens';
	public $timestamps = false;

	protected $fillable = [
		'id',
		'user_id',
		'client_id',
		'name',
		'scopes',
		'revoked',
		'created_at',
		'updated_at',
		'expires_at',
	];
}
