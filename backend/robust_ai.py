"""
BULLETPROOF AI PREDICTION SYSTEM
This module contains extremely robust AI prediction logic with Groq AI integration
"""
import re
import logging
import os
from typing import Tuple
from dotenv import load_dotenv
from groq_service import groq_service as ai_service

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class RobustCareerAnalyzer:
    """Bulletproof career analysis with strict validation"""
    
    # EXTREMELY STRICT career income caps (lifetime, 10-year)
    CAREER_REALITY_CAPS = {
        # Manual/Service - Be BRUTAL about low-income careers
        'farm': (400000, 70000),
        'farmer': (400000, 70000),
        'farming': (400000, 70000),
        'agriculture': (450000, 80000),
        'labor': (350000, 60000),
        'laborer': (350000, 60000),
        'clean': (300000, 50000),
        'cleaner': (300000, 50000),
        'janitor': (300000, 50000),
        'driver': (400000, 70000),
        'security': (350000, 60000),
        'guard': (350000, 60000),
        'cashier': (300000, 50000),
        'waiter': (350000, 60000),
        'server': (350000, 60000),
        'cook': (400000, 70000),
        'chef': (500000, 90000),
        'retail': (400000, 70000),
        'sales associate': (400000, 70000),
        'maid': (250000, 40000),
        'helper': (300000, 50000),
        'assistant': (500000, 80000),
        
        # Service/Government - Modest but stable
        'teacher': (800000, 130000),
        'teaching': (800000, 130000),
        'police': (900000, 150000),
        'firefighter': (850000, 140000),
        'nurse': (1000000, 160000),
        'nursing': (1000000, 160000),
        'clerk': (600000, 100000),
        'receptionist': (500000, 80000),
        'social worker': (700000, 120000),
        'librarian': (650000, 110000),
        
        # Skilled trades - Better but capped
        'electrician': (800000, 130000),
        'plumber': (750000, 125000),
        'mechanic': (700000, 120000),
        'technician': (800000, 130000),
        'carpenter': (700000, 120000),
        'welder': (650000, 110000),
        
        # Professional - Realistic professional caps
        'engineer': (1800000, 300000),
        'engineering': (1800000, 300000),
        'accountant': (1200000, 200000),
        'accounting': (1200000, 200000),
        'manager': (1500000, 250000),
        'management': (1500000, 250000),
        'analyst': (1400000, 230000),
        'designer': (1200000, 200000),
        'marketing': (1300000, 220000),
        'sales manager': (1500000, 250000),
        'hr': (1100000, 180000),
        'project manager': (1400000, 230000),
        
        # High Professional - Still realistic
        'doctor': (3000000, 450000),
        'physician': (3000000, 450000),
        'lawyer': (2500000, 400000),
        'attorney': (2500000, 400000),
        'software engineer': (2200000, 350000),
        'software developer': (2200000, 350000),
        'programmer': (1800000, 300000),
        'consultant': (2000000, 320000),
        'finance': (2500000, 400000),
        'financial advisor': (1800000, 300000),
        'investment': (3000000, 480000),
        'architect': (1800000, 300000),
        'pharmacist': (2200000, 350000),
        'dentist': (2800000, 420000),
        
        # AI/Tech/Data Science - High potential
        'ai scientist': (3500000, 500000),
        'ai engineer': (2800000, 420000),
        'data scientist': (2500000, 380000),
        'machine learning': (2800000, 420000),
        'ml engineer': (2800000, 420000),
        'research scientist': (3200000, 480000),
        'computer scientist': (2600000, 400000),
        'openai': (3500000, 500000),
        'ai researcher': (3200000, 480000),
        
        # Business/Entrepreneurship - HIGHLY variable
        'entrepreneur': (1000000, 150000),  # Most fail, be realistic
        'business owner': (800000, 130000),  # Most small businesses struggle
        'startup': (500000, 80000),  # Most startups fail
        'ceo': (5000000, 800000),  # Only if proven track record
    }
    
    @staticmethod
    def get_brutal_career_estimate(aspiration: str, country: str) -> Tuple[float, float]:
        """Get INTELLIGENT and NUANCED career estimates with heavy OpenAI integration"""
        
        logger.info(f"🚀 USING GROQ for career analysis: {aspiration} in {country}")
        
        # PRIMARY METHOD: Advanced Groq Analysis with STRICT FORMAT
        try:
            prompt = f"""You are an expert career analyst. Provide REALISTIC financial projections for a {aspiration} in {country}.

IMPORTANT: 
- Respond with EXACT format below
- All amounts in USD only (convert from local currency if needed)
- Be realistic but optimistic
- Consider full career span (40 years) and investment growth

Career: {aspiration}
Location: {country}

Analysis factors:
- Current market demand and salary ranges
- Career progression over 40 years
- Investment and savings potential (assume 15% annual return on investments)
- Regional economic factors and opportunities
- Modern career opportunities (remote work, consulting, side businesses)

RESPOND WITH EXACTLY THIS FORMAT:

LIFETIME_NET_WORTH: [USD amount for total 40-year wealth including salary, investments, assets]
TEN_YEAR_NET_WORTH: [USD amount for realistic net worth after 10 years]
CONFIDENCE_LEVEL: High/Medium/Low
REASONING: [One sentence explanation]

EXAMPLES:
- Software Engineer in India: LIFETIME_NET_WORTH: 2500000, TEN_YEAR_NET_WORTH: 400000
- Doctor in USA: LIFETIME_NET_WORTH: 4500000, TEN_YEAR_NET_WORTH: 600000
- Teacher in India: LIFETIME_NET_WORTH: 800000, TEN_YEAR_NET_WORTH: 120000

Be SMART and REALISTIC. Consider {aspiration} specifically in {country}."""

            response = ai_service.generate_response(prompt, max_tokens=200, temperature=0.6)
            
            logger.info(f"🎯 Groq Response: {response[:500]}...")  # Truncate log output
            
            # Enhanced parsing with multiple patterns
            lifetime_patterns = [
                r'LIFETIME_NET_WORTH:\s*\$?(\d{1,3}(?:,?\d{3})*)',
                r'LIFETIME[_\s]*NET[_\s]*WORTH:\s*\$?(\d{1,3}(?:,?\d{3})*)',
                r'Lifetime.*?(\d{1,3}(?:,?\d{3})*)',
                r'Total.*?(\d{1,3}(?:,?\d{3})*)'
            ]
            
            ten_year_patterns = [
                r'TEN_YEAR_NET_WORTH:\s*\$?(\d{1,3}(?:,?\d{3})*)',
                r'TEN[_\s]*YEAR[_\s]*NET[_\s]*WORTH:\s*\$?(\d{1,3}(?:,?\d{3})*)',
                r'10[_\s]*year.*?(\d{1,3}(?:,?\d{3})*)',
                r'ten[_\s]*year.*?(\d{1,3}(?:,?\d{3})*)'
            ]
            
            lifetime_nw = None
            ten_year_nw = None
            
            # Try multiple patterns for lifetime
            for pattern in lifetime_patterns:
                match = re.search(pattern, response, re.IGNORECASE)
                if match:
                    lifetime_nw = float(match.group(1).replace(',', ''))
                    break
            
            # Try multiple patterns for ten-year
            for pattern in ten_year_patterns:
                match = re.search(pattern, response, re.IGNORECASE)
                if match:
                    ten_year_nw = float(match.group(1).replace(',', ''))
                    break
            
            if lifetime_nw and ten_year_nw:
                # Intelligent validation and adjustment
                lifetime_nw, ten_year_nw = RobustCareerAnalyzer._intelligent_validation(
                    aspiration, country, lifetime_nw, ten_year_nw
                )
                
                logger.info(f"✅ Groq Analysis Complete - Lifetime: ${lifetime_nw:,.0f}, 10-year: ${ten_year_nw:,.0f}")
                return lifetime_nw, ten_year_nw
            
            # Fallback: Extract any large numbers from response
            all_numbers = re.findall(r'\b(\d{1,3}(?:,?\d{3})*)\b', response)
            large_numbers = [float(n.replace(',', '')) for n in all_numbers if float(n.replace(',', '')) > 10000]
            
            if len(large_numbers) >= 2:
                # Sort and take the largest two as lifetime and ten-year
                large_numbers.sort(reverse=True)
                lifetime_nw = large_numbers[0]
                ten_year_nw = min(large_numbers[1], lifetime_nw * 0.4)  # Ten-year shouldn't exceed 40% of lifetime
                
                lifetime_nw, ten_year_nw = RobustCareerAnalyzer._intelligent_validation(
                    aspiration, country, lifetime_nw, ten_year_nw
                )
                
                logger.info(f"✅ Fallback Parse Success - Lifetime: ${lifetime_nw:,.0f}, 10-year: ${ten_year_nw:,.0f}")
                return lifetime_nw, ten_year_nw
        
        except Exception as e:
            logger.error(f"❌ Primary Groq analysis failed: {e}")
        
        # SECONDARY METHOD: Ultra-Simple Groq Query
        try:
            simple_prompt = f"""Estimate realistic net worth for {aspiration} in {country} (amounts in USD only):

Career: {aspiration}
Location: {country}

Consider average salaries, investment growth, and career progression.

Respond ONLY with numbers:
Lifetime (40-year career): [USD number]
10-year mark: [USD number]

Example format:
Lifetime: 1800000
10-year: 280000"""

            response = ai_service.generate_response(simple_prompt, max_tokens=80, temperature=0.5)
            
            # Extract numbers more aggressively
            numbers = re.findall(r'\b(\d{6,})\b', response)  # Look for 6+ digit numbers
            
            if len(numbers) >= 2:
                lifetime_nw = float(numbers[0])
                ten_year_nw = float(numbers[1])
                
                # Ensure logical relationship
                if ten_year_nw > lifetime_nw:
                    lifetime_nw, ten_year_nw = ten_year_nw, lifetime_nw
                
                lifetime_nw, ten_year_nw = RobustCareerAnalyzer._intelligent_validation(
                    aspiration, country, lifetime_nw, ten_year_nw
                )
                
                logger.info(f"✅ Simple Groq Success - Lifetime: ${lifetime_nw:,.0f}, 10-year: ${ten_year_nw:,.0f}")
                return lifetime_nw, ten_year_nw
                
        except Exception as e:
            logger.error(f"❌ Secondary Groq analysis failed: {e}")
        
        # TERTIARY METHOD: Enhanced Intelligent Fallback
        logger.warning(f"🚨 Using enhanced intelligent fallback for {aspiration}")
        return RobustCareerAnalyzer._get_intelligent_fallback(aspiration, country)
    
    @staticmethod
    def _intelligent_validation(aspiration: str, country: str, lifetime_nw: float, ten_year_nw: float) -> Tuple[float, float]:
        """More flexible validation that considers context and nuance"""
        
        aspiration_lower = aspiration.lower().strip()
        
        # Flexible category-based validation (less strict than before)
        if any(keyword in aspiration_lower for keyword in ['farm', 'agriculture', 'labor', 'clean', 'driver', 'security', 'retail']):
            # Manual/Service careers - still conservative but allow for variation
            max_lifetime = 600000
            max_ten_year = 120000
        elif any(keyword in aspiration_lower for keyword in ['teacher', 'nurse', 'police', 'clerk', 'assistant']):
            # Service/Government - stable careers
            max_lifetime = 1200000
            max_ten_year = 200000
        elif any(keyword in aspiration_lower for keyword in ['engineer', 'accountant', 'manager', 'analyst', 'designer']):
            # Professional careers - good potential
            max_lifetime = 3000000
            max_ten_year = 500000
        elif any(keyword in aspiration_lower for keyword in ['doctor', 'lawyer', 'software', 'consultant', 'finance']):
            # High-paying professional careers
            max_lifetime = 5000000
            max_ten_year = 800000
        elif any(keyword in aspiration_lower for keyword in ['entrepreneur', 'business', 'startup', 'ceo']):
            # Business/Entrepreneurship - allow higher variance
            max_lifetime = 8000000
            max_ten_year = 1200000
        else:
            # Unknown career - moderate caps
            max_lifetime = 2500000
            max_ten_year = 400000
        
        # Apply country multipliers for economic differences
        country_multipliers = {
            'usa': 1.0, 'united states': 1.0, 'america': 1.0,
            'canada': 0.9, 'australia': 0.9, 'uk': 0.9, 'united kingdom': 0.9,
            'germany': 0.8, 'france': 0.8, 'japan': 0.8, 'singapore': 0.9,
            'india': 0.6, 'china': 0.5, 'brazil': 0.4, 'mexico': 0.4,  # Increased India for tech/AI careers
            'nigeria': 0.3, 'bangladesh': 0.3, 'pakistan': 0.3
        }
        
        multiplier = country_multipliers.get(country.lower(), 0.5)  # Default for unknown countries
        max_lifetime *= multiplier
        max_ten_year *= multiplier
        
        # Apply caps but be more flexible
        if lifetime_nw > max_lifetime:
            logger.info(f"Adjusting lifetime estimate for {aspiration} in {country}: ${lifetime_nw:,.0f} -> ${max_lifetime:,.0f}")
            lifetime_nw = max_lifetime
        
        if ten_year_nw > max_ten_year:
            logger.info(f"Adjusting 10-year estimate for {aspiration} in {country}: ${ten_year_nw:,.0f} -> ${max_ten_year:,.0f}")
            ten_year_nw = max_ten_year
        
        # Ensure logical relationship between 10-year and lifetime
        if ten_year_nw > lifetime_nw * 0.7:  # 10-year shouldn't be more than 70% of lifetime
            ten_year_nw = lifetime_nw * 0.4
            logger.info(f"Adjusting 10-year to be 40% of lifetime: ${ten_year_nw:,.0f}")
        
        # Minimum realistic values
        lifetime_nw = max(50000, lifetime_nw)
        ten_year_nw = max(10000, ten_year_nw)
        
        return lifetime_nw, ten_year_nw
    
    @staticmethod
    def _get_intelligent_fallback(aspiration: str, country: str) -> Tuple[float, float]:
        """Enhanced intelligent fallback with context awareness and AI career support"""
        
        aspiration_lower = aspiration.lower().strip()
        
        # Intelligent career categorization with AI/Tech focus
        if any(keyword in aspiration_lower for keyword in ['ai scientist', 'ai engineer', 'artificial intelligence', 'openai']):
            base_lifetime, base_ten_year = 3500000, 500000  # High-end AI careers
        elif any(keyword in aspiration_lower for keyword in ['data scientist', 'machine learning', 'ml engineer', 'ai researcher']):
            base_lifetime, base_ten_year = 2800000, 420000
        elif any(keyword in aspiration_lower for keyword in ['research scientist', 'computer scientist']):
            base_lifetime, base_ten_year = 3000000, 450000
        elif any(keyword in aspiration_lower for keyword in ['software', 'programmer', 'developer', 'tech']):
            base_lifetime, base_ten_year = 2200000, 380000
        elif any(keyword in aspiration_lower for keyword in ['engineer', 'technical']):
            base_lifetime, base_ten_year = 2000000, 350000
        elif any(keyword in aspiration_lower for keyword in ['doctor', 'physician']):
            base_lifetime, base_ten_year = 3200000, 500000
        elif any(keyword in aspiration_lower for keyword in ['lawyer', 'attorney']):
            base_lifetime, base_ten_year = 2800000, 450000
        elif any(keyword in aspiration_lower for keyword in ['finance', 'investment']):
            base_lifetime, base_ten_year = 2500000, 420000
        elif any(keyword in aspiration_lower for keyword in ['consultant', 'consulting']):
            base_lifetime, base_ten_year = 2300000, 400000
        elif any(keyword in aspiration_lower for keyword in ['teacher', 'education']):
            base_lifetime, base_ten_year = 900000, 150000
        elif any(keyword in aspiration_lower for keyword in ['nurse', 'healthcare']):
            base_lifetime, base_ten_year = 1100000, 180000
        elif any(keyword in aspiration_lower for keyword in ['business', 'entrepreneur']):
            base_lifetime, base_ten_year = 1500000, 250000  # Conservative for most business ventures
        elif any(keyword in aspiration_lower for keyword in ['farm', 'agriculture']):
            base_lifetime, base_ten_year = 500000, 80000
        else:
            # Unknown career - moderate estimate
            base_lifetime, base_ten_year = 1200000, 200000
        
        # Apply country economic factor
        country_multipliers = {
            'usa': 1.0, 'united states': 1.0, 'america': 1.0,
            'canada': 0.9, 'australia': 0.9, 'uk': 0.9, 'united kingdom': 0.9,
            'germany': 0.8, 'france': 0.8, 'japan': 0.8, 'singapore': 0.9,
            'india': 0.6, 'china': 0.5, 'brazil': 0.4, 'mexico': 0.4  # Increased India multiplier for tech/AI
        }
        
        multiplier = country_multipliers.get(country.lower(), 0.5)
        
        final_lifetime = base_lifetime * multiplier
        final_ten_year = base_ten_year * multiplier
        
        logger.info(f"💡 Intelligent fallback for {aspiration} in {country}: Lifetime ${final_lifetime:,.0f}, 10-year ${final_ten_year:,.0f}")
        
        return final_lifetime, final_ten_year


class RobustUniversityAnalyzer:
    """Bulletproof university analysis"""
    
    @staticmethod
    def get_strict_university_assessment(university_name: str) -> Tuple[str, int]:
        """Get STRICT university assessment - most universities are NOT elite"""
        
        prompt = f"""You are a STRICT university ranking expert. Be CONSERVATIVE and REALISTIC.

University: {university_name}

STRICT CLASSIFICATION (95% of universities are B, C tier):
- S+ (Top 0.1% - Only ~20 universities): Harvard, MIT, Stanford, Oxford, Cambridge, IIT Bombay
- S (Top 1% - Only ~100 universities): Other Ivies, top state schools like UC Berkeley, UCLA
- A+ (Top 5% - Only ~500 universities): Good regional leaders, top NITs, known state schools
- A (Top 15%): Decent universities with some reputation
- B+ (Top 30%): Average universities, most state schools
- B (Top 60%): Below average universities, most private colleges  
- C (Bottom 40%): Local colleges, unknown institutions, community colleges

CRITICAL RULES:
1. If you don't immediately recognize the university as world-famous, it's probably B or C
2. Most Indian universities outside top IITs/IIMs are B or C tier
3. Most private colleges are B or C tier
4. Unknown/regional universities are automatically C tier
5. Only rate S+/S if it's globally famous like Harvard/MIT level

OUTPUT FORMAT:
TIER: [S+/S/A+/A/B+/B/C]
SCORE: [number 0-100, where 100=Harvard, 85=good state school, 60=average, 40=below average]"""

        try:
            response = groq_service.generate_response(prompt, max_tokens=100)
            content = response
            logger.info(f"AI University Assessment: {content}")
            
            # Parse tier and score
            tier_match = re.search(r'TIER:\s*([A-Z+]+)', content)
            score_match = re.search(r'SCORE:\s*(\d+)', content)
            
            if tier_match and score_match:
                tier = tier_match.group(1)
                score = int(score_match.group(1))
                return tier, min(score, 95)  # Cap at 95 for realism
            
            # Fallback parsing
            if 'S+' in content or 'S tier' in content:
                return 'S+', 95
            elif 'S' in content:
                return 'S', 88
            elif 'A+' in content:
                return 'A+', 78
            elif 'A' in content:
                return 'A', 68
            elif 'B+' in content:
                return 'B+', 58
            elif 'B' in content:
                return 'B', 48
            else:
                return 'C', 35
        
        except Exception as e:
            logger.error(f"OpenAI university analysis failed: {e}")
        
        # Fallback static analysis
        return RobustUniversityAnalyzer._get_fallback_university_rating(university_name)
    
    @staticmethod
    def _get_fallback_university_rating(university_name: str) -> Tuple[str, int]:
        """Conservative fallback university ratings"""
        
        name_lower = university_name.lower().strip()
        
        # Elite tier (S+)
        elite_unis = [
            'harvard', 'mit', 'stanford', 'yale', 'princeton', 'oxford', 'cambridge',
            'iit bombay', 'iit delhi', 'iit madras', 'iit kanpur', 'iit kharagpur'
        ]
        
        # Top tier (S)
        top_unis = [
            'columbia', 'brown', 'cornell', 'dartmouth', 'upenn', 'berkeley', 'ucla',
            'university of chicago', 'northwestern', 'duke', 'johns hopkins',
            'iit roorkee', 'iit guwahati', 'iisc bangalore', 'iim ahmedabad', 'iim bangalore'
        ]
        
        # Good tier (A+)
        good_unis = [
            'university of michigan', 'georgia tech', 'carnegie mellon', 'virginia tech',
            'nit trichy', 'nit warangal', 'nit surathkal', 'bits pilani', 'dtu', 'nsit'
        ]
        
        # Check against known universities
        for elite in elite_unis:
            if elite in name_lower:
                return 'S+', 92
        
        for top in top_unis:
            if top in name_lower:
                return 'S', 85
        
        for good in good_unis:
            if good in name_lower:
                return 'A+', 75
        
        # Unknown/local universities get low ratings
        if any(word in name_lower for word in ['institute', 'college', 'university']):
            return 'B', 45  # Most unknown institutions are below average
        
        return 'C', 35  # Very conservative default
