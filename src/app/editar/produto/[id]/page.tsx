import { prisma } from '@/lib/db';
import { EditProductForm } from './EditProductForm';

interface EditProductParamsProps {
  params: Promise<{ id: string }>;
}

const editProduct: React.FC<EditProductParamsProps> = async ({ params }) => {
  const { id } = await params; // Pega o parâmetro chamado id
  const product = await prisma.product.findUnique({ where: { id: id } }); // Pega o produto na base de dados

  if (!product) {
    return (
      <div className="grow flex items-center justify-center ">
        <h1 className="font-bold text-2xl">Produto não existe</h1>
      </div>
    );
  }

  return <EditProductForm product={product} />;
};

export default editProduct;
