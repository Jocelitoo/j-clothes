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

  const showProducts: ProductProps[] = []; // Armazena os produtos que serão mostrados

  products.map((product) => {
    // Colocar tudo em maiúsculo para evitar o erro de n aparecer por exemplo 'Sapato' pq o usuário pesquisou 'sapato'
    const formatedName = product.name.toUpperCase();
    const formatedSearch = search.toUpperCase();

    if (formatedName.includes(formatedSearch)) showProducts.push(product); // Envia pro array os produtos que devem aparecer. Se search for '', todos serão TRUE
  });

  const amountOfPages = useMemo(() => {
    const neededPages = Math.ceil(showProducts.length / productsPerPage); // Pega a quantidade de página que vai ser necessário. Math.Ceil() serve para arredondar o número para cima
    const pages: number[] = []; // Armazena o número de cada página  no array, para podermos usar map

    // Enviar pro array o número de cada página
    for (let i = 1; i <= neededPages; i++) {
      pages.push(i);
    }

    return pages;
  }, [showProducts.length, productsPerPage]);

  // Lógica para mostrar os produtos de acordo com sua página
  const formatedProducts = showProducts.slice(
    currentPage * productsPerPage - productsPerPage,
    currentPage * productsPerPage,
  );

  // Controla a quantidade de produtos por página de acordo com o tamanho da tela
  const handleWindowResize = useCallback(() => {
    if (window.innerWidth >= 640) setProductsPerPage(12);
    if (window.innerWidth < 350) setProductsPerPage(8);
  }, []);

  useEffect(() => {
    handleWindowResize(); // Executa a função quando a página é carregada

    // Executa a função quando a página é recarregada
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);

  // Mais recentes para os mais antigos
  if (order === 'date') {
    products.sort((a, b) => {
      const aFormated = dayjs(b.createdAt).valueOf(); // Retorna a data A em milisegundos
      const bFormated = dayjs(a.createdAt).valueOf(); // Retorna a data B em milisegundos

      return aFormated - bFormated;
    });
  }

  // Maior preço para menor
  if (order === 'price+') {
    products.sort((a, b) => {
      return b.price - a.price;
    });
  }

  // Menor preço para menor
  if (order === 'price-') {
    products.sort((a, b) => {
      return a.price - b.price;
    });
  }

  // Letra A-Z
  if (order === 'name') {
    products.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }

  // Quantidade de avaliações
  if (order === 'reviews') {
    products.sort((a, b) => {
      return (b.reviews?.length || 0) - (a.reviews?.length || 0);
    });
  }

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
          {amountOfPages.map((page, index) => {
            const isPageInRange =
              (currentPage === 1 && page <= 3) ||
              (currentPage === amountOfPages.length &&
                page >= amountOfPages.length - 2) ||
              page === currentPage ||
              page === currentPage - 1 ||
              page === currentPage + 1;

            return (
              isPageInRange && (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCurrentPage(page);
                    window.scrollTo(0, 0); // Rola a página para o topo
                  }}
                  className={`${currentPage === page && 'bg-slate-100'}`}
                >
                  {page}
                </Button>
              )
            );
          })}
        </div>

        <Button
          variant="outline"
          type="button"
          disabled={currentPage === amountOfPages.length}
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
