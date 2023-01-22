<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Http\Resources\OrderResource;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $orders = Order::all();
        return OrderResource::collection($orders);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $request->validate([
        'payment' => 'required|in:BLIK,Transfer,Visa/Mastercard',
        'price' => 'numeric|between:0,999999.99|required',
        'street' => 'string|required',
        'house_number' => 'integer|required',
        'city' => 'string|required'
      ]);

      $order = Order::create([
        'payment' => $request['payment'],
        'price' => $request['price'],
        'user_id' => $request->user()['id'],
        'street' => $request['street'],
        'house_number' => $request['house_number'],
        'city' => $request['city'],
        'apartment_number' => $request['apartment_number']
      ]);

      foreach ($request['products'] as $product) {
        $order->products()->attach($product['id']);
      }

      return $order;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
