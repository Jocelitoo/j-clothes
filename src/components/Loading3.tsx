import { Skeleton } from './ui/skeleton';

interface Loading3Props {
  smartphone: number;
  notebook: number;
  desktop: number;
  numberOfArrays: number;
}

export const Loading3: React.FC<Loading3Props> = ({
  smartphone,
  notebook,
  desktop,
  numberOfArrays,
}) => {
  const createArrays = () => {
    const result = [];

    for (let i = 0; i < numberOfArrays; i++) {
      result.push(i);
    }

    return result;
  };

  return (
    <div
      className={`grid gap-4 grid-cols-${smartphone} sm:grid-cols-${notebook} lg:grid-cols-${desktop}`}
    >
      {createArrays().map((array, index) => {
        return (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-32 w-full rounded-xl" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
