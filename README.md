# Smooth Pizza

Smooth Pizza is a website on which you can order some food online. It has a convenient admin panel where you can see the orders and manage products that are visible in the menu.

## Installation
### Prerequisites
- package manager, eg. [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [composer](https://getcomposer.org/)
- [git](https://git-scm.com/)

Clone the repository

```bash
git clone https://github.com/matibox/smooth-pizza.git
```

### Install dependencies
First, cd to the client project directory
```bash
cd smooth-pizza/client
```

Install client dependencies
```bash
npm install
```

Cd into server direcory
```bash
cd ../server
```

Install server dependencies
```bash
composer install
```

### Create .env files
In /server directory, copy `.env.example` file and rename it to `.env`

Edit database credentials for your database
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

Edit administrator email address at the bottom of the file
```env
ADMIN_EMAIL=example@example.com
```

Move to client directory
```bash
cd ../client
```

Copy `.env.example` file and rename it to `.env`

Edit api URL and promo code values, promo code must contain exactly 9 characters

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_PROMO_CODE=promocode
```

### Start servers

Go into /server directory and run the migrations
```bash
php artisan migrate
```

Then, spin up the server
```bash
php artisan serve
```

Go into /client directory and build the application
```bash
npm run build
```

Start frontend server
```bash
npm start
```

Open http://localhost:3000

## Usage

### Ordering online
1. Click on the `Sign in` button in the top right corner <br /> <br />
![localhost_3000_ (1)](https://user-images.githubusercontent.com/47917952/214289463-7a0b0706-e349-4c46-a880-f33d05996856.png)

2. Click the `Sign up` link <br /> <br />
![localhost_3000_ (2)](https://user-images.githubusercontent.com/47917952/214289792-b3bf016a-4f8c-48ad-b1ae-ee1a4d6d7fd0.png)

3. Fill in your credentials and click `Sign up` button <br /> <br />
![localhost_3000_signup](https://user-images.githubusercontent.com/47917952/214290408-6e883094-bf6d-47ac-b4d8-55ecee5365b7.png)

4. Scroll down to menu and pick the product you want to order, click `add to cart` button <br /> <br />
![localhost_3000_ (3)](https://user-images.githubusercontent.com/47917952/214294165-2d41e19a-a1c9-44e9-9228-a421f6ba8f21.png)


## License

[MIT](https://choosealicense.com/licenses/mit/)
