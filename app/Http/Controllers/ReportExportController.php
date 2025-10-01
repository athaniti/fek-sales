<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use App\Exports\ReportExport;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class ReportExportController extends Controller
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * Export report as PDF
     */
    public function exportPdf(Request $request)
    {
        try {
            $type = $request->input('type', 'daily');
            $date = $request->input('date', today()->toDateString());

            // Get report data
            $reportData = $this->getReportData($type, $date);

            // Add export metadata
            $reportData['export_info'] = [
                'type' => $type,
                'date' => $date,
                'generated_at' => now()->format('d/m/Y H:i:s'),
            ];

            // Generate PDF
            $pdf = Pdf::loadView('reports.pdf', compact('reportData'))
                ->setPaper('a4')
                ->setOptions([
                    'isHtml5ParserEnabled' => true,
                    'isPhpEnabled' => true,
                    'defaultFont' => 'DejaVu Sans',
                    'isFontSubsettingEnabled' => true,
                ]);

            $filename = $this->generateFilename($type, $date, 'pdf');

            return $pdf->download($filename);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Σφάλμα κατά την εξαγωγή PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export report as CSV (Excel compatible)
     */
    public function exportExcel(Request $request)
    {
        try {
            $type = $request->input('type', 'daily');
            $date = $request->input('date', today()->toDateString());

            // Get report data
            $reportData = $this->getReportData($type, $date);

            // Create CSV export
            $exporter = new ReportExport($reportData, $type);
            $csvContent = $exporter->toCsv();
            $filename = $exporter->getFilename();

            return response($csvContent)
                ->header('Content-Type', 'text/csv; charset=UTF-8')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"')
                ->header('Cache-Control', 'must-revalidate, post-check=0, pre-check=0')
                ->header('Expires', '0');

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Σφάλμα κατά την εξαγωγή CSV: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get report data based on type and date
     */
    private function getReportData($type, $date)
    {
        $carbonDate = Carbon::parse($date);

        switch ($type) {
            case 'daily':
                return $this->reportService->getDailySales($carbonDate);

            case 'monthly':
                return $this->reportService->getMonthlySales($carbonDate->year, $carbonDate->month);

            case 'yearly':
                return $this->reportService->getYearlySales($carbonDate->year);

            default:
                return $this->reportService->getDailySales($carbonDate);
        }
    }

    /**
     * Generate filename for export
     */
    private function generateFilename($type, $date, $extension)
    {
        $carbonDate = Carbon::parse($date);

        $typeLabels = [
            'daily' => 'Ημερήσια',
            'monthly' => 'Μηνιαία',
            'yearly' => 'Ετήσια'
        ];

        $typeLabel = $typeLabels[$type] ?? 'Αναφορά';

        switch ($type) {
            case 'daily':
                $dateStr = $carbonDate->format('d-m-Y');
                break;
            case 'monthly':
                $dateStr = $carbonDate->format('m-Y');
                break;
            case 'yearly':
                $dateStr = $carbonDate->format('Y');
                break;
            default:
                $dateStr = $carbonDate->format('d-m-Y');
        }

        return "FEK_Αναφορά_{$typeLabel}_{$dateStr}.{$extension}";
    }

    /**
     * Preview PDF in browser
     */
    public function previewPdf(Request $request)
    {
        try {
            $type = $request->input('type', 'daily');
            $date = $request->input('date', today()->toDateString());

            // Get report data
            $reportData = $this->getReportData($type, $date);

            // Add export metadata
            $reportData['export_info'] = [
                'type' => $type,
                'date' => $date,
                'generated_at' => now()->format('d/m/Y H:i:s'),
            ];

            // Generate PDF for inline viewing
            $pdf = Pdf::loadView('reports.pdf', compact('reportData'))
                ->setPaper('a4')
                ->setOptions([
                    'isHtml5ParserEnabled' => true,
                    'isPhpEnabled' => true,
                    'defaultFont' => 'DejaVu Sans',
                    'isFontSubsettingEnabled' => true,
                ]);

            return $pdf->stream();

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Σφάλμα κατά την προεπισκόπηση PDF: ' . $e->getMessage()
            ], 500);
        }
    }
}
