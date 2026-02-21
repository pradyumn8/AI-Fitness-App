import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../contexts/AppContext'
import type { FoodEntry } from '../types';
import Card from '../components/ui/Card';
import { mealTypeOptions, quickActivitiesFoodLog } from '../assets/assets';
import { Loader2Icon, PlusIcon, SparkleIcon, UtensilsCrossed } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import mockApi from '../assets/mockApi';

const Foodlog = () => {
  const { allFoodLogs, setAllFoodLogs } = useAppContext()

  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    calories: 0,
    mealType: '',
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null)

  const today = new Date().toISOString().split('T')[0];

  const loadEntries = () => {
    const todayEntries = allFoodLogs.filter((entry: FoodEntry) => entry.createdAt?.split('T')[0] === today);
    setEntries(todayEntries);
  }

  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault()
    const {data}=await mockApi.foodLogs.create({data: formData})
    setAllFoodLogs(prev => [...prev])
  }

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);

  const handleQuickAdd = (activityName: string) => {
    setFormData({
      ...formData, mealType: activityName
    });
    setShowForm(true);
  }

  useEffect(() => {
    (() => { loadEntries(); })();
  }, [allFoodLogs]);

  return (
    <div className='page-container'>
      {/* Header */}
      <div className='page-header'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-800 dark:text-white'>Food Log</h1>
            <p className='text-slate-500 dark:text-slate-400 text-sm mt-1'>Track your daily food intake</p>
          </div>
          <div className="text-right">
            <p className='text-sm text-slate-500 dark:text-slate-400'>Today's Total</p>
            <p className='text-xl font-bold text-emerald-600 dark:text-emerald-400'>{totalCalories} kcal</p>
          </div>
        </div>
      </div>

      <div className='page-content-grid'>
        {/* Quick Add Section */}
        {!showForm && (
          <div className='space-y-4'>
            <Card>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Quick Add</h3>
              <div className='flex flex-wrap gap-2'>
                {quickActivitiesFoodLog.map((activity) => (
                  <button onClick={()=>handleQuickAdd(activity.name)} key={activity.name} className='px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors'>
                    {activity.emoji}
                    {activity.name}
                  </button>
                ))}
              </div>
            </Card>

            <Button className='w-full' onClick={()=>setShowForm(true)}>
              <PlusIcon className='size-5'/>
              Add Custom Food
            </Button>

            <Button className='w-full' onClick={()=>inputRef.current?.click()}>
              <SparkleIcon className='size-5'/>
              AI Food Snap
            </Button>
            <input type="file" accept='image/*' hidden ref={inputRef} />
            {loading && (
              <div className='fixed inset-0 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur flex items-center justify-center z-100'>
                <Loader2Icon className='size-8 text-emerabld-600 dark:text-emerald-400 animate-spin'/>
              </div>
            )}
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <Card className='border-2 border-emerald-200 dark:border-emerald-800'>
            <h3 className='font-semibold text-slate-800 dark:text-white mb-4'>New Food Entry</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input label='Food Name' value={formData.name} onChange={(e)=>setFormData({...formData, name: e.toString()})} placeholder='e.g., Grilled Chicken Salad' required/>

              <Input label='Calories' value={formData.calories} onChange={(e)=>setFormData({...formData, calories: Number(e)})} placeholder='e.g., 350' type='number' required min={1}/>

              <Select label='Meal Type' value={formData.mealType} onChange={(e)=>setFormData({...formData, mealType: e.toString()})} placeholder='e.g., Breakfast' options={mealTypeOptions} required/>

              <div className='flex gap-3 pt-2'>
              <Button className='flex-1' type='button' variant='secondary' onClick={()=>{setShowForm(false); setFormData({
                name: '',
                calories: 0,
                mealType: ''
              })}}>
                Cancel
              </Button>


              <Button type='submit' className='flex-1'>
                Add Entry
              </Button>
              </div>
            </form>
                
          </Card>
        )
        }
      </div>
    </div>
  )
}

export default Foodlog