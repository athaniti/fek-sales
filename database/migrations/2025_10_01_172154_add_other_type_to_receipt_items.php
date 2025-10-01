<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('receipt_items', function (Blueprint $table) {
            // Update enum to include 'other' type
            $table->enum('item_type', ['fek', 'book', 'cd', 'product', 'other'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('receipt_items', function (Blueprint $table) {
            // Revert back to previous enum
            $table->enum('item_type', ['fek', 'book', 'cd', 'product'])->change();
        });
    }
};
