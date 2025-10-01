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
            // Change enum to include new types
            $table->enum('item_type', ['fek', 'book', 'cd', 'product'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('receipt_items', function (Blueprint $table) {
            // Revert back to original enum
            $table->enum('item_type', ['fek', 'product'])->change();
        });
    }
};
