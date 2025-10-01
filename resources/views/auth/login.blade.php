{{-- resources/views/auth/login.blade.php --}}
<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Σύνδεση - Εθνικό Τυπογραφείο</title>
    @vite(['resources/css/app.css'])
</head>
<body class="bg-gray-100">
    <div class="min-h-screen flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg shadow-lg w-96">
            <div class="text-center mb-8">
                <h1 class="text-2xl font-bold text-blue-800">Εθνικό Τυπογραφείο</h1>
                <p class="text-gray-600 mt-2">Σύστημα Πωλήσεων ΦΕΚ</p>
            </div>

            <form method="POST" action="{{ route('login') }}">
                @csrf

                <div class="mb-4">
                    <label for="username" class="block text-gray-700 mb-2 font-medium">
                        Όνομα Χρήστη
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value="{{ old('username') }}"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 @error('username') border-red-500 @enderror"
                        required
                        autofocus
                    >
                    @error('username')
                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div class="mb-6">
                    <label for="password" class="block text-gray-700 mb-2 font-medium">
                        Κωδικός Πρόσβασης
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 @error('password') border-red-500 @enderror"
                        required
                    >
                </div>

                <div class="mb-6">
                    <label class="flex items-center">
                        <input type="checkbox" name="remember" class="mr-2">
                        <span class="text-sm text-gray-700">Να με θυμάσαι</span>
                    </label>
                </div>

                <button
                    type="submit"
                    class="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Σύνδεση
                </button>
            </form>

            <!-- Testing Info -->
            @if(config('app.env') === 'local')
            <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p class="text-sm text-yellow-800 font-semibold mb-2">🧪 Testing Mode</p>
                <p class="text-xs text-yellow-700">
                    Username: <code class="bg-yellow-100 px-1">admin</code> or <code class="bg-yellow-100 px-1">operator1</code><br>
                    Password: <code class="bg-yellow-100 px-1">test123</code>
                </p>
            </div>
            @endif
        </div>
    </div>
</body>
</html>
