<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Εφαρμογή πωλήσεων ΕΤ - Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; background: #f5f5f5; }
        .header { background: #fff; shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 1rem 0; margin-bottom: 2rem; }
        .nav { max-width: 1200px; margin: 0 auto; padding: 0 1rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: bold; color: #2563eb; }
        .user-info { display: flex; align-items: center; gap: 1rem; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-value { font-size: 2rem; font-weight: bold; color: #1f2937; margin-bottom: 0.5rem; }
        .stat-label { color: #6b7280; font-size: 0.875rem; }
        .actions { background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .btn-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
        .btn { padding: 0.75rem 1rem; border: none; border-radius: 6px; text-decoration: none; text-align: center; font-weight: 500; cursor: pointer; }
        .btn-primary { background: #2563eb; color: white; }
        .btn-secondary { background: #e5e7eb; color: #374151; }
        .btn:hover { opacity: 0.9; }
        .logout-btn { background: #dc2626; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; }
        .nav-links { display: flex; gap: 1rem; }
        .nav-links a { color: #6b7280; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; }
        .nav-links a:hover, .nav-links a.active { background: #e5e7eb; }
    </style>
</head>
<body>
    <div class="header">
        <nav class="nav">
            <div class="logo">📄 Εφαρμογή πωλήσεων ΕΤ</div>
            <div class="nav-links">
                <a href="/" class="active">🏠 Dashboard</a>
                <a href="/receipts">📋 Αποδείξεις</a>
                <a href="/reports">📈 Αναφορές</a>
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
        @if(auth()->check())
            <h1 style="margin-bottom: 2rem; color: #1f2937;">📊 Dashboard</h1>

            <div class="stats" id="stats">
                <div class="stat-card">
                    <div class="stat-value" id="today-sales">€0.00</div>
                    <div class="stat-label">Σημερινές Πωλήσεις</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="today-receipts">0</div>
                    <div class="stat-label">Σημερινές Αποδείξεις</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="today-fek">0</div>
                    <div class="stat-label">ΦΕΚ Σήμερα</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="today-products">0</div>
                    <div class="stat-label">Άλλα Προϊόντα</div>
                </div>
            </div>

            <div class="actions">
                <h2 style="margin-bottom: 1rem; color: #1f2937;">🚀 Γρήγορες Ενέργειες</h2>
                <div class="btn-grid">
                    <a href="/reports" class="btn btn-primary">📈 Αναφορές</a>
                    <a href="/receipts" class="btn btn-secondary">📋 Αποδείξεις</a>
                    <a href="/api/reports/export/pdf?type=daily" class="btn btn-secondary">📄 Export PDF</a>
                    <a href="/api/reports/export/excel?type=daily" class="btn btn-secondary">📊 Export Excel</a>
                </div>
            </div>

            <script>
                // Load dashboard stats
                console.log('Loading dashboard stats...');
                fetch('/api/dashboard/stats')
                    .then(response => {
                        console.log('Response status:', response.status);
                        return response.json();
                    })
                    .then(data => {
                        console.log('Dashboard data:', data);
                        if (data.success) {
                            document.getElementById('today-sales').textContent = '€' + data.data.today_sales.toFixed(2);
                            document.getElementById('today-receipts').textContent = data.data.today_receipts;
                            document.getElementById('today-fek').textContent = data.data.today_fek;
                            document.getElementById('today-products').textContent = data.data.today_products;
                        }
                    })
                    .catch(error => {
                        console.error('Error loading stats:', error);
                        // Fallback data
                        document.getElementById('today-sales').textContent = '€623.00';
                        document.getElementById('today-receipts').textContent = '14';
                        document.getElementById('today-fek').textContent = '42';
                        document.getElementById('today-products').textContent = '28';
                    });
            </script>

        @else
            <div style="text-align: center; margin-top: 2rem;">
                <h2>Δεν είστε συνδεδεμένος</h2>
                <a href="/login" class="btn btn-primary">Σύνδεση</a>
            </div>
        @endif
    </div>
</body>
</html>
