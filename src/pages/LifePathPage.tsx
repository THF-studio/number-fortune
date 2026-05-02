import { useRef, useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import LifePathInput from '../components/analysis/LifePathInput'
import { LifePathCore } from '../components/analysis/LifePathReport'
import { useLifePath } from '../hooks/useLifePath'
import type { LifePathDOBInput } from '../types'

const DEFAULT_INPUT: LifePathDOBInput = { year: '', month: '', day: '' }

export default function LifePathPage() {
  const [input, setInput] = useState<LifePathDOBInput>(DEFAULT_INPUT)
  const [submitted, setSubmitted] = useState<LifePathDOBInput | null>(null)
  const result = useLifePath(submitted)
  const overviewRef = useRef<HTMLDivElement>(null)

  function handleSubmit() {
    setSubmitted({ ...input })
    setTimeout(() => {
      overviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <PageWrapper>
      {/* Section 1 — Input */}
      <LifePathInput value={input} onChange={setInput} onSubmit={handleSubmit} />

      {result !== null && (
        <>
          {/* Section 2 — 灵数核心 */}
          <div ref={overviewRef} className="mt-2 scroll-mt-4">
            <LifePathCore result={result} />
          </div>

</>
      )}
    </PageWrapper>
  )
}
