import z from 'zod';

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Title is required'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum([
      'Action',
      'Adventure',
      'Animation',
      'Biography',
      'Crime',
      'Drama',
      'Fantasy',
      'Romance',
      'Sci-Fi'
    ]),
    {
      required_error: 'Genre is required',
      invalid_type_error: 'Genre must be an array of enum Genre',
      length_error: 'Genre must have at least one element'
    }
  ),
  rate: z.number().min(0).max(10).default(0)
});

export function validateMovie(object) {
  return movieSchema.safeParse(object);
}

export function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object);
}
