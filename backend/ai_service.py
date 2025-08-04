"""
🤖 UNIFIED AI SERVICE - Google Gemini Integration
Handles all AI interactions using Google Gemini API
"""
import google.generativeai as genai
import os
import logging
from typing import Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

class AIService:
    """Unified AI service using Google Gemini"""
    
    def __init__(self):
        """Initialize the AI service with Gemini"""
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # Configure Gemini
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        logger.info("✅ Google Gemini AI service initialized successfully")
    
    def generate_response(self, prompt: str, max_tokens: int = 1500, temperature: float = 0.7) -> str:
        """
        Generate AI response using Google Gemini
        
        Args:
            prompt: The input prompt
            max_tokens: Maximum tokens to generate
            temperature: Temperature for response generation
            
        Returns:
            Generated response text
        """
        try:
            # Configure generation parameters
            generation_config = genai.types.GenerationConfig(
                max_output_tokens=max_tokens,
                temperature=temperature,
                top_p=0.95,
                top_k=40
            )
            
            # Generate response
            response = self.model.generate_content(
                prompt,
                generation_config=generation_config
            )
            
            if response.text:
                logger.info(f"✅ Gemini response generated successfully (length: {len(response.text)})")
                return response.text.strip()
            else:
                raise Exception("Empty response from Gemini")
                
        except Exception as e:
            logger.error(f"❌ Gemini API error: {e}")
            raise Exception(f"AI generation failed: {str(e)}")
    
    def test_connection(self) -> Dict[str, Any]:
        """Test the Gemini API connection"""
        try:
            test_prompt = "Respond with exactly: Gemini is working! Current timestamp and a random number."
            response = self.generate_response(test_prompt, max_tokens=50)
            
            import time
            return {
                "status": "success",
                "message": "✅ Google Gemini is connected and working!",
                "ai_response": response,
                "timestamp": time.time(),
                "provider": "google-gemini",
                "model": "gemini-1.5-flash"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": f"❌ Gemini connection failed: {str(e)}",
                "provider": "google-gemini"
            }

# Global AI service instance
ai_service = AIService()
