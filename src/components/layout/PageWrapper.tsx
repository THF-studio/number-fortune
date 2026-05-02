interface PageWrapperProps {
  children: React.ReactNode
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {children}
    </div>
  )
}
