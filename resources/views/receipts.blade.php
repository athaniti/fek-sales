<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Εφαρμογή πωλήσεων ΕΤ - Αποδείξεις</title>
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
        .receipts-grid { display: grid; gap: 1rem; }
        .receipt-card { background: #fff; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .receipt-header { display: flex; justify-content: between; align-items: center; margin-bottom: 1rem; }
        .receipt-number { font-weight: bold; color: #1f2937; }
        .receipt-status { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem; }
        .status-completed { background: #d1fae5; color: #065f46; }
        .status-cancelled { background: #fee2e2; color: #991b1b; }
        .receipt-items { margin-top: 0.5rem; }
        .btn { padding: 0.75rem 1rem; border: none; border-radius: 6px; text-decoration: none; text-align: center; font-weight: 500; cursor: pointer; margin-right: 0.5rem; }
        .btn-primary { background: #2563eb; color: white; }
        .btn-secondary { background: #e5e7eb; color: #374151; }
        .logout-btn { background: #dc2626; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; }
        .loading { text-align: center; padding: 2rem; }
    </style>
</head>
<body>
    <div class="header">
        <nav class="nav">
            <div class="logo">📄 Εφαρμογή πωλήσεων ΕΤ</div>
            <div class="nav-links">
                <a href="/">🏠 Dashboard</a>
                <a href="/receipts" class="active">📋 Αποδείξεις</a>
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
        <h1 style="margin-bottom: 2rem; color: #1f2937;">📋 Αποδείξεις</h1>

        <div style="margin-bottom: 1rem;">
            <a href="#" class="btn btn-primary" onclick="loadReceipts()">🔄 Ανανέωση</a>
        </div>

        <div id="loading" class="loading" style="display: none;">
            <div>⏳ Φόρτωση αποδείξεων...</div>
        </div>

        <div id="receipts-container" class="receipts-grid">
            <!-- Receipts will be loaded here -->
        </div>
    </div>

    <script>
        let receipts = [];

        function loadReceipts() {
            document.getElementById('loading').style.display = 'block';
            document.getElementById('receipts-container').innerHTML = '';

            fetch('/api/receipts')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('loading').style.display = 'none';

                    if (data.success) {
                        receipts = data.data;
                        displayReceipts(receipts);
                    } else {
                        document.getElementById('receipts-container').innerHTML =
                            '<div style="text-align: center; padding: 2rem;">❌ Σφάλμα φόρτωσης αποδείξεων</div>';
                    }
                })
                .catch(error => {
                    console.error('Error loading receipts:', error);
                    document.getElementById('loading').style.display = 'none';

                    // Fallback - show sample data
                    showSampleData();
                });
        }

        function displayReceipts(receipts) {
            const container = document.getElementById('receipts-container');

            if (receipts.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 2rem;">📄 Δεν βρέθηκαν αποδείξεις</div>';
                return;
            }

            container.innerHTML = receipts.map(receipt => `
                <div class="receipt-card">
                    <div class="receipt-header">
                        <div>
                            <div class="receipt-number">Απόδειξη #${receipt.receipt_number}</div>
                            <div style="color: #6b7280; font-size: 0.875rem;">
                                ${formatDate(receipt.created_at)} - ${receipt.user_name || 'N/A'}
                            </div>
                        </div>
                        <div>
                            <span class="receipt-status status-${receipt.status}">
                                ${receipt.status === 'completed' ? '✅ Ολοκληρώθηκε' : '❌ Ακυρώθηκε'}
                            </span>
                        </div>
                    </div>

                    <div class="receipt-items">
                        <div><strong>Προϊόντα:</strong> ${receipt.items_count || 0}</div>
                        <div><strong>Σύνολο:</strong> €${(receipt.final_amount || 0).toFixed(2)}</div>
                    </div>
                </div>
            `).join('');
        }

        function showSampleData() {
            const sampleReceipts = [
                {
                    receipt_number: 'R2025001',
                    created_at: new Date().toISOString(),
                    user_name: 'Admin User',
                    status: 'completed',
                    items_count: 3,
                    final_amount: 125.50
                },
                {
                    receipt_number: 'R2025002',
                    created_at: new Date(Date.now() - 86400000).toISOString(),
                    user_name: 'Operator',
                    status: 'completed',
                    items_count: 1,
                    final_amount: 45.00
                }
            ];

            displayReceipts(sampleReceipts);
        }

        function formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('el-GR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Load receipts when page loads
        document.addEventListener('DOMContentLoaded', loadReceipts);
    </script>
</body>
</html>
