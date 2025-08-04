/**
 * 🔮 Destiny Engine - Main Application
 */

import React, { useState, useEffect, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// Components
import CrystalBallScene, { SceneLoader } from './components/CrystalBallScene';
import QuestionOverlay from './components/QuestionOverlay';
import ProcessingOverlay from './components/ProcessingOverlay';
import ResultsOverlay from './components/ResultsOverlay';

// Hooks and Types
import { useApi } from './hooks/useApi';
import { UserInput, PredictionResponse, AppState, ShareData } from './types';

// Global cosmic styles
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    padding: 0;
    background: radial-gradient(ellipse at center, #2b1055 0%, #12051e 100%);
    overflow: hidden;
    font-family: 'Inter', 'Arial', sans-serif;
    color: white;
  }
`;

// Animations
const twinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
`;

const fadeInGlow = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px) scale(0.9); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0px) scale(1); 
  }
`;

const AppContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at center, #2b1055 0%, #12051e 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Cosmic starfield
const Starfield = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 2px;
    height: 2px;
    background: white;
    border-radius: 50%;
    animation: ${twinkle} 4s infinite ease-in-out;
    box-shadow: 
      100px 150px #fff, 200px 300px #fff, 350px 100px #fff, 450px 250px #fff,
      550px 350px #fff, 150px 450px #fff, 750px 200px #fff, 850px 400px #fff,
      950px 100px #fff, 50px 500px #fff, 1150px 300px #fff, 1250px 150px #fff,
      1350px 450px #fff, 250px 50px #fff, 650px 50px #fff, 1050px 500px #fff;
  }
  
  &::after {
    animation-delay: 2s;
    opacity: 0.7;
    box-shadow: 
      120px 170px #fff, 220px 320px #fff, 370px 120px #fff, 470px 270px #fff,
      570px 370px #fff, 170px 470px #fff, 770px 220px #fff, 870px 420px #fff,
      970px 120px #fff, 70px 520px #fff, 1170px 320px #fff, 1270px 170px #fff;
  }
`;

const CrystalBallContainer = styled.div`
  position: relative;
  z-index: 10;
  animation: ${float} 6s ease-in-out infinite;
`;

const InitialGreeting = styled.div<{ $isVisible: boolean; $isClickable: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  text-align: center;
  transition: all 1s ease-out;
  opacity: ${props => props.$isVisible ? 1 : 0};
  pointer-events: ${props => props.$isClickable ? 'all' : 'none'};
  cursor: ${props => props.$isClickable ? 'pointer' : 'default'};
  user-select: none;
  animation: ${props => props.$isVisible ? fadeInGlow : 'none'} 2s ease-out;

  &:hover {
    transform: translate(-50%, -50%) scale(${props => props.$isClickable ? 1.05 : 1});
    transition: transform 0.3s ease;
  }
`;

const WelcomeText = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: 3rem;
  font-weight: 300;
  color: white;
  letter-spacing: 3px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    letter-spacing: 2px;
  }
`;

const SubtleHint = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 20px;
  letter-spacing: 1px;
  opacity: 0;
  animation: ${fadeInGlow} 2s ease-out 1s forwards;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

// Error boundary
const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <AppContainer>
    <div style={{ textAlign: 'center', color: 'white', padding: '20px' }}>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
    </div>
  </AppContainer>
);

// Main App Component
const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('greeting');
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingClickable, setGreetingClickable] = useState(false);
  const [userData, setUserData] = useState<UserInput>({
    name: '',
    age: 18,
    country: '',
    college: '',
    aspiration: ''
  });

  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);

  // Show greeting after delay
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowGreeting(true);
    }, 2000);

    const timer2 = setTimeout(() => {
      setGreetingClickable(true);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleBeginJourney = () => {
    if (!greetingClickable) return;
    
    setShowGreeting(false);
    setTimeout(() => {
      setAppState('asking');
    }, 1000);
  };

  const handleQuestionsComplete = async (data: UserInput) => {
    setUserData(data);
    setAppState('processing');
    
    // Start the API call while processing animation runs
    try {
      const response = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      setPredictionResult(result);
    } catch (err) {
      console.error('Prediction failed:', err);
      // Handle error state
    }
  };

  const handleProcessingComplete = () => {
    // This is called when the processing animation finishes
    setAppState('revealed');
  };

  const handleRestart = () => {
    setAppState('greeting');
    setUserData({
      name: '',
      age: 18,
      country: '',
      college: '',
      aspiration: ''
    });
    setPredictionResult(null);
    setShowGreeting(false);
    setGreetingClickable(false);

    // Restart the greeting sequence
    setTimeout(() => {
      setShowGreeting(true);
    }, 1000);
    
    setTimeout(() => {
      setGreetingClickable(true);
    }, 3000);
  };

  const handleShare = (shareData: ShareData) => {
    // Handle social sharing
    console.log('Share data:', shareData);
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <GlobalStyle />
      <AppContainer>
        <Starfield />
        
        <CrystalBallContainer>
          <Suspense fallback={<SceneLoader />}>
            <CrystalBallScene 
              state={appState}
            />
          </Suspense>
        </CrystalBallContainer>

        {appState === 'greeting' && (
          <InitialGreeting 
            $isVisible={showGreeting}
            $isClickable={greetingClickable}
            onClick={handleBeginJourney}
          >
            <WelcomeText>Peer into your future</WelcomeText>
            {greetingClickable && (
              <SubtleHint>Click to begin your journey</SubtleHint>
            )}
          </InitialGreeting>
        )}

        {appState === 'asking' && (
          <QuestionOverlay 
            onComplete={handleQuestionsComplete}
            onClose={() => setAppState('greeting')}
          />
        )}

        {appState === 'processing' && (
          <ProcessingOverlay 
            isVisible={true}
            onComplete={handleProcessingComplete}
          />
        )}

        {appState === 'revealed' && predictionResult && (
          <ResultsOverlay 
            isVisible={true}
            prediction={predictionResult}
            userData={{
              name: userData.name,
              netWorth: predictionResult.predicted_lifetime_nw,
              rank: predictionResult.rank_band,
              aspiration: userData.aspiration,
              university: userData.college
            }}
            onRestart={handleRestart}
          />
        )}
      </AppContainer>
    </ErrorBoundary>
  );
};

export default App;
