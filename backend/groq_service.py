"""
🚀 Groq AI Service    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = os.getenv("MODEL_NAME", "llama-3.1-8b-instant")
        
        if not self.api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        logger.info(f"🚀 Groq service initialized with model: {self.model}")LLM inference with high limits

This service provides:
- 30 requests/minute, 14,400 requests/day (FREE)
- Lightning-fast inference (10x faster than OpenAI)
- Llama 3.1 70B model support
- OpenAI-compatible API format
"""

import os
import json
import logging
import requests
from typing import Optional, Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class GroqService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = os.getenv("MODEL_NAME", "llama3-70b-8192")
        
        if not self.api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        logger.info(f"🚀 Groq service initialized with model: {self.model}")
    
    def generate_response(
        self, 
        prompt: str, 
        max_tokens: int = 200, 
        temperature: float = 0.7,
        model: Optional[str] = None
    ) -> str:
        """
        Generate AI response using Groq API
        
        Args:
            prompt: The input prompt
            max_tokens: Maximum tokens to generate (default: 200)
            temperature: Response creativity (0.0-2.0, default: 0.7)
            model: Override default model
            
        Returns:
            Generated text response
        """
        try:
            # Prepare the request payload
            payload = {
                "model": model or self.model,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "max_tokens": max_tokens,
                "temperature": temperature,
                "top_p": 1,
                "stop": None,
                "stream": False
            }
            
            logger.info(f"🤖 Groq request: {self.model}, max_tokens={max_tokens}, temp={temperature}")
            
            # Make the API request
            response = requests.post(
                self.base_url,
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            # Check for HTTP errors
            response.raise_for_status()
            
            # Parse the response
            result = response.json()
            
            if "choices" not in result or len(result["choices"]) == 0:
                raise Exception(f"Invalid response format: {result}")
            
            generated_text = result["choices"][0]["message"]["content"].strip()
            
            # Log successful response
            usage = result.get("usage", {})
            prompt_tokens = usage.get("prompt_tokens", 0)
            completion_tokens = usage.get("completion_tokens", 0)
            
            logger.info(f"✅ Groq response generated successfully")
            logger.info(f"📊 Tokens used: {prompt_tokens} prompt + {completion_tokens} completion = {prompt_tokens + completion_tokens} total")
            
            return generated_text
            
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Groq API request failed: {e}")
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_detail = e.response.json()
                    logger.error(f"Error details: {error_detail}")
                except:
                    logger.error(f"Raw error response: {e.response.text}")
            raise Exception(f"Groq API request failed: {str(e)}")
            
        except Exception as e:
            logger.error(f"❌ Groq service error: {e}")
            raise Exception(f"Groq service error: {str(e)}")
    
    async def test_connection(self) -> Dict[str, Any]:
        """
        Test the Groq API connection
        
        Returns:
            Dictionary with test results
        """
        try:
            test_prompt = "Respond with exactly: Groq AI is working! Current timestamp and a random number."
            
            response = self.generate_response(
                prompt=test_prompt,
                max_tokens=50,
                temperature=0.7
            )
            
            return {
                "status": "success",
                "message": "✅ Groq AI is connected and working!",
                "ai_response": response,
                "model": self.model,
                "api_key_present": bool(self.api_key)
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": f"❌ Groq AI connection failed: {str(e)}",
                "api_key_present": bool(self.api_key)
            }
    
    def get_available_models(self) -> list:
        """
        Get list of available Groq models
        
        Returns:
            List of available model names
        """
        try:
            models_url = "https://api.groq.com/openai/v1/models"
            response = requests.get(models_url, headers=self.headers)
            response.raise_for_status()
            
            models_data = response.json()
            return [model["id"] for model in models_data.get("data", [])]
            
        except Exception as e:
            logger.error(f"❌ Failed to fetch Groq models: {e}")
            return [
                "llama3-70b-8192",
                "llama3-8b-8192", 
                "mixtral-8x7b-32768",
                "gemma-7b-it"
            ]

# Global service instance
groq_service = GroqService()

# Backward compatibility alias
ai_service = groq_service
