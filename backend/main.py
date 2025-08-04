"""
🔮 Destiny Engine Backend - The AI Oracle

This is the brain of the Destiny Engine that processes user data and makes
AI-powered predictions about their financial future using Groq AI.

The system implements a sophisticated two-step AI analysis:
1. Career wealth estimation based on role and location
2. Personal probability assessment based on background

Architecture:
- FastAPI for high-performance async API
- Pydantic for robust data validation  
- Groq AI for ultra-fast intelligent analysis
- Pandas for university rankings lookup
- MongoDB Atlas for data persistence
"""

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator
import os
import json
import pandas as pd
from robust_ai import RobustCareerAnalyzer, RobustUniversityAnalyzer
from groq_service import groq_service as ai_service
from database import database_service
import re
import asyncio
import logging
from typing import Optional, Dict, Any
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app with metadata
app = FastAPI(
    title="🔮 Destiny Engine API",
    description="AI-powered financial destiny predictions with mystical flair",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Configuration - Allow frontend to communicate
origins = [
    "http://localhost:3000",
    "http://localhost:3001", 
    "http://127.0.0.1:3000",
    "https://destiny-engine.vercel.app",  # Production domain
    "https://*.vercel.app",  # Vercel preview deployments
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Global data storage
university_data = None
wealth_data = None

# ============================================================================
# DATA MODELS (Pydantic Schemas)
# ============================================================================

class UserInput(BaseModel):
    """User input data with validation"""
    name: str = Field(..., min_length=1, max_length=50, description="User's name")
    age: int = Field(..., ge=16, le=80, description="Age between 16-80")
    country: str = Field(..., min_length=2, max_length=50, description="Country of residence")
    college: str = Field(..., min_length=2, max_length=100, description="University/College name")
    aspiration: str = Field(..., min_length=2, max_length=100, description="Career aspiration")
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip().title()
    
    @field_validator('college')
    @classmethod
    def validate_college(cls, v):
        return v.strip()
    
    @field_validator('aspiration')
    @classmethod
    def validate_aspiration(cls, v):
        return v.strip().title()

class PredictionResponse(BaseModel):
    """The Oracle's final verdict"""
    predicted_lifetime_nw: float = Field(..., description="Predicted lifetime net worth")
    predicted_10_year_nw: float = Field(..., description="Predicted 10-year net worth")
    rank_band: str = Field(..., description="Wealth percentile ranking")
    reasoning: str = Field(..., description="AI's reasoning for the prediction")
    college_tier: Optional[str] = Field(None, description="University tier ranking")
    probability_score: float = Field(..., description="Success probability (0-1)")
    oracle_confidence: str = Field(..., description="Oracle's confidence level")

class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str
    message: str
    version: str

# ============================================================================
# DATA LOADING & INITIALIZATION
# ============================================================================

async def load_data():
    """Load university rankings and wealth data on startup"""
    global university_data, wealth_data
    
    try:
        # Load university rankings
        data_path = Path(__file__).parent.parent / "data"
        uni_file = data_path / "university_ranks.csv"
        wealth_file = data_path / "wealth_data.json"
        
        if uni_file.exists():
            university_data = pd.read_csv(uni_file)
            logger.info(f"Loaded {len(university_data)} university records")
        else:
            logger.warning("University data file not found")
            university_data = pd.DataFrame()
        
        if wealth_file.exists():
            with open(wealth_file, 'r') as f:
                wealth_data = json.load(f)
            logger.info("Loaded wealth percentile data")
        else:
            logger.warning("Wealth data file not found")
            wealth_data = {}
            
    except Exception as e:
        logger.error(f"Error loading data: {e}")
        # Initialize empty data structures as fallback
        university_data = pd.DataFrame()
        wealth_data = {}

@app.on_event("startup")
async def startup_event():
    """Initialize data, Groq AI, and MongoDB on startup"""
    await load_data()
    
    # Check Groq AI configuration
    if not os.getenv("GROQ_API_KEY"):
        logger.error("Groq API key not found! Set GROQ_API_KEY environment variable.")
    else:
        logger.info("Groq AI configured successfully")
        # Test AI service connection
        try:
            test_result = await ai_service.test_connection()
            if test_result["status"] == "success":
                logger.info("✅ Groq AI connection test successful")
            else:
                logger.error(f"❌ Groq AI connection test failed: {test_result['message']}")
        except Exception as e:
            logger.error(f"❌ Groq AI connection test failed: {e}")
    
    # Initialize MongoDB connection
    try:
        db_connected = await database_service.connect()
        if db_connected:
            logger.info("✅ MongoDB Atlas connected successfully")
        else:
            logger.warning("⚠️ MongoDB connection failed - running without database")
    except Exception as e:
        logger.error(f"❌ MongoDB connection error: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    try:
        await database_service.disconnect()
        logger.info("📴 Application shutdown complete")
    except Exception as e:
        logger.error(f"❌ Shutdown error: {e}")

def validate_wealth_estimates(aspiration: str, lifetime_nw: float, ten_year_nw: float) -> tuple[float, float]:
    """Validate and adjust unrealistic wealth estimates based on career type"""
    aspiration_lower = aspiration.lower()
    
    # Define realistic caps for different career categories
    career_caps = {
        # Low-income careers
        'farmer': (500000, 100000),
        'farming': (500000, 100000),
        'agriculture': (600000, 120000),
        'teacher': (800000, 150000),
        'teaching': (800000, 150000),
        'retail': (600000, 100000),
        'cashier': (400000, 80000),
        'waiter': (400000, 80000),
        'driver': (500000, 100000),
        'security': (500000, 90000),
        'cleaner': (350000, 70000),
        'cook': (450000, 90000),
        
        # Medium-income careers  
        'nurse': (1200000, 200000),
        'engineer': (2500000, 450000),
        'accountant': (1500000, 250000),
        'manager': (2000000, 350000),
        'analyst': (1800000, 300000),
        'designer': (1400000, 250000),
        'marketing': (1600000, 280000),
        'sales': (1800000, 300000),
        
        # High-income careers
        'doctor': (4000000, 600000),
        'lawyer': (3500000, 500000),
        'software': (3000000, 500000),
        'consultant': (3500000, 550000),
        'finance': (4000000, 600000),
        'investment': (5000000, 800000),
        'entrepreneur': (10000000, 1000000),  # High variance career
    }
    
    # Find matching career category
    max_lifetime = None
    max_ten_year = None
    
    for career_keyword, (lifetime_cap, ten_year_cap) in career_caps.items():
        if career_keyword in aspiration_lower:
            max_lifetime = lifetime_cap
            max_ten_year = ten_year_cap
            break
    
    # Apply caps if found
    if max_lifetime and max_ten_year:
        if lifetime_nw > max_lifetime:
            logger.warning(f"Adjusting unrealistic lifetime estimate for {aspiration}: ${lifetime_nw:,.0f} -> ${max_lifetime:,.0f}")
            lifetime_nw = max_lifetime
        
        if ten_year_nw > max_ten_year:
            logger.warning(f"Adjusting unrealistic 10-year estimate for {aspiration}: ${ten_year_nw:,.0f} -> ${max_ten_year:,.0f}")
            ten_year_nw = max_ten_year
    
    # General sanity checks
    if lifetime_nw > 20000000:  # Cap at $20M for any career
        logger.warning(f"Capping extremely high lifetime estimate: ${lifetime_nw:,.0f} -> $20,000,000")
        lifetime_nw = 20000000
    
    if ten_year_nw > lifetime_nw * 0.6:  # 10-year shouldn't be more than 60% of lifetime
        ten_year_nw = lifetime_nw * 0.3
        logger.warning(f"Adjusting 10-year estimate to be 30% of lifetime: ${ten_year_nw:,.0f}")
    
    if ten_year_nw < 10000:  # Minimum realistic 10-year net worth
        ten_year_nw = 10000
    
    if lifetime_nw < 50000:  # Minimum realistic lifetime net worth
        lifetime_nw = 50000
    
    return lifetime_nw, ten_year_nw

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

async def find_university_tier(college_name: str) -> tuple[str, int]:
    """Find university tier and rank from the database with flexible case-insensitive matching"""
    if university_data.empty:
        logger.warning("University data not loaded")
        return get_ai_university_assessment(college_name)
    
    # Clean and normalize the input
    college_clean = college_name.strip().lower()
    college_words = set(college_clean.split())
    
    logger.info(f"Looking up university: '{college_name}' -> normalized: '{college_clean}'")
    
    # Method 1: Exact case-insensitive match
    exact_match = university_data[
        university_data['university_name'].str.lower().str.strip() == college_clean
    ]
    
    if not exact_match.empty:
        row = exact_match.iloc[0]
        tier = row.get('tier', 'A')
        rank = row.get('qs_rank', row.get('nirf_rank', 300))
        logger.info(f"Exact match found: {row['university_name']} -> {tier}, rank {rank}")
        return tier, int(rank) if pd.notna(rank) else 300
    
    # Method 2: Flexible partial matching - check if input contains university name or vice versa
    best_match = None
    best_score = 0
    
    for idx, row in university_data.iterrows():
        uni_name = row['university_name'].lower().strip()
        uni_words = set(uni_name.split())
        
        # Check various matching conditions
        matches = []
        
        # Condition 1: Input is contained in university name
        if college_clean in uni_name:
            matches.append(0.9)
        
        # Condition 2: University name is contained in input  
        if uni_name in college_clean:
            matches.append(0.8)
        
        # Condition 3: Word overlap ratio
        if len(college_words) > 0 and len(uni_words) > 0:
            overlap = len(college_words & uni_words)
            word_score = overlap / max(len(college_words), len(uni_words))
            if word_score > 0.3:  # At least 30% word overlap
                matches.append(word_score)
        
        # Condition 4: Common abbreviations and variations
        if any(keyword in college_clean for keyword in ['iit', 'nit', 'iisc', 'iim', 'bits']):
            if any(keyword in uni_name for keyword in ['iit', 'nit', 'iisc', 'iim', 'bits']):
                # Check if the specific institute matches
                for keyword in ['iit', 'nit', 'iisc', 'iim', 'bits']:
                    if keyword in college_clean and keyword in uni_name:
                        # Extract the location/name part
                        college_parts = college_clean.replace(keyword, '').strip().split()
                        uni_parts = uni_name.replace(keyword, '').strip().split()
                        if any(part in uni_parts for part in college_parts if len(part) > 2):
                            matches.append(0.95)
        
        if matches:
            score = max(matches)
            if score > best_score:
                best_score = score
                best_match = row
    
    if best_match is not None and best_score > 0.3:
        tier = best_match.get('tier', 'A')
        rank = best_match.get('qs_rank', best_match.get('nirf_rank', 300))
        logger.info(f"Best match found: {best_match['university_name']} (score: {best_score:.2f}) -> {tier}, rank {rank}")
        return tier, int(rank) if pd.notna(rank) else 300
    if best_match is not None and best_score > 0.3:
        tier = best_match.get('tier', 'A')
        rank = best_match.get('qs_rank', best_match.get('nirf_rank', 300))
        logger.info(f"Best match found: {best_match['university_name']} (score: {best_score:.2f}) -> {tier}, rank {rank}")
        return tier, int(rank) if pd.notna(rank) else 300
    
    # Method 3: No database match found, use BULLETPROOF AI assessment
    logger.info(f"No database match found for '{college_name}', using BULLETPROOF AI assessment")
    return RobustUniversityAnalyzer.get_strict_university_assessment(college_name)

def get_ai_university_assessment(college_name: str) -> tuple[str, int]:
    """AI-powered university assessment for unknown institutions"""
    try:
        prompt = f"""You are a STRICT global university ranking expert. Be REALISTIC and CONSERVATIVE in your assessment.

University: {college_name}

STRICT Classification Guidelines:
- S+ (Top 1% - Only ~50 universities globally): Harvard, MIT, Stanford, Oxford, Cambridge, IIT Bombay, ETH Zurich
- S (Top 5% - Only ~250 universities globally): UCLA, Imperial College, top state schools like UC Berkeley  
- A+ (Top 15% - Only major regional leaders): Top NITs, good state flagships, well-known regional universities
- A (Top 30% - Decent universities): Average state universities, known private colleges
- B+ (Top 50% - Below average): Lesser-known regional universities
- B (Top 70% - Poor reputation): Small local universities, community colleges
- C (Bottom 30% - Unknown/Local): Local colleges, unknown institutions, new universities

IMPORTANT: Most universities should be rated B+, B, or C. Only rate S+/S if it's truly world-famous. Be CONSERVATIVE.

If you don't recognize the university name or it seems local/regional, default to B or C tier.

University: {college_name}

Respond EXACTLY as:
TIER: [S+/S/A+/A/B+/B/C]
RANK: [estimated global rank number between 500-2000 for unknown universities]

Example for unknown university:
TIER: B
RANK: 1200"""

        response = ai_service.generate_response(prompt, max_tokens=100, temperature=0.3)
        
        logger.info(f"AI University Assessment for {college_name}: {response}")
        
        # Parse the response
        tier_match = re.search(r'TIER:\s*([A-C][+]?)', response)
        rank_match = re.search(r'RANK:\s*(\d+)', response)
        
        if tier_match and rank_match:
            tier = tier_match.group(1)
            rank = int(rank_match.group(1))
            logger.info(f"AI assessed {college_name}: {tier}, rank {rank}")
            return tier, rank
        
        # Fallback parsing
        valid_tiers = ['S+', 'S', 'A+', 'A', 'B+', 'B', 'C']
        for tier in valid_tiers:
            if tier in content:
                rank_estimates = {'S+': 25, 'S': 75, 'A+': 150, 'A': 300, 'B+': 500, 'B': 700, 'C': 1000}
                return tier, rank_estimates.get(tier, 500)
                
    except Exception as e:
        logger.error(f"AI university assessment failed for {college_name}: {e}")
    
    # Final fallback - be more realistic for unknown universities  
    if "university of" in college_name.lower() and any(location in college_name.lower() for location in ['haldia', 'local', 'regional']):
        logger.warning(f"Unknown regional university detected: {college_name}, using conservative assessment")
        return "C", 1500  # Local/regional university
    
    logger.warning(f"All assessment methods failed for {college_name}, using conservative fallback")
    return "B", 800  # More conservative default

def calculate_wealth_percentile(net_worth: float, country: str = "USA") -> str:
    """Calculate which wealth percentile the net worth falls into"""
    if not wealth_data or 'global_wealth_percentiles' not in wealth_data:
        return "Top 20% - Comfortable"
    
    # Apply country multiplier
    multiplier = wealth_data.get('country_multipliers', {}).get(country, 1.0)
    adjusted_nw = net_worth * multiplier
    
    percentiles = wealth_data['global_wealth_percentiles']
    
    # Check from highest to lowest
    for percentile in ['top_0.1', 'top_0.5', 'top_1', 'top_2', 'top_5', 'top_10', 'top_20', 'top_50']:
        if adjusted_nw >= percentiles[percentile]['min_nw']:
            return percentiles[percentile]['label']
    
    return percentiles['bottom_50']['label']

def get_oracle_confidence(probability: float) -> str:
    """Convert probability to mystical confidence level"""
    if probability >= 0.8:
        return "The stars align powerfully in your favor"
    elif probability >= 0.6:
        return "The cosmic forces show strong promise"
    elif probability >= 0.4:
        return "The universe whispers of potential"
    elif probability >= 0.2:
        return "A challenging but possible path lies ahead"
    else:
        return "The journey requires extraordinary determination"

async def get_enhanced_reasoning(user_data: UserInput, college_tier: str, lifetime_nw: float, ten_year_nw: float, probability: float, base_reasoning: str) -> str:
    """
    Step 3: AI-powered enhancement of the final reasoning with specific insights
    """
    try:
        prompt = f"""You are a mystical Oracle providing personalized financial destiny insights. Create an engaging, specific, and inspiring explanation.

DESTINY PROFILE:
- Name: {user_data.name}
- Age: {user_data.age} years old
- Country: {user_data.country}
- University: {user_data.college} (Tier {college_tier})
- Aspiration: {user_data.aspiration}
- Predicted Lifetime Net Worth: ${lifetime_nw:,.0f}
- Predicted 10-Year Net Worth: ${ten_year_nw:,.0f}
- Success Probability: {probability:.1%}

PREVIOUS ANALYSIS: {base_reasoning}

Create a MYSTICAL yet SPECIFIC reasoning that:
1. Mentions their exact university and how it connects to their aspiration
2. References their age as an advantage or consideration
3. Explains the specific pathway from their education to wealth
4. Mentions unique opportunities in {user_data.country} for {user_data.aspiration}
5. Includes 2-3 specific strategic recommendations

Write in an INSPIRING, MYSTICAL tone like an ancient Oracle revealing destiny, but include PRACTICAL insights.

Respond with EXACTLY this format:
Your {user_data.college} foundation in {user_data.country} [specific insight about their path]. At {user_data.age}, [age-specific advantage]. The cosmic alignment shows [specific opportunity or strategy]. Your journey toward {user_data.aspiration} shall [specific prediction with practical element].

Example:
Your IIT Delhi engineering foundation in India positions you perfectly as the nation becomes a global tech powerhouse. At 21, you have the optimal timing to ride the AI revolution wave. The cosmic alignment shows opportunities in fintech and startup ecosystems where your technical skills will compound exponentially. Your journey toward software engineering shall flourish through strategic job transitions, equity participation, and eventual consulting ventures.

Be SPECIFIC to their exact profile, not generic."""

        response = ai_service.generate_response(prompt, max_tokens=200, temperature=0.8)

        enhanced_reasoning = response.strip()
        logger.info(f"Enhanced reasoning generated: {enhanced_reasoning[:150]}...")  # Truncate log
        return enhanced_reasoning
        
    except Exception as e:
        logger.error(f"Error in enhanced reasoning generation: {e}")
        # Return enhanced base reasoning as fallback
        return f"Your foundation at {user_data.college} combined with your {user_data.age}-year perspective creates meaningful opportunities in {user_data.aspiration}. {base_reasoning}"

# Test endpoint to verify Gemini AI usage
@app.get("/api/test-ai")
async def test_ai():
    """Test endpoint to verify Gemini AI is working and being used"""
    try:
        logger.info("🧪 Testing Gemini AI connectivity...")
        
        response = ai_service.generate_response(
            "Respond with exactly: Gemini AI is working! Current timestamp and a random number.",
            max_tokens=50,
            temperature=0.7
        )
        
        import time
        return {
            "status": "success",
            "message": "✅ Gemini AI is connected and working!",
            "ai_response": response,
            "timestamp": time.time(),
            "model": "gemini-1.5-flash",
            "api_key_present": bool(os.getenv("GEMINI_API_KEY"))
        }
        
    except Exception as e:
        logger.error(f"❌ OpenAI test failed: {e}")
        return {
            "status": "error", 
            "message": f"❌ OpenAI connection failed: {str(e)}",
            "api_key_present": bool(os.getenv("OPENAI_API_KEY"))
        }
    """Convert probability to mystical confidence level"""
    if probability >= 0.8:
        return "The stars align powerfully in your favor"
    elif probability >= 0.6:
        return "The cosmic forces show strong promise"
    elif probability >= 0.4:
        return "The universe whispers of potential"
    elif probability >= 0.2:
        return "A challenging but possible path lies ahead"
    else:
        return "The journey requires extraordinary determination"

# ============================================================================
# AI ORACLE FUNCTIONS
# ============================================================================

async def get_career_wealth_estimate(aspiration: str, country: str) -> tuple[float, float]:
    """
    Step 1: Get REALISTIC AI-powered career wealth estimates
    Returns: (lifetime_nw, ten_year_nw)
    """
    try:
        # Enhanced prompt for realistic assessments
        prompt = f"""You are a REALISTIC financial analyst providing CONSERVATIVE wealth projections. Do NOT be overly optimistic.

Career Path: {aspiration}
Country/Region: {country}

IMPORTANT GUIDELINES:
- For traditional careers like farming, teaching, retail: Use REALISTIC modest income ranges
- For high-paying careers like software engineering, medicine: Be realistic about top performers
- Consider MEDIAN outcomes, not just top 1% success stories
- Factor in career risks, market saturation, economic realities

Specific Career Analysis for: {aspiration}

Research and provide conservative but fair estimates considering:
1. Typical starting salaries and realistic progression
2. Market saturation and competition
3. Economic factors and industry stability  
4. Geographic salary variations for {country}
5. Realistic savings rates and investment returns
6. Career longevity and retirement factors

For careers like:
- Farming: Modest income, high risk, variable returns
- Teaching: Stable but limited income growth
- Software Engineering: Good potential but market dependent
- Medicine: High earning but long training period
- Business: Highly variable, most fail

Respond with ONLY these numbers:
LIFETIME_NW: [realistic total lifetime net worth]
TEN_YEAR_NW: [realistic net worth after 10 years]

Be CONSERVATIVE. Most people don't become millionaires. Examples:
- Farmer: LIFETIME_NW: 400000, TEN_YEAR_NW: 80000
- Teacher: LIFETIME_NW: 800000, TEN_YEAR_NW: 120000  
- Software Engineer: LIFETIME_NW: 2500000, TEN_YEAR_NW: 400000
        """

        response = ai_service.generate_response(prompt, max_tokens=300, temperature=0.7)

        logger.info(f"Gemini Career Analysis Response: {response}")
        
        # Parse the response
        lifetime_match = re.search(r'LIFETIME_NW:\s*(\d+)', response)
        ten_year_match = re.search(r'TEN_YEAR_NW:\s*(\d+)', response)
        
        if lifetime_match and ten_year_match:
            lifetime_nw = float(lifetime_match.group(1))
            ten_year_nw = float(ten_year_match.group(1))
            
            # Validation and reality checks
            lifetime_nw, ten_year_nw = validate_wealth_estimates(aspiration, lifetime_nw, ten_year_nw)
            
            logger.info(f"Parsed AI estimates - Lifetime: ${lifetime_nw:,.0f}, 10-year: ${ten_year_nw:,.0f}")
            return lifetime_nw, ten_year_nw
        else:
            # Enhanced fallback parsing
            numbers = re.findall(r'\d+', content)
            if len(numbers) >= 2:
                lifetime_nw = float(numbers[0])
                ten_year_nw = float(numbers[1])
                
                # Apply validation
                lifetime_nw, ten_year_nw = validate_wealth_estimates(aspiration, lifetime_nw, ten_year_nw)
                
                logger.info(f"Fallback parsed estimates - Lifetime: ${lifetime_nw:,.0f}, 10-year: ${ten_year_nw:,.0f}")
                return lifetime_nw, ten_year_nw
            
    except Exception as e:
        logger.error(f"Error in AI career wealth estimation: {e}")
        # Force Gemini retry with simpler prompt
        try:
            simple_prompt = f"Estimate lifetime net worth for {aspiration} in {country}. Respond with just a number."
            response = ai_service.generate_response(simple_prompt, max_tokens=50, temperature=0.5)
            numbers = re.findall(r'\d+', response)
            if numbers:
                lifetime_estimate = float(numbers[0])
                return lifetime_estimate, lifetime_estimate * 0.2  # 10-year as 20% of lifetime
        except:
            pass
    
    # Only use fallback if ALL AI attempts fail
    logger.warning(f"All AI attempts failed for {aspiration} in {country}, using emergency fallback")
    return 3000000.0, 600000.0

async def get_success_probability(user_data: UserInput, college_tier: str, college_rank: int) -> tuple[float, str]:
    """
    Step 2: AI-powered assessment of user's probability of achieving their specific aspiration
    Returns: (probability, reasoning)
    """
    try:
        # Enhanced prompt with more specific context
        prompt = f"""
        You are an expert career counselor and success probability analyst. Assess this person's likelihood of achieving their specific career goals.

        PROFILE ANALYSIS:
        - Name: {user_data.name}
        - Age: {user_data.age} years old
        - Country: {user_data.country}
        - University: {user_data.college}
        - University Tier: {college_tier} (Global Rank ~{college_rank})
        - Career Aspiration: {user_data.aspiration}

        ASSESSMENT FACTORS:
        1. Educational Match: How well does their university prepare students for {user_data.aspiration}?
        2. Market Demand: Current and future job market for {user_data.aspiration} in {user_data.country}
        3. Age Factor: At {user_data.age}, what are their timing advantages/disadvantages?
        4. University Advantage: How does {user_data.college} (tier {college_tier}) help in {user_data.aspiration}?
        5. Geographic Opportunity: Career prospects for {user_data.aspiration} in {user_data.country}

        Be specific about THIS exact combination of person, university, and career goal.

        Respond in this EXACT format:
        PROBABILITY: [decimal between 0.1 and 0.95]
        REASONING: [One compelling sentence explaining their unique advantages and pathway to success]

        Example:
        PROBABILITY: 0.78
        REASONING: Your computer science foundation at IIT combined with India's booming tech sector positions you perfectly for software engineering success.

        Focus on their specific strengths and realistic pathways. Be encouraging but honest.
        """

        response = ai_service.generate_response(prompt, max_tokens=150, temperature=0.6)

        logger.info(f"Groq Probability Analysis Response: {response[:200]}...")  # Truncate log
        
        # Parse the response
        prob_match = re.search(r'PROBABILITY:\s*([\d.]+)', response)
        reason_match = re.search(r'REASONING:\s*(.+)', response, re.DOTALL)
        
        if prob_match and reason_match:
            probability = float(prob_match.group(1))
            reasoning = reason_match.group(1).strip()
            
            # Ensure probability is in valid range
            probability = max(0.1, min(0.95, probability))
            
            logger.info(f"Parsed AI probability: {probability:.2f}")
            return probability, reasoning
        
        # Fallback parsing attempt
        numbers = re.findall(r'0\.\d+|\d+\.\d+', content)
        if numbers:
            probability = float(numbers[0])
            probability = max(0.1, min(0.95, probability))
            reasoning = f"Based on your profile at {user_data.college}, you have strong potential in {user_data.aspiration}."
            return probability, reasoning
        
    except Exception as e:
        logger.error(f"Error in AI probability assessment: {e}")
        # Try simpler AI prompt
        try:
            simple_prompt = f"What's the success probability (0.1-0.9) for {user_data.aspiration} from {user_data.college}? Just give a number."
            response = ai_service.generate_response(simple_prompt, max_tokens=20, temperature=0.3)
            numbers = re.findall(r'0\.\d+', response)
            if numbers:
                probability = float(numbers[0])
                reasoning = f"Your educational foundation provides a solid pathway to success in {user_data.aspiration}."
                return max(0.1, min(0.95, probability)), reasoning
        except:
            pass
    
    # Enhanced fallback based on college tier and age
    tier_probabilities = {
        'S+': 0.85, 'S': 0.75, 'A+': 0.65, 'A': 0.55, 
        'B+': 0.45, 'B': 0.35, 'C': 0.25
    }
    
    base_prob = tier_probabilities.get(college_tier, 0.4)
    
    # Age adjustment
    if user_data.age <= 22:
        base_prob += 0.05  # Young advantage
    elif user_data.age >= 30:
        base_prob -= 0.05  # Slight disadvantage
    
    base_prob = max(0.1, min(0.95, base_prob))
    
    fallback_reason = f"Your foundation at {user_data.college} combined with your {user_data.age}-year-old perspective creates meaningful opportunities in {user_data.aspiration}."
    
    logger.warning(f"Using enhanced fallback probability: {base_prob:.2f}")
    return base_prob, fallback_reason

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/api/health", response_model=HealthCheckResponse)
async def health_check():
    """Health check endpoint"""
    return HealthCheckResponse(
        status="healthy",
        message="🔮 The Oracle is awake and ready to reveal destinies",
        version="1.0.0"
    )

@app.get("/api/test-ai")
async def test_ai():
    """Test endpoint to verify Groq AI is working"""
    try:
        logger.info("🧪 Testing Groq AI connectivity...")
        
        test_result = await ai_service.test_connection()
        
        import time
        return {
            "status": test_result["status"],
            "message": test_result["message"],
            "ai_response": test_result.get("ai_response", ""),
            "timestamp": time.time(),
            "model": os.getenv("MODEL_NAME", "llama-3.1-8b-instant"),
            "api_key_present": bool(os.getenv("GROQ_API_KEY"))
        }
        
    except Exception as e:
        logger.error(f"❌ Groq AI test failed: {e}")
        return {
            "status": "error", 
            "message": f"❌ Groq AI connection failed: {str(e)}",
            "api_key_present": bool(os.getenv("GROQ_API_KEY"))
        }

@app.post("/api/predict", response_model=PredictionResponse)
async def predict_destiny(user_input: UserInput, request: Request):
    """
    🔮 The main Oracle endpoint - predicts financial destiny
    
    This endpoint orchestrates the complete AI analysis process:
    1. Validates user input
    2. Looks up university tier/ranking
    3. Gets AI career wealth estimates  
    4. Assesses personal success probability
    5. Calculates final "Fated Net Worth"
    6. Determines wealth percentile ranking
    """
    try:
        logger.info(f"Processing destiny prediction for {user_input.name}")
        
        # Step 1: University Analysis
        college_tier, college_rank = await find_university_tier(user_input.college)
        logger.info(f"University tier: {college_tier}, rank: {college_rank}")
        
        # Step 2: ENHANCED AI Career Wealth Estimation (First LLM Call)
        logger.info("🚀 CALLING GROQ for career wealth estimation...")
        lifetime_nw, ten_year_nw = RobustCareerAnalyzer.get_brutal_career_estimate(
            user_input.aspiration, 
            user_input.country
        )
        logger.info(f"✅ Groq Career estimates - Lifetime: ${lifetime_nw:,.0f}, 10-year: ${ten_year_nw:,.0f}")
        
        # Step 3: ENHANCED AI Personal Success Probability (Second LLM Call)
        logger.info("🚀 CALLING GROQ for success probability assessment...")
        probability, reasoning = await get_success_probability(
            user_input, college_tier, college_rank
        )
        logger.info(f"✅ Groq Success probability: {probability:.2f} - {reasoning}")
        
        # Step 4: FINAL AI REASONING ENHANCEMENT (Third LLM Call)
        logger.info("🚀 CALLING GROQ for final reasoning enhancement...")
        enhanced_reasoning = await get_enhanced_reasoning(
            user_input, college_tier, lifetime_nw, ten_year_nw, probability, reasoning
        )
        logger.info(f"✅ Groq Enhanced reasoning: {enhanced_reasoning}")
        
        # Step 4: Final Calculation (DO NOT multiply by probability - that's success chance, not income reduction)
        final_lifetime_nw = lifetime_nw
        final_ten_year_nw = ten_year_nw
        
        # Step 5: Wealth Percentile Ranking
        rank_band = calculate_wealth_percentile(final_lifetime_nw, user_input.country)
        
        # Step 6: Oracle Confidence
        oracle_confidence = get_oracle_confidence(probability)
        
        logger.info(f"Final prediction - Lifetime: ${final_lifetime_nw:,.0f}, Rank: {rank_band}")
        
        # Create response object
        prediction_response = PredictionResponse(
            predicted_lifetime_nw=final_lifetime_nw,
            predicted_10_year_nw=final_ten_year_nw,
            rank_band=rank_band,
            reasoning=enhanced_reasoning,
            college_tier=college_tier,
            probability_score=probability,
            oracle_confidence=oracle_confidence
        )
        
        # Save to database (async, don't wait for completion)
        try:
            # Get client info for tracking
            client_ip = request.client.host if request.client else "unknown"
            user_agent = request.headers.get("user-agent", "unknown")
            
            # Prepare data for database
            user_data_dict = {
                "name": user_input.name,
                "age": user_input.age,
                "university": user_input.university,
                "aspiration": user_input.aspiration,
                "country": user_input.country,
                "session_id": f"{client_ip}_{user_input.name}_{user_input.age}",
                "ip_address": client_ip,
                "user_agent": user_agent
            }
            
            prediction_data_dict = {
                "predicted_lifetime_nw": final_lifetime_nw,
                "predicted_10_year_nw": final_ten_year_nw,
                "rank_band": rank_band,
                "reasoning": enhanced_reasoning,
                "college_tier": college_tier,
                "college_rank": college_rank,
                "success_probability": probability,
                "oracle_confidence": oracle_confidence
            }
            
            # Save to database (fire and forget)
            asyncio.create_task(
                database_service.save_prediction(user_data_dict, prediction_data_dict)
            )
            
        except Exception as db_error:
            logger.warning(f"⚠️ Database save failed (continuing without saving): {db_error}")
        
        return prediction_response
        
    except Exception as e:
        logger.error(f"Error processing prediction: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"🔮 The Oracle encountered a disturbance in the cosmic forces: {str(e)}"
        )

@app.get("/api/universities")
async def list_universities():
    """Get list of supported universities for autocomplete"""
    if university_data.empty:
        return {"universities": []}
    
    universities = university_data['university_name'].tolist()[:100]  # Limit to first 100
    return {"universities": universities}

@app.get("/api/stats")
async def get_database_stats():
    """Get database statistics and insights"""
    try:
        stats = await database_service.get_prediction_stats()
        return stats
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        return {"error": "Unable to fetch statistics"}

@app.get("/api/recent-predictions")
async def get_recent_predictions(limit: int = 20):
    """Get recent predictions (anonymized)"""
    try:
        predictions = await database_service.get_recent_predictions(limit)
        return {"predictions": predictions}
    except Exception as e:
        logger.error(f"Error getting recent predictions: {e}")
        return {"predictions": []}

@app.get("/api/careers")
async def list_careers():
    """Get list of sample careers for suggestions"""
    if not wealth_data or 'career_base_estimates' not in wealth_data:
        return {"careers": ["Software Engineer", "Data Scientist", "Doctor", "Lawyer"]}
    
    careers = list(wealth_data['career_base_estimates'].keys())
    return {"careers": careers}

# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"detail": f"🔮 The Oracle requires valid inputs: {str(exc)}"}
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

# ============================================================================
# MAIN APPLICATION
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )
