# Full-Stack Ecommerce App

A full-scale ecommerce platform built with Next.js, NextAuth (Auth.js), and raw SQL — built as a deep-dive into full-stack architecture, from schema design to auth to fulfillment.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Auth:** NextAuth v4 (Credentials provider, JWT sessions)
- **Database:** MySQL (raw SQL, no ORM)
- **Language:** TypeScript
- **Package Manager:** pnpm
- **Containerization:** Docker & Docker Compose

## Features

- Custom auth (register, login, logout, session) via NextAuth
- Customer & user accounts (supports customer-linked and admin/staff accounts)
- Product catalog with brand/category filtering and search
- Cart & checkout flow
- Order management with itemized order history
- Payment tracking (UPI, Card, Cash, NetBanking)
- Fulfillment/shipment status tracking
- Product reviews
- Inventory management

## Database Schema

Core tables: `Customers`, `Users`, `Customer_address`, `Products`, `Inventory`, `Orders`, `OrderItems`, `Fulfillment`, `OrderPayment`, `Reviews`.

Key design decisions:

- `Users.customer_id` is nullable — supports non-customer (admin/staff) accounts
- Prices are snapshotted in `OrderItems.amount` at time of purchase, decoupled from live `Products.price`
- Cascading deletes on dependent records (addresses, orders, order items, fulfillment, payments)

## Getting Started

### Prerequisites

- Docker & Docker Compose

### Setup (Docker)

This project runs fully in Docker — Next.js app + MySQL, no local Node/MySQL install needed.

1. Set up environment variables:

```bash
cp .env.example .env
```

Fill in `.env` (app-level vars like NextAuth secret; DB connection vars are already set in `docker-compose.yml`):

```env
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000
```

Generate a secret:

```bash
openssl rand -base64 32
```

2. Start everything:

```bash
docker compose up
```

This spins up:

- `web` — Next.js app on `http://localhost:3000` (hot reload enabled via volume mount)
- `db` — MySQL 8.0 on `localhost:3306`, with data persisted in a named volume (`mysql_data`)

3. Run your schema against the containerized DB (first time only):

```bash
docker compose exec db mysql -u root -p ecommerce < schema.sql
```

Visit `http://localhost:3000`.

> **Note:** Inside Docker, the app connects to MySQL via hostname `db` (the compose service name), not `localhost`. Make sure your DB connection code reads `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` from environment variables rather than hardcoding `localhost`.

## API Routes

| Route                       | Method                | Description                              |
| --------------------------- | --------------------- | ---------------------------------------- |
| `/api/auth/register`        | POST                  | Create a new customer + user account     |
| `/api/auth/[...nextauth]`   | GET/POST              | NextAuth login, logout, session handling |
| `/api/auth/me`              | GET                   | Get current logged-in user               |
| `/api/products`             | GET                   | List/search/filter products              |
| `/api/cart`                 | GET/POST/PATCH/DELETE | Manage cart items                        |
| `/api/orders`               | GET/POST              | Checkout & order history                 |
| `/api/payments`             | POST                  | Initiate/track payment                   |
| `/api/fulfillment/:orderId` | GET/PATCH             | Shipment tracking                        |
| `/api/reviews`              | GET/POST/DELETE       | Product reviews                          |

## Roadmap

- [x] Docker setup for local dev (DB + app)
- [ ] Production Dockerfile (multi-stage build, no volume mount)
- [ ] Admin dashboard for inventory/order management
- [ ] Product recommendations
- [ ] Optional GraphQL layer for flexible product-page queries

## License

MIT — see [LICENSE](./LICENSE) for details.
