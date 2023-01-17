export type Error = {
  status?: number;
  response: {
    data: {
      message: string;
      errors: {
        [key: string]: string[];
      };
    };
  };
};

export function isApiError(error: unknown): error is Error {
  if ((error as Error).response.data.message) {
    return true;
  }
  return false;
}
