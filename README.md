# 🔮 Destiny Engine - AI Crystal Ball

An interactive 3D web application that predicts your financial destiny using AI and a mystical crystal ball interface.

![Destiny Engine Preview](https://via.placeholder.com/800x400/0f0f23/81d4fa?text=🔮+Destiny+Engine+Preview)

## ✨ Features

- **🎮 3D Crystal Ball Interface**: Interactive Three.js crystal ball with magical animations
- **🤖 AI-Powered Predictions**: Groq AI (Llama-3.1-8b-instant) analyzes career aspirations and personal data
- **� MongoDB Integration**: Complete data persistence and analytics tracking
- **�💫 Emotional User Journey**: From curiosity to revelation through carefully crafted UX
- **📱 Social Sharing**: Generated destiny cards for viral sharing
- **🎓 Real University Data**: QS/NIRF rankings integration for accurate assessments
- **🌟 Mystical Design**: Beautiful shaders, animations, and atmospheric effects
- **📊 Analytics Dashboard**: Track popular careers and user patterns

## 🏗️ Architecture

### Frontend (React + Three.js)
- **React** with TypeScript for UI state management
- **Three.js + React Three Fiber** for 3D crystal ball with custom shaders
- **Styled Components** for beautiful overlays and responsive design
- **Error Boundaries** for graceful error handling
- **Progressive questioning** system for engaging user experience

### Backend (Python + FastAPI)
- **FastAPI** for high-performance async API endpoints
- **Groq AI** integration for ultra-fast intelligent wealth predictions (14.4K requests/day)
- **MongoDB Atlas** for data persistence and analytics
- **Pandas** for university rankings data processing
- **Pydantic** for robust data validation and serialization
- **Comprehensive error handling** and logging

### Database (MongoDB Atlas)
- **User Predictions**: Complete tracking of all user inputs and results
- **Analytics**: Popular careers, universities, and success patterns
- **Session Tracking**: User behavior and conversion metrics
- **Real-time Stats**: Live dashboard of platform usage

### Data Pipeline
1. **User Input** → Progressive questions about age, college, aspirations
2. **AI Analysis** → Groq AI calls for wealth estimation & probability assessment
3. **Calculation** → Intelligent formula combining estimates with success probability
4. **Database Storage** → Automatic saving of all predictions for analytics
5. **Revelation** → Beautifully presented results with sharing capabilities

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (3.8 or higher)
- **Groq API Key** (free, high limits)
- **MongoDB Atlas Account** (free tier)

### 1. Clone & Setup
```bash
git clone <your-repo-url>
cd destiny-engine
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Environment Configuration
Create `backend/.env`:
```env
# Groq AI Configuration (Fast & High Limits)
GROQ_API_KEY=your_groq_api_key_here

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=destiny_engine

# AI Provider Settings
AI_PROVIDER=groq
MODEL_NAME=llama-3.1-8b-instant
TEMPERATURE=0.7
DEBUG=True
ENVIRONMENT=development
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. Start Development

**Option A: Using VS Code Tasks** (Recommended)
1. Open the project in VS Code
2. Run: `Ctrl+Shift+P` → "Tasks: Run Task" → "🌟 Start Full Stack"

**Option B: Manual Start**
```bash
# Terminal 1: Backend
cd backend
python -m uvicorn main:app --reload

# Terminal 2: Frontend  
cd frontend
npm start
```

### 6. Open Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Database Stats**: http://localhost:8000/api/stats

## 🎯 Project Philosophy

We're creating more than software - we're crafting an **emotional experience** that makes people feel seen, validated, and optimistic about their future. Every technical decision serves the emotional journey from curiosity to delight.

### The Psychology Behind the Design

- **🔮 Crystal Ball**: Bypasses analytical thinking, engages wonder and curiosity
- **📝 Progressive Questions**: Builds emotional investment and encourages self-reflection  
- **⚡ Thinking Animation**: Creates anticipation and implies complex AI processing
- **🎊 Positive Framing**: Results feel like mystical revelations, not cold calculations
- **📤 Social Proof**: Shareable destiny cards drive organic viral growth

## 🔧 Tech Stack Deep Dive

### Frontend Technologies
```
React + TypeScript     → Component architecture & type safety
Three.js              → 3D graphics engine
React Three Fiber     → React integration for Three.js
React Three Drei      → Helper components and utilities
Styled Components     → CSS-in-JS with theme support
React Error Boundary  → Graceful error handling
```

### Backend Technologies
```
FastAPI              → Async Python web framework
Groq AI (Llama-3.1)  → Ultra-fast AI predictions (14.4K requests/day)
MongoDB Atlas        → Cloud database for data persistence
Pandas               → Data manipulation and analysis
Pydantic             → Data validation and serialization
Motor                → Async MongoDB driver
Uvicorn              → ASGI server for development
```

### 3D Graphics & Shaders
```
Custom Crystal Shader → Mystical swirling effects
Particle Systems     → Magical atmospheric particles
Dynamic Lighting     → State-responsive illumination
Orbital Animations   → Smooth celestial movements
```

## 📁 Project Structure

```
destiny-engine/
├── 📁 backend/
│   ├── main.py              # FastAPI application
│   ├── test_backend.py      # Backend tests
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/    # React components
│   │   │   ├── CrystalBall.tsx
│   │   │   ├── CrystalBallScene.tsx
│   │   │   ├── QuestionOverlay.tsx
│   │   │   ├── ProcessingOverlay.tsx
│   │   │   └── ResultsOverlay.tsx
│   │   ├── 📁 hooks/        # Custom React hooks
│   │   │   └── useApi.ts
│   │   ├── 📁 types/        # TypeScript definitions
│   │   │   └── index.ts
│   │   ├── 📁 styles/       # Global styles
│   │   │   └── GlobalStyles.ts
│   │   ├── App.tsx          # Main application
│   │   └── index.tsx        # Entry point
│   └── package.json         # Dependencies & scripts
├── 📁 data/
│   ├── university_ranks.csv # University rankings data
│   └── wealth_data.json     # Wealth percentile data
├── 📁 .vscode/
│   └── tasks.json           # VS Code tasks
├── vercel.json              # Deployment configuration
└── README.md                # This file
```

## 🌟 Key Features Breakdown

### 🔮 The Crystal Ball Experience
- **Custom WebGL Shaders**: Mystical swirling patterns that react to user state
- **Physics-Based Animation**: Realistic floating and rotation behaviors
- **State-Responsive Effects**: Visual intensity changes based on app state
- **Particle Systems**: Magical atmospheric effects

### 🤖 AI Oracle Intelligence
- **Groq AI Integration**: 
  1. Ultra-fast career wealth estimation based on role and geography
  2. Personal success probability assessment using Llama-3.1-8b-instant
- **University Tier Integration**: Real QS/NIRF rankings affect predictions
- **Dynamic Prompting**: Context-aware AI prompts for accurate results
- **Fallback Systems**: Graceful handling of API failures
- **High Performance**: 14.4K requests/day limit, sub-second response times

### 💫 User Experience Design
- **Emotional Arc**: Carefully crafted journey from curiosity → engagement → revelation
- **Progressive Disclosure**: Information revealed step-by-step to maintain engagement
- **Positive Psychology**: Optimistic framing that makes users feel validated
- **Social Virality**: Built-in sharing mechanisms for organic growth

## 🧪 Testing

### Backend Testing
```bash
cd backend
python test_backend.py
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Health Check
```bash
curl http://localhost:8000/api/health
```

## 🌐 GitHub + Vercel Deployment Guide

### 🔧 Step 1: Prepare Your Repository

1. **Create GitHub Repository**
   ```bash
   # Initialize git (if not done already)
   git init
   git add .
   git commit -m "Initial commit: Destiny Engine with MongoDB integration"
   
   # Create repository on GitHub.com
   # Then connect and push
   git remote add origin https://github.com/yourusername/destiny-engine.git
   git branch -M main
   git push -u origin main
   ```

2. **Create Vercel Configuration**
   Create `vercel.json` in project root:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "backend/main.py",
         "use": "@vercel/python",
         "config": {
           "maxLambdaSize": "50mb"
         }
       },
       {
         "src": "frontend/package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "build"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "backend/main.py"
       },
       {
         "src": "/(.*)",
         "dest": "frontend/$1"
       }
     ],
     "env": {
       "GROQ_API_KEY": "@groq-api-key",
       "MONGODB_URI": "@mongodb-uri",
       "DATABASE_NAME": "destiny_engine",
       "AI_PROVIDER": "groq",
       "MODEL_NAME": "llama-3.1-8b-instant"
     }
   }
   ```

### 🚀 Step 2: Deploy Backend to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub account

2. **Deploy Backend**
   - Click "New Project" in Vercel dashboard
   - Import your GitHub repository
   - **Framework Preset**: Other
   - **Root Directory**: Leave empty (project root)
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Output Directory**: `backend`
   - Click "Deploy"

3. **Add Environment Variables**
   In Vercel project settings → Environment Variables:
   ```
   GROQ_API_KEY = your_groq_api_key_here
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   DATABASE_NAME = destiny_engine
   AI_PROVIDER = groq
   MODEL_NAME = llama-3.1-8b-instant
   TEMPERATURE = 0.7
   ENVIRONMENT = production
   ```

4. **Get Backend URL**
   - After deployment, copy your backend URL: `https://your-project.vercel.app`
   - Test it: `https://your-project.vercel.app/api/health`

### 🎨 Step 3: Deploy Frontend to Vercel

1. **Update Frontend API URL**
   Create `frontend/.env.production`:
   ```env
   REACT_APP_API_URL=https://your-backend.vercel.app
   ```

2. **Create Separate Frontend Project**
   - In Vercel dashboard, click "New Project"
   - Import the **same GitHub repository**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - Click "Deploy"

3. **Configure Frontend Build**
   Make sure `frontend/package.json` has:
   ```json
   {
     "scripts": {
       "build": "react-scripts build",
       "start": "react-scripts start"
     }
   }
   ```

### 🔗 Step 4: Connect Frontend to Backend

1. **Update Frontend API Calls**
   In your frontend code, update API base URL:
   ```typescript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
   ```

2. **Update CORS in Backend**
   In `backend/main.py`, update CORS origins:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "http://localhost:3000",
           "https://your-frontend.vercel.app",  # Add your frontend URL
           "https://*.vercel.app"  # Allow all Vercel subdomains
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **Redeploy Backend**
   - Push changes to GitHub
   - Vercel will auto-deploy

### 🧪 Step 5: Test Deployment

1. **Test Backend**
   ```bash
   curl https://your-backend.vercel.app/api/health
   curl https://your-backend.vercel.app/api/stats
   ```

2. **Test Frontend**
   - Visit `https://your-frontend.vercel.app`
   - Complete a prediction
   - Verify data is saved to MongoDB

3. **Check Logs**
   - Vercel dashboard → Functions tab → View logs
   - Monitor for any deployment issues

### 🔄 Step 6: Automatic Deployments

1. **GitHub Integration**
   - Every push to `main` branch auto-deploys
   - Pull requests create preview deployments
   - Environment variables persist across deployments

2. **Custom Domains** (Optional)
   - Vercel project settings → Domains
   - Add your custom domain
   - Vercel handles SSL certificates automatically

## 📊 New API Endpoints

### Analytics & Insights
- `GET /api/stats` - Database statistics and trends
- `GET /api/recent-predictions` - Recent predictions (anonymized)
- `GET /api/universities` - Supported universities list

### Health & Monitoring
- `GET /api/health` - API health check
- `GET /docs` - Interactive API documentation

## 🔐 Environment Variables

### Required for Backend
- `GROQ_API_KEY`: Your Groq API key (free, high limits)
- `MONGODB_URI`: MongoDB Atlas connection string
- `DATABASE_NAME`: Database name (default: destiny_engine)

### Optional
- `AI_PROVIDER`: AI provider (default: groq)
- `MODEL_NAME`: AI model (default: llama-3.1-8b-instant)
- `TEMPERATURE`: AI creativity level (default: 0.7)
- `DEBUG`: Enable debug mode (default: False)
- `ENVIRONMENT`: Deployment environment (development/production)

### Frontend Environment
- `REACT_APP_API_URL`: Backend API URL for production

## 🧪 Testing

### Backend Testing
```bash
cd backend
python test_backend.py
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Health Check
```bash
curl http://localhost:8000/api/health
curl http://localhost:8000/api/stats
```

### MongoDB Connection Test
```bash
# Check logs for:
# ✅ MongoDB Atlas connected successfully
```

## 🎨 Customization

### Adding New Career Types
1. Update `data/wealth_data.json` with new career estimates
2. Optionally add to question suggestions in `QuestionOverlay.tsx`

### Modifying University Rankings
1. Edit `data/university_ranks.csv`
2. Backend automatically loads the updated data

### Customizing Visual Effects
1. Modify shader code in `CrystalBall.tsx`
2. Adjust animation parameters in scene components

## 🐛 Troubleshooting

### Common Issues

**Frontend won't start**
- Ensure Node.js v16+ is installed
- Try `npm install` again
- Check for port conflicts (default: 3000)

**Backend API errors**
- Verify OpenAI API key is set correctly
- Check Python version (3.8+ required)
- Ensure all dependencies are installed

**3D scenes not rendering**
- Update graphics drivers
- Try a different browser (Chrome/Firefox recommended)
- Check browser WebGL support

**API calls failing**
- Verify backend is running on port 8000
- Check network/firewall settings
- Confirm CORS configuration

## 📚 Learning Resources

### Three.js & React Three Fiber
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Journey Course](https://threejs-journey.com/)
- [Drei Helper Components](https://github.com/pmndrs/drei)

### FastAPI & Python
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Pydantic Models](https://docs.pydantic.dev/)

### UI/UX Design
- [Styled Components](https://styled-components.com/)
- [Framer Motion](https://www.framer.com/motion/) (for future animations)

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 API access
- **Three.js** community for 3D graphics inspiration
- **React Three Fiber** for seamless React integration
- **University ranking organizations** for educational data
- **The mystical forces** that guided this project's creation ✨

---

*"The future belongs to those who believe in the beauty of their dreams."* 🔮

**Built with 💫 by the Destiny Engine Team**
