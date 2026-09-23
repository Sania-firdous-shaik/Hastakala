# Hastakala 🇮🇳

## Indian Handmade Crafts E-Commerce Marketplace

Hastakala is a full-stack e-commerce platform that connects customers with Indian artisans and creators. Users can explore handmade products, manage their cart and wishlist, place orders, make secure online payments through Razorpay, and interact with an AI-powered craft shopping assistant.

The platform also provides creator and admin functionality for managing products, orders, users, and the marketplace.

---

## 🌐 Live Demo

**Frontend:**
https://hastakala-mauve.vercel.app/

**Backend API:**
https://hastakala.onrender.com/

**GitHub Repository:**
https://github.com/Sania-firdous-shaik/Hastakala

---

## ✨ Features

### 🛍️ Customer Features

* Browse Indian handmade products
* Search and filter products
* View detailed product information
* Add products to cart
* Update cart quantities
* Add/remove products from wishlist
* User registration and login
* Email verification
* User profile management
* Place orders
* View order history
* Track order status
* Secure online payments using Razorpay
* AI-powered craft shopping assistant

### 🎨 Creator Features

* Creator account registration
* Creator dashboard
* Add handmade products
* Upload multiple product images
* Manage product inventory
* Update product information
* Track creator products and orders

### 👨‍💼 Admin Features

* Admin dashboard
* Manage users
* Manage creators
* Manage products
* Manage categories
* Manage orders
* Update order status
* Monitor marketplace activity

---

# 🤖 Hastakala AI Craft Assistant

Hastakala includes an AI-powered shopping assistant built using the **Google Gemini API**.

The assistant helps customers discover products based on their requirements, preferences, and budget.

### Example Questions

```text
I need a handmade gift under ₹500.

Show me something for home decoration.

I want traditional Indian jewelry.

Which product is good for a birthday gift?
```

The AI assistant uses the actual product catalog from MongoDB before generating recommendations.

### AI Architecture

```text
Customer
   ↓
React AI Chat Interface
   ↓
Express.js API
   ↓
MongoDB Product Catalog
   ↓
Google Gemini API
   ↓
AI Recommendation
   ↓
Customer
```

The backend provides Gemini with the available active products so that recommendations are based on the actual Hastakala catalog rather than invented products or prices.

---

# 💳 Online Payments

Hastakala uses **Razorpay** for online payments.

### Payment Flow

```text
Customer
   ↓
Checkout
   ↓
Create Order
   ↓
Razorpay Payment Gateway
   ↓
Payment
   ↓
Backend Signature Verification
   ↓
Payment Status Updated
   ↓
Order Confirmation
```

Payments are processed in **Indian Rupees (INR ₹)**.

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router
* Tailwind CSS
* Axios
* Headless UI
* Heroicons
* Vercel

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Nodemailer
* Multer
* Razorpay
* Google Gemini API
* Render

## Development Tools

* Git
* GitHub
* VS Code
* Postman
* npm

---

# 🏗️ Project Architecture

```text
Hastakala
│
├── craft-app-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── craft-app-backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── uploads/
│   ├── index.js
│   ├── seed.js
│   └── package.json
│
├── screenshots/
│
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/Sania-firdous-shaik/Hastakala.git
```

```bash
cd Hastakala
```

---

# 🔧 Backend Setup

Navigate to the backend:

```bash
cd craft-app-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=4000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm run dev
```

Backend will run at:

```text
http://localhost:4000
```

---

# 💻 Frontend Setup

Open a new terminal and navigate to the frontend:

```bash
cd craft-app-frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

The project uses environment variables for sensitive configuration.

### Backend

```text
MONGODB_URI
JWT_SECRET
EMAIL_USER
EMAIL_PASS
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
GEMINI_API_KEY
```

### Frontend

```text
VITE_API_URL
```

**Never commit `.env` files, API keys, passwords, or secret credentials to GitHub.**

---

# 🔑 Authentication

Hastakala uses authentication and role-based access control.

### User Roles

```text
Customer
   ↓
Regular shopping features

Creator
   ↓
Product management
Creator dashboard

Admin
   ↓
Marketplace administration
```

Authentication includes:

* User registration
* Login
* JWT-based authentication
* Email verification
* Role-based authorization
* Protected routes
* Creator access control
* Admin access control

---

# 📦 Product Management

Creators can add and manage handmade products.

Each product can contain:

* Product name
* Description
* Price
* Stock quantity
* Category
* Multiple images
* Creator information
* Active/inactive status

Example categories include:

* Handicrafts
* Jewelry
* Home Decor
* Wood Crafts
* Paintings

---

# 🛒 Shopping Flow

```text
Browse Products
      ↓
View Product
      ↓
Add to Cart
      ↓
Review Cart
      ↓
Checkout
      ↓
Enter Customer Details
      ↓
Create Order
      ↓
Razorpay Payment
      ↓
Payment Verification
      ↓
Order Confirmation
```

---

# 📡 API Endpoints

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-email
```

## Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

## Orders

```text
POST /api/orders
GET  /api/orders
GET  /api/orders/:id
PUT  /api/orders/:id
```

## Payments

```text
POST /api/payments/create-order
POST /api/payments/verify
GET  /api/payments/history
```

## AI Assistant

```text
POST /api/ai/ask
```

---

# 🤖 AI Recommendation Flow

When a customer asks the AI assistant for a recommendation:

```text
1. Customer enters a question
          ↓
2. React sends the request to Express.js
          ↓
3. Backend retrieves active products from MongoDB
          ↓
4. Product information is sent to Gemini
          ↓
5. Gemini generates a recommendation
          ↓
6. Response is returned to React
          ↓
7. Customer sees the recommendation
```

The system is designed to recommend products from the available catalog and use the actual product prices.

---

# 📧 Email Verification

Hastakala uses **Nodemailer with Gmail SMTP** for email-related functionality.

The email system is used for:

* Account verification
* Verification links
* User authentication workflows

---

# 🗄️ Database

Hastakala uses **MongoDB** with **Mongoose**.

Main collections/models include:

```text
User
Product
Category
Order
Payment
```

Relationships between users, products, orders, and payments are managed using MongoDB ObjectIds and Mongoose references.

---

# 🔒 Security

The application includes:

* JWT authentication
* Password hashing
* Protected API routes
* Role-based authorization
* Environment variables for secrets
* Razorpay payment signature verification
* Email verification
* Input validation
* Restricted creator/admin operations

Sensitive credentials are stored using environment variables and are not included in the repository.

---

# 🌟 Project Highlights

### 🇮🇳 Indian Handmade Marketplace

Designed specifically around Indian handmade products and artisans, with pricing displayed in Indian Rupees (₹).

### 🛒 Complete E-Commerce Flow

Includes product discovery, cart, wishlist, checkout, orders, and payment processing.

### 💳 Razorpay Integration

Integrated Razorpay for secure online payments in INR.

### 🤖 AI-Powered Shopping Assistant

Uses Google Gemini to provide product recommendations based on the actual marketplace catalog.

### 👥 Role-Based Marketplace

Supports separate experiences for customers, creators, and administrators.

### 📧 Email Verification

Provides email verification during user registration.

### 📱 Responsive Interface

Built with React and Tailwind CSS for a responsive shopping experience across desktop and mobile devices.

---

# 📂 Example Products

The marketplace contains Indian handmade products such as:

* Handmade Lac Meenakari Bangles
* Terracotta Peacock Figurine
* Handcrafted Bamboo Basket
* Blue Pottery Decorative Plate
* Handmade Wooden Jewelry Box
* Traditional Jhumka Earrings

All prices are displayed in Indian Rupees (₹).

---

# 🎯 Future Enhancements

Possible future improvements include:

* Product reviews and ratings
* Advanced recommendation system
* Personalized customer recommendations
* Creator analytics
* Order tracking integration
* Improved AI shopping assistant
* Notifications
* Coupon and discount system
* Product recommendation based on purchase history
* Enhanced admin analytics

---

# 👩‍💻 Author

**Sania Firdous Shaik**

B.Tech – Artificial Intelligence & Data Science

GitHub:
https://github.com/Sania-firdous-shaik

LinkedIn:
https://www.linkedin.com/in/sania-firdous-shaik/

---

# 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**Hastakala — Connecting Indian Artisans with the Digital Marketplace 🇮🇳**
