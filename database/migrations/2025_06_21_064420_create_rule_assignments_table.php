<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRuleAssignmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rule_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rule_id')->constrained('dynamic_rules')->onDelete('cascade');
            $table->foreignId('researcher_id')->constrained('users')->onDelete('cascade'); // or 'users' depending on your table
            $table->foreignId('participant_id')->constrained('appusers')->onDelete('cascade'); // or 'users' depending on your table
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
        Schema::dropIfExists('rule_assignments');
    }
}
