<?php
// Simple test of the dashboard API
require 'bootstrap/app.php';

use Illuminate\Http\Request;

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Create a request for the dashboard stats
$request = Request::create('/api/dashboard/stats', 'GET');

// Process the request
$response = $kernel->handle($request);

// Output the response
echo "Status: " . $response->getStatusCode() . "\n";
echo "Content: " . $response->getContent() . "\n";

$kernel->terminate($request, $response);
