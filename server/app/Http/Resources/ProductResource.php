<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
          'category' => $this->category,
          'name' => $this->name,
          'description' => $this->description,
          'price' => $this->price,
          'amount' => $this->pivot->amount
        ];
    }
}
