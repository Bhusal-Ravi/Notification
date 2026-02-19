import { Send } from 'lucide-react'
import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

type TelegramStatusProps = {
  email: string | undefined
}

function TelegramStatus({ email }: TelegramStatusProps) {
  const [telegramUserId, setTelegramUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate= useNavigate()
  useEffect(() => {
    if (!email) return
    async function checkStatus() {
      try {
        setLoading(true)
        const base = API_BASE_URL ? `${API_BASE_URL}` : ''
        const response = await fetch(`${base}/api/telegramstatus`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email })
        })
        const result = await response.json()
        if (result.status === 'linked') {
          setTelegramUserId(result.telegram_user_id)
        } else {
          setTelegramUserId(null)
        }
      } catch (error) {
        console.error('Failed to check telegram status:', error)
        setTelegramUserId(null)
      } finally {
        setLoading(false)
      }
    }
    checkStatus()
  }, [email])

  if (loading) {
    return (
      <div className='border-[4px] border-black bg-[#f7f7f7] px-5 py-4 text-center shadow-[6px_6px_0_#0b0b0d]'>
        <p className='text-sm font-semibold uppercase tracking-widest text-[#555]'>Checking Telegram status...</p>
      </div>
    )
  }

  return (
    <div className={`border-[4px] border-black px-5 py-4 text-center shadow-[6px_6px_0_#0b0b0d] ${telegramUserId ? 'bg-[#c1ff72]' : 'bg-[#ffb5bd]'}`}>
      {telegramUserId ? (
        <div>
          <p className='text-xs font-semibold uppercase tracking-widest text-[#0b0b0d]'>Telegram Linked</p>
          <p className='mt-1 text-lg font-black text-[#0b0b0d]'>You are currently linked with <span className='underline'>{telegramUserId}</span></p>
        </div>
      ) : (
        <div className='flex justify-center items-center flex-col'>
          <p className='text-xs font-semibold uppercase tracking-widest text-[#0b0b0d]'>Telegram Not Linked</p>
          <p className='mt-1 text-lg font-black text-[#0b0b0d]'>You are not currently linked to Telegram</p>
          <button 
            onClick={() => navigate('/telegramverify')} 
            className='mt-4 rounded-md bg-black'
          >
            <span className='bg-[#4ecdc4] inline-flex items-center gap-2 rounded-md border-2 border-black px-5 py-2.5 font-bold text-sm -translate-x-1 -translate-y-1 transition-all hover:-translate-x-2 hover:-translate-y-2 active:translate-x-0 active:translate-y-0'>
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              Activate Telegram Notifications
              <Send className='w-4 h-4' strokeWidth={2.5}/>
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

export default TelegramStatus
