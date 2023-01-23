import { type FC } from 'react';
import type { Order as TOrder } from '../types/Order';

type OrderProps = {
  order: TOrder;
};

const Order: FC<OrderProps> = ({ order }) => {
  return <div>{JSON.stringify(order)}</div>;
};

export default Order;
