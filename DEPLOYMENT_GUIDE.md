# 🚀 Complete GitHub + Vercel Deployment Guide

## 📋 Prerequisites Checklist

✅ **Groq API Key**: Get free key from [console.groq.com](https://console.groq.com)  
✅ **MongoDB Atlas**: Free cluster from [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)  
✅ **GitHub Account**: For repository hosting  
✅ **Vercel Account**: For deployment (free tier)  

---

## 🔧 STEP 1: Setup GitHub Repository

### 1.1 Initialize Git Repository
```bash
cd c:\Users\User\OneDrive\Desktop\destiny-engine

# Initialize git (if not done already)
git init
git add .
git commit -m "Initial commit: Destiny Engine with MongoDB + Groq AI"
```

### 1.2 Create GitHub Repository
1. Go to [github.com](https://github.com) → **New Repository**
2. Repository name: `destiny-engine`
3. Description: `🔮 AI-powered financial destiny predictions with 3D crystal ball`
4. Set to **Public** (for free Vercel hosting)
5. Click **Create Repository**

### 1.3 Connect and Push
```bash
# Connect to GitHub (replace with your username)
git remote add origin https://github.com/YOURUSERNAME/destiny-engine.git
git branch -M main
git push -u origin main
```

---

## 🚀 STEP 2: Deploy Backend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click **Sign up with GitHub**
3. Authorize Vercel to access your repositories

### 2.2 Deploy Backend
1. **Vercel Dashboard** → **New Project**
2. **Import Git Repository** → Select `destiny-engine`
3. **Configure Project**:
   - **Framework Preset**: `Other`
   - **Root Directory**: ` ` (leave empty - project root)
   - **Build Command**: ` ` (leave empty)
   - **Output Directory**: ` ` (leave empty)
4. Click **Deploy**

### 2.3 Add Environment Variables
In Vercel project → **Settings** → **Environment Variables**:

```env
GROQ_API_KEY = gsk_your_groq_api_key_here
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME = destiny_engine
AI_PROVIDER = groq
MODEL_NAME = llama-3.1-8b-instant
TEMPERATURE = 0.7
ENVIRONMENT = production
```

### 2.4 Get Backend URL
- After deployment: Copy URL like `https://destiny-engine-xyz.vercel.app`
- Test: `https://destiny-engine-xyz.vercel.app/api/health`

---

## 🎨 STEP 3: Deploy Frontend to Vercel

### 3.1 Update Frontend Configuration
Create `frontend/.env.production`:
```env
REACT_APP_API_URL=https://destiny-engine-xyz.vercel.app
```

### 3.2 Update API Calls in Frontend
In `frontend/src/hooks/useApi.ts` (or wherever you make API calls):
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

### 3.3 Create Separate Frontend Project
1. **Vercel Dashboard** → **New Project**
2. **Import Git Repository** → Select `destiny-engine` (same repo)
3. **Configure Project**:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Click **Deploy**

### 3.4 Update Backend CORS
In `backend/main.py`, update CORS to allow your frontend:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://destiny-engine-frontend.vercel.app",  # Your frontend URL
        "https://*.vercel.app"  # Allow all Vercel domains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3.5 Redeploy Backend
```bash
git add .
git commit -m "Update CORS for production frontend"
git push origin main
```

---

## 🧪 STEP 4: Test Everything

### 4.1 Test Backend APIs
```bash
# Health check
curl https://your-backend.vercel.app/api/health

# Database stats
curl https://your-backend.vercel.app/api/stats

# API documentation
open https://your-backend.vercel.app/docs
```

### 4.2 Test Full Application
1. Visit `https://your-frontend.vercel.app`
2. Complete a prediction
3. Check if data is saved to MongoDB
4. Verify all animations and 3D effects work

### 4.3 Monitor Logs
- **Vercel Dashboard** → **Functions** → **View Logs**
- Check for any errors or warnings
- Monitor response times and performance

---

## 🔄 STEP 5: Automatic Deployments

### 5.1 GitHub Integration
- Every push to `main` branch triggers auto-deployment
- Pull requests create preview deployments
- Environment variables persist across deployments

### 5.2 Branch Strategy
```bash
# Create development branch
git checkout -b development
git push -u origin development

# Vercel will create preview URLs for each branch
```

---

## 🌐 STEP 6: Custom Domains (Optional)

### 6.1 Add Custom Domain
1. **Vercel Project** → **Settings** → **Domains**
2. Add your domain: `destinyengine.com`
3. Configure DNS according to Vercel instructions
4. SSL certificates are automatic

### 6.2 Update Environment Variables
Update `REACT_APP_API_URL` to use your custom domain.

---

## 📊 STEP 7: Monitoring & Analytics

### 7.1 Vercel Analytics
- Enable Vercel Analytics in project settings
- Track user visits, page views, and performance

### 7.2 MongoDB Monitoring
- Check MongoDB Atlas dashboard for:
  - Database size and usage
  - Query performance
  - Connection metrics

### 7.3 Custom Analytics
Access built-in analytics:
- `GET /api/stats` - Database insights
- `GET /api/recent-predictions` - User activity

---

## 🔒 STEP 8: Security & Performance

### 8.1 Environment Security
- Never commit `.env` files to GitHub
- Use Vercel environment variables for secrets
- Rotate API keys regularly

### 8.2 Performance Optimization
- Enable Vercel Edge Network (automatic)
- Monitor function execution times
- Optimize MongoDB queries

### 8.3 Rate Limiting (Future)
Consider adding rate limiting for production:
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
```

---

## 🎯 URLs After Deployment

### Production URLs
- **Frontend**: `https://destiny-engine-frontend.vercel.app`
- **Backend**: `https://destiny-engine-backend.vercel.app`
- **API Docs**: `https://destiny-engine-backend.vercel.app/docs`
- **Health Check**: `https://destiny-engine-backend.vercel.app/api/health`

### Analytics Endpoints
- **Database Stats**: `https://destiny-engine-backend.vercel.app/api/stats`
- **Recent Predictions**: `https://destiny-engine-backend.vercel.app/api/recent-predictions`

---

## 🚨 Troubleshooting

### Common Issues

**Backend not deploying**:
- Check `requirements.txt` includes all dependencies
- Verify environment variables are set correctly
- Check Vercel function logs for errors

**Frontend can't connect to backend**:
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS configuration in backend
- Test backend URL directly

**MongoDB connection issues**:
- Verify MongoDB URI is correct
- Check MongoDB Atlas network access settings
- Ensure database user has correct permissions

**3D graphics not working**:
- Ensure WebGL is enabled in browser
- Check for JavaScript errors in console
- Verify Three.js assets are loading

---

## 🎉 Success Checklist

✅ **Backend deployed and accessible**  
✅ **Frontend deployed and beautiful**  
✅ **MongoDB saving predictions**  
✅ **AI predictions working**  
✅ **3D crystal ball animating**  
✅ **Auto-deployment from GitHub**  
✅ **Analytics tracking users**  
✅ **All APIs responding correctly**  

**🚀 Your Destiny Engine is now LIVE and ready to predict financial futures! 🔮**

---

## 📞 Support

- **GitHub Issues**: Create issue for bugs
- **Vercel Support**: Check Vercel documentation
- **MongoDB Support**: Atlas documentation
- **Groq API**: Console support and documentation
