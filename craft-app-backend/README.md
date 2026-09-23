# Hastakala - Craft Marketplace Backend API

A comprehensive backend API for an Indian handmade crafts marketplace built with Node.js, Express, and MongoDB.

## Features

- **User Authentication & Authorization**
  - User registration (Creators & Customers)
  - Email verification
  - JWT-based authentication
  - Role-based access control

- **Product Management**
  - CRUD operations for products
  - Image upload support
  - Category management
  - Stock management
  - Product search and filtering

- **Order Management**
  - Order creation (authenticated & guest users)
  - Order status tracking
  - Order history
  - Stock validation

- **Payment Integration**
  - Razorpay payment gateway integration
  - INR currency support
  - Payment status tracking
  - Razorpay signature verification
  - Payment history

- **Admin Dashboard**
  - User management
  - Product management
  - Order management
  - Sales reports
  - Analytics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Upload**: Multer
- **Payment Gateway**: Razorpay
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Razorpay account for payments

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd craft-app-backend
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the backend directory and add:

   ```env
   PORT=4000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   EMAIL_USER=your-email
   EMAIL_PASS=your-gmail-app-password
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   ```

4. **Start MongoDB**

   For local MongoDB:

   ```bash
   mongod
   ```

   Or use MongoDB Atlas.

5. **Run the application**

   Development:

   ```bash
   npm run dev
   ```

   Production:

   ```bash
   npm start
   ```

   The backend runs on:

   `http://localhost:4000`

## API Endpoints

### Authentication

* `POST /api/auth/register` - User registration
* `POST /api/auth/login` - User login
* `GET /api/auth/verify-email/:token` - Email verification
* `GET /api/auth/me` - Get current user
* `PUT /api/auth/profile` - Update profile
* `PUT /api/auth/change-password` - Change password

### Products

* `GET /api/products` - Get all products
* `GET /api/products/:id` - Get single product
* `POST /api/products` - Create product
* `PUT /api/products/:id` - Update product
* `DELETE /api/products/:id` - Delete product
* `GET /api/products/creator/my-products` - Get creator's products
* `PATCH /api/products/:id/toggle-status` - Toggle product status

### Orders

* `POST /api/orders` - Create order
* `GET /api/orders/my-orders` - Get user's orders
* `GET /api/orders/:id` - Get single order
* `PATCH /api/orders/:id/status` - Update order status
* `PATCH /api/orders/:id/cancel` - Cancel order
* `GET /api/orders/admin/all` - Get all orders
* `GET /api/orders/admin/stats` - Order statistics

### Payments

* `POST /api/payments/create-order` - Create Razorpay order
* `POST /api/payments/verify` - Verify Razorpay payment
* `GET /api/payments/history` - Get payment history

### Admin

* `GET /api/admin/dashboard` - Dashboard statistics
* `GET /api/admin/users` - User management
* `PATCH /api/admin/users/:id/status` - Update user status
* `DELETE /api/admin/users/:id` - Delete user
* `GET /api/admin/products` - Product management
* `PATCH /api/admin/products/:id/status` - Update product status
* `GET /api/admin/categories` - Category management
* `POST /api/admin/categories` - Create category
* `PUT /api/admin/categories/:id` - Update category
* `DELETE /api/admin/categories/:id` - Delete category
* `GET /api/admin/reports/sales` - Sales reports

### Public

* `GET /api/categories` - Get all categories

## User Roles

### 1. User (Customer)

* Browse products
* Place orders
* Make payments
* View order history
* Manage profile
* Manage wishlist

### 2. Creator (Seller)

* All customer permissions
* Create products
* Manage products
* View orders
* Manage inventory
* Track sales

### 3. Admin

* All permissions
* User management
* Product management
* Order management
* Payment management
* Analytics and reports

## Razorpay Integration

Hastakala uses **Razorpay** for online payments.

All payments are processed in **Indian Rupees (INR)**.

Currency: **₹**

### Payment Flow

1. Customer creates an order.
2. Backend creates a Razorpay order.
3. Razorpay Checkout opens.
4. Customer completes the payment.
5. Razorpay returns the payment details.
6. Backend verifies the Razorpay signature.
7. Payment is stored in MongoDB.
8. Order status changes to `confirmed`.

### Payment Methods

The backend supports:

* Razorpay
* Card
* Cash on Delivery
* Bank Transfer

## File Upload

Product images are stored locally in the `uploads/` directory.

* Supported formats: JPEG, JPG, PNG, WebP
* Maximum file size: 5MB
* Maximum files per product: 5

## Security Features

* JWT authentication
* Password hashing with bcrypt
* Rate limiting
* CORS protection
* Helmet security headers
* Input validation
* MongoDB/Mongoose validation
* Razorpay payment signature verification

## Error Handling

The API includes comprehensive error handling for:

* Validation errors
* Authentication errors
* Authorization errors
* Database errors
* File upload errors
* Payment processing errors

## Development

### Scripts

* `npm run dev` - Start development server with Nodemon
* `npm start` - Start production server
* `npm test` - Run tests

### Database Seeding

To seed the database with categories:

`node seed.js`

## Production Deployment

### Environment Variables

* Set `NODE_ENV=production`
* Use a strong JWT secret
* Configure production MongoDB
* Configure email service
* Configure Razorpay live credentials

### Security

* Enable HTTPS
* Configure proper CORS
* Configure rate limiting
* Set up monitoring

### File Storage

For production, consider cloud storage such as:

* AWS S3
* Cloudinary
* Other object storage services

## About Hastakala

Hastakala is an Indian handmade crafts marketplace designed to connect customers with talented creators and artisans.

The platform showcases traditional Indian craftsmanship through a modern e-commerce experience.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
