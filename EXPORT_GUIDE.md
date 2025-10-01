# 📊 Export Functionality - Οδηγός Χρήσης

## 🎯 Περιγραφή
Η νέα λειτουργικότητα εξαγωγής επιτρέπει την εξαγωγή αναφορών πωλήσεων σε μορφή PDF και Excel.

## 📁 Νέα Αρχεία

### Backend
- `app/Http/Controllers/ReportExportController.php` - Controller για exports
- `app/Exports/ReportExport.php` - Excel export class
- `resources/views/reports/pdf.blade.php` - PDF template
- `tests/Feature/ReportExportTest.php` - Tests για exports

### Frontend
- Ενημερώθηκε `resources/js/Pages/Reports.jsx` με export buttons
- Δημιουργήθηκε `resources/js/Pages/TestExports.jsx` για δοκιμές

## 🔧 API Endpoints

### Export Routes
```
GET /api/reports/export/pdf?type={type}&date={date}
GET /api/reports/export/excel?type={type}&date={date}
GET /api/reports/export/pdf/preview?type={type}&date={date}
```

### Parameters
- `type`: daily, monthly, yearly
- `date`: YYYY-MM-DD format

### Examples
```
/api/reports/export/pdf?type=daily&date=2024-01-15
/api/reports/export/excel?type=monthly&date=2024-01-01
/api/reports/export/pdf/preview?type=yearly&date=2024-01-01
```

## 🎨 Frontend Features

### Export Buttons (στη σελίδα Reports)
- 📄 **PDF** - Download PDF report
- 📊 **Excel** - Download Excel report
- 👁️ **Προεπισκόπηση** - Preview PDF in browser
- 🖨️ **Εκτύπωση** - Print current view

### Automatic Filename Generation
- Daily: `FEK_Αναφορά_Ημερήσια_15-01-2024.pdf`
- Monthly: `FEK_Αναφορά_Μηνιαία_01-2024.xlsx`
- Yearly: `FEK_Αναφορά_Ετήσια_2024.pdf`

## 📊 Export Content

### PDF Features
- Professional styling με λογότυπο ΦΕΚ
- Summary cards με βασικά στοιχεία
- Styled tables με borders και colors
- Greek fonts support (DejaVu Sans)
- Page breaking optimization
- Footer με copyright

### Excel Features
- Multiple sheets support
- Formatted headers και styling
- Greek text support
- Summary sections
- Automatic column widths
- Professional formatting

## 🔧 Packages Used
- `barryvdh/laravel-dompdf` v3.1.1 - PDF generation
- `maatwebsite/excel` v1.1.5 - Excel export

## ✅ Tests
Δημιουργήθηκαν unit tests που επιβεβαιώνουν:
- PDF export endpoint functionality
- Excel export endpoint functionality  
- PDF preview functionality
- Support για όλους τους τύπους αναφορών (daily/monthly/yearly)

## 🚀 How to Use

### 1. Από το Reports Interface
1. Πηγαίνετε στη σελίδα Reports
2. Επιλέξτε τύπο αναφοράς (Daily/Monthly/Yearly)
3. Ορίστε φίλτρα (ημερομηνία, μήνας, έτος)
4. Κάντε κλικ "Δημιουργία Αναφοράς"
5. Χρησιμοποιήστε τα export buttons:
   - PDF για download
   - Excel για spreadsheet
   - Προεπισκόπηση για preview

### 2. Απευθείας API Calls
```javascript
// PDF Download
window.open('/api/reports/export/pdf?type=daily&date=2024-01-15', '_blank');

// Excel Download  
window.open('/api/reports/export/excel?type=monthly&date=2024-01-01', '_blank');

// PDF Preview
window.open('/api/reports/export/pdf/preview?type=yearly&date=2024-01-01', '_blank');
```

## 📋 Data Structure
Όλα τα exports χρησιμοποιούν τα ίδια δεδομένα από το `ReportService`:

```php
[
    'period' => ['title', 'start', 'end'],
    'totals' => ['receipts_count', 'total_amount', 'discount', 'gross_amount'],
    'items_by_type' => [['type_label', 'quantity', 'total_amount']],
    'receipts' => [['receipt_number', 'date', 'time', 'items_count', 'final_amount']]
]
```

## 🎯 Next Steps
- Μπορείτε να προσθέσετε περισσότερα export formats (CSV, Word)
- Προσθήκη email functionality για αποστολή αναφορών
- Scheduled exports για αυτόματη αποστολή
- Advanced filtering options
