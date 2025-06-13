<?php

namespace Database\Factories;

use App\Models\AdminSettings;
use Illuminate\Database\Eloquent\Factories\Factory;

class AdminSettingsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AdminSettings::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'binaryExpireDays' => $this->faker->numberBetween(1, 365),
            'featured_video' => $this->faker->url,
            'about_us' => $this->faker->paragraph,
            'terms_and_conditions' => $this->faker->paragraph,
            'facebook_url' => $this->faker->url,
            'twitter_url' => $this->faker->url,
            'instagram_url' => $this->faker->url,
        ];
    }
}
