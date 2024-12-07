'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ContentAnalyzer() {
  const [url, setUrl] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const analyzeContent = async () => {
    if (!url) {
      alert('Please enter a valid URL')
      return
    }

    setIsLoading(true)
    setAnalysis('')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (data.error) {
        setAnalysis(`Error: ${data.error}`)
      } else {
        setAnalysis(data.analysis)
      }
    } catch (error) {
      setAnalysis(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Content Analyzer</CardTitle>
          <CardDescription>
            Paste a URL below to analyze the webpage content and determine if it's helpful or unhelpful based on various criteria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="url"
              placeholder="Enter webpage URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={analyzeContent} disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
          {isLoading && (
            <div className="mt-4 text-center text-muted-foreground">
              Analyzing content... Please wait...
            </div>
          )}
          {analysis && (
            <div className="mt-4 p-4 bg-muted rounded-md whitespace-pre-wrap">
              {analysis}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

