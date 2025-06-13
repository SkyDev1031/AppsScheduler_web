<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'fullname' => $this->faker->name,
            'username' => $this->faker->unique()->safeEmail,
            'ScreenName' => $this->faker->name,
            'password' => bcrypt('password'), // Use bcrypt to hash the password
            'activation_code' => Str::random(10),
            'status' => $this->faker->randomElement(['Pending', 'Active']),
            'CanReceiveBinaryPayouts' => $this->faker->randomElement(['Y', 'N']),
            'LoginIP' => $this->faker->ipv4,
            'LoginStatus' => $this->faker->numberBetween(0, 1),
            'Token' => Str::random(60),
            'TimeStamp' => $this->faker->dateTime()->format('Y-m-d H:i:s'),
            'ParentID' => $this->faker->numberBetween(1, 100),
            'ChildId' => $this->faker->numberBetween(1, 100),
            'PlaceReferralOn' => $this->faker->randomElement(['Left', 'Right']),
            'Leg' => $this->faker->randomElement(['Left', 'Right']),
            'Referral' => $this->faker->userName,
            'sponsor' => $this->faker->userName,
            'WalletBalance' => $this->faker->randomFloat(4, 0, 1000),
            'role' => $this->faker->randomElement(['1', '0']),
            'support' => $this->faker->numberBetween(0, 99),        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function unverified()
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
            ];
        });
    }
}
