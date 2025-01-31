'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ProductProps } from '@/utils/props';
import Image from 'next/image';
import React, { useState } from 'react';

interface ProductImageProps {
  product: ProductProps;
}

export const ProductImage: React.FC<ProductImageProps> = ({ product }) => {
  const [imageUrl, setImageUrl] = useState(product.images[0].url);

  return (
    <div className="w-full space-y-2">
      <div className="aspect-square overflow-hidden relative w-full bg-slate-200 rounded-md">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="w-full h-full object-contain"
        />
      </div>

      <ScrollArea>
        <RadioGroup
          defaultValue="image-0"
          className="border rounded-md p-3 flex gap-4 "
        >
          {product.images.map((image, index) => {
            return (
              <div key={index}>
                <RadioGroupItem
                  value={`image-${index}`}
                  onClick={() => {
                    setImageUrl(image.url);
                  }}
                  id={`image-${index}`}
                  className="hidden peer"
                />

                <Label
                  htmlFor={`image-${index}`}
                  className="aspect-square overflow-hidden relative bg-slate-200 rounded-md block w-12 cursor-pointer peer-aria-checked:ring-2"
                >
                  <Image
                    src={image.url}
                    alt={product.name}
                    fill
                    className="w-full h-full object-contain"
                  />
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
