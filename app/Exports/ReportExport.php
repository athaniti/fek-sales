<?php

namespace App\Exports;

class ReportExport
{
    protected $reportData;
    protected $type;

    public function __construct(array $reportData, string $type = 'daily')
    {
        $this->reportData = $reportData;
        $this->type = $type;
    }

    public function toCsv(): string
    {
        $output = '';

        // Add BOM for UTF-8 Excel compatibility
        $output .= "\xEF\xBB\xBF";

        // Header
        $output .= $this->csvLine(['ΕΘΝΙΚΟ ΤΥΠΟΓΡΑΦΕΙΟ - ΑΝΑΦΟΡΑ ΠΩΛΗΣΕΩΝ']);
        $output .= $this->csvLine(['Περίοδος:', $this->reportData['period']['title'] ?? '']);
        $output .= $this->csvLine(['Ημερομηνία Δημιουργίας:', date('d/m/Y H:i')]);
        $output .= $this->csvLine([]); // Empty row

        // Summary
        $output .= $this->csvLine(['ΣΥΓΚΕΝΤΡΩΤΙΚΑ ΣΤΟΙΧΕΙΑ']);
        $output .= $this->csvLine(['Αποδείξεις:', $this->reportData['totals']['receipts_count'] ?? 0]);
        $output .= $this->csvLine(['Συνολικό Ποσό:', '€' . number_format($this->reportData['totals']['total_amount'] ?? 0, 2)]);
        $output .= $this->csvLine(['Έκπτωση:', '€' . number_format($this->reportData['totals']['discount'] ?? 0, 2)]);
        $output .= $this->csvLine([]); // Empty row

        // Main data
        $output .= $this->csvLine(['ΑΝΑΛΥΣΗ ΑΝΑ ΤΥΠΟ ΠΡΟΪΟΝΤΟΣ']);
        $output .= $this->csvLine(['Είδος', 'Τεμάχια', 'Συνολικό Ποσό']);

        if (isset($this->reportData['items_by_type'])) {
            foreach ($this->reportData['items_by_type'] as $item) {
                $output .= $this->csvLine([
                    $item['type_label'],
                    $item['quantity'],
                    '€' . number_format($item['total_amount'], 2),
                ]);
            }

            // Total row
            $totalQuantity = array_sum(array_column($this->reportData['items_by_type'], 'quantity'));
            $totalAmount = $this->reportData['totals']['total_amount'] ?? 0;

            $output .= $this->csvLine([]);
            $output .= $this->csvLine([
                'ΣΥΝΟΛΟ',
                $totalQuantity,
                '€' . number_format($totalAmount, 2)
            ]);
        }

        // Receipts section
        if (isset($this->reportData['receipts']) && count($this->reportData['receipts']) > 0) {
            $output .= $this->csvLine([]);
            $output .= $this->csvLine([]);
            $output .= $this->csvLine(['ΛΙΣΤΑ ΑΠΟΔΕΙΞΕΩΝ']);
            $output .= $this->csvLine(['Αριθμός', 'Ημερομηνία', 'Ώρα', 'Είδη', 'Ποσό']);

            foreach ($this->reportData['receipts'] as $receipt) {
                $output .= $this->csvLine([
                    $receipt['receipt_number'],
                    $receipt['date'],
                    $receipt['time'],
                    $receipt['items_count'],
                    '€' . number_format($receipt['final_amount'], 2)
                ]);
            }
        }

        return $output;
    }

    private function csvLine(array $fields): string
    {
        $escapedFields = array_map(function($field) {
            // Convert to string and escape quotes
            $field = (string) $field;
            if (strpos($field, '"') !== false || strpos($field, ',') !== false || strpos($field, "\n") !== false) {
                $field = '"' . str_replace('"', '""', $field) . '"';
            }
            return $field;
        }, $fields);

        return implode(',', $escapedFields) . "\n";
    }

    public function getFilename(): string
    {
        $typeLabels = [
            'daily' => 'Ημερήσια',
            'monthly' => 'Μηνιαία',
            'yearly' => 'Ετήσια'
        ];

        $typeLabel = $typeLabels[$this->type] ?? 'Αναφορά';
        $date = date('d-m-Y');

        return "FEK_Αναφορά_{$typeLabel}_{$date}.csv";
    }
}
