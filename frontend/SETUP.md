# Frontend Setup Guide

## Prerequisites
- Node.js 14.0 or higher
- npm or yarn package manager
- Backend server running on `http://localhost:8000`

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The frontend will open automatically at `http://localhost:5173`

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with hot module reloading (HMR).

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

## Environment Configuration

The API base URL is configured in `src/api/axiosConfig.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000/api'
```

If your backend runs on a different port, update this URL.

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── api/
│   │   └── axiosConfig.js     # Axios configuration
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication context
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CategoriesPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── PaymentPage.jsx
│   │   ├── WishlistPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── OffersPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── ProfilePage.jsx
│   ├── App.jsx          # Main component with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## Key Features

### Authentication
- JWT token-based authentication
- Stored in localStorage as `access_token`
- Automatic token attachment to all requests
- Auto-logout on 401 response

### State Management
- React Context API for authentication
- Local storage for persistence
- useAuth hook for easy access

### Routing
- React Router v6
- Protected routes for authenticated users
- Admin-only routes
- Public routes for login/register

### Components

#### Navbar
- Dynamic navigation based on auth state
- Cart count display
- User dropdown menu
- Responsive design

#### ProductCard
- Add to cart functionality
- Wishlist toggle
- Real-time availability
- Rating display

#### ProtectedRoute
- Checks authentication
- Redirects to login if needed
- Admin-only route support

## Troubleshooting

### "Cannot GET /" or Page Blank

1. Ensure backend is running on port 8000
2. Check browser console for errors (F12)
3. Clear browser cache and refresh

### API Connection Errors

1. Verify backend is running: `http://localhost:8000/api/products/products/`
2. Check CORS is enabled in backend settings
3. Verify API_BASE_URL in `src/api/axiosConfig.js`

### Login Not Working

1. Check if user exists in database:
   ```bash
   # In backend terminal
   python manage.py shell
   >>> from users.models import User
   >>> User.objects.all()
   ```

2. Verify credentials:
   - Admin: username `admin`, password `admin123`
   - Customer: username `customer`, password `customer123`

3. Check browser console for specific error messages

### "Module not found" Errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 Already in Use

Edit `vite.config.js`:
```javascript
server: {
  port: 5174,  // Change to available port
}
```

Or kill the process:
- **Windows**: `netstat -ano | findstr :5173` then `taskkill /PID <PID> /F`
- **Mac/Linux**: `lsof -i :5173` then `kill -9 <PID>`

## Development Tips

### Hot Module Replacement (HMR)
Changes are automatically reflected in the browser. No need to manually refresh!

### React DevTools
Install React DevTools browser extension for debugging:
- [Chrome](https://chrome.google.com/webstore/)
- [Firefox](https://addons.mozilla.org/)

### Console Debugging
Open browser DevTools (F12) to see:
- Console errors and warnings
- Network requests to backend API
- Local storage values (auth tokens)

### API Testing
Before testing in React, test API endpoints:
```bash
# Example: List products
curl http://localhost:8000/api/products/products/

# Example: With authentication
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/...
```

## Building for Production

```bash
# Build optimized version
npm run build

# Test production build locally
npm run preview
```

The `dist/` folder contains production-ready files.

## Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Build: `npm run build`
2. Deploy `dist/` folder to Netlify
3. Configure redirect rules for SPA

### Update API URL for Production
Before deploying, update `src/api/axiosConfig.js`:
```javascript
const API_BASE_URL = 'https://your-backend-domain.com/api'
```

## Next Steps

1. Ensure backend is running: `python manage.py runserver`
2. Start frontend: `npm run dev`
3. Login with demo credentials:
   - Admin: `admin` / `admin123`
   - Customer: `customer` / `customer123`
4. Explore the application!

## Support

For issues:
1. Check browser console (F12)
2. Check backend server logs
3. Verify API endpoints are accessible
4. Review error messages carefully

---

Happy coding! 🚀
