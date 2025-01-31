'use client';

import { Rating } from '@/components/Rating';
import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react';
import { ProductProps } from '@/utils/props';
import { VariationRadio } from './VariationRadio';
import { QuantityInput } from './QuantityInput';
import { AddToCartButton } from './AddToCartButton';

interface ProductInfoProps {
  product: ProductProps;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [productQuantity, setProductQuantity] = useState(0);
  const [productVariation, setProductVariation] = useState(
    product.variations[0],
  );

  const numberOfReviews = product.reviews?.length ?? 0;
  const totalRating =
    product.reviews?.reduce((acc, product) => acc + product.rating, 0) ?? 0;

  const productRating = totalRating / numberOfReviews;

  return (
    <div className="space-y-3">
      <p className="text-3xl">{product.name}</p>

      <p className="font-semibold text-xl">R$ {product.price}</p>

      <div className="flex items-center gap-4">
        <Rating count={5} value={productRating} />
        <p>{numberOfReviews} Avaliações</p>
      </div>

      <p className="text-sm">{product.description}</p>

      <p>
        <span className="font-semibold uppercase">Categória:</span>{' '}
        {product.category}
      </p>

      <VariationRadio
        product={product}
        setProductVariation={setProductVariation}
      />

      <p>
        <span className="font-semibold uppercase">Estoque:</span>{' '}
        {productVariation.inStock}
      </p>

      <Separator />

      <QuantityInput
        productQuantity={productQuantity}
        productVariation={productVariation}
        setProductQuantity={setProductQuantity}
      />

      <Separator />

      <AddToCartButton
        product={product}
        productQuantity={productQuantity}
        productVariation={productVariation}
        setProductQuantity={setProductQuantity}
      />
    </div>
  );
};
