<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDynamicRulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dynamic_rules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('track_targets');     // { apps: [], categories: [] }
            $table->json('restrict_targets');  // { apps: [], categories: [] }
            $table->json('condition');         // { metric, operator, value }
            $table->json('action');            // { type, start_time?, end_time?, limit_minutes? }
            $table->string('evaluation_window')->default('daily'); // e.g., daily, weekly
            $table->json('effective_days');    // [ "Monday", "Tuesday", ... ]
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dynamic_rules');
    }
}
