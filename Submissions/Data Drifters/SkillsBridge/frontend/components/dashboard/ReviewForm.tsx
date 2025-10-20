// src/components/dashboard/ReviewForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { courses } from '@/lib/student/api';

import { Rating } from 'react-simple-star-rating'; // Assuming you installed this

const reviewFormSchema = z.object({
  rating: z.coerce.number().min(1, { message: 'Rating is required (1-5 stars).' }).max(5),
  comment: z.string().max(500, { message: 'Comment cannot exceed 500 characters.' }).optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  courseId: string;
  onReviewSubmitted: () => void;
  onCancel: () => void;
}

export default function ReviewForm({ courseId, onReviewSubmitted, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0); // For the star rating component

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const handleRatingChange = (rate: number) => {
    setRating(rate);
    form.setValue('rating', rate); // Update form state with the rating
  };

  const onSubmit = async (values: ReviewFormValues) => {
    try {
      await courses.addReview(courseId, {
        rating: values.rating,
        comment: values.comment || undefined,
      });
      toast.success('Review added successfully!');
      onReviewSubmitted(); // Notify parent component
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add review.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-md bg-secondary/50">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Rating</FormLabel>
              <FormControl>
                <div>
                  <Rating
                    onClick={handleRatingChange}
                    initialValue={rating}
                    size={30}
                    fillColor="#facc15" // yellow-400
                  />
                  {form.formState.errors.rating && (
                    <p className="text-sm font-medium text-destructive mt-2">
                      {form.formState.errors.rating.message}
                    </p>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts on this course..."
                  className="resize-y min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </Form>
  );
}