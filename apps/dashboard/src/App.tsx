import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { AuthProvider } from '@/context/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'

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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransitionWrapper>
                <Dashboard />
              </PageTransitionWrapper>
            </ProtectedRoute>
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
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
