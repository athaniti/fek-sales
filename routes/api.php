<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{FekController, ReceiptController, ProductController, ReportController};

Route::middleware('auth:sanctum')->group(function () {

    // FEK API
    Route::prefix('fek')->group(function () {
        Route::get('/search', [FekController::class, 'search']);
        Route::get('/details', [FekController::class, 'details']);
    });

    // Receipts API
    Route::get('/receipts', [ReceiptController::class, 'index']);
    Route::get('/receipts/{receipt}', [ReceiptController::class, 'show']);
    Route::post('/receipts', [ReceiptController::class, 'store']);
    Route::post('/receipts/{receipt}/cancel', [ReceiptController::class, 'cancel']);

    // Products API
    Route::get('/products', [ProductController::class, 'index']);

    // Reports API
    Route::get('/reports/daily', [ReportController::class, 'daily']);
    Route::get('/reports/monthly', [ReportController::class, 'monthly']);
    Route::get('/reports/yearly', [ReportController::class, 'yearly']);
});
