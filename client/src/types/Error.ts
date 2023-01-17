export type Error = {
  status?: number;
  message: string;
};

export function isApiError(error: unknown): error is Error {
  if ((error as Error).message) {
    return true;
  }
  return false;
}
