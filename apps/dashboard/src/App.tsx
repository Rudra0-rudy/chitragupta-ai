import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { AuthProvider } from '@/context/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { NotFound } from '@/pages/NotFound'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Dashboard shell
import { DashboardLayout, DashboardIndexRedirect } from '@/components/dashboard/DashboardLayout'
import { Overview } from '@/pages/dashboard/Overview'
import { Alerts } from '@/pages/dashboard/Alerts'
import { Works } from '@/pages/dashboard/Works'
import { Reports } from '@/pages/dashboard/Reports'
import { Settings } from '@/pages/dashboard/Settings'

function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PageTransitionWrapper>
              <Home />
            </PageTransitionWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransitionWrapper>
              <Login />
            </PageTransitionWrapper>
          }
        />

        {/* Legacy /dashboard (placeholder page, unprotected for backward compat) */}
        <Route
          path="/dashboard-old"
          element={
            <ProtectedRoute>
              <PageTransitionWrapper>
                <Dashboard />
              </PageTransitionWrapper>
            </ProtectedRoute>
          }
        />

        {/* Dashboard shell — protected, nested routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Index: /dashboard → /dashboard/overview */}
          <Route index element={<DashboardIndexRedirect />} />
          <Route path="overview" element={<Overview />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="works" element={<Works />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 Catch-all */}
        <Route
          path="*"
          element={
            <PageTransitionWrapper>
              <NotFound />
            </PageTransitionWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <AnimatedRoutes />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
