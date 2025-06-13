<?php

namespace Database\Factories;

use App\Models\AppUser;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AppUserFactory extends Factory
{
    protected $model = AppUser::class;

    public function definition()
    {
        return [
            'userID' => $this->faker->unique()->userID,
            'phonenumber' => $this->faker->unique()->phoneNumber(),
            'password' => bcrypt('password123'), // You can change this to a hashed password
            'status' => $this->faker->randomElement(['Pending', 'Active', 'Disenrolled']),
        ];
    }
}