<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('first_user_id');
            $table->unsignedBigInteger('second_user_id');
            $table->unsignedBigInteger('property_id');
            $table->timestamps();

            $table->foreign('first_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('second_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
        });

        // Add a custom constraint to prevent duplicate conversations between the same two users
        // This ensures that (user1, user2) and (user2, user1) are treated as the same conversation
        // DB::statement('
        //     ALTER TABLE conversations 
        //     ADD CONSTRAINT unique_conversation_pair 
        //     CHECK (
        //         NOT EXISTS (
        //             SELECT 1 FROM conversations c2 
        //             WHERE (c2.first_user_id = conversations.second_user_id AND c2.second_user_id = conversations.first_user_id)
        //             AND c2.id != conversations.id
        //         )
        //     )
        // ');
    }

    public function down()
    {
        Schema::dropIfExists('conversations');
    }
}; 