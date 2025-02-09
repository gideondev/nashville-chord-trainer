// Basic major scale chord families for demonstration
export const chordFamilies = {
  C: ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
  D: ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
  E: ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
  F: ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"],
  G: ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
  A: ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
  B: ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"],
};

// Common real-world progressions (focus on 4-chord patterns)
const commonProgressions = [
  // Pop/rock classics
  ["I", "V", "vi", "IV"], // 50s progression variant
  ["vi", "IV", "I", "V"], // Modern pop variant
  ["I", "IV", "V", "IV"], // Classic rock
  ["I", "vi", "IV", "V"], // 50s progression
  ["ii", "V", "I", "IV"], // Jazz-influenced
  ["I", "IV", "vi", "V"], // Pop punk/emo
  ["I", "V", "IV", "V"], // Blues turnaround
  ["I", "IV", "I", "V"], // Country progression
];

// Weighted probabilities for more realistic random generation
const progressionWeights = {
  I: 35, // Most common
  IV: 25,
  V: 20,
  vi: 15,
  ii: 10,
  iii: 5,
  "vii°": 3,
};

/**
 * Generates a random Nashville number progression.
 * @param {number} numChords - The number of chords to generate in the progression.
 * @returns {string[]} An array representing the Nashville number progression.
 */
export function getRandomNashvilleProgression(numChords = 4) {
  // 80% chance to use a common progression when requesting 4 chords
  if (numChords === 4 && Math.random() < 0.8) {
    // Select a random common progression
    return commonProgressions[
      Math.floor(Math.random() * commonProgressions.length)
    ];
  }

  // For non-4 chord requests or 20% variation, use weighted random
  const weightedNumbers = [];
  // Populate an array with Nashville numerals according to their weights
  for (const [numeral, weight] of Object.entries(progressionWeights)) {
    weightedNumbers.push(...Array(weight).fill(numeral));
  }

  let progression = [];
  // Randomly select chords based on their weights to form a progression
  for (let i = 0; i < numChords; i++) {
    const randIndex = Math.floor(Math.random() * weightedNumbers.length);
    progression.push(weightedNumbers[randIndex]);
  }

  return progression;
}
