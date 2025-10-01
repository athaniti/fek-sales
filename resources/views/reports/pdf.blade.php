<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $reportData['period']['title'] ?? 'Αναφορά Πωλήσεων' }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #4F46E5;
            padding-bottom: 20px;
        }

        .header h1 {
            font-size: 20px;
            font-weight: bold;
            margin: 0 0 10px 0;
            color: #4F46E5;
        }

        .header h2 {
            font-size: 16px;
            font-weight: bold;
            margin: 0 0 10px 0;
            color: #1F2937;
        }

        .header p {
            margin: 5px 0;
            color: #6B7280;
        }

        .summary-cards {
            display: flex;
            justify-content: space-around;
            margin-bottom: 30px;
            page-break-inside: avoid;
        }

        .summary-card {
            background: #F8FAFC;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            width: 30%;
        }

        .summary-card .value {
            font-size: 18px;
            font-weight: bold;
            color: #1F2937;
            margin: 5px 0;
        }

        .summary-card .label {
            font-size: 10px;
            color: #6B7280;
            text-transform: uppercase;
        }

        .report-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }

        .section-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #1F2937;
            border-bottom: 1px solid #E5E7EB;
            padding-bottom: 5px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        table th {
            background-color: #4F46E5;
            color: white;
            font-weight: bold;
            padding: 12px 8px;
            text-align: center;
            border: 1px solid #4F46E5;
            font-size: 11px;
        }

        table td {
            padding: 10px 8px;
            border: 1px solid #D1D5DB;
            vertical-align: middle;
        }

        table tr:nth-child(even) {
            background-color: #F9FAFB;
        }

        table tr:hover {
            background-color: #F3F4F6;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .font-bold {
            font-weight: bold;
        }

        .total-row {
            background-color: #F3F4F6 !important;
            font-weight: bold;
            border-top: 2px solid #4F46E5;
        }

        .total-row td {
            border: 1px solid #4F46E5;
            font-size: 13px;
        }

        .currency {
            color: #059669;
            font-weight: bold;
        }

        .type-icon {
            font-size: 16px;
            margin-right: 8px;
        }

        .footer {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            text-align: center;
            font-size: 10px;
            color: #6B7280;
            border-top: 1px solid #E5E7EB;
            padding-top: 10px;
        }

        @page {
            margin: 2cm;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>📄 ΕΘΝΙΚΟ ΤΥΠΟΓΡΑΦΕΙΟ</h1>
        <h2>{{ $reportData['period']['title'] ?? 'Αναφορά Πωλήσεων' }}</h2>
        <p>Περίοδος: {{ $reportData['period']['start'] ?? '' }} - {{ $reportData['period']['end'] ?? '' }}</p>
        <p>Δημιουργήθηκε: {{ date('d/m/Y H:i') }}</p>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
        <div class="summary-card">
            <div class="value">{{ $reportData['totals']['receipts_count'] ?? 0 }}</div>
            <div class="label">Αποδείξεις</div>
        </div>
        <div class="summary-card">
            <div class="value">€{{ number_format($reportData['totals']['gross_amount'] ?? 0, 2) }}</div>
            <div class="label">Προ Έκπτωσης</div>
        </div>
        <div class="summary-card">
            <div class="value currency">€{{ number_format($reportData['totals']['total_amount'] ?? 0, 2) }}</div>
            <div class="label">Συνολικό Ποσό</div>
        </div>
    </div>

    <!-- Main Sales Summary -->
    @if(isset($reportData['items_by_type']) && count($reportData['items_by_type']) > 0)
    <div class="report-section">
        <div class="section-title">📊 Συγκεντρωτική Αναφορά Πωλήσεων</div>
        <table>
            <thead>
                <tr>
                    <th style="text-align: left;">Είδος</th>
                    <th>Τεμάχια</th>
                    <th style="text-align: right;">Συνολικό Ποσό Είδους</th>
                </tr>
            </thead>
            <tbody>
                @foreach($reportData['items_by_type'] as $item)
                <tr>
                    <td>
                        <span class="type-icon">{{ $item['type_icon'] }}</span>
                        <span class="font-bold">{{ $item['type_label'] }}</span>
                    </td>
                    <td class="text-center font-bold">{{ number_format($item['quantity']) }}</td>
                    <td class="text-right font-bold currency">€{{ number_format($item['total_amount'], 2) }}</td>
                </tr>
                @endforeach

                <!-- Total Row -->
                <tr class="total-row">
                    <td>
                        <span class="type-icon">📋</span>
                        <span>ΣΥΝΟΛΟ</span>
                    </td>
                    <td class="text-center">
                        {{ number_format(array_sum(array_column($reportData['items_by_type'], 'quantity'))) }}
                    </td>
                    <td class="text-right currency">
                        €{{ number_format($reportData['totals']['total_amount'] ?? 0, 2) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    @endif

    <!-- Receipts List -->
    @if(isset($reportData['receipts']) && count($reportData['receipts']) > 0)
    <div class="report-section">
        <div class="section-title">📋 Λίστα Αποδείξεων</div>
        <table>
            <thead>
                <tr>
                    <th>Αριθμός</th>
                    <th>Ημερομηνία</th>
                    <th>Ώρα</th>
                    <th>Είδη</th>
                    <th style="text-align: right;">Ποσό</th>
                </tr>
            </thead>
            <tbody>
                @foreach($reportData['receipts'] as $receipt)
                <tr>
                    <td class="font-bold">{{ $receipt['receipt_number'] }}</td>
                    <td class="text-center">{{ $receipt['date'] }}</td>
                    <td class="text-center">{{ $receipt['time'] }}</td>
                    <td class="text-center">{{ $receipt['items_count'] }}</td>
                    <td class="text-right font-bold currency">€{{ number_format($receipt['final_amount'], 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <!-- Footer -->
    <div class="footer">
        <p>Αναφορά που δημιουργήθηκε από το Σύστημα Πωλήσεων FEK</p>
        <p>© {{ date('Y') }} Εθνικό Τυπογραφείο - Όλα τα δικαιώματα διατηρούνται</p>
    </div>
</body>
</html>
