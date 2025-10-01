<?php

// app/Http/Controllers/FekController.php
namespace App\Http\Controllers;

use App\Services\FekApiService;
use App\Services\PricingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FekController extends Controller
{
    public function __construct(
        private FekApiService $fekApi,
        private PricingService $pricingService
    ) {}

    public function search(Request $request)
    {
        Log::info('FEK Search called with params:', $request->all());

        $validated = $request->validate([
            'q' => 'nullable|string', // General search query
            'fek_type' => 'nullable|string',
            'fek_number' => 'nullable|string',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
            'title' => 'nullable|string',
        ]);

        try {
            // If general query 'q' is provided, use it as 'query' parameter
            if (!empty($validated['q'])) {
                $validated['query'] = $validated['q'];
            }

            Log::info('Calling FEK API with filters:', $validated);
            $results = $this->fekApi->searchFek($validated);
            Log::info('FEK API returned:', ['count' => count($results)]);

            return response()->json(['success' => true, 'data' => $results]);
        } catch (\Exception $e) {
            Log::error('FEK Search error:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function details(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|string', // FEK ID from search results
            'fek_number' => 'nullable|string',
            'fek_type' => 'nullable|string',
            'fek_date' => 'nullable|date',
        ]);

        try {
            $details = null;

            // If ID is provided, get details by ID
            if (!empty($validated['id'])) {
                // For development mode, handle fake data
                if (config('app.env') === 'local' && config('app.debug')) {
                    $details = $this->fekApi->getFakeDetailsById($validated['id']);
                } else {
                    // For production, you would implement ID-based lookup
                    // For now, extract info from ID format: fek_NUMBER_TYPE_YEAR
                    if (preg_match('/fek_(\d+)_([A-Z])_(\d{4})/', $validated['id'], $matches)) {
                        $details = $this->fekApi->getFekDetails(
                            $matches[1], // number
                            $matches[2], // type
                            $matches[3] . '-01-01' // date
                        );
                    }
                }
            } else {
                // Fallback to number/type/date lookup
                $details = $this->fekApi->getFekDetails(
                    $validated['fek_number'],
                    $validated['fek_type'],
                    $validated['fek_date']
                );
            }

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
