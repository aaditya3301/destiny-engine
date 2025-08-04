/**
 * ❓ Question Overlay Component
 * 
 * This component handles the progressive questioning system that guides
 * users through providing their information for the destiny prediction.
 */

import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { UserInput, Question } from '../types';

interface QuestionOverlayProps {
  onComplete: (data: UserInput) => void;
  onClose: () => void;
}

// Animation keyframes
const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
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
  padding: 20px;
  box-sizing: border-box;
  z-index: 10;
  transition: opacity 0.5s ease;
  opacity: ${props => props.isVisible ? 1 : 0};
  pointer-events: ${props => props.isVisible ? 'all' : 'none'};
`;

const QuestionCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(129, 212, 250, 0.1) 0%,
    rgba(74, 14, 78, 0.2) 100%
  );
  border: 2px solid rgba(129, 212, 250, 0.3);
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 100vh;
  overflow-y: auto;
  text-align: center;
  animation: ${fadeInDown} 0.6s ease-out;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 20px 40px rgba(129, 212, 250, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    padding: 20px;
    max-width: 90vw;
  }
`;

const Title = styled.h1`
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  color: #81d4fa;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(129, 212, 250, 0.5);
`;

const Subtitle = styled.p`
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30px;
  line-height: 1.6;
`;

const QuestionText = styled.h2`
  font-family: 'Cinzel', serif;
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  font-size: 1.1rem;
  font-family: 'Cinzel', serif;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(129, 212, 250, 0.3);
  border-radius: 10px;
  color: #ffffff;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #81d4fa;
    box-shadow: 0 0 20px rgba(129, 212, 250, 0.3);
    background: rgba(255, 255, 255, 0.15);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 15px 20px;
  font-size: 1.1rem;
  font-family: 'Cinzel', serif;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(129, 212, 250, 0.3);
  border-radius: 10px;
  color: #ffffff;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  
  /* Force dropdown to appear downwards */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  
  /* Limit dropdown height to show only few options */
  size: 1;
  
  /* Custom dropdown arrow */
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%2381d4fa' viewBox='0 0 16 16'%3e%3cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4-796 5.48a1 1 0 0 1-1.506 0z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 16px;
  padding-right: 45px;
  
  &:focus {
    outline: none;
    border-color: #81d4fa;
    box-shadow: 0 0 20px rgba(129, 212, 250, 0.3);
  }
  
  /* Style the dropdown options */
  option {
    background: rgba(26, 26, 46, 0.95);
    color: #ffffff;
    padding: 10px 15px;
    border: none;
    font-family: 'Cinzel', serif;
    
    &:hover {
      background: rgba(129, 212, 250, 0.2);
    }
    
    &:checked {
      background: rgba(129, 212, 250, 0.3);
    }
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 12px 15px;
    background-size: 14px;
    background-position: right 12px center;
    padding-right: 35px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 15px 30px;
  font-size: 1.1rem;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.variant === 'primary' ? css`
    background: linear-gradient(45deg, #4a0e4e, #81d4fa);
    color: #ffffff;
    box-shadow: 0 5px 15px rgba(129, 212, 250, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(129, 212, 250, 0.4);
      animation: ${pulse} 0.6s ease-in-out;
    }
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: left 0.5s;
    }
    
    &:hover:before {
      left: 100%;
    }
  ` : css`
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border: 2px solid rgba(129, 212, 250, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: #81d4fa;
    }
  `}
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(129, 212, 250, 0.2);
  border-radius: 2px;
  margin-bottom: 30px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background: linear-gradient(90deg, #4a0e4e, #81d4fa);
  border-radius: 2px;
  transition: width 0.5s ease;
  animation: ${shimmer} 2s linear infinite;
  background-size: 200px 100%;
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: -15px;
  margin-bottom: 15px;
  text-align: left;
`;

// Question configuration
const questions: Question[] = [
  {
    id: 'name',
    text: 'What name shall the Oracle address you by?',
    placeholder: 'Enter your name',
    type: 'text',
    validation: (value: string) => value.trim().length >= 2,
    errorMessage: 'Please enter at least 2 characters'
  },
  {
    id: 'age',
    text: 'How many years have you walked this earth?',
    placeholder: 'Enter your age',
    type: 'number',
    validation: (value: number) => value >= 16 && value <= 80,
    errorMessage: 'Age must be between 16 and 80'
  },
  {
    id: 'country',
    text: 'In which realm do you currently dwell?',
    placeholder: 'Select your country',
    type: 'select',
    options: [
      'USA', 'India', 'UK', 'Australia', 'Germany', 'China',
      'Switzerland','Norway','Other'
    ],
    validation: (value: string) => value.length > 0,
    errorMessage: 'Please select your country'
  },
  {
    id: 'college',
    text: 'From which temple of knowledge do you hail?',
    placeholder: 'Enter your university/college',
    type: 'text',
    validation: (value: string) => value.trim().length >= 2,
    errorMessage: 'Please enter your university/college'
  },
  {
    id: 'aspiration',
    text: 'What destiny calls to your soul in 10 years?',
    placeholder: 'Enter your dream career (e.g., AI Scientist, CEO, Doctor)',
    type: 'text',
    validation: (value: string) => value.trim().length >= 2,
    errorMessage: 'Please enter your aspiration'
  }
];

export const QuestionOverlay: React.FC<QuestionOverlayProps> = ({ 
  onComplete, 
  onClose 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(-1); // -1 for intro
  const [answers, setAnswers] = useState<Partial<UserInput>>({});
  const [currentValue, setCurrentValue] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setError('');
  }, [currentQuestion, currentValue]);

  const handleStart = () => {
    setCurrentQuestion(0);
  };

  const handleNext = () => {
    if (currentQuestion === -1) {
      handleStart();
      return;
    }

    const question = questions[currentQuestion];
    const value = question.type === 'number' ? parseInt(currentValue) : currentValue;
    
    // Validate input
    if (!question.validation || !question.validation(value)) {
      setError(question.errorMessage || 'Invalid input');
      return;
    }

    // Save answer
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);
    setCurrentValue('');
    setError('');

    // Check if we're done
    if (currentQuestion === questions.length - 1) {
      onComplete(newAnswers as UserInput);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevQuestion = questions[currentQuestion - 1];
      setCurrentValue(String(answers[prevQuestion.id] || ''));
    } else if (currentQuestion === 0) {
      setCurrentQuestion(-1);
    }
  };

  const progress = currentQuestion >= 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  const renderIntro = () => (
    <QuestionCard>
      <Title>🔮 The Oracle Awakens</Title>
      <Subtitle>
        Welcome, seeker of destiny. The crystal ball swirls with ancient wisdom, 
        ready to reveal the golden path of your future. To divine your financial 
        destiny, the Oracle requires knowledge of your earthly form and aspirations.
      </Subtitle>
      <Subtitle>
        Answer truthfully, for the cosmos sees all, and your honesty shall 
        be rewarded with visions of prosperity beyond measure.
      </Subtitle>
      <ButtonContainer>
        <Button variant="secondary" onClick={onClose}>
          Flee from Destiny
        </Button>
        <Button variant="primary" onClick={handleStart}>
          Begin the Revelation ✨
        </Button>
      </ButtonContainer>
    </QuestionCard>
  );

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    
    return (
      <QuestionCard>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
        
        <QuestionText>{question.text}</QuestionText>
        
        {question.type === 'select' ? (
          <Select
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            autoFocus
          >
            <option value="">Choose your realm...</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            type={question.type}
            placeholder={question.placeholder}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleNext()}
            autoFocus
          />
        )}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <ButtonContainer>
          <Button variant="secondary" onClick={handleBack}>
            ← Previous
          </Button>
          <Button variant="primary" onClick={handleNext}>
            {currentQuestion === questions.length - 1 ? 'Reveal My Destiny 🔮' : 'Next →'}
          </Button>
        </ButtonContainer>
      </QuestionCard>
    );
  };

  return (
    <Overlay isVisible={isVisible}>
      {currentQuestion === -1 ? renderIntro() : renderQuestion()}
    </Overlay>
  );
};

export default QuestionOverlay;
