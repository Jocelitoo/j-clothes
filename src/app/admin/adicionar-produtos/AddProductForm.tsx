'use client';

import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addProductFormSchema } from '@/lib/schema';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { createProduct } from '@/actions/productActions';
import { useEffect, useState } from 'react';
import { useCurrentUserContext } from '@/hooks/CurrentUserContextProvider';
import { redirect } from 'next/navigation';

const categories = [
  {
    value: 'homem',
    label: 'Homem',
  },
  {
    value: 'mulher',
    label: 'Mulher',
  },
  {
    value: 'calçado',
    label: 'Calçado',
  },
];

const sizes = [
  'PP',
  'P',
  'M',
  'G',
  'GG',
  'XGG',
  '38',
  '40',
  '42',
  '44',
  '46',
  '48',
  '50',
  '52',
  'Acessório',
];

export const AddProductForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useCurrentUserContext(); // Pegar dados do usuário logado

  const form = useForm<z.infer<typeof addProductFormSchema>>({
    resolver: zodResolver(addProductFormSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      category: '',
      variations: [{ size: '', inStock: 0 }],
      images: [{ id: '', url: '' }],
    },
  });

  // Manipular o campo 'variations' que é um array
  const variationFields = useFieldArray({
    control: form.control,
    name: 'variations',
  });

  // Manipular o campo 'images' que é um array
  const imageFields = useFieldArray({
    control: form.control,
    name: 'images',
  });

  useEffect(() => {
    if (currentUser?.role !== 'Admin') redirect('/'); // Redirecionar o usuário que n é admin para a home
  }, [currentUser]);

  const onSubmit = async (values: z.infer<typeof addProductFormSchema>) => {
    // Organizar todos os tamanhos escolhidos e verificar se houve algum duplicado
    const sizes: string[] = [];

    values.variations.map((variation) => {
      sizes.push(variation.size);
    });

    const hasDuplicates = new Set(sizes).size !== sizes.length;

    if (hasDuplicates)
      return toast({
        description: 'Tamanhos duplicados',
        style: { backgroundColor: '#e74c3c', color: '#000' },
      });

    // Criar o produto na BD
    setIsLoading(true);

    createProduct(values)
      .then((response) => {
        form.reset(); // Limpa todos os campos do formulário
        toast({
          description: response,
          style: { backgroundColor: '#07bc0c', color: '#000' },
        });
      })
      .catch((error) => {
        toast({
          description: error.message,
          style: { backgroundColor: '#e74c3c', color: '#000' },
        });
      })
      .finally(() => setIsLoading(false));
  };

  const deleteImageInCloudinary = (index: number) => {
    const id = form.getValues(`images.${index}.id`); // Pega o id do campo do formulário que teve o index especificado
    imageFields.remove(index); // Remove o array que teve o index especificado

    if (id) {
      const data = {
        imageId: id,
      };

      fetch(`/api/sign-cloudinary-params`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(data),
      });
    }
  };

  return (
    <div className="px-2 sm:px-4 lg:px-20 my-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-lg mx-auto border rounded-md p-4 bg-slate-50 shadow-lg space-y-3"
        >
          <h1 className="text-2xl font-bold text-center">Adicionar produto</h1>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome:</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço:</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={0.01} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição:</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categória:</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  >
                    {categories.map((category, index) => {
                      return (
                        <FormItem key={index}>
                          <FormControl className="peer hidden">
                            <RadioGroupItem
                              id={`radio-${index}`}
                              value={category.value}
                            />
                          </FormControl>

                          <FormLabel
                            htmlFor={`radio-${index}`}
                            tabIndex={0} // Torna o input focável pelo teclado
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                const element = document.querySelector(
                                  `#radio-${index}`,
                                ) as HTMLLabelElement | null;

                                element?.click(); // Simula um clique para que o radio seja escolhido (Acessibilidade)
                              }
                            }}
                            className="block border-2 p-4 text-center rounded-md cursor-pointer transition-colors duration-300 hover:bg-cyan-300 peer-aria-checked:border-black "
                          >
                            {category.label}
                          </FormLabel>
                        </FormItem>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <p className="font-semibold text-sm">Variações:</p>

            {variationFields.fields.map((field, index) => {
              return (
                <div key={index} className="flex items-end  gap-4 ">
                  <FormField
                    control={form.control}
                    name={`variations.${index}.size`}
                    render={() => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel>Tamanho:</FormLabel>
                        <FormControl>
                          <select
                            className="border rounded-md h-9"
                            {...form.register(`variations.${index}.size`, {
                              required: true,
                            })}
                            onChange={(event) => {
                              form.setValue(
                                `variations.${index}.size`,
                                event.target.value,
                              );
                            }}
                          >
                            {sizes.map((size, index) => {
                              return (
                                <option key={index} value={size}>
                                  {size}
                                </option>
                              );
                            })}
                          </select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`variations.${index}.inStock`}
                    render={() => (
                      <FormItem>
                        <FormLabel>Em estoque:</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...form.register(`variations.${index}.inStock`, {
                              required: true,
                            })}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    variant={'outline'}
                    type="button"
                    onClick={() => variationFields.remove(index)}
                    className="transition-colors duration-300 hover:bg-red-500"
                  >
                    <Trash2 />
                  </Button>
                </div>
              );
            })}

            <Button
              type="button"
              variant={'outline'}
              onClick={() => variationFields.append({ size: '', inStock: 0 })}
            >
              Adicionar variação
            </Button>
          </div>

          <div className="space-y-4">
            <p className="font-semibold text-sm">Imagens:</p>

            <div className="grid grid-cols-3 gap-4">
              {imageFields.fields.map((field, index) => {
                return (
                  <div key={index}>
                    <FormField
                      control={form.control}
                      name={`images`}
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <CldUploadWidget
                              signatureEndpoint="/api/sign-cloudinary-params"
                              onSuccess={(result) => {
                                // Verifica se result.info é um objeto com a propriedade secure_url (corrige erro do TS não reconhece secure_url e secure_id)
                                if (
                                  typeof result.info === 'object' &&
                                  result.info?.secure_url &&
                                  result.info?.public_id
                                ) {
                                  const imageUrl = result.info.secure_url;
                                  const imageId = result.info.public_id;

                                  form.setValue(
                                    `images.${index}.url`,
                                    imageUrl,
                                  );
                                  form.setValue(`images.${index}.id`, imageId);
                                } else {
                                  console.error(
                                    'Erro: O resultado retornado não contém os dados esperados.',
                                  );
                                }
                              }}
                              options={{
                                maxFiles: 1, // Só 1 imagem pode ser enviada por vez
                                sources: ['local', 'google_drive'], // Somente imagens locais (no computador) e imagens do google drive podem ser enviadas
                                clientAllowedFormats: [
                                  'jpg',
                                  'jpeg',
                                  'webp',
                                  'png',
                                ], // Formatos aceitáveis
                                maxImageFileSize: 5000000, // 5MB é o tamanho máximo da imagem
                                autoMinimize: true, // Minimiza a tela de enviar imagens quando uma imagem sofrer upload, assim evita o usuário enviar múltiplas imagens
                              }}
                            >
                              {({ open }) => {
                                const url = form.getValues(
                                  `images.${index}.url`,
                                ); // Pega a url da imagem

                                return (
                                  <>
                                    {url ? (
                                      <div className="border-dashed border-2 border-slate-300 rounded-md h-20 overflow-hidden relative w-full">
                                        <Image
                                          src={url}
                                          alt="teste"
                                          fill
                                          className="w-full h-full object-contain"
                                        />
                                      </div>
                                    ) : (
                                      <>
                                        <Button
                                          variant={'ghost'}
                                          type="button"
                                          onClick={() => open()}
                                          className="border-dashed border-2 border-slate-300 w-full h-20"
                                        >
                                          <Camera />
                                        </Button>
                                      </>
                                    )}
                                  </>
                                );
                              }}
                            </CldUploadWidget>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button
                      variant={'outline'}
                      type="button"
                      onClick={() => deleteImageInCloudinary(index)}
                      className="w-full mt-2 transition-colors duration-300 hover:bg-red-500"
                    >
                      Deletar
                    </Button>
                  </div>
                );
              })}
            </div>

            <Button
              type="button"
              variant={'outline'}
              onClick={() => imageFields.append({ id: '', url: '' })}
            >
              Adicionar imagem
            </Button>
          </div>

          {isLoading ? (
            <Button
              disabled
              variant={'ghost'}
              className="w-full bg-cyan-300 transition-colors duration-300 hover:bg-cyan-500"
            >
              <Loader2 className="animate-spin" /> Adicionando produto...
            </Button>
          ) : (
            <Button
              type="submit"
              variant={'ghost'}
              className="w-full bg-cyan-300 transition-colors duration-300 hover:bg-cyan-500"
            >
              Adicionar produto
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};
