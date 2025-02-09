"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, XCircle, Clock } from "lucide-react"
import { chordFamilies, getRandomNashvilleProgression } from '@/utils/chordUtils';

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
  const [multipleChoiceData, setMultipleChoiceData] = useState([])
  const [userGuesses, setUserGuesses] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [currentChordIndex, setCurrentChordIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)

    // Convert Nashville notations (I, ii, IV...) to actual chords in the current key
    const convertToChords = (nashvilleArr) => {
      const mapIndex = {
        I: 0, "ii": 1, "iii": 2, IV: 3, V: 4, "vi": 5, "vii°": 6
      }
      return nashvilleArr.map(numeral => chordFamilies[currentKey][mapIndex[numeral]])
    }

  const actualChords = convertToChords(progression)

  useEffect(() => {
    const mcData = actualChords.map((chord) => {
      const allChordsInKey = chordFamilies[currentKey]
      return getMultipleChoiceOptions(chord, allChordsInKey)
    })
    setMultipleChoiceData(mcData)
    setUserGuesses(Array(progression.length).fill(null))
    setSubmitted(false)
    setCurrentChordIndex(0)
    setTimeLeft(30)
  }, [progression, currentKey])

  // Timer logic
  useEffect(() => {
    if (submitted || currentChordIndex >= progression.length) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextChord(null) // Auto-advance on timeout
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentChordIndex, submitted])
  

  const handleNextChord = (guess) => {
    const newGuesses = [...userGuesses]
    newGuesses[currentChordIndex] = guess
    setUserGuesses(newGuesses)

    if (currentChordIndex < progression.length - 1) {
      setCurrentChordIndex(prev => prev + 1)
      setTimeLeft(30)
    } else {
      setSubmitted(true)
    }
  }

  const handleNewProgression = () => {
    setProgression(getRandomNashvilleProgression())
    setShowAnswers(false)
    setSubmitted(false)
    setCurrentChordIndex(0)
    setTimeLeft(30)
  }
  

  const correctCount = userGuesses.reduce((acc, guess, idx) => {
    return guess === actualChords[idx] ? acc + 1 : acc
  }, 0)
  

  return (
    <main className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header and Controls remain same */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Chord Progression Trainer</h1>
          <p className="text-muted-foreground">Practice identifying chords in different keys</p>
        </div>

          {/* Key Selection Controls */}
          <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <Select value={currentKey} onValueChange={setCurrentKey}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select key" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(chordFamilies).map((key) => (
                    <SelectItem key={key} value={key}>
                      {key} Major
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleNewProgression}
                variant="secondary"
              >
                New Progression
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress & Timer Card */}
        <Card>
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium">
                Progress: {currentChordIndex + 1}/{progression.length}
              </div>
              <div className="flex items-center gap-2 text-orange-500">
                <Clock className="h-5 w-5" />
                <span className="font-mono">{timeLeft}s</span>
              </div>
            </div>
            
            {!submitted && (
              <div className="space-y-4 text-center">
                <div className="text-4xl font-bold tracking-tighter">
                  {progression[currentChordIndex]}
                </div>
                <div className="flex justify-center gap-2 flex-wrap">
                  {multipleChoiceData[currentChordIndex]?.map((option, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="text-lg px-6 py-4"
                      onClick={() => handleNextChord(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {submitted && (
              <div className="text-center space-y-4">
                <div className="text-2xl font-bold">Results</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {progression.map((num, idx) => (
                    <div key={idx} className="flex flex-col items-center p-2 border rounded-lg">
                      <div className="text-muted-foreground">{num}</div>
                      <div className="font-medium">
                        {userGuesses[idx]}
                        <span className="text-muted-foreground"> / </span>
                        <span className="text-primary">{actualChords[idx]}</span>
                      </div>
                      {userGuesses[idx] === actualChords[idx] ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Card - Similar to before but updated */}
        {submitted && (
          <Card className="border-success/20 bg-success/5">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-success">
                    Final Score: {correctCount}/{progression.length}
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleNewProgression}
                variant="default"
              >
                Try Another Progression
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}