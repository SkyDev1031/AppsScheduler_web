<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSendRecommendationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('send_recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recommendation_id')->constrained('recommendations')->onDelete('cascade');
            $table->foreignId('researcher_id')->constrained('users')->onDelete('cascade');
            $table->unsignedBigInteger('participant_id');
            $table->timestamp('send_time')->nullable();
            $table->timestamp('accept_time')->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->timestamps();
        
            $table->foreign('participant_id')->references('id')->on('appusers')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('send_recommendations');
    }
}
