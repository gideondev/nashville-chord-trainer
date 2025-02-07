"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Nashville Chord Trainer</h1>
      <p className="text-lg text-gray-600">Test your chord knowledge, make fewer mistakes, become a superstar.</p>
      
      <div className="space-x-2">
        <Link href="/train">
          <Button>Start Training</Button>
        </Link>
        <Link href="/cheatsheet">
          <Button variant="outline">View Cheatsheet</Button>
        </Link>
      </div>
    </main>
  )
}
