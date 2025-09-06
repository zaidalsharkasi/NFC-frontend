import * as z from 'zod';

export const headerImageSchema = z.object({
  image: z.any().refine((file) => {
    if (file instanceof File) {
      return file.type.startsWith('image/');
    }
    return typeof file === 'string' && file.length > 0;
  }, 'Please select a valid image file'),
});

export type HeaderImageFormData = z.infer<typeof headerImageSchema>;

export interface HeaderImage {
  _id: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
