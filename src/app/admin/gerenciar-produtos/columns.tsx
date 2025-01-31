'use client';

import { deleteProduct } from '@/actions/productActions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ProductProps } from '@/utils/props';
import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  Eye,
  SquarePen,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const columns: ColumnDef<ProductProps>[] = [
  {
    accessorKey: 'name',
    header: 'Produto',
    cell: ({ row }) => {
      const url = row.original.images[0].url; // Pega a url da primeira imagem
      return (
        <div className="flex items-center gap-2 min-w-24">
          <Image src={url} alt={row.original.name} width={48} height={48} />
          <p className="line-clamp-4"> {row.original.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="pl-0"
        >
          Preço <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price);

      return <div className="">{formatted}</div>;
    },
  },
  { accessorKey: 'category', header: 'Categória' },
  {
    accessorKey: 'inStock',
    header: 'Estoque',
    cell: ({ row }) => {
      const variations = row.original.variations; // Pega todas as variations
      const totalInStock = variations.reduce(
        (acc, variation) => variation.inStock + acc, // Pega o total de produtos no estoque
        0,
      );
      const alert = variations.find((variation) => variation.inStock < 10);

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={'outline'}>
              Ver estoque {alert && <TriangleAlert />}
            </Button>
          </PopoverTrigger>

          <PopoverContent>
            <div>
              {variations.map((variation, index) => {
                const alert = variation.inStock < 10;

                return (
                  <div key={index} className="flex items-center gap-1">
                    <p className={`${alert && 'text-red-500'}`}>
                      {variation.size}:
                    </p>
                    <p className={`${alert && 'text-red-500'}`}>
                      {variation.inStock}
                    </p>
                    {alert && <TriangleAlert size={14} />}
                  </div>
                );
              })}

              <p>Total: {totalInStock}</p>
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const id = row.original.id; // Id do produto
      return (
        <div className="flex gap-4 ">
          <Button variant={'outline'} asChild>
            <Link href={`/editar/produto/${id}`}>
              <SquarePen />
              <p className="sr-only">Editar produto</p>
            </Link>
          </Button>

          <Button variant={'outline'} asChild>
            <Link
              href={`/produto/${id}`}
              className="border rounded-md py-2 px-4 flex items-center"
            >
              <Eye size={16} />
              <p className="sr-only">Ver produto</p>
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger className="border rounded-md px-4 transition-colors duration-300 hover:bg-red-500">
              <Trash2 size={16} />
              <p className="sr-only">Deletar</p>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não poderá ser desfeita. O produto sera
                  permanentemente deletado.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    deleteProduct(id)
                      .then((response) => {
                        alert(response);
                      })
                      .catch((error) => {
                        alert(error.message);
                      })
                  }
                  className="text-black bg-red-300 transition-colors duration-300 hover:bg-red-500 "
                >
                  Deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
