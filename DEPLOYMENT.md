# Deployment Guide for Fixwala.com

This guide covers deploying your MERN application to various platforms.

## Table of Contents
- [Replit](#replit)
- [Heroku](#heroku)
- [Vercel (Frontend) + Heroku (Backend)](#vercel--heroku)
- [DigitalOcean](#digitalocean)

---

## Replit

Replit is the easiest way to deploy and run your MERN application.

### Steps:

1. **Go to [Replit.com](https://replit.com)**

2. **Import from GitHub**
   - Click "Create Repl"
   - Select "Import from GitHub"
   - Enter: `https://github.com/GULSHAN-STACK20/Fixwala-website`

3. **Set Environment Variables**
   - Click the lock icon (Secrets) in the left sidebar
   - Add these secrets:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     PORT=5000
     ```

4. **MongoDB Atlas Setup** (if not already done)
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string
   - Whitelist Replit's IP (or use 0.0.0.0/0 for all IPs)

5. **Run the Application**
   - Click the "Run" button
   - Replit will automatically install dependencies and start the server

6. **Access Your App**
   - Your app will be available at: `https://your-repl-name.your-username.repl.co`

### Replit Configuration

The `.replit` file is already configured to:
- Install dependencies automatically
- Run the Node.js server
- Set up the environment

---

## Heroku

### Prerequisites
- Heroku account
- Heroku CLI installed

### Steps:

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create a new Heroku app**
   ```bash
   heroku create fixwala-app
   ```

3. **Set up MongoDB**
   - Option A: Use MongoDB Atlas (recommended)
   - Option B: Use Heroku addon
     ```bash
     heroku addons:create mongolab:sandbox
     ```

4. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Open your app**
   ```bash
   heroku open
   ```

### Important Notes for Heroku:
- The `Procfile` specifies how to start the app
- Frontend is built and served from the backend in production
- Environment variables are managed through Heroku config

---

## Vercel (Frontend) + Heroku (Backend)

This approach separates frontend and backend deployment.

### Backend on Heroku:

Follow the Heroku steps above for the backend.

### Frontend on Vercel:

1. **Go to [Vercel](https://vercel.com)**

2. **Import your repository**
   - Click "New Project"
   - Import from GitHub
   - Select the `Fixwala-website` repository

3. **Configure build settings**
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Set environment variables**
   - Add `REACT_APP_API_URL` with your Heroku backend URL
   - Example: `https://fixwala-app.herokuapp.com`

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend

### Update Frontend to Use Backend URL:

In `client/src/services/api.js`, update:
```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  ...
});
```

---

## DigitalOcean

### Using DigitalOcean App Platform:

1. **Create account on [DigitalOcean](https://www.digitalocean.com)**

2. **Create a new App**
   - Go to Apps
   - Click "Create App"
   - Connect your GitHub repository

3. **Configure components**
   
   **Backend:**
   - Type: Web Service
   - Source Directory: `/server`
   - Build Command: `npm install`
   - Run Command: `npm start`
   - Port: 5000
   
   **Frontend:**
   - Type: Static Site
   - Source Directory: `/client`
   - Build Command: `npm install && npm run build`
   - Output Directory: `build`

4. **Set environment variables**
   - MONGODB_URI
   - PORT
   - NODE_ENV

5. **Deploy**
   - Click "Create Resources"
   - Wait for deployment to complete

---

## MongoDB Atlas Setup (For All Platforms)

1. **Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**

2. **Create a cluster**
   - Choose the free tier (M0)
   - Select your preferred region

3. **Create a database user**
   - Go to Database Access
   - Add new database user
   - Save username and password

4. **Whitelist IP addresses**
   - Go to Network Access
   - Add IP Address
   - Use `0.0.0.0/0` to allow all (or specific IPs for better security)

5. **Get connection string**
   - Go to Clusters
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

---

## Environment Variables Checklist

For any platform, make sure to set:

- ✅ `MONGODB_URI` - Your MongoDB connection string
- ✅ `PORT` - Server port (usually 5000)
- ✅ `NODE_ENV` - Set to "production" for production deployments

---

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Fails**
   - Check if IP is whitelisted in MongoDB Atlas
   - Verify connection string format
   - Ensure password doesn't contain special characters (or encode them)

2. **Frontend Can't Connect to Backend**
   - Verify CORS is enabled in backend
   - Check if API URL is correct in frontend
   - Ensure backend is deployed and running

3. **Build Fails**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Look at build logs for specific errors

4. **App Crashes on Startup**
   - Check environment variables are set
   - Verify MongoDB is accessible
   - Look at application logs

---

## Post-Deployment

After deploying:

1. **Test all features**
   - Browse services
   - Create a test booking
   - Check API endpoints

2. **Monitor performance**
   - Check response times
   - Monitor error logs
   - Track database performance

3. **Set up monitoring** (optional)
   - Use services like New Relic, Datadog, or built-in platform monitoring

---

## Need Help?

If you encounter issues:
- Check the platform-specific documentation
- Review application logs
- Open an issue on GitHub

Happy Deploying! 🚀
