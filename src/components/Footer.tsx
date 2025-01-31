import { Facebook, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  const year = new Date().getFullYear(); // Pegar o ano atual

  return (
    <footer className="px-2 sm:px-4 lg:px-20 bg-slate-200 pt-8 pb-4 flex flex-col items-center gap-4">
      <p className="font-bold text-4xl">J-Clothes</p>
      <nav aria-label="Links relacionados à empresa">
        <ul className="flex flex-col sm:flex-row gap-4">
          <li className="underline-offset-4 hover:underline">
            <Link href={'#'}>Compania</Link>
          </li>

          <li className="underline-offset-4 hover:underline">
            <Link href={'#'}>Produtos</Link>
          </li>

          <li className="underline-offset-4 hover:underline">
            <Link href={'#'}>Sobre-nos</Link>
          </li>

          <li className="underline-offset-4 hover:underline">
            <Link href={'#'}>Contato</Link>
          </li>
        </ul>
      </nav>

      <nav aria-label="Redes sociais">
        <ul className="flex gap-4">
          <li>
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook />
              <span className="sr-only">Facebook</span>
            </Link>
          </li>

          <li>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram />
              <span className="sr-only">Instagram</span>
            </Link>
          </li>

          <li>
            <Link
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube />
              <span className="sr-only">Youtube</span>
            </Link>
          </li>
        </ul>
      </nav>

      <p className="text-center">
        Copyright &copy; {year} - All rights reserved to{' '}
        <Link
          href={'https://jocelito-portfolio.netlify.app/'}
          target="blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4"
        >
          Jocelito
        </Link>
      </p>
    </footer>
  );
};
