import { Loader2Icon } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900'>
        <Loader2Icon className='h-8 w-8 animate-spin text-green-500'/>
    </div>
  )
}

export default Loading