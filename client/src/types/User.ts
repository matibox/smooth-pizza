// {
//   "user": {
//     "name": "Mateusz",
//     "email": "pepeasdga.hladky@gmail.com",
//     "updated_at": "2023-01-17T17:55:25.000000Z",
//     "created_at": "2023-01-17T17:55:25.000000Z",
//     "id": 3
//   },
//   "token": "4|ANaAkgFFiI0qnYRIqXHWM0sFEJ21WtV0ZZB2sAo4"
// }

export type User = {
  name: string;
  email: string;
  id: number;
  isAdmin: '0' | '1';
};
