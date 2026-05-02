import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const ANALYTICS_SUB = [
  { to: '/analytics/life-path',      label: '生命灵数' },
  { to: '/analytics/numeric-energy', label: '号码分析' },
]

const TOP_NAV = [
  { to: '/analytics', label: '数理生命', exact: false, sub: ANALYTICS_SUB },
]

function navClass(isActive: boolean) {
  return isActive
    ? 'text-gray-700 text-sm font-semibold'
    : 'text-gray-700 text-sm'
}``

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const analyticsActive = location.pathname.startsWith('/analytics')

  // Close dropdown when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="bg-[#f9f9f9] sticky top-0 z-40 border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-12">
          <span className="font-semibold text-gray-700 text-md">号运</span>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-7">
            {TOP_NAV.map(item =>
              item.sub ? (
                /* Dropdown item */
                <div key={item.to} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(o => !o)}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      analyticsActive ? 'text-gray-700 font-semibold' : 'text-gray-700 hover:text-gray-800'
                    }`}
                  >
                    {item.label}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-[#f9f9f9] border border-gray-100 rounded-lg shadow-sm py-1 min-w-[150px] z-50">
                      {item.sub.map(s => (
                        <NavLink
                          key={s.to}
                          to={s.to}
                          onClick={() => setDropdownOpen(false)}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm ${
                              isActive ? 'text-gray-700 bg-gray-100 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                            }`
                          }
                        >
                          {s.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) => navClass(isActive)}
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-1 text-gray-700"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile menu — overlay, does not push content */}
      {mobileOpen && (
        <nav className="sm:hidden absolute top-12 left-0 right-0 bg-[#f9f9f9] shadow-md z-50 flex flex-col gap-1 px-4 py-3">
          <div className="py-1">
            <div className={`text-sm mb-1 ${analyticsActive ? 'text-gray-700 font-semibold' : 'text-gray-700'}`}>
              数理生命
            </div>
            {ANALYTICS_SUB.map(s => (
              <NavLink
                key={s.to}
                to={s.to}
                className={({ isActive }) => `block py-1.5 pl-4 text-sm ${isActive ? 'text-gray-700 font-semibold' : 'text-gray-700'}`}
                onClick={() => setMobileOpen(false)}
              >
                {s.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
