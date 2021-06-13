# Ordering System API

An API built to manage an ordering system front-end.

## Table of Contents

- [Dependencies](#dependencies)
- [Database Structure](#database-structure)
  - [Users](#users)
  - [Profile](#profile)
  - [Categories](#categories)
  - [Products](#products)
  - [Product Options](#product-options)
  - [Orders](#orders)
  - [Order Items](#order-items)
- [Routes](#routes)
  - [Profile](#profile-1)
  - [Categories](#categories-1)
  - [Products](#products-1)
  - [Cart](#cart)
  - [Orders](#orders-1)

### Dependencies

[axios](https://github.com/axios/axios) - Makes HTTP requests from Node.js<br />
[cors](https://github.com/expressjs/cors) - Enables CORS<br />
[dotenv](https://github.com/motdotla/dotenv) - Loads environment variables<br />
[express](https://github.com/expressjs/express) - Node web app framework<br />
[express-jwt](https://github.com/auth0/express-jwt) - Middleware for validating JWTs<br />
[express-jwt-authz](https://github.com/auth0/express-jwt-authz) - Validates JWT scope<br />
[express-validator](https://github.com/express-validator/express-validator) - Validates and sanitizes input<br />
[helmet](https://github.com/helmetjs/helmet) - Sets various headers for security<br />
[jwks-rsa](https://github.com/auth0/node-jwks-rsa) - Retrieves keys from a JWKS endpoint<br />
[morgan](https://github.com/expressjs/morgan) - Logs HTTP requests<br />
[pg-promise](https://github.com/vitaly-t/pg-promise) - Postgres library for interacting with a Postgres database<br />
[winston](https://github.com/winstonjs/winston) - Logging library<br />

### Database Structure

#### Users

User authentication and authorization are managed through the [Auth0](https://auth0.com/) platform.

#### Profile

| Field         | Type    | Information                                                        |
| ------------- | ------- | ------------------------------------------------------------------ |
| user_id       | varchar | reference to users                                                 |
| abn           | varchar | Validated as per [ABR](https://abr.business.gov.au/help/abnformat) |
| name          | varchar |                                                                    |
| phone         | varchar |                                                                    |
| fax           | varchar |                                                                    |
| streetAddress | varchar |                                                                    |
| suburb        | varchar |                                                                    |
| state         | varchar |                                                                    |
| postCode      | varchar |                                                                    |

#### Categories

| Field | Type    | Information |
| ----- | ------- | ----------- |
| title | varchar |             |

#### Products

| Field       | Type    | Information             |
| ----------- | ------- | ----------------------- |
| category_id | bigint  | Reference to categories |
| name        | varchar |                         |
| price       | decimal | 2 decimal places        |
| description | varchar |                         |

#### Product Options

| Field      | Type    | Information           |
| ---------- | ------- | --------------------- |
| product_id | bigint  | Reference to products |
| name       | varchar |                       |
| price      | decimal | 2 decimal places      |

#### Orders

| Field   | Type    | Information        |
| ------- | ------- | ------------------ |
| user_id | varchar | Reference to users |
| status  | varchar |                    |
| type    | varchar |                    |
| notes   | varchar |                    |

#### Order Items

| Field      | Type    | Information           |
| ---------- | ------- | --------------------- |
| order_id   | varchar | Reference to orders   |
| product_id | varchar | Reference to products |
| quantity   | int     |                       |

### Routes

#### Profile

| Route              | Action         | Auth                 |
| ------------------ | -------------- | -------------------- |
| GET /api/profile   | Get profile    |                      |
| POST /api/profile  | Create profile | Authenticated, Admin |
| PATCH /api/profile | Update profile | Authenticated, Admin |

#### Categories

| Route                | Action             | Auth                 |
| -------------------- | ------------------ | -------------------- |
| GET /api/category    | Get all categories |                      |
| POST /api/category   | Create category    | Authenticated, Admin |
| DELETE /api/category | Delete category    | Authenticated, Admin |

#### Products

| Route                   | Action           | Auth                 |
| ----------------------- | ---------------- | -------------------- |
| GET /api/product        | Get all products |                      |
| GET /api/product/:id    | Get product      |                      |
| POST /api/product       | Create product   | Authenticated, Admin |
| PATCH /api/product/:id  | Update product   | Authenticated, Admin |
| DELETE /api/product/:id | Delete Product   | Authenticated, Admin |

#### Cart

| Route                | Action                | Auth                |
| -------------------- | --------------------- | ------------------- |
| GET /api/cart        | Get cart for user     | Authenticated, User |
| POST /api/cart       | Create cart for user  | Authenticated, User |
| POST /api/cart/:id   | Add item to cart      | Authenticated, User |
| PATCH /api/cart      | Checkout cart         | Authenticated, User |
| PATCH /api/cart/:id  | Update item in cart   | Authenticated, User |
| DELETE /api/cart/:id | Delete item from cart | Authenticated, User |

#### Orders

| Route                | Action                  | Auth                         |
| -------------------- | ----------------------- | ---------------------------- |
| GET /api/order       | Get all orders for user | Authenticated, User          |
| GET /api/order/all   | Get all orders          | Authenticated, Admin         |
| GET /api/order/:id   | Get order               | Authenticated, Admin or User |
| PATCH /api/order/:id | Update order            | Authenticated, Admin         |
