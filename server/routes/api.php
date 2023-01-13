<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PizzaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Unauthenticated users
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/pizzas', [PizzaController::class, 'index']);
Route::get('/pizzas/{id}', [PizzaController::class, 'show']);

Route::group(['middleware' => ['auth:sanctum']], function() {
  // Authenticated users
  Route::post('/logout', [AuthController::class, 'logout']);

  Route::post('/pizzas', [PizzaController::class, 'store']);
  Route::put('/pizzas/{id}', [PizzaController::class, 'update']);
  Route::delete('/pizzas/{id}', [PizzaController::class, 'destroy']);
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
  return $request->user();
});
