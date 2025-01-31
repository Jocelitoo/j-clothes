import { CartTable } from './CartTable';
import { Checkout } from './Checkout';

const Cart = () => {
  return (
    <div className="my-8 px-2 sm:px-4 lg:px-20 flex-grow flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Carrinho de compras</h1>

      <CartTable />

      <Checkout />
    </div>
  );
};

export default Cart;
