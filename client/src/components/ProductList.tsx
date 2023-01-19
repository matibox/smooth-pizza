import { useCallback, useMemo, type FC } from 'react';
import type { Product, ProductCategory } from '../types/Product';

type ProductListProps = {
  products: Product[];
};

const objectKeys = <T extends object>(obj: T) => {
  return Object.keys(obj) as Array<keyof T>;
};

const ProductList: FC<ProductListProps> = ({ products }) => {
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
          <section key={key} className='mb-4 flex flex-col gap-1 last:mb-0'>
            <h2 className='text-lg font-bold'>{sectionHeading}</h2>
            <div>
              {productCategories[key].map(product => (
                <div key={product.id}>{product.name}</div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ProductList;
