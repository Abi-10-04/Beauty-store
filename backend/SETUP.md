# Backend Setup Guide

## Prerequisites
- Python 3.8 or higher
- MySQL Server
- pip (Python package manager)

## Installation Steps

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Create MySQL Database

Before running migrations, create the MySQL database:

```sql
CREATE DATABASE beauty_store_db;
```

**On Windows (Command Prompt):**
```bash
mysql -u root -p
CREATE DATABASE beauty_store_db;
EXIT;
```

**On Windows (PowerShell):**
```bash
mysql -u root -p
CREATE DATABASE beauty_store_db;
EXIT;
```

### 3. Configure Database (if needed)

Edit `beauty_store/settings.py` and update the DATABASES configuration:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'beauty_store_db',
        'USER': 'root',           # Your MySQL username
        'PASSWORD': '',           # Your MySQL password (if any)
        'HOST': 'localhost',      # MySQL host
        'PORT': '3306',           # MySQL port
    }
}
```

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Populate Sample Data

```bash
python manage.py populate_sample_data
```

This will create:
- 3 product categories (Skincare, Haircare, Makeup)
- 15 sample products
- 3 discount offers
- Admin user (username: admin, password: admin123)
- Customer user (username: customer, password: customer123)

### 6. Create Superuser (Optional)

If you want to create your own admin account:

```bash
python manage.py createsuperuser
```

### 7. Run Development Server

```bash
python manage.py runserver
```

The server will start on `http://localhost:8000`

## Accessing the Application

### Admin Panel
Visit `http://localhost:8000/admin/` and login with your admin credentials.

### API Documentation
Browse the API using Django REST Framework browsable API at:
- `http://localhost:8000/api/products/products/`
- `http://localhost:8000/api/auth/`
- etc.

## Troubleshooting

### MySQL Connection Error: "Can't connect to MySQL server"

1. Verify MySQL is running:
   - **Windows**: Open Services, search for MySQL and ensure it's running
   - **Mac**: Check System Preferences > MySQL
   - **Linux**: `sudo systemctl status mysql`

2. Check credentials in `settings.py`

3. Verify database exists:
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

### Error: "No module named 'mysqlclient'"

Reinstall the package:
```bash
pip uninstall mysqlclient
pip install mysqlclient
```

### Error: "Permission denied" when running migrations

Try running with Python specifically:
```bash
python manage.py migrate
```

### Error: "CORS not allowed"

Ensure the frontend URL is in CORS_ALLOWED_ORIGINS in `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
]
```

### Error: "No such table" after migration

Run migrations again:
```bash
python manage.py migrate --fake-initial
python manage.py migrate
```

## Running on a Different Port

```bash
python manage.py runserver 8001
```

## Environment Variables

Create a `.env` file in the backend directory (optional):

```
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_NAME=beauty_store_db
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_HOST=localhost
DATABASE_PORT=3306
```

## API Endpoints Summary

### Authentication
- `POST /api/auth/auth/register/` - Register
- `POST /api/auth/auth/login/` - Login
- `GET /api/auth/users/me/` - Get current user

### Products
- `GET /api/products/products/` - List products
- `POST /api/products/products/` - Create product (admin)
- `GET /api/products/categories/` - List categories

### Cart
- `GET /api/products/cart/my_cart/` - Get cart
- `POST /api/products/cart/add_item/` - Add to cart
- `POST /api/products/cart/remove_item/` - Remove from cart

### Orders
- `GET /api/orders/orders/my_orders/` - List orders
- `POST /api/orders/orders/create_order/` - Place order

### Reviews
- `GET /api/reviews/reviews/` - List reviews
- `POST /api/reviews/reviews/` - Create review

### Offers
- `GET /api/offers/offers/` - List active offers

## Next Steps

1. Start the backend server: `python manage.py runserver`
2. Keep it running in the background
3. Open another terminal and start the frontend: `npm run dev` (from frontend directory)
4. Access the application at `http://localhost:5173`

For more information, see the main README.md file.
