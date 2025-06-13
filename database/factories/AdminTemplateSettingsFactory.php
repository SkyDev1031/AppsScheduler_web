<?php

namespace Database\Factories;

use App\Models\AdminTemplateSettings;
use Illuminate\Database\Eloquent\Factories\Factory;

class AdminTemplateSettingsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AdminTemplateSettings::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Returning specific data for the 'field' and 'value'
        $fieldValues = ['isRegistration', 'register'];
        
        return [
            'field' => $this->faker->randomElement($fieldValues), // Randomly picks between 'isRegistration' and 'register'
            'value' => $this->faker->numberBetween(1, 100), // Random integer between 1 and 100
        ];
    }
}
