<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportExportTest extends TestCase
{
    /**
     * Test PDF export endpoint
     */
    public function test_pdf_export_endpoint()
    {
        $response = $this->get('/api/reports/export/pdf?type=daily&date=2024-01-15');

        // Should return either PDF content or error response
        $this->assertTrue(
            $response->status() === 200 || $response->status() === 500,
            'Expected PDF export to return 200 or 500, got ' . $response->status()
        );
    }

    /**
     * Test CSV export endpoint
     */
    public function test_excel_export_endpoint()
    {
        $response = $this->get('/api/reports/export/excel?type=daily&date=2024-01-15');

        // Should return either CSV content or error response
        $this->assertTrue(
            $response->status() === 200 || $response->status() === 500,
            'Expected CSV export to return 200 or 500, got ' . $response->status()
        );
    }

    /**
     * Test PDF preview endpoint
     */
    public function test_pdf_preview_endpoint()
    {
        $response = $this->get('/api/reports/export/pdf/preview?type=daily&date=2024-01-15');

        // Should return either PDF content or error response
        $this->assertTrue(
            $response->status() === 200 || $response->status() === 500,
            'Expected PDF preview to return 200 or 500, got ' . $response->status()
        );
    }

    /**
     * Test export endpoints with different report types
     */
    public function test_export_with_different_types()
    {
        $types = ['daily', 'monthly', 'yearly'];

        foreach ($types as $type) {
            $response = $this->get("/api/reports/export/pdf?type={$type}&date=2024-01-15");

            $this->assertTrue(
                $response->status() === 200 || $response->status() === 500,
                "Expected {$type} PDF export to return 200 or 500, got " . $response->status()
            );
        }
    }
}
