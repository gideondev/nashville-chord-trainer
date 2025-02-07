"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2 } from "lucide-react"

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
  const possibleNumbers = ["I", "ii", "iii", "IV", "V", "vi"]
  let progression = []
  for (let i = 0; i < numChords; i++) {
    const randIndex = Math.floor(Math.random() * possibleNumbers.length)
    progression.push(possibleNumbers[randIndex])
  }
  return progression
}

export default function TrainPage() {
  // State management remains identical
  const [currentKey, setCurrentKey] = useState("C")
  const [progression, setProgression] = useState(getRandomNashvilleProgression())
  const [showAnswers, setShowAnswers] = useState(false)

  const handleNewProgression = () => {
    setProgression(getRandomNashvilleProgression())
    setShowAnswers(false)
  }

   // Convert Nashville notations (I, ii, IV...) to actual chords in the current key
   const convertToChords = (nashvilleArr) => {
    // Mapping from roman numeral -> index in chordFamilies
    const mapIndex = {
      I: 0, "ii": 1, "iii": 2, IV: 3, V: 4, "vi": 5, "vii°": 6
    }
    return nashvilleArr.map(numeral => chordFamilies[currentKey][mapIndex[numeral]])
  }


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
                      <SelectItem key={key} value={key}>{key}</SelectItem>
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
              <div className="flex flex-wrap gap-3">
                {progression.map((num, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center text-lg font-semibold">
                      {num}
                    </div>
                    {showAnswers && (
                      <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {convertToChords(progression)[idx]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers Card - Only shows when answers are visible */}
        {showAnswers && (
          <Card className="border-success/20 bg-success/5">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-success">
                  Chords in {currentKey} Key
                </p>
                <div className="flex flex-wrap gap-2">
                  {convertToChords(progression).map((chord, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-success/10 text-success text-sm font-medium"
                    >
                      {chord}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}