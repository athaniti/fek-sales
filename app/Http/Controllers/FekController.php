<?php

// app/Http/Controllers/FekController.php
namespace App\Http\Controllers;

use App\Services\FekApiService;
use App\Services\PricingService;
use Illuminate\Http\Request;

class FekController extends Controller
{
    public function __construct(
        private FekApiService $fekApi,
        private PricingService $pricingService
    ) {}

    public function search(Request $request)
    {
        $validated = $request->validate([
            'fek_type' => 'nullable|string',
            'fek_number' => 'nullable|string',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
            'title' => 'nullable|string',
        ]);

        try {
            $results = $this->fekApi->searchFek($validated);
            return response()->json(['success' => true, 'data' => $results]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function details(Request $request)
    {
        $validated = $request->validate([
            'fek_number' => 'required|string',
            'fek_type' => 'required|string',
            'fek_date' => 'required|date',
        ]);

        try {
            $details = $this->fekApi->getFekDetails(
                $validated['fek_number'],
                $validated['fek_type'],
                $validated['fek_date']
            );

            if (!$details) {
                return response()->json([
                    'success' => false,
                    'message' => 'Το ΦΕΚ δεν βρέθηκε'
                ], 404);
            }

            // Υπολογισμός τιμής
            $pricing = $this->pricingService->calculateFekPrice($details);
            $details['calculated_price'] = $pricing;

            return response()->json(['success' => true, 'data' => $details]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function downloadPdf(Request $request)
    {
        $validated = $request->validate([
            'pdf_url' => 'required|url',
        ]);

        try {
            $pdfContent = $this->fekApi->downloadFekPdf($validated['pdf_url']);
            
            return response($pdfContent)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="fek.pdf"');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Αποτυχία λήψης PDF'
            ], 500);
        }
    }
}
