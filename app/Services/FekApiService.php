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
}