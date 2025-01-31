'use client';

import { ProductCard } from '@/components/ProductCard';
import { ProductProps } from '@/utils/props';
import React from 'react';

interface FeaturedProps {
  featuredProducts: ProductProps[];
  newProducts: ProductProps[];
}

export const Featured: React.FC<FeaturedProps> = ({
  featuredProducts,
  newProducts,
}) => {
  return (
    <div className="px-2 sm:px-4 lg:px-20 my-8 space-y-8">
      <div className="space-y-4">
        <p className="font-bold text-center text-2xl">Mais avaliados</p>
        <ProductCard products={featuredProducts} />
      </div>

      <div className="space-y-4">
        <p className="font-bold text-center text-2xl">Novos produtos</p>
        <ProductCard products={newProducts} />
      </div>
    </div>
  );
};
