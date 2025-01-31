import { Cards } from './Cards';
import { ProductProps } from '@/utils/props';
import { prisma } from '@/lib/db';

interface ProductsParamsProps {
  params: Promise<{ category: string }>;
}

const Products: React.FC<ProductsParamsProps> = async ({ params }) => {
  const { category } = await params; // Pega o parâmetro chamado category
  let products: ProductProps[] = [];

  // Verificar se houve parâmetro (pegar produtos com o parâmetro) ou não (pegar todos os produtos)
  if (category && category.length === 1) {
    const decodedCategory = decodeURIComponent(category); // À codificação de URL transforma caracteres especiais (como acentos, ç) em sequências percentuais. Então precisamos primeiro decodificar eles pra usarmos sem erro com palavras acentuadas

    // Pegar os produto que tem a categoria especificada
    products = await prisma.product.findMany({
      where: { category: decodedCategory },
      orderBy: { createdAt: 'desc' },
      include: { reviews: true },
    });
  } else {
    // Pegar todos os produtos
    products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { reviews: true },
    });
  }

  if (products.length === 0) {
    return (
      <div className="grow flex justify-center items-center">
        <h1 className="text-2xl font-bold">
          Não foi encontrado nenhum produto
        </h1>
      </div>
    );
  }

  return (
    <div className="my-16 px-2 sm:px-4 lg:px-20">
      <Cards products={products} />
    </div>
  );
};

export default Products;
