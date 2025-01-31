'use client';

import { ProductProps } from '@/utils/props';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ProductCardProps {
  products: ProductProps[];
}

export const ProductCard: React.FC<ProductCardProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {products.map((product, index) => {
        return (
          <Link
            key={index}
            href={`/produto/${product.id}`}
            className="space-y-2 group"
          >
            <div className="aspect-square overflow-hidden relative w-full bg-slate-200 rounded-md">
              <Image
                src={product.images[0].url}
                fill
                alt={product.name}
                className="w-full h-full object-contain duration-300 group-hover:scale-125"
              />
            </div>

            <p className="line-clamp-1">{product.name}</p>

            <p className="font-semibold">R$ {product.price.toFixed(2)}</p>
          </Link>
        );
      })}
    </div>
  );
};
