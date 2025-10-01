<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    /**
     * Show the login form
     */
    public function showLoginForm()
    {
        return view('auth.login');
    }

    /**
     * Handle login request
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // ΠΡΟΣΩΡΙΝΟ: Bypass για testing χωρίς LDAP
        // Για production, θα χρησιμοποιήσουμε LDAP
        if (config('app.env') === 'local') {
            $user = User::where('username', $validated['username'])->first();

            // Testing mode - accept password "test123" for any user
            if ($user && $validated['password'] === 'test123') {
                if (!$user->is_active) {
                    return back()->withErrors([
                        'username' => 'Ο λογαριασμός σας είναι ανενεργός.',
                    ])->withInput($request->only('username'));
                }

                Auth::login($user, $request->boolean('remember'));
                $request->session()->regenerate();

                return redirect()->intended('/');
            }
        }

        // Production: LDAP Authentication (θα το ενεργοποιήσουμε αργότερα)
        /*
        try {
            $ldapService = app(\App\Services\LdapAuthService::class);
            $user = $ldapService->authenticate(
                $validated['username'],
                $validated['password']
            );

            if (!$user) {
                return back()->withErrors([
                    'username' => 'Τα στοιχεία σύνδεσης είναι λανθασμένα.',
                ])->withInput($request->only('username'));
            }

            if (!$user->is_active) {
                return back()->withErrors([
                    'username' => 'Ο λογαριασμός σας είναι ανενεργός.',
                ])->withInput($request->only('username'));
            }

            Auth::login($user, $request->boolean('remember'));
            $request->session()->regenerate();

            return redirect()->intended('/');

        } catch (\Exception $e) {
            \Log::error('Login error: ' . $e->getMessage());
            return back()->withErrors([
                'username' => 'Σφάλμα κατά τη σύνδεση. Παρακαλώ δοκιμάστε ξανά.',
            ])->withInput($request->only('username'));
        }
        */

        return back()->withErrors([
            'username' => 'Τα στοιχεία σύνδεσης είναι λανθασμένα.',
        ])->withInput($request->only('username'));
    }

    /**
     * Handle logout request
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
