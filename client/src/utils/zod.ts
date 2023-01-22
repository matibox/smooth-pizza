import { type Schema, ZodError } from 'zod';

type ParseSchemaReturn =
  | {
      error: true;
      message: string;
    }
  | {
      error: false;
    };

export const parseSchema = (
  schema: Schema,
  data: unknown
): ParseSchemaReturn => {
  try {
    schema.parse(data);
    return {
      error: false,
    };
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      const errors = err.errors.map(err => err.message);
      return {
        error: true,
        message: errors.reduce((a, b) => `${a}. ${b}`),
      };
    }
    return {
      error: true,
      message: 'Unknown error.',
    };
  }
};
