<?php

// app/Http/Controllers/Admin/UserController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('admin');
    }

    public function index()
    {
        $users = User::orderBy('full_name')->paginate(50);
        return view('admin.users.index', compact('users'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'full_name' => 'required|string|max:255',
            'role' => 'required|in:admin,operator',
        ]);

        $user = User::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ο χρήστης δημιουργήθηκε επιτυχώς',
            'data' => $user
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email,' . $user->id,
            'full_name' => 'required|string|max:255',
            'role' => 'required|in:admin,operator',
            'is_active' => 'boolean',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ο χρήστης ενημερώθηκε επιτυχώς',
            'data' => $user
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Δεν μπορείτε να διαγράψετε τον εαυτό σας'
            ], 400);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ο χρήστης διαγράφηκε επιτυχώς'
        ]);
    }
}