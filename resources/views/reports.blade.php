<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Εφαρμογή πωλήσεων ΕΤ - Αναφορές</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; background: #f5f5f5; }
        .header { background: #fff; shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 1rem 0; margin-bottom: 2rem; }
        .nav { max-width: 1200px; margin: 0 auto; padding: 0 1rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: bold; color: #2563eb; }
        .nav-links { display: flex; gap: 1rem; }
        .nav-links a { color: #6b7280; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; }
        .nav-links a:hover, .nav-links a.active { background: #e5e7eb; }
        .user-info { display: flex; align-items: center; gap: 1rem; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .reports-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .report-card { background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .btn { padding: 0.75rem 1rem; border: none; border-radius: 6px; text-decoration: none; text-align: center; font-weight: 500; cursor: pointer; margin: 0.25rem; display: inline-block; }
        .btn-primary { background: #2563eb; color: white; }
        .btn-success { background: #059669; color: white; }
        .btn-info { background: #0284c7; color: white; }
        .btn-secondary { background: #e5e7eb; color: #374151; }
        .logout-btn { background: #dc2626; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
        .form-group input { width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <nav class="nav">
            <div class="logo">📄 Εφαρμογή πωλήσεων ΕΤ</div>
            <div class="nav-links">
                <a href="/">🏠 Dashboard</a>
                <a href="/receipts">📋 Αποδείξεις</a>
                <a href="/reports" class="active">📈 Αναφορές</a>
            </div>
            <div class="user-info">
                @if(auth()->check())
                    <span>{{ auth()->user()->full_name }}</span>
                    <form action="/logout" method="POST" style="display: inline;">
                        @csrf
                        <button type="submit" class="logout-btn">Αποσύνδεση</button>
                    </form>
                @endif
            </div>
        </nav>
    </div>

    <div class="container">
        <h1 style="margin-bottom: 2rem; color: #1f2937;">📈 Αναφορές</h1>

        <div class="reports-grid">
            <!-- Daily Report -->
            <div class="report-card">
                <h3 style="margin-top: 0;">📅 Ημερήσια Αναφορά</h3>
                <p style="color: #6b7280; margin-bottom: 1rem;">Αναφορά πωλήσεων για σήμερα</p>

                <div class="form-group">
                    <label for="daily-date">Ημερομηνία:</label>
                    <input type="date" id="daily-date" value="{{ date('Y-m-d') }}">
                </div>

                <div>
                    <a href="#" class="btn btn-info" onclick="viewDailyReport()">👁️ Προβολή</a>
                    <a href="#" class="btn btn-primary" onclick="downloadDailyPDF()">📄 PDF</a>
                    <a href="#" class="btn btn-success" onclick="downloadDailyExcel()">📊 Excel</a>
                </div>
            </div>

            <!-- Monthly Report -->
            <div class="report-card">
                <h3 style="margin-top: 0;">📆 Μηνιαία Αναφορά</h3>
                <p style="color: #6b7280; margin-bottom: 1rem;">Αναφορά πωλήσεων για τον μήνα</p>

                <div class="form-group">
                    <label for="monthly-date">Μήνας:</label>
                    <input type="month" id="monthly-date" value="{{ date('Y-m') }}">
                </div>

                <div>
                    <a href="#" class="btn btn-info" onclick="viewMonthlyReport()">👁️ Προβολή</a>
                    <a href="#" class="btn btn-primary" onclick="downloadMonthlyPDF()">📄 PDF</a>
                    <a href="#" class="btn btn-success" onclick="downloadMonthlyExcel()">📊 Excel</a>
                </div>
            </div>

            <!-- Yearly Report -->
            <div class="report-card">
                <h3 style="margin-top: 0;">📋 Ετήσια Αναφορά</h3>
                <p style="color: #6b7280; margin-bottom: 1rem;">Αναφορά πωλήσεων για το έτος</p>

                <div class="form-group">
                    <label for="yearly-date">Έτος:</label>
                    <input type="number" id="yearly-date" value="{{ date('Y') }}" min="2020" max="2030">
                </div>

                <div>
                    <a href="#" class="btn btn-info" onclick="viewYearlyReport()">👁️ Προβολή</a>
                    <a href="#" class="btn btn-primary" onclick="downloadYearlyPDF()">📄 PDF</a>
                    <a href="#" class="btn btn-success" onclick="downloadYearlyExcel()">📊 Excel</a>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="report-card">
                <h3 style="margin-top: 0;">⚡ Γρήγορες Ενέργειες</h3>
                <p style="color: #6b7280; margin-bottom: 1rem;">Έτοιμες αναφορές για άμεση χρήση</p>

                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <a href="/api/reports/export/pdf?type=daily" class="btn btn-primary">📄 PDF Σήμερα</a>
                    <a href="/api/reports/export/excel?type=daily" class="btn btn-success">📊 Excel Σήμερα</a>
                    <a href="/api/reports/export/pdf?type=monthly" class="btn btn-secondary">📄 PDF Μήνα</a>
                    <a href="/api/reports/export/excel?type=monthly" class="btn btn-secondary">📊 Excel Μήνα</a>
                </div>
            </div>
        </div>

        <!-- Report Preview -->
        <div id="report-preview" style="margin-top: 2rem; display: none;">
            <div class="report-card">
                <h3>📊 Προεπισκόπηση Αναφοράς</h3>
                <div id="report-content">
                    <!-- Report content will be loaded here -->
                </div>
            </div>
        </div>
    </div>

    <script>
        function viewDailyReport() {
            const date = document.getElementById('daily-date').value;
            loadReport('daily', { date: date });
        }

        function viewMonthlyReport() {
            const month = document.getElementById('monthly-date').value;
            loadReport('monthly', { month: month });
        }

        function viewYearlyReport() {
            const year = document.getElementById('yearly-date').value;
            loadReport('yearly', { year: year });
        }

        function downloadDailyPDF() {
            const date = document.getElementById('daily-date').value;
            window.open(`/api/reports/export/pdf?type=daily&date=${date}`, '_blank');
        }

        function downloadDailyExcel() {
            const date = document.getElementById('daily-date').value;
            window.open(`/api/reports/export/excel?type=daily&date=${date}`, '_blank');
        }

        function downloadMonthlyPDF() {
            const month = document.getElementById('monthly-date').value;
            window.open(`/api/reports/export/pdf?type=monthly&month=${month}`, '_blank');
        }

        function downloadMonthlyExcel() {
            const month = document.getElementById('monthly-date').value;
            window.open(`/api/reports/export/excel?type=monthly&month=${month}`, '_blank');
        }

        function loadReport(type, params) {
            const preview = document.getElementById('report-preview');
            const content = document.getElementById('report-content');

            preview.style.display = 'block';
            content.innerHTML = '<div>⏳ Φόρτωση αναφοράς...</div>';

            let url = `/api/reports/${type}?`;
            Object.keys(params).forEach(key => {
                url += `${key}=${params[key]}&`;
            });

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        displayReportData(data.data);
                    } else {
                        content.innerHTML = '<div style="color: red;">❌ Σφάλμα φόρτωσης αναφοράς</div>';
                    }
                })
                .catch(error => {
                    console.error('Error loading report:', error);
                    content.innerHTML = '<div style="color: red;">❌ Σφάλμα σύνδεσης</div>';
                });
        }

        function displayReportData(data) {
            const content = document.getElementById('report-content');

            let html = `
                <div style="margin-bottom: 1rem;">
                    <h4>📊 Στατιστικά</h4>
                    <p><strong>Συνολικές Πωλήσεις:</strong> €${data.total_sales?.toFixed(2) || '0.00'}</p>
                    <p><strong>Αριθμός Αποδείξεων:</strong> ${data.total_receipts || 0}</p>
                    <p><strong>ΦΕΚ:</strong> ${data.total_fek || 0}</p>
                    <p><strong>Άλλα Προϊόντα:</strong> ${data.total_products || 0}</p>
                </div>
            `;

            if (data.receipts && data.receipts.length > 0) {
                html += `
                    <div>
                        <h4>📋 Αποδείξεις</h4>
                        <div style="max-height: 300px; overflow-y: auto;">
                            ${data.receipts.map(receipt => `
                                <div style="border-bottom: 1px solid #e5e7eb; padding: 0.5rem 0;">
                                    <strong>${receipt.receipt_number}</strong> -
                                    €${receipt.final_amount.toFixed(2)} -
                                    ${new Date(receipt.created_at).toLocaleDateString('el-GR')}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            content.innerHTML = html;
        }
    </script>
</body>
</html>
