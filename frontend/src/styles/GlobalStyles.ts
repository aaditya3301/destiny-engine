/**
 * 🎨 Global Styles
 * 
 * Global CSS styles for the Destiny Engine, including fonts,
 * animations, and base styling.
 */

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(
      135deg,
      #0f0f23 0%,
      #1a1a2e 25%,
      #16213e 50%,
      #0f0f23 100%
    );
    color: #ffffff;
    overflow-x: hidden;
    min-height: 100vh;
    position: relative;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(15, 15, 35, 0.5);
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(
      to bottom,
      #81d4fa,
      #4a0e4e
    );
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(
      to bottom,
      #4ecdc4,
      #81d4fa
    );
  }

  /* Remove focus outline for mouse users */
  .js-focus-visible :focus:not(.focus-visible) {
    outline: none;
  }

  /* Custom focus styles for keyboard users */
  .focus-visible {
    outline: 2px solid #81d4fa;
    outline-offset: 2px;
  }

  /* Selection styles */
  ::selection {
    background: rgba(129, 212, 250, 0.3);
    color: #ffffff;
  }

  /* Disable text selection on UI elements */
  button, .no-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Mystical cursor for interactive elements */
  button, input, select, [role="button"] {
    cursor: pointer;
  }

  /* Ensure inputs and buttons have proper font inheritance */
  input, button, select, textarea {
    font-family: inherit;
  }

  /* Smooth transitions for interactive elements */
  button, input, select, a {
    transition: all 0.3s ease;
  }

  /* Custom animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes mysticalGlow {
    0%, 100% {
      filter: drop-shadow(0 0 5px rgba(129, 212, 250, 0.3));
    }
    50% {
      filter: drop-shadow(0 0 20px rgba(129, 212, 250, 0.6));
    }
  }

  @keyframes floatUpDown {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  /* Utility classes */
  .fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .slide-in-up {
    animation: slideInUp 0.6s ease-out;
  }

  .slide-in-down {
    animation: slideInDown 0.6s ease-out;
  }

  .scale-in {
    animation: scaleIn 0.6s ease-out;
  }

  .mystical-glow {
    animation: mysticalGlow 2s ease-in-out infinite;
  }

  .float-animation {
    animation: floatUpDown 3s ease-in-out infinite;
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .full-width {
    width: 100%;
  }

  .full-height {
    height: 100vh;
  }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hidden {
    display: none;
  }

  .invisible {
    visibility: hidden;
  }

  .opacity-0 {
    opacity: 0;
  }

  .opacity-50 {
    opacity: 0.5;
  }

  .opacity-100 {
    opacity: 1;
  }

  /* Responsive breakpoints */
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
    
    body {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    html {
      font-size: 12px;
    }
    
    body {
      font-size: 0.8rem;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    body {
      background: #000000;
      color: #ffffff;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Print styles */
  @media print {
    * {
      background: transparent !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    
    body {
      background: white !important;
    }
  }
`;

export default GlobalStyles;
