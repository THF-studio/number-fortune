import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import AnalyticsPage from './pages/AnalyticsPage'
import LifePathPage from './pages/LifePathPage'
import NumericEnergyPage from './pages/NumericEnergyPage'
import StrategyPage from './pages/StrategyPage'
import ProfilePage from './pages/ProfilePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/analytics/numeric-energy" replace /> },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
        children: [
          { index: true, element: <Navigate to="numeric-energy" replace /> },
          { path: 'life-path',      element: <LifePathPage /> },
          { path: 'numeric-energy', element: <NumericEnergyPage /> },
        ],
      },
      { path: 'strategy', element: <StrategyPage /> },
      { path: 'profile',  element: <ProfilePage /> },
    ],
  },
])
