import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import React, { Dispatch } from 'react';

interface ProductVariationProps {
  inStock: number;
  size: string;
}

interface QuantityInputProps {
  productQuantity: number;
  productVariation: ProductVariationProps;
  setProductQuantity: Dispatch<React.SetStateAction<number>>;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  productQuantity,
  productVariation,
  setProductQuantity,
}) => {
  const { toast } = useToast();

  return (
    <div className="flex items-center gap-4">
      <p className="font-semibold uppercase">Quantidade:</p>

      <Input
        type="number"
        min={1}
        max={99}
        value={productQuantity}
        onChange={(event) => {
          const newProductQuantity = Number(event.target.value); // Transformar a string em número

          if (newProductQuantity > productVariation.inStock) {
            toast({
              description:
                'A quantidade escolhida excede à disponível no estoque',
              style: { backgroundColor: '#e74c3c', color: '#fff' },
            });

            setProductQuantity(0);
          } else {
            setProductQuantity(newProductQuantity);
          }
        }}
        className="max-w-24"
      />
    </div>
  );
};
