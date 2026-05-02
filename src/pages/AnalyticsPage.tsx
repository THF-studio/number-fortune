import { NavLink, Outlet, Navigate } from 'react-router-dom'

const SUB_NAV = [
  { to: '/analytics/life-path',      label: '生命灵数' },
  { to: '/analytics/numeric-energy', label: '号码分析' },
]

export default function AnalyticsPage() {
  return (
    <div>
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex gap-6">
            {SUB_NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `py-3 text-sm border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
