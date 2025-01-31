import { Button } from '@/components/ui/button';
import { useCartContext } from '@/hooks/CartContextProvider';
import { useToast } from '@/hooks/use-toast';
import { CartProductProps, ProductProps } from '@/utils/props';
import React, { Dispatch, SetStateAction } from 'react';

interface ProductVariationProps {
  inStock: number;
  size: string;
}

interface AddToCartButtonProps {
  product: ProductProps;
  productQuantity: number;
  productVariation: ProductVariationProps;
  setProductQuantity: Dispatch<SetStateAction<number>>;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  productQuantity,
  productVariation,
  setProductQuantity,
}) => {
  const { toast } = useToast();
  const { setCartProducts } = useCartContext();

  const addToCart = () => {
    // Criar o novo produto à ser adicionado no carrinho de compras
    const newCartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: productQuantity,
      size: productVariation.size,
      inStock: productVariation.inStock,
      imageUrl: product.images[0].url,
    };

    // Verificar se já existe no sessionStorage o armazenamento 'cart'
    const cartExist = sessionStorage.getItem('cart');

    if (cartExist) {
      const cart: CartProductProps[] = JSON.parse(cartExist); // Pegar os dados armazenados no 'cart'

      let productExistInCart = false;

      cart.map((cartProduct) => {
        if (
          cartProduct.id === newCartProduct.id &&
          cartProduct.size === newCartProduct.size
        ) {
          if (
            cartProduct.quantity + newCartProduct.quantity >
            newCartProduct.inStock
          ) {
            toast({
              description:
                'A quantidade escolhida excede a quantidade disponível no estoque',
              style: { backgroundColor: '#e74c3c', color: '#fff' },
            });
          } else {
            cartProduct.quantity += newCartProduct.quantity; // Nova quantidade do produto

            sessionStorage.setItem('cart', JSON.stringify(cart)); // Atualizar no sessionStorage o 'cart'
            setCartProducts(cart);

            toast({
              description: 'Produto adicionado ao carrinho',
              style: { backgroundColor: '#07bc0c', color: '#fff' },
            });
          }

          productExistInCart = true;
          setProductQuantity(0);
        }
      });

      if (productExistInCart) return; // Termina aqui a function

      cart.push(newCartProduct); // Adicionar o novo produto ao 'cart'

      sessionStorage.setItem('cart', JSON.stringify(cart)); // Atualizar no sessionStorage o 'cart'
      setCartProducts(cart);

      setProductQuantity(0);
      toast({
        description: 'Produto adicionado ao carrinho',
        style: { backgroundColor: '#07bc0c', color: '#fff' },
      });
    } else {
      sessionStorage.setItem('cart', JSON.stringify([newCartProduct])); // Criar o armazenamento 'cart' no sessionStorage
      setCartProducts([newCartProduct]);

      toast({
        description: 'Produto adicionado ao carrinho',
        style: { backgroundColor: '#07bc0c', color: '#fff' },
      });
    }
  };

  return (
    <Button
      variant={'ghost'}
      disabled={
        productQuantity <= 0 || productQuantity > productVariation.inStock
      }
      onClick={() => addToCart()}
      className="w-full bg-cyan-300 duration-300  hover:bg-cyan-500"
    >
      Adicionar ao carrinho
    </Button>
  );
};
