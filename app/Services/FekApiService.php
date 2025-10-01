<?php
// app/Services/FekApiService.php
namespace App\Services;

use App\Models\FekCache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class FekApiService
{
    private string $apiBaseUrl;
    private string $apiToken;

    public function __construct()
    {
        $this->apiBaseUrl = config('services.fek_api.base_url');
        $this->apiToken = config('services.fek_api.token');
    }

    public function searchFek(array $filters): array
    {
        // DEVELOPMENT MODE: Return fake data for testing
        if (config('app.env') === 'local' && config('app.debug')) {
            return $this->getFakeSearchResults($filters);
        }

        $response = Http::withToken($this->apiToken)
            ->timeout(30)
            ->get("{$this->apiBaseUrl}/fek/search", $filters);

        if ($response->failed()) {
            throw new \Exception('Αποτυχία επικοινωνίας με το σύστημα ΦΕΚ');
        }

        return $response->json('data', []);
    }

    public function getFekDetails(string $fekNumber, string $fekType, string $fekDate): ?array
    {
        // DEVELOPMENT MODE: Return fake data for testing
        if (config('app.env') === 'local' && config('app.debug')) {
            return $this->getFakeDetails($fekNumber, $fekType, $fekDate);
        }

        // Έλεγχος cache
        $cacheKey = "fek:{$fekType}:{$fekNumber}:{$fekDate}";

        return Cache::remember($cacheKey, 3600, function () use ($fekNumber, $fekType, $fekDate) {
            // Έλεγχος local database cache
            $cached = FekCache::where([
                'fek_number' => $fekNumber,
                'fek_type' => $fekType,
                'fek_date' => $fekDate,
            ])->first();

            if ($cached) {
                return $cached->toArray();
            }

            // Ανάκτηση από API
            $response = Http::withToken($this->apiToken)
                ->get("{$this->apiBaseUrl}/fek/details", [
                    'number' => $fekNumber,
                    'type' => $fekType,
                    'date' => $fekDate,
                ]);

            if ($response->failed()) {
                return null;
            }

            $data = $response->json('data');

            // Αποθήκευση στο cache
            FekCache::updateOrCreate(
                [
                    'fek_number' => $fekNumber,
                    'fek_type' => $fekType,
                    'fek_date' => $fekDate,
                ],
                [
                    'title' => $data['title'] ?? '',
                    'total_pages' => $data['total_pages'] ?? 0,
                    'color_pages' => $data['color_pages'] ?? 0,
                    'maps_count' => $data['maps_count'] ?? 0,
                    'has_images' => $data['has_images'] ?? false,
                    'pdf_url' => $data['pdf_url'] ?? null,
                    'metadata' => $data['metadata'] ?? [],
                    'cached_at' => now(),
                ]
            );

            return $data;
        });
    }

    public function downloadFekPdf(string $pdfUrl): string
    {
        $response = Http::withToken($this->apiToken)
            ->timeout(60)
            ->get($pdfUrl);

        if ($response->failed()) {
            throw new \Exception('Αποτυχία λήψης αρχείου PDF');
        }

        return $response->body();
    }

    /**
     * Get fake details by ID for development/testing (public wrapper)
     */
    public function getFakeDetailsById(string $id): ?array
    {
        return $this->getFakeDetailsByIdPrivate($id);
    }

    /**
     * Fake search results for development/testing
     */
    private function getFakeSearchResults(array $filters): array
    {
        $fakeData = [
            [
                'id' => 'fek_345_A_2024',
                'fek_number' => '345',
                'fek_type' => 'Α',
                'fek_date' => '2024-01-15',
                'title' => 'Κανονισμός για την προστασία προσωπικών δεδομένων',
                'publication_date' => '2024-01-15',
                'total_pages' => 25,
                'color_pages' => 5,
                'maps_count' => 0,
                'has_images' => true,
                'issue_number' => '345/Α/2024'
            ],
            [
                'id' => 'fek_187_B_2024',
                'fek_number' => '187',
                'fek_type' => 'Β',
                'fek_date' => '2024-01-10',
                'title' => 'Διόρθωση σφαλμάτων στον νόμο 4815/2021',
                'publication_date' => '2024-01-10',
                'total_pages' => 12,
                'color_pages' => 0,
                'maps_count' => 2,
                'has_images' => false,
                'issue_number' => '187/Β/2024'
            ],
            [
                'id' => 'fek_523_A_2024',
                'fek_number' => '523',
                'fek_type' => 'Α',
                'fek_date' => '2024-02-05',
                'title' => 'Νέο πλαίσιο για την ψηφιακή διακυβέρνηση',
                'publication_date' => '2024-02-05',
                'total_pages' => 45,
                'color_pages' => 15,
                'maps_count' => 1,
                'has_images' => true,
                'issue_number' => '523/Α/2024'
            ],
            [
                'id' => 'fek_892_C_2024',
                'fek_number' => '892',
                'fek_type' => 'Γ',
                'fek_date' => '2024-03-12',
                'title' => 'Κατάλογος αναγνωρισμένων εκπαιδευτικών ιδρυμάτων',
                'publication_date' => '2024-03-12',
                'total_pages' => 156,
                'color_pages' => 0,
                'maps_count' => 0,
                'has_images' => false,
                'issue_number' => '892/Γ/2024'
            ],
            [
                'id' => 'fek_234_D_2024',
                'fek_number' => '234',
                'fek_type' => 'Δ',
                'fek_date' => '2024-02-28',
                'title' => 'Τροποποίηση κανονισμού λειτουργίας δημόσιων υπηρεσιών',
                'publication_date' => '2024-02-28',
                'total_pages' => 8,
                'color_pages' => 2,
                'maps_count' => 0,
                'has_images' => true,
                'issue_number' => '234/Δ/2024'
            ],
        ];

        // Filter based on search query if provided
        if (isset($filters['query']) && !empty($filters['query'])) {
            $query = strtolower($filters['query']);
            $fakeData = array_filter($fakeData, function($item) use ($query) {
                return strpos(strtolower($item['title']), $query) !== false ||
                       strpos(strtolower($item['fek_number']), $query) !== false ||
                       strpos(strtolower($item['issue_number']), $query) !== false;
            });
        }

        return array_values($fakeData);
    }

    /**
     * Fake details for development/testing
     */
    private function getFakeDetails(string $fekNumber, string $fekType, string $fekDate): array
    {
        // Check if this matches one of our fake entries
        $fakeData = $this->getFakeSearchResults([]);

        foreach ($fakeData as $item) {
            if ($item['fek_number'] === $fekNumber &&
                $item['fek_type'] === $fekType &&
                $item['fek_date'] === $fekDate) {
                return array_merge($item, [
                    'pdf_url' => "https://example.com/fake-pdf/{$fekNumber}-{$fekType}-{$fekDate}.pdf",
                    'metadata' => [
                        'ministry' => 'Υπουργείο Ψηφιακής Διακυβέρνησης',
                        'category' => 'Νομοθεσία',
                        'keywords' => ['νόμος', 'κανονισμός', 'διαδικασία'],
                        'summary' => 'Αυτό είναι ένα fake ΦΕΚ για testing σκοπούς.'
                    ]
                ]);
            }
        }

        // Fallback for unknown FEK
        $fakeDetails = [
            'id' => "fek_{$fekNumber}_{$fekType}_" . date('Y', strtotime($fekDate)),
            'fek_number' => $fekNumber,
            'fek_type' => $fekType,
            'fek_date' => $fekDate,
            'title' => "Λεπτομερείς πληροφορίες για ΦΕΚ {$fekNumber}/{$fekType}",
            'publication_date' => $fekDate,
            'total_pages' => rand(10, 150),
            'color_pages' => rand(0, 20),
            'maps_count' => rand(0, 5),
            'has_images' => (bool) rand(0, 1),
            'issue_number' => "{$fekNumber}/{$fekType}/" . date('Y', strtotime($fekDate)),
            'pdf_url' => "https://example.com/fake-pdf/{$fekNumber}-{$fekType}-{$fekDate}.pdf",
            'metadata' => [
                'ministry' => 'Υπουργείο Ψηφιακής Διακυβέρνησης',
                'category' => 'Νομοθεσία',
                'keywords' => ['νόμος', 'κανονισμός', 'διαδικασία'],
                'summary' => 'Αυτό είναι ένα fake ΦΕΚ για testing σκοπούς.'
            ]
        ];

        return $fakeDetails;
    }

    /**
     * Get fake details by ID for development/testing (private)
     */
    private function getFakeDetailsByIdPrivate(string $id): ?array
    {
        $fakeData = $this->getFakeSearchResults([]);

        foreach ($fakeData as $item) {
            if ($item['id'] === $id) {
                return array_merge($item, [
                    'pdf_url' => "https://example.com/fake-pdf/{$item['fek_number']}-{$item['fek_type']}-{$item['fek_date']}.pdf",
                    'metadata' => [
                        'ministry' => 'Υπουργείο Ψηφιακής Διακυβέρνησης',
                        'category' => 'Νομοθεσία',
                        'keywords' => ['νόμος', 'κανονισμός', 'διαδικασία'],
                        'summary' => 'Αυτό είναι ένα fake ΦΕΚ για testing σκοπούς.'
                    ]
                ]);
            }
        }

        return null;
    }
}
