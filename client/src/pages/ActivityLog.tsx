import React, { useEffect, useState } from 'react'
import { useAppContext } from '../contexts/AppContext'
import type { ActivityEntry } from '../types'
import { quickActivities } from '../assets/assets'
import Card from '../components/ui/Card'
import { DumbbellIcon, PlusIcon } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import mockApi from '../assets/mockApi'

const ActivityLog = () => {

  const { allActivityLogs, setAllActivityLogs } = useAppContext()

  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<{ name: string; duration: number; calories: number }>({
    name: '',
    duration: 0,
    calories: 0,
  })
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const loadActivities = () => {
    const todayActivities = allActivityLogs.filter((activity: ActivityEntry) => activity.createdAt?.split('T')[0] === today)
    setActivities(todayActivities)
  }

  useEffect(() => {
    (() => {
      loadActivities()
    })()
  }, [allActivityLogs])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!formData.name || !formData.duration || !formData.calories) {
      setError('Please fill in all fields')
      return
    }
    const { data } = await mockApi.activityLogs.create({ data: formData })
    setAllActivityLogs(prev => [...prev, data])
    setFormData({ name: '', duration: 0, calories: 0 })
    setShowForm(false)
  }

  const handleQuickAdd = (activity: { name: string, rate: number }) => {
    setFormData({
      name: activity.name,
      duration: 30,
      calories: 30 * activity.rate
    })
    setShowForm(true)
  }

  const handleDurationChange = (val: string | number) => {
    const duration = Number(val);
    const activity = quickActivities.find((activity) => activity.name === formData.name);

    let calories = formData.calories
    if (activity) {
      calories = duration * activity.rate
    }
    setFormData({
      ...formData,
      duration,
      calories
    })
  }


const totalMinutes: number = activities.reduce((sum, activity) => sum + activity.duration, 0)

return (
  <div className='page-container'>
    {/* Header */}
    <div className='page-header'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-slate-800 dark:text-white'>Activity Log</h1>
          <p className='text-slate-500 dark:text-slate-400 text-sm mt-1'>Track your daily food intake</p>
        </div>
        <div className="text-right">
          <p className='text-sm text-slate-500 dark:text-slate-400'>Active Today</p>
          <p className='text-xl font-bold text-blue-600 dark:text-blue-400'>{totalMinutes} mins</p>
        </div>
      </div>
    </div>

    <div className='page-content-grid'>
      {/* Quick Add Section */}
      {!showForm && (
        <div className='space-y-4'>
          <Card>
            <h3 className='font-semibold text-slate-700 dark:text-slate-200 mb-3'>Quick Add</h3>
            <div className='flex gap-2 flex-wrap'>
              {quickActivities.map((activity) => (
                <button onClick={() => handleQuickAdd(activity)} key={activity.name} className='px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors'>
                  {activity.emoji}
                  {activity.name}
                </button>
              ))}
            </div>
          </Card>
          <Button onClick={() => setShowForm(true)} className='w-full '>
            <PlusIcon className='size-5' />
            Add Custom Activity
          </Button>
        </div>
      )}
      {/* Add Form */}
      {showForm && (
        <Card className='border-2 border-blue-200 dark:border-blue-800'>
          <h3 className='font-semibold text-slate-800 dark:text-white mb-3'>New Activity Entry</h3>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input label='Activity Name' value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.toString() })} placeholder='e.g., Morning Run' required />

            <div className='flex gap-4'>
              <Input label='Duration (minutes)' value={formData.duration} placeholder='e.g., 30' type='number' required min={1} max={300} onChange={handleDurationChange}/>

              <Input label='Calories Burned' value={formData.calories} onChange={(e) => setFormData({ ...formData, calories: Number(e) })} placeholder='e.g., 150' type='number' required min={1} />
            </div>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            
            <div className='flex gap-3 pt-2'>
              <Button variant='secondary' type='button' onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type='submit'>Add Activity</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Activities List */}
      {activities.length === 0 ? (
        <Card className='text-center py-12'>
          <div>
            <DumbbellIcon className='w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-4' />
          </div>
          <h3 className='text-slate-800 dark:text-white font-semibold mb-2'>No Activities Yet</h3>
          <p className='text-slate-500 dark:text-slate-400 text-sm'>Get started by adding your first activity</p>
        </Card>
      ):(
        <Card>

        </Card>
      )}
    </div>
  </div>
)
}

export default ActivityLog