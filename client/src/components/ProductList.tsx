import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  type FC,
} from 'react';
import type { Product, ProductCategory } from '../types/Product';
import ProductEl from './Product';

type ProductListProps = {
  products: Product[];
  setChosenProduct: Dispatch<SetStateAction<Product | undefined>>;
};

const objectKeys = <T extends object>(obj: T) => {
  return Object.keys(obj) as Array<keyof T>;
};

const ProductList: FC<ProductListProps> = ({ products, setChosenProduct }) => {
  const filterProducts = useCallback(
    (category: ProductCategory) =>
      products.filter(product => product.category === category),
    [products]
  );

  const productCategories: Record<ProductCategory, Product[]> = useMemo(
    () => ({
      pizza: filterProducts('pizza'),
      sauce: filterProducts('sauce'),
      'cold-drinks': filterProducts('cold-drinks'),
      'hot-drinks': filterProducts('hot-drinks'),
      beer: filterProducts('beer'),
      wine: filterProducts('wine'),
    }),
    [filterProducts]
  );

  return (
    <div className='mt-6 w-4/5 max-w-5xl'>
      {objectKeys(productCategories).map(key => {
        const replacedDashes = key.replace(/-/g, ' ');
        const sectionHeading =
          replacedDashes.charAt(0).toUpperCase() + replacedDashes.slice(1);
        return (
          <section
            key={key}
            className='mb-8 flex flex-col gap-2 last:mb-0 md:mb-14 md:gap-4'
          >
            <h2 className='text-xl text-amber-600 md:text-3xl'>
              {sectionHeading}
              {sectionHeading === 'Pizza' && (
                <span className='ml-2 text-base text-stone-900 md:text-lg'>
                  {' '}
                  Ø 32cm
                </span>
              )}
            </h2>
            <div>
              {productCategories[key].map(product => (
                <ProductEl
                  key={product.id}
                  product={product}
                  setChosenProduct={setChosenProduct}
                  addToCart
                  delete={false}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ProductList;
