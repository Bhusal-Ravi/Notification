import { ExternalLink } from 'lucide-react'
import  { useEffect, useState } from 'react'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

type TelegramStatusProps = {
  email: string | undefined
}

function TelegramStatus({ email }: TelegramStatusProps) {
  const [telegramUserId, setTelegramUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
          <a target="_blank" rel="noopener noreferrer" href='https://t.me/No_Ti_Fi_Ca_Ti_OnBot' className='text-xs mt-2 max-w-fit flex justify-center hover:border-b-2 border-blue-400 items-center font-semibold uppercase '>Activate your telegram notifications <ExternalLink className='ml-2 h-4 w-4' strokeWidth={1.5}/> </a>
        </div>
      )}
    </div>
  )
}

export default TelegramStatus
