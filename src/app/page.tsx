import { Suspense } from 'react';
import { Banner } from './Banner';
import { Featured } from './Featured';
import { NewProducts } from './NewProducts';
import { Loading3 } from '@/components/Loading3';

const Home = () => {
  return (
    <>
      <Banner />

      <div className="px-2 sm:px-4 lg:px-20 my-8 space-y-16">
        <div className="space-y-4">
          <p className="font-bold text-center text-2xl">Mais avaliados</p>

          <Suspense
            fallback={
              <Loading3
                smartphone={2}
                notebook={4}
                desktop={4}
                numberOfArrays={4}
              />
            }
          >
            <Featured />
          </Suspense>
        </div>

        <div className="space-y-4">
          <p className="font-bold text-center text-2xl">Novos produtos</p>

          <Suspense
            fallback={
              <Loading3
                smartphone={2}
                notebook={4}
                desktop={4}
                numberOfArrays={4}
              />
            }
          >
            <NewProducts />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default Home;
