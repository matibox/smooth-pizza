import { type Dispatch, type SetStateAction, type FC } from 'react';
import type { Product } from '../types/Product';

type ProductProps =
  | {
      product: Product;
      addToCart: true;
      delete: false;
      setChosenProduct: Dispatch<SetStateAction<Product | undefined>>;
    }
  | {
      product: Product;
      addToCart: false;
      delete: false;
    }
  | {
      product: Product;
      addToCart: false;
      delete: true;
      handleDelete: (productId: number) => void;
    };

const ProductEl: FC<ProductProps> = props => {
  const { product, addToCart, delete: isDeletable } = props;

  return (
    <>
      <div className='flex items-center justify-between border-b border-amber-600 py-2 first:pt-0 last:border-b-0 last:pb-0'>
        <div className='flex flex-col'>
          <span className='font-bold md:text-lg'>{product.name}</span>
          <p className='text-sm text-stone-600 md:text-base'>
            {product.description}
          </p>
          <span className='text-sm text-amber-600 md:text-base'>
            {product.price} €
          </span>
        </div>
        {addToCart && (
          <button
            className='text-sm underline underline-offset-4 transition-colors hover:text-amber-600 focus:text-amber-600 focus:outline-none md:text-base'
            onClick={() => props.setChosenProduct(product)}
          >
            Add to cart
          </button>
        )}
        {isDeletable && (
          <button
            className='text-sm underline underline-offset-4 transition-colors hover:text-amber-600 focus:text-amber-600 focus:outline-none md:text-base'
            onClick={() => props.handleDelete(product.id)}
          >
            Delete product
          </button>
        )}
      </div>
    </>
  );
};

export default ProductEl;
