// src/components/dashboard/CourseForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2 } from 'lucide-react';

import { courses } from '@/lib/instructor/api';
import { Course, SyllabusItem } from '@/types/index'; // Define these types

// Zod schema for syllabus items
const syllabusItemSchema = z.object({
  title: z.string().min(1, { message: 'Syllabus item title is required.' }),
  type: z.enum(['video', 'text', 'pdf'], { message: 'Invalid syllabus item type.' }),
  contentUrl: z.string().url().optional().or(z.literal('')),
  textContent: z.string().optional().or(z.literal('')),
  duration: z.coerce.number().min(1, { message: 'Duration must be at least 1 minute.' }),
}).superRefine((data, ctx) => {
  if (data.type === 'video' && !data.contentUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Video content URL is required for video type.',
      path: ['contentUrl'],
    });
  }
  if (data.type === 'pdf' && !data.contentUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'PDF content URL is required for PDF type.',
      path: ['contentUrl'],
    });
  }
  if (data.type === 'text' && !data.textContent) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Text content is required for text type.',
      path: ['textContent'],
    });
  }
});

// Zod schema for the course form
const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }).max(100),
  description: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
  category: z.string().min(1, { message: 'Category is required.' }),
  duration: z.coerce.number().min(1, { message: 'Duration must be at least 1 hour.' }),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced'], { message: 'Difficulty is required.' }),
  syllabus: z.array(syllabusItemSchema).min(1, { message: 'At least one syllabus item is required.' }),
});

type CourseFormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
  initialData?: Course; // For editing existing courses
  courseId?: string; // For editing existing courses
}

export default function CourseForm({ initialData, courseId }: CourseFormProps) {
  const router = useRouter();
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          duration: initialData.duration || 0, // Ensure duration is number
          syllabus: initialData.syllabus || [],
        }
      : {
          title: '',
          description: '',
          category: '',
          duration: 0,
          difficulty: 'Beginner',
          syllabus: [
            { title: '', type: 'text', textContent: '', contentUrl: '', duration: 0 },
          ],
        },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'syllabus',
  });

  const onSubmit = async (values: CourseFormValues) => {
    try {
      if (initialData && courseId) {
        await courses.updateCourse(courseId, values);
        toast.success('Course updated successfully!');
      } else {
        await courses.createCourse(values);
        toast.success('Course created successfully!');
      }
      router.push('/dashboard/instructor/courses'); // Redirect to course list
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save course.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Advanced Fullstack Development" {...field} />
              </FormControl>
              <FormDescription>The main title of your course.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of what the course covers."
                  className="resize-y min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>A comprehensive overview of the course content.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    {/* Add more categories as needed */}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (hours)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 20" {...field} />
                </FormControl>
                <FormDescription>Approximate total duration of the course in hours.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Syllabus</h3>
          <FormDescription>Outline the lessons and content for your course.</FormDescription>

          {fields.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded-md mb-4 relative">
              <div className="absolute top-2 right-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1} // Don't allow deleting the last item
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <FormField
                control={form.control}
                name={`syllabus.${index}.title`}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Lesson Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Introduction to MERN Stack" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`syllabus.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="text">Text/Article</SelectItem>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`syllabus.${index}.duration`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (min)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch(`syllabus.${index}.type`) === 'video' || form.watch(`syllabus.${index}.type`) === 'pdf' ? (
                <FormField
                  control={form.control}
                  name={`syllabus.${index}.contentUrl`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-4">
                      <FormLabel>Content URL</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., https://youtube.com/lesson1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Link to your video or PDF content.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              {form.watch(`syllabus.${index}.type`) === 'text' ? (
                <FormField
                  control={form.control}
                  name={`syllabus.${index}.textContent`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-4">
                      <FormLabel>Text Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your lesson content here..."
                          className="resize-y min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide the textual content for this lesson.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ title: '', type: 'text', textContent: '', contentUrl: '', duration: 0 })
            }
            className="mt-4"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Syllabus Item
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : initialData ? 'Update Course' : 'Create Course'}
        </Button>
      </form>
    </Form>
  );
}