"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, XCircle } from "lucide-react"

// Basic major scale chord families for demonstration
const chordFamilies = {
  C: ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
  G: ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
  D: ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
  A: ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
  E: ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
  // Add more keys as needed
}

// Returns an array of chords in Nashville notation format (e.g. [I, IV, V])
function getRandomNashvilleProgression(numChords = 4) {
  const possibleNumbers = ["I", "ii", "iii", "IV", "V", "vi", "vii°"]
  let progression = []
  for (let i = 0; i < numChords; i++) {
    const randIndex = Math.floor(Math.random() * possibleNumbers.length)
    progression.push(possibleNumbers[randIndex])
  }
  return progression
}

// Return a random selection of chord options for a specific chord (the correct chord + 3 random distractors)
function getMultipleChoiceOptions(correctChord, allChords) {
  // We only want 3 random distractors that are not the correct chord
  const distractors = allChords.filter((c) => c !== correctChord)
  // Shuffle them up
  const shuffled = distractors.sort(() => 0.5 - Math.random()).slice(0, 3)
  // Combine correct + distractors, shuffle again
  const options = [correctChord, ...shuffled].sort(() => 0.5 - Math.random())
  return options
}

export default function TrainPage() {
  const [currentKey, setCurrentKey] = useState("C")
  const [progression, setProgression] = useState(getRandomNashvilleProgression())
  const [showAnswers, setShowAnswers] = useState(false)

  // For the guessing game
  const [multipleChoiceData, setMultipleChoiceData] = useState([]) 
  const [userGuesses, setUserGuesses] = useState([]) 
  const [submitted, setSubmitted] = useState(false)

  // Convert Nashville notations (I, ii, IV...) to actual chords in the current key
  const convertToChords = (nashvilleArr) => {
    const mapIndex = {
      I: 0, "ii": 1, "iii": 2, IV: 3, V: 4, "vi": 5, "vii°": 6
    }
    return nashvilleArr.map(numeral => chordFamilies[currentKey][mapIndex[numeral]])
  }

  // Whenever progression or currentKey changes, update multiple-choice sets
  useEffect(() => {
    const actualChords = convertToChords(progression)
    const mcData = actualChords.map((chord) => {
      const allChordsInKey = chordFamilies[currentKey]
      return getMultipleChoiceOptions(chord, allChordsInKey)
    })
    setMultipleChoiceData(mcData)
    setUserGuesses(Array(progression.length).fill(null))
    setSubmitted(false)
  }, [progression, currentKey])

  const handleNewProgression = () => {
    setProgression(getRandomNashvilleProgression())
    setShowAnswers(false)
  }

  // Handle guess changes (radio-button style or anything else)
  const handleGuess = (chord, idx) => {
    const newGuesses = [...userGuesses]
    newGuesses[idx] = chord
    setUserGuesses(newGuesses)
  }

  // Once submitted, we evaluate correctness
  const handleSubmit = () => {
    setSubmitted(true)
    setShowAnswers(true) // optional: automatically reveal actual chords
  }

  // Evaluate correctness for the scoreboard
  const actualChords = convertToChords(progression)
  const correctCount = userGuesses.reduce((acc, guess, idx) => {
    return guess === actualChords[idx] ? acc + 1 : acc
  }, 0)

  return (
    <main className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Chord Progression Trainer</h1>
          <p className="text-muted-foreground">Practice identifying chords in different keys</p>
        </div>

        {/* Controls Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="w-full md:w-auto">
                <Select value={currentKey} onValueChange={setCurrentKey}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select key" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(chordFamilies).map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleNewProgression}
                className="w-full md:w-auto"
                variant="secondary"
              >
                Generate New Progression
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progression Display Card */}
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Current Progression</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAnswers(!showAnswers)}
              >
                {showAnswers ? "Hide Chords" : "Reveal Chords"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* This row shows the Nashville numerals + correct chords if revealed */}
              <div className="flex flex-wrap gap-3">
                {progression.map((num, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center text-lg font-semibold">
                      {num}
                    </div>
                    {showAnswers && (
                      <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {actualChords[idx]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guessing Section */}
        <Card>
          <CardHeader>
            <CardTitle>Guess The Chords</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose what you think each chord is before submitting your answers!
            </p>
            <div className="flex flex-col space-y-3">
              {progression.map((num, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Chord for {num}?</span>
                  <div className="flex gap-2 flex-wrap">
                    {multipleChoiceData[idx]?.map((option, i) => {
                      const isCorrect = submitted && option === actualChords[idx]
                      const isChosen = userGuesses[idx] === option
                      const isWrongChoice = submitted && isChosen && !isCorrect

                      return (
                        <Button
                          key={i}
                          variant={isChosen ? "default" : "outline"}
                          className={
                            isWrongChoice
                              ? "bg-destructive/10 text-destructive"
                              : isCorrect
                              ? "bg-success/10 text-success"
                              : ""
                          }
                          onClick={() => handleGuess(option, idx)}
                        >
                          {option}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={userGuesses.some((g) => g === null)} // optional: disable if not all chords guessed
            >
              Submit Answers
            </Button>
          </CardContent>
        </Card>

        {/* Answers Card - Only shows when submitted */}
        {submitted && (
          <Card className="border-success/20 bg-success/5">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-success">
                    You got {correctCount} out of {progression.length} correct!
                  </p>
                </div>
              </div>
              {correctCount === progression.length ? (
                <p className="text-sm">
                  Nice job, you badass chord wizard. Generate a new progression and keep going!
                </p>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <span>Missed a few. No sweat, practice makes perfect!</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
