import React, { useEffect, useState } from 'react'
import { useAppContext } from '../contexts/AppContext'
import { useTheme } from '../contexts/ThemeContext'
import type { ProfileFormData, UserData } from '../types'
import Card from '../components/ui/Card'
import { Calendar, Scale, Target, User, } from 'lucide-react'
import Button from '../components/ui/Button'
import { goalLabels, goalOptions } from '../assets/assets'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import mockApi from '../assets/mockApi'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, logout, fetchUser, allFoodLogs, allActivityLogs } = useAppContext()

  const { theme, toggleTheme } = useTheme()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({ age: 0, weight: 0, height: 0, goal: 'maintain', dailyCalorieIntake: 2000, dailyCalorieBurn: 400 })

  const fetchUserData = () => {
    if (user) {
      setFormData({
        age: user.age || 0,
        weight: user.weight || 0,
        height: user.height || 0,
        goal: user.goal || 'maintain',
        dailyCalorieIntake: user.dailyCalorieIntake || 2000,
        dailyCalorieBurn: user.dailyCalorieBurn || 400,
      })
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token') || ''
    if (token) {
      fetchUser(token)
    }
    fetchUserData()
  }, [])

  const handleSave = async () => {
    try {
      // Mock API Update
      const updates: Partial<UserData> = {
        ...formData,
        goal: formData.goal as 'lose' | 'gain' | 'maintain'
      };
      await mockApi.user.update(user?.id || '', updates)
      await fetchUser(user?.token || '')
      toast.success('Profile updated successfully')
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || 'Failed to update profile')
    }
    setIsEditing(false)
  }

  const getStats = () => {
    const totalFoodEntries = allFoodLogs?.length || 0;
    const totalActivies = allActivityLogs?.length || 0;

    return {totalFoodEntries, totalActivies}
  }
  
  const stats = getStats();

  if (!user || !formData) return null

  return (
    <div className='page-container'>
      {/* header */}
      <div className="page-header">
        <h1 className='text-2xl font-bold text-slate-800 dark:text-white'>Profile</h1>
        <p className='text-slate-500 dark:text-slate-400 text-sm mt-1'>Manage your settings</p>
      </div>

      <div className='profile-content'>
        {/* left col */}
        <Card>
          {/* Card Title */}
          <div className="flex items-center gap-4 mb-6">
            <div className='size-12 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center'>
              <User className='size-6 text-white' />
            </div>
            <div>
              <h2>Your Profile</h2>
              <p>Member since {new Date(user.createdAt || '').toLocaleDateString()}</p>
            </div>
          </div>

          {isEditing ? (
            <div className='space-y-4'>
              <Input label='Age' type='number' value={formData.age} onChange={(e) => setFormData({ ...formData, age: Number(e) })} min={13} max={120} />

              <Input label='Weight (kg)' type='number' value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: Number(e) })} min={20} max={300} />

              <Input label='Height (cm)' type='number' value={formData.height} onChange={(e) => setFormData({ ...formData, height: Number(e) })} min={100} max={250} />

              <Select label='Fitness Goal' value={formData.goal as string} onChange={(e) => setFormData({ ...formData, goal: e as 'lose' | 'gain' | 'maintain' })} options={goalOptions} />

              <div className='flex gap-3 pt-2'>
                <Button variant='secondary' className='flex-1' onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    age: Number(user.age),
                    weight: Number(user.weight),
                    height: Number(user.height),
                    goal: user.goal || '',
                    dailyCalorieIntake: user.dailyCalorieIntake || 2000,
                    dailyCalorieBurn: user.dailyCalorieBurn || 400,
                  });
                }}>
                  Cancel
                </Button>
                <Button variant='primary' className='flex-1'
                  onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className='space-y-4'>
                <div className='flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200'>
                  <div className='size-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center'>
                    <Calendar className='size-5 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div>
                    <p className='text-sm text-slate-500 dark:text-slate-400'>Age</p>
                    <p className='font-medium text-slate-800 dark:text-white'>{user.age} years</p>
                  </div>
                </div>

                <div className='flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200'>
                  <div className='size-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center'>
                    <Scale className='size-5 text-purple-600 dark:text-purple-400' />
                  </div>
                  <div>
                    <p className='text-sm text-slate-500 dark:text-slate-400'>Weight</p>
                    <p className='font-medium text-slate-800 dark:text-white'>{user.weight} kg</p>
                  </div>
                </div>

                {/* Height */}
                {user.height !== 0 && (
                  <div className='flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200'>
                    <div className='size-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center'>
                      <User className='size-5 text-green-600 dark:text-green-400' />
                    </div>
                    <div>
                      <p className='text-sm text-slate-500 dark:text-slate-400'>Height</p>
                      <p className='font-medium text-slate-800 dark:text-white'>{user.height} cm</p>
                    </div>
                  </div>
                )}

                {/* goal */}
                <div className='flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200'>
                  <div className='size-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center'>
                    <Target className='size-5 text-orange-600 dark:text-orange-400' />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Goal
                  </p>
                  <p className='font-semibold text-slate-800 dark:text-white capitalize'>{goalLabels[user?.goal || 'gain']}</p>
                </div>
              </div>

              <Button variant="secondary" onClick={() => setIsEditing(true)} className='w-full mt-4'>Edit Profile</Button>
            </>
          )}
        </Card>
        {/* right col */}
        <div className='space-y-4'>
          {/* stats card */}
          <Card>
            <h2 className='text-xl font-semibold mb-4'>Your Stats</h2>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg'>
                <div className='size-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center'>
                  <Calendar className='size-5 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <p className='text-sm text-slate-500 dark:text-slate-400'>Total Food Entries</p>
                  <p className='font-medium text-slate-800 dark:text-white'>{stats.totalFoodEntries}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile