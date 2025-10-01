<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{FekController, ReceiptController, ProductController, ReportController, DashboardController};

Route::middleware('auth')->group(function () {

    // Products API
    Route::get('/products', [ProductController::class, 'index']);

    // Reports API
    Route::get('/reports/daily', [ReportController::class, 'daily']);
    Route::get('/reports/monthly', [ReportController::class, 'monthly']);
    Route::get('/reports/yearly', [ReportController::class, 'yearly']);
});

// Dashboard API - Temporary without auth for testing
Route::prefix('dashboard')->group(function () {
    Route::get('/stats', [DashboardController::class, 'stats']);
    Route::get('/recent-receipts', [DashboardController::class, 'recentReceipts']);
});

// Receipts API - Temporary without auth for testing
Route::prefix('receipts')->group(function () {
    Route::get('/', [ReceiptController::class, 'index']);
    Route::get('/{receipt}', [ReceiptController::class, 'show']);
    Route::post('/', [ReceiptController::class, 'store']);
    Route::post('/{receipt}/cancel', [ReceiptController::class, 'cancel']);
});

// FEK API - Temporary without auth for testing
Route::prefix('fek')->group(function () {
    Route::get('/search', [FekController::class, 'search']);
    Route::get('/details', [FekController::class, 'details']);
    Route::get('/test', function() {
        return response()->json(['message' => 'FEK API is working', 'fake_data' => [
            ['id' => 'test_1', 'title' => 'Test ΦΕΚ'],
            ['id' => 'test_2', 'title' => 'Another Test ΦΕΚ']
        ]]);
    });
});
