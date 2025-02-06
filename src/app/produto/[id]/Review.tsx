'use client';

import { createReview } from '@/actions/reviewActions';
import { Rating } from '@/components/Rating';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUserContext } from '@/hooks/CurrentUserContextProvider';
import { useToast } from '@/hooks/use-toast';
import { reviewFormSchema } from '@/lib/schema';
import { ProductProps } from '@/utils/props';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Loader2Icon, Star, User2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface ReviewProps {
  product: ProductProps;
  hableToReview: boolean;
}

export const Review: React.FC<ReviewProps> = ({ product, hableToReview }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useCurrentUserContext(); // Pega o usuário
  const { toast } = useToast();

  const formatDate = (date: Date) => {
    return dayjs(date).format('DD/MM/YYYY');
  };

  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      text: '',
      rating: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof reviewFormSchema>) => {
    if (!currentUser?.id) return;

    // Verificar se o usuário pode fazer a review
    if (!hableToReview) return;

    // Organizar os dados
    const data = {
      userId: currentUser.id,
      productId: product.id,
      userName: currentUser.name,
      text: values.text,
      rating: values.rating,
    };

    setIsLoading(true);

    createReview(data)
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Avaliações do produto</h2>

      {hableToReview && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Escreva aqui sua avaliação"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="space-x-2">
                      <Button
                        type="button"
                        variant={'ghost'}
                        className="p-0"
                        onClick={() => form.setValue('rating', 1)}
                      >
                        <Star
                          className={`${form.getValues('rating') >= 1 && 'fill-[#ffc107]'} !size-6`}
                        />
                      </Button>

                      <Button
                        type="button"
                        variant={'ghost'}
                        className="p-0"
                        onClick={() => form.setValue('rating', 2)}
                      >
                        <Star
                          className={`${form.getValues('rating') >= 2 && 'fill-[#ffc107]'} !size-6`}
                        />
                      </Button>

                      <Button
                        type="button"
                        variant={'ghost'}
                        className="p-0"
                        onClick={() => form.setValue('rating', 3)}
                      >
                        <Star
                          className={`${form.getValues('rating') >= 3 && 'fill-[#ffc107]'} !size-6`}
                        />
                      </Button>

                      <Button
                        type="button"
                        variant={'ghost'}
                        className="p-0"
                        onClick={() => form.setValue('rating', 4)}
                      >
                        <Star
                          className={`${form.getValues('rating') >= 4 && 'fill-[#ffc107]'} !size-6`}
                        />
                      </Button>

                      <Button
                        type="button"
                        variant={'ghost'}
                        className="p-0"
                        onClick={() => form.setValue('rating', 5)}
                      >
                        <Star
                          className={`${form.getValues('rating') >= 5 && 'fill-[#ffc107]'} !size-6`}
                        />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isLoading ? (
              <Button disabled>
                <Loader2Icon className="animate-spin" /> Enviando
              </Button>
            ) : (
              <Button type="submit">Enviar avaliação</Button>
            )}
          </form>
        </Form>
      )}

      <div>
        {product.reviews === undefined || product.reviews?.length === 0 ? (
          <p>0 avaliações</p>
        ) : (
          product.reviews.map((review, index) => {
            return (
              <div key={index} className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2">
                  <User2 />

                  <p className="text-xl font-semibold">{review.userName}</p>

                  <p>{formatDate(review.createdAt)}</p>
                </div>

                <Rating count={5} value={review.rating} />

                <p>{review.text}</p>

                <Separator />
              </div>
            );
          })
        )}

        {/* {product.reviews?.map((review, index) => {
         
        })} */}
      </div>
    </div>
  );
};
