# Chord Progression Trainer 🎹⏱️

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A interactive web application for musicians to practice recognizing common chord progressions in different keys, with timed challenges and progress tracking.

## Features

- **Key Selection**: Choose from 5 major keys (C, G, D, A, E)
- **Common Progressions**: Focus on real-world patterns used in pop, rock, and jazz
- **Timed Challenges**: 30-second timer per chord with auto-advance
- **Progress Tracking**: Visual feedback with correct/incorrect indicators
- **Multiple Choice**: Adaptive distractors based on current key
- **Score System**: Final percentage score with detailed breakdown
- **Responsive UI**: Mobile-friendly interface with clean design

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI components
- **State Management**: React useState/useEffect
- **Icons**: Lucide React icons
- **Build Tool**: Vite (via Next.js)

## Key Algorithms

### Progression Generation
```typescript
// Uses weighted probabilities for realistic progressions
const progressionWeights = {
  "I": 35, "IV": 25, "V": 20, 
  "vi": 15, "ii": 10, "iii": 5, "vii°": 3
};

// 80% chance to use common 4-chord patterns
const commonProgressions = [
  ["I", "V", "vi", "IV"], // Axis progression
  ["vi", "IV", "I", "V"], // Modern pop
  ["I", "IV", "V", "IV"], // Classic rock
  // ...6 more common patterns
];
