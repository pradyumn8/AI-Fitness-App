import { AtSignIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../contexts/AppContext'
import { Toaster } from 'react-hot-toast'

const Login = () => {

  const [state, setState] = useState('sign up')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const { login, signup, user } = useAppContext()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (state === 'login') {
        await login({ email, password })
      } else {
        await signup({ username, email, password })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <>
      <Toaster />
      <main className='login-page-container'>
        <form onSubmit={handleSubmit} className='login-form'>
          <h2 className='text-3xl font-medium text-gray-900 dark:text-white'>{state === 'login' ? 'Sign In' : 'Sign Up'}</h2>
          <p className='mt-2 text-sm text-gray-500/90 dark:text-gray-400'>{state === 'login' ? 'Please enter email and password to access.?' : 'Please enter email and password to create an account.'}</p>

          {state !== 'login' && (
            <div className='mt-4'>
              <label htmlFor='name' className='text-sm font-medium text-gray-700 dark:text-gray-300'>Username</label>
              <div className='relative mt-2'>
                <AtSignIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5' />
                <input onChange={(e) => setUsername(e.target.value)} value={username} type='text' id='name' placeholder='Enter your username' className='login-input pl-10' required />
              </div>
            </div>
          )}

          {/* Email */}
          <div className='mt-4'>
            <label htmlFor='name' className='text-sm font-medium text-gray-700 dark:text-gray-300'>Email</label>
            <div className='relative mt-2'>
              <MailIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5' />
              <input onChange={(e) => setEmail(e.target.value)} value={email} type='email' id='name' placeholder='Enter your email' className='login-input pl-10' required />
            </div>
          </div>

          {/* Password */}
          <div className='mt-4'>
            <label htmlFor='name' className='text-sm font-medium text-gray-700 dark:text-gray-300'>Password</label>
            <div className='relative mt-2'>
              <LockIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5' />
              <input onChange={(e) => setPassword(e.target.value)} value={password} type={showPassword ? 'text' : 'password'} id='name' placeholder='Enter your password' className='login-input pl-10' required />
              <button type='button' className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600' onClick={() => setShowPassword((p) => !p)}>
                {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>
          </div>

          <button type='submit' disabled={isSubmitting} className='login-button'>
            {isSubmitting ? 'Submitting...' : state === 'login' ? 'Sign In' : 'Sign Up'}
          </button>

          {/* Toggle between Login and Signup */}
          <p className='mt-6 text-sm text-center text-gray-600 dark:text-gray-400'>
            {state === 'login' ? (
              <>Don't have an account? <span onClick={() => setState('signup')} className='text-green-600 hover:underline cursor-pointer font-medium'>Sign Up</span></>
            ) : (
              <>Already have an account? <span onClick={() => setState('login')} className='text-green-600 hover:underline cursor-pointer font-medium'>Sign In</span></>
            )}
          </p>
        </form>
      </main>
    </>
  )
}

export default Login