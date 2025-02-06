import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const Banner = () => {
  return (
    <div className="bg-cyan-100 pt-8 pb-8 sm:pb-0">
      <div className="px-2 sm:px-4 lg:px-20 flex items-center justify-between gap-4">
        <div className="flex flex-col items-center text-center gap-4 w-full sm:items-start sm:text-start ">
          <h1 className="text-2xl font-bold lg:text-4xl">
            Procurando peças de qualidade e com um ótimo preço ? É aqui que você
            encontra!
          </h1>

          <p className="text-xl">Confira já nossos produtos</p>

          <Link
            href={'/produtos'}
            className="flex gap-2 w-fit bg-cyan-300 py-2 px-4 rounded-md duration-300 hover:bg-cyan-500"
          >
            Ver produtos <ArrowRight />
          </Link>
        </div>

        <div className="w-full h-auto !hidden sm:!block ">
          <Image
            src={'/images/banner_image.png'}
            loading="eager"
            width={700}
            height={700}
            alt="Mulher de camisa amarela"
          />
        </div>
      </div>
    </div>
  );
};
