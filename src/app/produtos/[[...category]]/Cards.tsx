'use client';

import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductProps } from '@/utils/props';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface CardsProps {
  products: ProductProps[];
}

export const Cards: React.FC<CardsProps> = ({ products }) => {
  const [order, setOrder] = useState('date');
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [productsPerPage, setProductsPerPage] = useState(12); // Produtos por página
  const [search, setSearch] = useState(''); // Texto digitado para pesquisar produtos

  // Controlar a ordem que os produtos vão aparecer
  const sortedProducts = useMemo(() => {
    const sorted = [...products]; // Criar uma cópia para evitar modificar o estado original

    if (order === 'date') {
      // Mais recentes para os mais antigos
      sorted.sort((a, b) => {
        const aFormated = dayjs(b.createdAt).valueOf(); // Retorna a data A em milisegundos
        const bFormated = dayjs(a.createdAt).valueOf(); // Retorna a data B em milisegundos

        return aFormated - bFormated;
      });
    }

    // Maior preço para menor
    if (order === 'price+') {
      sorted.sort((a, b) => {
        return b.price - a.price;
      });
    }

    // Menor preço para menor
    if (order === 'price-') {
      console.log('oi');
      sorted.sort((a, b) => {
        return a.price - b.price;
      });
    }

    // Letra A-Z
    if (order === 'name') {
      sorted.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }

    // Quantidade de avaliações
    if (order === 'reviews') {
      sorted.sort((a, b) => {
        return (b.reviews?.length || 0) - (a.reviews?.length || 0);
      });
    }

    return sorted;
  }, [products, order]);

  // Filtrar produtos com base na busca
  const filteredProducts = useMemo(() => {
    return sortedProducts.filter((product) =>
      product.name.toUpperCase().includes(search.toUpperCase()),
    );
  }, [sortedProducts, search]);

  // Lógica para mostrar os produtos de acordo com sua página
  const formatedProducts = useMemo(() => {
    return filteredProducts.slice(
      currentPage * productsPerPage - productsPerPage,
      currentPage * productsPerPage,
    );
  }, [filteredProducts, currentPage, productsPerPage]);

  // Controla a quantidade de produtos por página de acordo com o tamanho da tela
  const handleWindowResize = useCallback(() => {
    if (window.innerWidth >= 640) setProductsPerPage(12);
    if (window.innerWidth < 350) setProductsPerPage(8);
  }, []);

  useEffect(() => {
    handleWindowResize(); // Executa a função quando a página é carregada

    // Executa a função quando a página é teu seu tamanho alterado
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);

  return (
    <>
      <div className="flex justify-between gap-4 mb-4">
        <Input
          placeholder="Pesquisar"
          type="text"
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-80"
        />

        <Select defaultValue={order} onValueChange={(event) => setOrder(event)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Ordenar por:" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="date">Mais recente</SelectItem>
              <SelectItem value="price-">Menor preço</SelectItem>
              <SelectItem value="price+">Maior preço</SelectItem>
              <SelectItem value="name">Nome A-Z</SelectItem>
              <SelectItem value="reviews">Mais avaliados</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <ProductCard products={formatedProducts} />

      <div className="flex justify-center gap-4 my-4">
        <Button
          variant="outline"
          type="button"
          disabled={currentPage === 1}
          onClick={() => {
            setCurrentPage((previousValue) => previousValue - 1);
            window.scrollTo(0, 0); // Rola a página para o topo
          }}
        >
          <span className="sr-only">Voltar</span>
          <ChevronLeft />
        </Button>

        <div className="flex justify-center gap-2">
          {Array.from(
            { length: Math.ceil(filteredProducts.length / productsPerPage) },
            (_, i) => i + 1,
          ).map((page) => (
            <Button
              key={page}
              type="button"
              variant="outline"
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo(0, 0);
              }}
              className={`${currentPage === page && 'bg-slate-100'}`}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          type="button"
          disabled={
            currentPage === Math.ceil(filteredProducts.length / productsPerPage)
          }
          onClick={() => {
            setCurrentPage((previousValue) => previousValue + 1);
            window.scrollTo(0, 0); // Rola a página para o topo
          }}
        >
          <span className="sr-only">Avançar</span>
          <ChevronRight />
        </Button>
      </div>
    </>
  );
};
