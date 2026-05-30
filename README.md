# Community Issue Reporting API

REST API for reporting and managing community issues (potholes, garbage, street lights, etc.).

## Tech Stack
- Node.js + Express
- Prisma ORM
- PostgreSQL (Supabase)
- JWT Authentication
- Cloudinary (Image uploads)

## Features
- User authentication (signup/login)
- Issue CRUD with filtering
- Image uploads
- Comments system
- Admin dashboard
- Rate limiting

## Installation

```bash
npm install
npx prisma migrate dev
npm run dev
```

## Environment Variables
DATABASE_URL='postgresql://...'
JWT_SECRET='your_secret'
ADMIN_MASTER_KEY='your_key'
CLOUDINARY_CLOUD_NAME='your_cloudinary_cloud_name'
CLOUDINARY_API_KEY="your_cloudinary_api_key'
CLOUDINARY_API_SECRET='your_cloudinary_api_secret'

## API Endpoints
- `POST /auth/signup` - User signup
- `POST /auth/login` - User login
- `GET /issues` - List issues (with filtering)
- `POST /issues` - Create issue
- `GET /issues/:id` - Get issue details
- `PATCH /issues/:id` - Update issue
- `POST /issues/:id/comments` - Add comment
- `DELETE /comments/:id` - Delete comment
- `PATCH /admin/issues/:id/status` - Update status (admin)
- `PATCH /admin/users/:id/disable` - Disable user (admin)
- `DELETE /admin/issues/:id` - Delete issue (admin)

## Deployment
Deployed on [Render](https://render.com)

## License
MIT