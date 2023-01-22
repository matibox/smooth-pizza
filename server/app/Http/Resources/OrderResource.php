<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
          'id' => $this->id,
          'createdAt' => $this->created_at,
          'payment' => $this->payment,
          'price' => $this->price,
          'street' => $this->street,
          'house_number' => $this->house_number,
          'city' => $this->city,
          'apartment_number' => $this->apartment_number,
          'user' => new UserResource($this->user),
          'products' => ProductResource::collection($this->products()->get())
        ];
    }
}
