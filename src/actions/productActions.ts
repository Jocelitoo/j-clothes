'use server';

import { prisma } from '@/lib/db';
import { addProductFormSchema } from '@/lib/schema';
import { ProductProps } from '@/utils/props';
import { revalidatePath } from 'next/cache';

export const createProduct = async (formData: unknown) => {
  try {
    // Verificar se os dados do formulário estão de acordo com os critérios especificados no Zod (importante verificar isso no client e server side)
    const result = addProductFormSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        throw new Error(issue.message);
      });
    }

    // Verificar se o nome já está sendo utilizado
    const nameInUse = await prisma.product.findUnique({
      where: { name: result.data?.name },
    });

    if (nameInUse) throw new Error('Já existe um produto com esse nome');

    // Criar o produto na base de dados
    if (result.data) {
      await prisma.product.create({
        data: {
          name: result.data.name,
          price: result.data.price,
          category: result.data.category,
          description: result.data.description,
          variations: result.data.variations,
          images: result.data.images,
        },
      });
    }

    return 'Produto criado com sucesso';
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (formData: ProductProps) => {
  try {
    // Verificar se os dados do formulário estão de acordo com os critérios especificados no Zod (importante verificar isso no client e server side)
    const result = addProductFormSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        throw new Error(issue.message);
      });
    }

    // Verificar se o produto existe na base de dados
    const product = await prisma.product.findUnique({
      where: { id: formData.id },
    });

    if (!product) throw new Error('Produto não existe');

    // Atualizar o produto na base de dados
    await prisma.product.update({
      where: { id: formData.id },
      data: {
        name: formData.name,
        price: formData.price,
        category: formData.category,
        description: formData.description,
        variations: formData.variations,
        images: formData.images,
      },
    });

    return 'Produto Editado com sucesso';
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    // Verificar se o produto existe
    const productExist = await prisma.product.findUnique({ where: { id: id } });

    if (!productExist) throw new Error('O produto não existe');

    // Deletar produto
    await prisma.product.delete({ where: { id: id } });

    revalidatePath('/admin/gerenciar-produtos'); // Atualiza os dados retornados na URL especificada sem precisar recarregar a página
    return 'Produto deletado com sucesso';
  } catch (error) {
    throw error;
  }
};
