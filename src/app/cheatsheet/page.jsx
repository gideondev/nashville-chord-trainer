"use client"
import { Card } from "@/components/ui/card"

const chordFamilies = {
  C: ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
  G: ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
  D: ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
  A: ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
  E: ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
  // Add more if you like
}

const nashvilleNumbers = ["I", "ii", "iii", "IV", "V", "vi", "vii°"]

export default function CheatsheetPage() {
  return (
    <main className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Nashville Number System Cheatsheet</h2>
      {Object.entries(chordFamilies).map(([key, chords]) => (
        <Card key={key} className="mb-4 p-4">
          <h3 className="text-lg font-medium mb-2">Key of {key}</h3>
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="font-semibold px-2 py-1">Nashville</th>
                <th className="font-semibold px-2 py-1">Chord</th>
              </tr>
            </thead>
            <tbody>
              {chords.map((chord, idx) => (
                <tr key={idx}>
                  <td className="px-2 py-1">{nashvilleNumbers[idx]}</td>
                  <td className="px-2 py-1">{chord}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ))}
    </main>
  )
}
