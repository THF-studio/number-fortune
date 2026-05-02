import { useRef, useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import NumberInput from '../components/analysis/NumberInput'
import HexagramSection from '../components/analysis/HexagramSection'
import ElementTable from '../components/analysis/ElementTable'
import DigitGrid from '../components/analysis/DigitGrid'
import { ScoreOverview, ScoreDetails } from '../components/analysis/ScoreSection'
import { useAnalysis } from '../hooks/useAnalysis'
import type { AnalysisInput } from '../types'

const DEFAULT_INPUT: AnalysisInput = {
  phone: '',
  favorElements: [],
  avoidElements: [],
}

export default function NumericEnergyPage() {
  const [input, setInput] = useState<AnalysisInput>(DEFAULT_INPUT)
  const [submittedPhone, setSubmittedPhone] = useState<string | null>(null)
  const result = useAnalysis(
    submittedPhone !== null && input.phone.trim() === submittedPhone ? input : null,
  )
  const overviewRef = useRef<HTMLDivElement>(null)

  function handleSubmit() {
    setSubmittedPhone(input.phone.trim())
    setTimeout(() => {
      overviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <PageWrapper>
      {/* Section 1 — Input */}
      <NumberInput value={input} onChange={setInput} onSubmit={handleSubmit} />

      {result !== null && (
        <>
          {/* Section 2 — Overview */}
          <div ref={overviewRef} className="mt-8 scroll-mt-4">
            <ScoreOverview result={result} />
          </div>

          {/* Section 3 — Details */}
          <div className="mt-6 space-y-4">
            <HexagramSection result={result} />
            <ElementTable result={result} />
            <DigitGrid result={result} />
            <ScoreDetails result={result} />
          </div>
        </>
      )}
    </PageWrapper>
  )
}
