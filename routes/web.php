<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

// Redirect root to login for unauthenticated users
Route::get('/', function () {
    return Auth::check() ? view('app') : redirect('/login');
});

// Simple pages
Route::middleware('auth')->group(function () {
    Route::get('/receipts', function () {
        return view('receipts');
    });
    Route::get('/reports', function () {
        return view('reports');
    });
});

// Login routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [App\Http\Controllers\Auth\LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [App\Http\Controllers\Auth\LoginController::class, 'login']);
});

Route::post('/logout', [App\Http\Controllers\Auth\LoginController::class, 'logout'])->name('logout')->middleware('web');

// SPA Routes - All handled by React Router
Route::middleware('auth')->group(function () {
    Route::get('/{any}', function () {
        return view('app');
    })->where('any', '^(?!api|login|logout).*$');
});
