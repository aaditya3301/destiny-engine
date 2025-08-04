/**
 * ⚡ Processing Component
 * 
 * This component shows the mystical animation and messages while the AI
 * Oracle is analyzing the user's data and making predictions.
 */

import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

interface ProcessingOverlayProps {
  isVisible: boolean;
  onComplete?: () => void;
}

// Animation keyframes
const mysticalGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(129, 212, 250, 0.3),
                0 0 40px rgba(129, 212, 250, 0.2),
                0 0 60px rgba(129, 212, 250, 0.1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(129, 212, 250, 0.6),
                0 0 60px rgba(129, 212, 250, 0.4),
                0 0 90px rgba(129, 212, 250, 0.2);
  }
`;

const orbitalSpin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulseText = keyframes`
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`;

const floatUpDown = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const shimmerWave = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

// Styled components
const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 15, 35, 0.98);
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  z-index: 20;
  transition: opacity 0.5s ease;
  opacity: ${props => props.isVisible ? 1 : 0};
  pointer-events: ${props => props.isVisible ? 'all' : 'none'};
`;

const ProcessingContainer = styled.div`
  text-align: center;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
    max-width: 95vw;
  }
`;

const OracleAnimation = styled.div`
  position: relative;
  width: 500px;
  height: 175px;
  margin: 0 auto 35px;
  animation: ${floatUpDown} 3s ease-in-out infinite;
`;

const InnerOrb = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 110px;
  height: 110px;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(129, 212, 250, 0.8) 0%,
    rgba(74, 14, 78, 0.6) 50%,
    transparent 100%
  );
  border-radius: 50%;
  animation: ${mysticalGlow} 2s ease-in-out infinite;
`;

const OrbitRing = styled.div<{ delay?: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 140px;
  height: 140px;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(129, 212, 250, 0.3);
  border-radius: 50%;
  animation: ${orbitalSpin} 8s linear infinite;
  animation-delay: ${props => props.delay || 0}s;
  
  &::before {
    content: '✨';
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 1.4rem;
    animation: ${orbitalSpin} 8s linear infinite reverse;
  }
`;

const OuterRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 180px;
  height: 180px;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(129, 212, 250, 0.2);
  border-radius: 50%;
  animation: ${orbitalSpin} 12s linear infinite reverse;
  
  &::before {
    content: '🔮';
    position: absolute;
    top: -15px;
    right: -15px;
    font-size: 1.8rem;
    animation: ${orbitalSpin} 12s linear infinite;
  }
`;

const ProcessingTitle = styled.h1`
  font-family: 'Cinzel', serif;
  font-size: 2.6rem;
  color: #81d4fa;
  margin-bottom: 18px;
  text-shadow: 0 0 20px rgba(129, 212, 250, 0.5);
  animation: ${pulseText} 2s ease-in-out infinite;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const ProcessingMessage = styled.p`
  font-family: 'Cinzel', serif;
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
  margin-bottom: 30px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 25px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ProcessingSteps = styled.div`
  margin-top: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    margin-top: 25px;
    gap: 15px;
    max-width: 550px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
    max-width: 400px;
  }
`;

const Step = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 18px 25px;
  background: ${props => props.isActive 
    ? 'linear-gradient(45deg, rgba(129, 212, 250, 0.2), rgba(74, 14, 78, 0.3))'
    : 'rgba(255, 255, 255, 0.05)'
  };
  border: 2px solid ${props => 
    props.isCompleted ? '#4ecdc4' : 
    props.isActive ? '#81d4fa' : 
    'rgba(129, 212, 250, 0.2)'
  };
  border-radius: 12px;
  transition: all 0.5s ease;
  position: relative;
  overflow: hidden;
  text-align: left;
  min-height: 70px;
  
  @media (max-width: 768px) {
    padding: 15px 18px;
    min-height: 60px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 15px;
    min-height: 50px;
    flex-direction: column;
    text-align: center;
  }
  
  ${props => props.isActive && css`
    animation: ${mysticalGlow} 2s ease-in-out infinite;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
      );
      animation: ${shimmerWave} 2s linear infinite;
    }
  `}
`;

const StepIcon = styled.span<{ isCompleted: boolean }>`
  margin-right: 18px;
  font-size: 2rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  ${props => props.isCompleted && css`
    color: #4ecdc4;
  `}
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-right: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
    margin-right: 0;
    margin-bottom: 8px;
  }
`;

const StepText = styled.span`
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  color: #ffffff;
  font-weight: 500;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

// Processing steps data
const processingSteps = [
  {
    icon: '🌟',
    text: 'Consulting the celestial archives...',
    duration: 2000
  },
  {
    icon: '📊',
    text: 'Analyzing wealth patterns across dimensions...',
    duration: 3000
  },
  {
    icon: '⚡',
    text: 'Calculating probability matrices...',
    duration: 3500
  },
  {
    icon: '✨',
    text: 'Weaving your financial destiny...',
    duration: 2000
  }
];

const mysticalMessages = [
  "The Oracle peers into the cosmic web of possibility...",
  "Ancient algorithms dance with modern wisdom...",
  "Your future whispers through the quantum foam...",
  "The stars align to reveal your golden path...",
  "Destiny crystallizes in the swirling mists of time..."
];

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ 
  isVisible,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setCompletedSteps([]);
      setCurrentMessage(0);
      return;
    }

    // Start the processing sequence
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < processingSteps.length) {
        setCurrentStep(stepIndex);
        
        // Mark step as completed after its duration
        setTimeout(() => {
          setCompletedSteps(prev => {
            const newCompleted = [...prev, stepIndex];
            // If this is the last step, call onComplete after a brief delay
            if (newCompleted.length === processingSteps.length && onComplete) {
              setTimeout(() => {
                onComplete();
              }, 1500); // Brief delay for dramatic effect
            }
            return newCompleted;
          });
        }, processingSteps[stepIndex].duration);
        
        stepIndex++;
      } else {
        clearInterval(stepInterval);
      }
    }, 1000);

    // Cycle through mystical messages
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % mysticalMessages.length);
    }, 4000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(messageInterval);
    };
  }, [isVisible, onComplete]);

  return (
    <Overlay isVisible={isVisible}>
      <ProcessingContainer>
        <OracleAnimation>
          <InnerOrb />
          <OrbitRing />
          <OrbitRing delay={2} />
          <OuterRing />
        </OracleAnimation>
        
        <ProcessingTitle>🔮 The Oracle Contemplates</ProcessingTitle>
        
        <ProcessingMessage>
          {mysticalMessages[currentMessage]}
        </ProcessingMessage>
        
        <ProcessingSteps>
          {processingSteps.map((step, index) => (
            <Step
              key={index}
              isActive={currentStep === index}
              isCompleted={completedSteps.includes(index)}
            >
              <StepIcon isCompleted={completedSteps.includes(index)}>
                {completedSteps.includes(index) ? '✅' : step.icon}
              </StepIcon>
              <StepText>{step.text}</StepText>
            </Step>
          ))}
        </ProcessingSteps>
      </ProcessingContainer>
    </Overlay>
  );
};

export default ProcessingOverlay;
