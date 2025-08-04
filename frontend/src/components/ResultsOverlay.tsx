/**
 * 🎯 Results Component
 * 
 * This component displays the Oracle's final verdict with beautiful animations,
 * sharing capabilities, and an inspiring presentation of the user's destiny.
 */

import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { PredictionResponse, ShareData } from '../types';

interface ResultsOverlayProps {
  isVisible: boolean;
  prediction: PredictionResponse | null;
  userData: ShareData | null;
  onRestart: () => void;
}

// Animation keyframes
const revealFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const goldShimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const numberCountUp = keyframes`
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const prestigeGlow = keyframes`
  0%, 100% { 
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.6),
                 0 0 40px rgba(255, 215, 0, 0.4),
                 0 0 60px rgba(255, 215, 0, 0.2);
  }
  50% { 
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.8),
                 0 0 60px rgba(255, 215, 0, 0.6),
                 0 0 90px rgba(255, 215, 0, 0.4);
  }
`;

const confettiAnimation = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
`;

// Styled components
const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  transition: opacity 0.8s ease;
  opacity: ${props => props.isVisible ? 1 : 0};
  pointer-events: ${props => props.isVisible ? 'all' : 'none'};
  padding: 20px;
  
  /* Allow scrolling but hide scrollbars */
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  
  &::-webkit-scrollbar {
    display: none; /* WebKit */
  }
`;

const ResultCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(26, 26, 46, 0.95) 0%,
    rgba(15, 15, 35, 0.98) 50%,
    rgba(74, 14, 78, 0.95) 100%
  );
  border: none;
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  width: 95vw;
  max-height: 90vh;
  text-align: center;
  animation: ${revealFade} 1s ease-out;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(129, 212, 250, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  
  /* Allow scrolling but hide scrollbars */
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  
  &::-webkit-scrollbar {
    display: none; /* WebKit */
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(129, 212, 250, 0.05) 0%,
      transparent 70%
    );
    animation: ${goldShimmer} 4s linear infinite;
  }

  @media (max-height: 800px) {
    padding: 30px;
  }
  
  @media (max-height: 600px) {
    padding: 25px;
  }
`;

const Header = styled.div`
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
`;

const OracleTitle = styled.h1`
  font-family: 'Cinzel', serif;
  font-size: 3.2rem;
  color: #ffd700;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #ffd700, #81d4fa, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${prestigeGlow} 3s ease-in-out infinite;
  
  @media (max-height: 800px) {
    font-size: 2.8rem;
    margin-bottom: 16px;
  }
  
  @media (max-height: 600px) {
    font-size: 2.4rem;
    margin-bottom: 12px;
  }
`;

const Subtitle = styled.p`
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  color: rgba(193, 219, 252, 0.95);
  margin-bottom: 16px;
  line-height: 1.5;
  text-shadow: 0 0 10px rgba(129, 212, 250, 0.3);
  
  @media (max-height: 800px) {
    font-size: 1.3rem;
    margin-bottom: 14px;
  }
  
  @media (max-height: 600px) {
    font-size: 1.2rem;
    margin-bottom: 12px;
  }
`;

const UserName = styled.span`
  color: #81d4fa;
  font-weight: 700;
  text-shadow: 0 0 15px rgba(129, 212, 250, 0.6);
  background: linear-gradient(45deg, #81d4fa, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NetWorthSection = styled.div`
  margin: 40px 0;
  padding: 35px;
  background: rgba(129, 212, 250, 0.1);
  border-radius: 15px;
  border: 2px solid rgba(129, 212, 250, 0.3);
  position: relative;
  z-index: 1;
  
  @media (max-height: 800px) {
    margin: 35px 0;
    padding: 30px;
  }
  
  @media (max-height: 600px) {
    margin: 30px 0;
    padding: 25px;
  }
`;

const NetWorthLabel = styled.p`
  font-family: 'Cinzel', serif;
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
  
  @media (max-height: 800px) {
    font-size: 1.3rem;
    margin-bottom: 14px;
  }
  
  @media (max-height: 600px) {
    font-size: 1.2rem;
    margin-bottom: 12px;
  }
`;

const NetWorthAmount = styled.h2<{ delay?: number }>`
  font-family: 'Cinzel', serif;
  font-size: 4rem;
  color: #ffd700;
  margin-bottom: 16px;
  font-weight: 700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
  animation: ${numberCountUp} 0.8s ease-out ${props => props.delay || 0}s both;
  
  @media (max-height: 800px) {
    font-size: 3.5rem;
    margin-bottom: 14px;
  }
  
  @media (max-height: 600px) {
    font-size: 3rem;
    margin-bottom: 12px;
  }
`;

const RankBadge = styled.div`
  display: inline-block;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #1a1a2e;
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  font-weight: 700;
  padding: 20px 40px;
  border-radius: 50px;
  margin: 25px 0;
  box-shadow: 0 10px 20px rgba(255, 215, 0, 0.3);
  animation: ${revealFade} 1s ease-out 0.5s both;
  
  @media (max-height: 800px) {
    font-size: 1.4rem;
    padding: 16px 32px;
    margin: 20px 0;
  }
  
  @media (max-height: 600px) {
    font-size: 1.3rem;
    padding: 14px 28px;
    margin: 16px 0;
  }
`;

const DetailsSection = styled.div`
  margin: 40px 0;
  text-align: left;
  position: relative;
  z-index: 1;
  
  @media (max-height: 800px) {
    margin: 35px 0;
  }
  
  @media (max-height: 600px) {
    margin: 30px 0;
  }
`;

const DetailItem = styled.div<{ delay?: number }>`
  display: flex;
  align-items: center;
  margin: 20px 0;
  padding: 25px;
  background: linear-gradient(
    135deg,
    rgba(15, 15, 35, 0.6) 0%,
    rgba(26, 26, 46, 0.8) 100%
  );
  border-radius: 12px;
  border-left: 4px solid #81d4fa;
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  animation: ${revealFade} 0.6s ease-out ${props => props.delay || 0}s both;
  
  @media (max-height: 800px) {
    margin: 18px 0;
    padding: 22px;
  }
  
  @media (max-height: 600px) {
    margin: 16px 0;
    padding: 20px;
  }
`;

const DetailIcon = styled.span`
  font-size: 2.2rem;
  margin-right: 25px;
  filter: drop-shadow(0 0 10px rgba(129, 212, 250, 0.5));
  
  @media (max-height: 800px) {
    font-size: 2rem;
    margin-right: 22px;
  }
  
  @media (max-height: 600px) {
    font-size: 1.8rem;
    margin-right: 20px;
  }
`;

const DetailLabel = styled.p`
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  color: rgba(193, 219, 252, 0.8);
  margin: 0 0 6px 0;
  
  @media (max-height: 800px) {
    font-size: 1.1rem;
    margin: 0 0 5px 0;
  }
  
  @media (max-height: 600px) {
    font-size: 1rem;
    margin: 0 0 4px 0;
  }
`;

const DetailValue = styled.p`
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  color: #ffffff;
  margin: 0;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
  
  @media (max-height: 800px) {
    font-size: 1.4rem;
  }
  
  @media (max-height: 600px) {
    font-size: 1.3rem;
  }
`;

const DetailContent = styled.div`
  flex: 1;
`;

const ReasoningSection = styled.div`
  margin: 40px 0;
  padding: 35px;
  background: rgba(129, 212, 250, 0.1);
  border-radius: 15px;
  border: 2px solid rgba(129, 212, 250, 0.3);
  position: relative;
  z-index: 1;
  
  @media (max-height: 800px) {
    margin: 35px 0;
    padding: 30px;
  }
  
  @media (max-height: 600px) {
    margin: 30px 0;
    padding: 25px;
  }
`;

const ReasoningTitle = styled.h3`
  font-family: 'Cinzel', serif;
  font-size: 1.7rem;
  color: #81d4fa;
  margin-bottom: 18px;
  text-align: center;
  
  @media (max-height: 800px) {
    font-size: 1.6rem;
    margin-bottom: 16px;
  }
  
  @media (max-height: 600px) {
    font-size: 1.5rem;
    margin-bottom: 14px;
  }
`;

const ReasoningText = styled.p`
  font-family: 'Cinzel', serif;
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  text-align: center;
  font-style: italic;
  
  @media (max-height: 800px) {
    font-size: 1.3rem;
    line-height: 1.5;
  }
  
  @media (max-height: 600px) {
    font-size: 1.2rem;
    line-height: 1.4;
  }
`;

const ConfidenceSection = styled.div`
  margin: 35px 0;
  padding: 30px;
  background: rgba(74, 14, 78, 0.2);
  border-radius: 12px;
  border: 2px solid rgba(74, 14, 78, 0.4);
  position: relative;
  z-index: 1;
  
  @media (max-height: 800px) {
    margin: 30px 0;
    padding: 25px;
  }
  
  @media (max-height: 600px) {
    margin: 25px 0;
    padding: 22px;
  }
`;

const ConfidenceText = styled.p`
  font-family: 'Cinzel', serif;
  font-size: 1.4rem;
  color: #d8b4fe;
  text-align: center;
  margin: 0;
  font-style: italic;
  line-height: 1.5;
  
  @media (max-height: 800px) {
    font-size: 1.3rem;
  }
  
  @media (max-height: 600px) {
    font-size: 1.2rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 25px;
  justify-content: center;
  margin-top: 40px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
  
  @media (max-height: 800px) {
    margin-top: 35px;
    gap: 22px;
  }
  
  @media (max-height: 600px) {
    margin-top: 30px;
    gap: 20px;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 18px 36px;
  font-size: 1.4rem;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  @media (max-height: 800px) {
    padding: 15px 30px;
    font-size: 1.3rem;
  }
  
  @media (max-height: 600px) {
    padding: 12px 24px;
    font-size: 1.2rem;
  }
  
  ${props => props.variant === 'primary' ? css`
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #1a1a2e;
    box-shadow: 
      0 8px 20px rgba(255, 215, 0, 0.4),
      0 0 15px rgba(255, 215, 0, 0.3);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 
        0 15px 30px rgba(255, 215, 0, 0.5),
        0 0 25px rgba(255, 215, 0, 0.4);
    }
  ` : css`
    background: linear-gradient(45deg, #81d4fa, #4ecdc4);
    color: #1a1a2e;
    box-shadow: 
      0 8px 20px rgba(129, 212, 250, 0.4),
      0 0 15px rgba(129, 212, 250, 0.3);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 
        0 15px 30px rgba(129, 212, 250, 0.5),
        0 0 25px rgba(129, 212, 250, 0.4);
    }
  `}
`;

const Confetti = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
`;

const ConfettiPiece = styled.div<{ left: number; delay: number; color: string }>`
  position: absolute;
  top: -20px;
  left: ${props => props.left}%;
  width: 10px;
  height: 10px;
  background: ${props => props.color};
  animation: ${confettiAnimation} 3s linear ${props => props.delay}s infinite;
  opacity: 0.8;
`;

export const ResultsOverlay: React.FC<ResultsOverlayProps> = ({
  isVisible,
  prediction,
  userData,
  onRestart
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible && prediction) {
      // Show confetti after card animation
      setTimeout(() => setShowConfetti(true), 1000);
    } else {
      setShowConfetti(false);
    }
  }, [isVisible, prediction]);

  const handleShare = async () => {
    if (!prediction || !userData) return;

    const shareData = {
      title: `🔮 My Financial Destiny Revealed!`,
      text: `The Oracle has spoken! My predicted lifetime net worth is ${formatNumber(prediction.predicted_lifetime_nw)}, placing me in the ${prediction.rank_band}! ✨`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        alert('Destiny details copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatNumber = (num: number) => {
    // Convert USD to INR (approximate rate: 1 USD = 83 INR)
    const usdToInrRate = 83;
    const inrAmount = num * usdToInrRate;
    
    if (inrAmount >= 10000000) {
      return `₹${(inrAmount / 10000000).toFixed(1)} Crores`;
    } else if (inrAmount >= 100000) {
      return `₹${(inrAmount / 100000).toFixed(1)} Lakhs`;
    } else if (inrAmount >= 1000) {
      return `₹${(inrAmount / 1000).toFixed(0)}K`;
    }
    return `₹${inrAmount.toLocaleString()}`;
  };

  if (!prediction || !userData) return null;

  const confettiColors = ['#ffd700', '#81d4fa', '#4ecdc4', '#ff6b6b', '#d8b4fe'];

  return (
    <Overlay isVisible={isVisible}>
      {showConfetti && (
        <Confetti>
          {Array.from({ length: 50 }, (_, i) => (
            <ConfettiPiece
              key={i}
              left={Math.random() * 100}
              delay={Math.random() * 3}
              color={confettiColors[Math.floor(Math.random() * confettiColors.length)]}
            />
          ))}
        </Confetti>
      )}
      
      <ResultCard>
        <Header>
          <OracleTitle>✨ The Oracle Has Spoken ✨</OracleTitle>
          <Subtitle>
            Behold, <UserName>{userData.name}</UserName>, your financial destiny 
            has been woven by the cosmic threads of possibility!
          </Subtitle>
        </Header>

        <NetWorthSection>
          <NetWorthLabel>Your 10-Year Net Worth Projection</NetWorthLabel>
          <NetWorthAmount>
            {formatNumber(prediction.predicted_10_year_nw)}
          </NetWorthAmount>
          <NetWorthLabel>
            (~₹{(prediction.predicted_10_year_nw * 83).toLocaleString()} INR)
          </NetWorthLabel>
        </NetWorthSection>

        <RankBadge>
          🏆 {prediction.rank_band}
        </RankBadge>

        <DetailsSection>
          <DetailItem delay={0.2}>
            <DetailIcon>🎯</DetailIcon>
            <DetailContent>
              <DetailLabel>Your Aspiration</DetailLabel>
              <DetailValue>{userData.aspiration}</DetailValue>
            </DetailContent>
          </DetailItem>

          <DetailItem delay={0.4}>
            <DetailIcon>🎓</DetailIcon>
            <DetailContent>
              <DetailLabel>University Foundation</DetailLabel>
              <DetailValue>
                {userData.university} 
                {prediction.college_tier && ` (Tier ${prediction.college_tier})`}
              </DetailValue>
            </DetailContent>
          </DetailItem>

          <DetailItem delay={0.6}>
            <DetailIcon>�</DetailIcon>
            <DetailContent>
              <DetailLabel>Fated Lifetime Net Worth</DetailLabel>
              <DetailValue>
                {formatNumber(prediction.predicted_lifetime_nw)}
              </DetailValue>
            </DetailContent>
          </DetailItem>

          <DetailItem delay={0.8}>
            <DetailIcon>⚡</DetailIcon>
            <DetailContent>
              <DetailLabel>Success Probability</DetailLabel>
              <DetailValue>
                {(prediction.probability_score * 100).toFixed(0)}%
              </DetailValue>
            </DetailContent>
          </DetailItem>
        </DetailsSection>

        <ReasoningSection>
          <ReasoningTitle>🔮 Oracle's Wisdom</ReasoningTitle>
          <ReasoningText>"{prediction.reasoning}"</ReasoningText>
        </ReasoningSection>

        <ConfidenceSection>
          <ConfidenceText>
            "{prediction.oracle_confidence}"
          </ConfidenceText>
        </ConfidenceSection>

        <ButtonContainer>
          <Button variant="primary" onClick={handleShare}>
            📤 Share My Destiny
          </Button>
          <Button variant="secondary" onClick={onRestart}>
            🔮 Consult Oracle Again
          </Button>
        </ButtonContainer>
      </ResultCard>
    </Overlay>
  );
};

export default ResultsOverlay;
