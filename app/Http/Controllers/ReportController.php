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
        $validated = $request->validate([
            'date' => 'required|date',
        ]);

        $date = Carbon::parse($validated['date']);
        $report = $this->reportService->getDailySales($date);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'data' => $report]);
        }

        return view('reports.daily', compact('report', 'date'));
    }

    public function monthly(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|integer|min:2020|max:2100',
            'month' => 'required|integer|min:1|max:12',
        ]);

        $report = $this->reportService->getMonthlySales(
            $validated['year'],
            $validated['month']
        );

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'data' => $report]);
        }

        return view('reports.monthly', compact('report', 'validated'));
    }

    public function yearly(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|integer|min:2020|max:2100',
        ]);

        $report = $this->reportService->getYearlySales($validated['year']);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'data' => $report]);
        }

        return view('reports.yearly', compact('report', 'validated'));
    }
}