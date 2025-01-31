import { Loader2 } from 'lucide-react';
import React from 'react';

interface LoadingProps {
  loadingText: string;
}

export const Loading: React.FC<LoadingProps> = ({ loadingText }) => {
  return (
    <div className="h-screen w-full bg-black opacity-90 absolute left-0 top-0 flex flex-col items-center justify-center gap-4 text-white z-50">
      <Loader2 className="animate-spin size-12" />

      <p className="text-4xl">{loadingText}</p>
    </div>
  );
};
