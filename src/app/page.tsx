import { Banner } from './Banner';
import { Featured } from './Featured';
import { prisma } from '@/lib/db';

const Home = async () => {
  // Pegar os 4 produtos com mais avaliações
  const featuredProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { reviews: { _count: 'desc' } },
  });

  // Pegar os últimos 4 produtos adicionados
  const newProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <Banner />

      <Featured featuredProducts={featuredProducts} newProducts={newProducts} />
    </>
  );
};

export default Home;
