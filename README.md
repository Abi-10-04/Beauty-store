# Beauty Products Store - E-Commerce Application

A full-stack e-commerce web application for beauty products, similar to Purplle.

## 🛠️ Tech Stack

### Frontend
- **React** with Vite
- **Bootstrap** for styling
- **Axios** for API calls
- **React Router** for navigation

### Backend
- **Django** with Django REST Framework
- **MySQL** database
- **JWT** Authentication
- **django-cors-headers** for CORS support

## 📁 Project Structure

```
Skincare E-Commerce/
├── frontend/          # React application
│   ├── src/
│   │   ├── api/       # Axios configuration
│   │   ├── components/
│   │   ├── context/   # Auth context
│   │   ├── pages/     # Page components
│   │   └── App.jsx
│   └── package.json
└── backend/           # Django application
    ├── beauty_store/  # Project settings
    ├── users/         # User management
    ├── products/      # Products & categories
    ├── orders/        # Order management
    ├── reviews/       # Product reviews
    ├── offers/        # Discount offers
    ├── manage.py
    └── requirements.txt
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- MySQL Server
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create MySQL Database**
   ```sql
   CREATE DATABASE beauty_store_db;
   ```

4. **Update Django settings (if needed)**
   Edit `beauty_store/settings.py` and update MySQL credentials:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'beauty_store_db',
           'USER': 'root',
           'PASSWORD': 'your_password',
           'HOST': 'localhost',
           'PORT': '3306',
       }
   }
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Populate sample data**
   ```bash
   python manage.py populate_sample_data
   ```

7. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start development server**
   ```bash
   python manage.py runserver
   ```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## 📋 Features

### User Features
- ✅ User Registration & Login (JWT Authentication)
- ✅ Browse Products by Category
- ✅ Add/Remove Products to Cart
- ✅ Add/Remove Products to Wishlist
- ✅ Place Orders
- ✅ View Order History
- ✅ Submit Product Reviews & Ratings
- ✅ View Special Offers & Coupons
- ✅ Update User Profile

### Admin Features
- ✅ Add/Edit/Delete Products
- ✅ Manage Product Stock
- ✅ View & Manage Orders
- ✅ Update Order Status
- ✅ View all users

### Dynamic Features
- ✅ Auto-calculated product ratings from reviews
- ✅ Auto-update stock after orders
- ✅ Real-time cart count
- ✅ JWT token-based authentication
- ✅ CORS enabled for frontend-backend communication

## 🔐 Authentication

The application uses JWT (JSON Web Token) for authentication.

### Default Demo Credentials
- **Admin**
  - Username: `admin`
  - Password: `admin123`

- **Customer**
  - Username: `customer`
  - Password: `customer123`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/auth/register/` - Register new user
- `POST /api/auth/auth/login/` - Login user
- `POST /api/auth/auth/logout/` - Logout user

### Products
- `GET /api/products/products/` - List all products
- `POST /api/products/products/` - Create product (admin)
- `GET /api/products/categories/` - List all categories
- `GET /api/products/products/by_category/?category_id=<id>` - Products by category

### Cart
- `GET /api/products/cart/my_cart/` - Get user's cart
- `POST /api/products/cart/add_item/` - Add item to cart
- `POST /api/products/cart/remove_item/` - Remove item from cart
- `PUT /api/products/cart/update_item/` - Update cart item quantity

### Wishlist
- `GET /api/products/wishlist/my_wishlist/` - Get user's wishlist
- `POST /api/products/wishlist/add_product/` - Add to wishlist
- `POST /api/products/wishlist/remove_product/` - Remove from wishlist

### Orders
- `GET /api/orders/orders/my_orders/` - Get user's orders
- `POST /api/orders/orders/create_order/` - Create new order

### Reviews
- `GET /api/reviews/reviews/` - Get all reviews
- `POST /api/reviews/reviews/` - Create review
- `GET /api/reviews/reviews/product_reviews/?product_id=<id>` - Get reviews for product

### Offers
- `GET /api/offers/offers/` - Get all active offers

## 🎨 Sample Data

The application comes with sample data:
- 3 Categories (Skincare, Haircare, Makeup)
- 15 Sample Products
- 3 Active Offers
- Admin and Customer demo accounts

Run `python manage.py populate_sample_data` to populate this data.

## 📱 Pages

### Public Pages
- **Home Page** - Featured products and categories banner
- **Categories Page** - Browse products by category
- **Offers Page** - View active discounts and coupons
- **Login Page** - User login
- **Register Page** - New user registration

### Protected Pages
- **Cart Page** - View and manage shopping cart
- **Checkout Page** - Enter shipping information
- **Payment Page** - Dummy payment page
- **Wishlist Page** - View saved products
- **Orders Page** - View order history and details
- **Profile Page** - Edit user profile

### Admin Pages
- **Admin Dashboard** - Manage products and orders

## 🛒 Shopping Flow

1. Browse products on home page or by category
2. Add products to cart or wishlist
3. Login if not already logged in
4. Proceed to checkout
5. Enter shipping information
6. Complete payment (demo)
7. View order in "My Orders"

## 🐛 Troubleshooting

### Backend Issues

**MySQL Connection Error**
- Ensure MySQL server is running
- Check credentials in `settings.py`
- Verify database `beauty_store_db` exists

**Migration Errors**
```bash
python manage.py migrate --fake-initial
```

**Port Already in Use**
```bash
python manage.py runserver 8001
```

### Frontend Issues

**Axios CORS Error**
- Ensure backend is running on `http://localhost:8000`
- Check `settings.py` CORS_ALLOWED_ORIGINS includes frontend URL

**Module Not Found**
```bash
npm install
```

**Clear Node Modules Cache**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 File Structure Explanation

### Backend
- `models.py` - Database models for each app
- `serializers.py` - Data serialization for API
- `views.py` - API view logic
- `urls.py` - URL routing
- `admin.py` - Django admin configuration

### Frontend
- `pages/` - Full page components
- `components/` - Reusable components
- `context/` - React Context for state management
- `api/` - Axios configuration and API calls
- `App.jsx` - Main component with routing

## 🚀 Deployment

### Backend Deployment (Heroku/PythonAnywhere)
1. Update `ALLOWED_HOSTS` in settings.py
2. Set `DEBUG = False`
3. Configure environment variables
4. Deploy using platform-specific CLI

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist/` folder
3. Update API base URL for production

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Bootstrap Documentation](https://getbootstrap.com/)

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For issues or questions, please create an issue in the repository.

---

**Happy Coding! 🎉**
