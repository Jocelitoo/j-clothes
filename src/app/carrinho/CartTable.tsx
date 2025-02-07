'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCartContext } from '@/hooks/CartContextProvider';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const CartTable = () => {
  const { cartProducts, setCartProducts } = useCartContext();
  const { toast } = useToast();

  const calcTotal = (price: number, quantity: number) => {
    return (price * quantity).toFixed(2);
  };

  const alterQuantity = (
    productId: string,
    productSize: string,
    newQuantity: number,
    inStock: number,
  ) => {
    // Verificar se a nova quantidade excede à disponível no estoque
    if (newQuantity > inStock) {
      toast({
        description: `A quantidade escolhida excede à disponível no estoque de ${inStock}`,
        style: { backgroundColor: '#e74c3c', color: '#fff' },
      });

      return;
    }

    // Atualizar o protudo com a nova quantidade
    const updatedCartProducts = cartProducts.map((cartProduct) => {
      // Verificar se o produto que está sofrendo map tem o mesmo id e size do produto que vai receber alteração
      if (cartProduct.id === productId && cartProduct.size === productSize) {
        // Clonar o produto e atualizar seus dados que sofreram alteração
        const updatedProduct = {
          ...cartProduct,
          quantity: newQuantity,
        };

        return updatedProduct; // Retorna o produto atualizado
      }

      return cartProduct;
    });

    // Salvar as alterações
    sessionStorage.setItem('cart', JSON.stringify(updatedCartProducts)); // Salva na sessionStorage o produto atualizado
    setCartProducts(updatedCartProducts); // Usamos para vermos a mudança em tempo real
  };

  const deleteProduct = (productId: string, productSize: string) => {
    // Pegar os produtos que NÃO tem o id e size do produto à ser deletado
    const updatedCartProducts = cartProducts.filter((cartProduct) => {
      if (cartProduct.id === productId) {
        if (cartProduct.size !== productSize) {
          return cartProduct;
        }
      } else {
        return cartProduct;
      }
    });

    // Salvar as alterações
    sessionStorage.setItem('cart', JSON.stringify(updatedCartProducts)); // Salva na sessionStorage o produto atualizado
    setCartProducts(updatedCartProducts); // Usamos para vermos a mudança em tempo real
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead className="text-center">Preço</TableHead>
          <TableHead className="text-center">Tamanho</TableHead>
          <TableHead className="text-center">Quantidade</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {cartProducts.length !== 0 ? (
          cartProducts.map((cartProduct, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="flex gap-4">
                  <Link
                    href={`/produto/${cartProduct.id}`}
                    className="block aspect-square overflow-hidden relative min-w-12 sm:min-w-24"
                  >
                    <Image
                      src={cartProduct.imageUrl}
                      alt={cartProduct.name}
                      fill
                      className="w-full h-full object-contain"
                    />
                  </Link>

                  <div className="flex flex-col justify-between">
                    <p className="line-clamp-1 text-base">{cartProduct.name}</p>

                    <Button
                      variant={'outline'}
                      onClick={() =>
                        deleteProduct(cartProduct.id, cartProduct.size)
                      }
                      className="w-fit duration-300 hover:bg-red-500"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  R$ {cartProduct.price}
                </TableCell>

                <TableCell className="text-center">
                  {cartProduct.size}
                </TableCell>

                <TableCell>
                  <Input
                    type="number"
                    min={1}
                    max={99}
                    value={cartProduct.quantity}
                    onChange={(event) =>
                      alterQuantity(
                        cartProduct.id,
                        cartProduct.size,
                        Number(event.target.value),
                        cartProduct.inStock,
                      )
                    }
                    className="max-w-20 mx-auto"
                  />
                </TableCell>

                <TableCell className="text-right">
                  R$ {calcTotal(cartProduct.price, cartProduct.quantity)}
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center space-y-4">
              <p className="text-xl">Nenhum produto encontrado</p>

              <Link
                href="/produtos"
                className="flex justify-center hover:underline"
              >
                <ArrowLeft size={20} /> Ir às compras
              </Link>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
