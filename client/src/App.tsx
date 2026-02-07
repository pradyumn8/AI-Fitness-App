import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import ActivityLog from './pages/ActivityLog'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import { useAppContext } from './contexts/AppContext'
import Login from './pages/Login'

const App = () => {

  const { user, isUserFetched, onboardingCompleted } = useAppContext()

  if (!user) {
    return isUserFetched ? <Login /> : <p>Loading</p>
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<Dashboard />} />
        <Route path='food' element={<Dashboard />} />
        <Route path='activity' element={<ActivityLog />} />
        <Route path='profile' element={<Profile />} />
      </Routes>
    </>
  )
}

export default App