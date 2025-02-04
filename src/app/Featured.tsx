import { ProductCard } from '@/components/ProductCard';
import { prisma } from '@/lib/db';
import React from 'react';

export const Featured = async () => {
  // Pegar os 4 produtos com mais avaliações
  const featuredProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { reviews: { _count: 'desc' } },
  });

  return <ProductCard products={featuredProducts} />;
};
