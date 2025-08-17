import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Habits from './pages/Habits'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import GlobalLoader from './components/GlobalLoader'

function App() {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Don't show global loading spinner, let individual components handle their loading states
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
  <GlobalLoader />
      <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
  <main className="flex-1 p-6 md:px-10">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
