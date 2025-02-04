import { ProductCard } from '@/components/ProductCard';
import { prisma } from '@/lib/db';

export const NewProducts = async () => {
  // Pegar os últimos 4 produtos adicionados
  const newProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  return <ProductCard products={newProducts} />;
};
