<?php

// app/Http/Controllers/ReportController.php
namespace App\Http\Controllers;

use App\Services\ReportService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function __construct(private ReportService $reportService) {}

    public function index()
    {
        return view('reports.index');
    }

    public function daily(Request $request)
    {
        $date = $request->input('date', today()->toDateString());

        try {
            $carbonDate = Carbon::parse($date);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Μη έγκυρη ημερομηνία'
            ], 400);
        }

        $report = $this->reportService->getDailySales($carbonDate);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'data' => $report]);
        }

        return view('reports.daily', compact('report', 'carbonDate'));
    }

    public function monthly(Request $request)
    {
        $year = $request->input('year', now()->year);
        $month = $request->input('month', now()->month);

        // Validate year and month ranges
        if ($year < 2020 || $year > 2100 || $month < 1 || $month > 12) {
            return response()->json([
                'success' => false,
                'error' => 'Μη έγκυρη ημερομηνία'
            ], 400);
        }

        $report = $this->reportService->getMonthlySales($year, $month);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'data' => $report]);
        }

        return view('reports.monthly', compact('report', 'year', 'month'));
    }

    public function yearly(Request $request)
    {
        $year = $request->input('year', now()->year);

        // Validate year range
        if ($year < 2020 || $year > 2100) {
            return response()->json([
                'success' => false,
                'error' => 'Μη έγκυρο έτος'
            ], 400);
        }

        $report = $this->reportService->getYearlySales($year);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'data' => $report]);
        }

        return view('reports.yearly', compact('report', 'year'));
    }
}
