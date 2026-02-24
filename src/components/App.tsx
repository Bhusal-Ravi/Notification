import { useEffect, useState } from 'react'
import Update from './ui/Update'
import TelegramStatus from './ui/TelegramStatus'
import { RefreshCcw, Zap, Globe, Timer, Eye, TrendingUp, Calendar } from 'lucide-react'
import { authClient } from '../../lib/auth-client'

/**
 * PALETTE — 4 intentional colors:
 *
 *  Ink        #1a1a1a   borders, text, shadows
 *  Cream      #f2ece0   page base, card bg
 *  Terracotta #c8624a   primary accent — warm, earthy, readable
 *  Steel      #4a7c9e   secondary accent — cool counterweight
 *  Straw      #d4a843   tertiary accent — used only on count/highlight moments
 *
 *  White #ffffff for chip contrast surfaces only.
 *
 *  Rule: Terracotta → Subscriptions section identity
 *        Steel       → Streak section identity
 *        Straw       → Count/number highlights across both
 */

type UserInfoRow = {
  taskname: string
  taskdescription: string
  fixed_notify_time: string
  timezone: string
  notify_after: string
}

type UserStreak = {
  taskname: string
  count: number
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
)

const RefreshBtn = ({ loading, onClick }: { loading: boolean; onClick: () => void }) => (
  <button
    disabled={loading}
    onClick={onClick}
    className="
      group flex items-center gap-2
      border-[3px] border-[#1a1a1a] bg-white
      px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]
      shadow-[4px_4px_0_#1a1a1a]
      transition-all duration-150
      hover:shadow-[2px_2px_0_#1a1a1a] hover:translate-x-[2px] hover:translate-y-[2px]
      active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
      disabled:opacity-40 disabled:cursor-not-allowed
    "
  >
    {loading
      ? <><Spinner /><span>Loading…</span></>
      : <><RefreshCcw size={13} className="transition-transform duration-500 group-hover:rotate-180" /><span>Refresh</span></>
    }
  </button>
)

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="border-[2.5px] border-[#1a1a1a] bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0_#1a1a1a] whitespace-nowrap text-[#1a1a1a]">
    {children}
  </span>
)

const EmptyState = ({ title, body }: { title: string; body: string }) => (
  <div className="border-[3px] border-dashed border-[#1a1a1a]/20 px-6 py-16 text-center">
    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#1a1a1a]/30">{title}</p>
    <p className="mt-3 text-lg font-black text-[#1a1a1a]/40">{body}</p>
  </div>
)

function App() {
  const { data: session, isPending } = authClient.useSession()

  const [userid, setUserId] = useState('')
  const [userinfo, setUserInfo] = useState<UserInfoRow[]>([])
  const [userStreak, setUserStreak] = useState<UserStreak[]>([])
  const [loadinginfo, setLoadingInfo] = useState(false)
  const [loadingstreak, setLoadingStreak] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  const totalActiveTasks = userinfo.length
  const uniqueTimezones = new Set(userinfo.map((t) => t.timezone)).size
  const intervalDriven = userinfo.filter((t) => t.notify_after && t.notify_after !== '0').length
  const currentlyWatching = userStreak.length
  const userActivityCount = userStreak.reduce((acc, cur) => acc + (cur.count || 0), 0)

  async function fetchUser(email: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/userexist`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const result = await res.json()
      if (res.ok && result.status === 'pass' && result.data?.userid) setUserId(result.data.userid)
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    if (!isPending && session?.user?.email && !hasInitialized) {
      fetchUser(session.user.email)
      setHasInitialized(true)
    }
  }, [session?.user?.email, isPending, hasInitialized])

  async function fetchUserinfo() {
    try {
      setLoadingInfo(true)
      if (!userid) return
      const res = await fetch(`${API_BASE_URL}/api/userinfo/${userid}`, {
        credentials: 'include', headers: { 'Content-Type': 'application/json' },
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result?.message)
      setUserInfo(Array.isArray(result?.data) ? result.data : [])
    } catch (e) { console.log(e) }
    finally { setLoadingInfo(false) }
  }

  async function fetchUserStreak() {
    try {
      setLoadingStreak(true)
      if (!userid) return
      const res = await fetch(`${API_BASE_URL}/api/userstreak/${userid}`, {
        credentials: 'include', headers: { 'Content-Type': 'application/json' },
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result?.message)
      setUserStreak(Array.isArray(result?.data) ? result.data : [])
    } catch (e) { console.log(e) }
    finally { setLoadingStreak(false) }
  }

  useEffect(() => {
    if (userid) { fetchUserinfo(); fetchUserStreak() }
  }, [userid])

  const getNotifyTime = (t: UserInfoRow) => {
    if (t.taskname === 'Drink Water') return 'Interval'
    if (t.taskname === 'Mid Night Report') return 'Midnight'
    return t.fixed_notify_time
  }
  const getCadence = (t: UserInfoRow) =>
    t.taskname === 'Mid Night Report' ? '1 Day' : t.notify_after || '—'
  const getStreakDesc = (name: string) => {
    if (name === 'Drink Water') return 'Times water intake was logged today'
    if (name === 'Daily Exercise') return 'Exercise sessions completed today'
    if (name === 'Study Session') return 'Study sessions logged today'
    return 'Total logged entries today'
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Bebas+Neue&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --ink:   #1a1a1a;
          --cream: #f2ece0;
          --terra: #c8624a;
          --steel: #4a7c9e;
          --straw: #d4a843;
        }

        body {
          margin: 0;
          background-color: var(--cream);
          background-image: radial-gradient(#1a1a1a0f 1px, transparent 1px);
          background-size: 24px 24px;
          font-family: 'DM Sans', sans-serif;
          color: var(--ink);
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-inner { animation: marquee 32s linear infinite; display: flex; width: max-content; }

        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .blink { animation: blink 1.2s step-end infinite; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up  { animation: fadeUp 0.45s cubic-bezier(.22,.68,0,1.2) both; }
        .delay-1  { animation-delay: 0.05s; }
        .delay-2  { animation-delay: 0.15s; }
        .delay-3  { animation-delay: 0.25s; }
        .delay-4  { animation-delay: 0.35s; }

        .card-grid > *:nth-child(1) { animation-delay: 0.04s; }
        .card-grid > *:nth-child(2) { animation-delay: 0.10s; }
        .card-grid > *:nth-child(3) { animation-delay: 0.16s; }
        .card-grid > *:nth-child(4) { animation-delay: 0.22s; }
        .card-grid > *:nth-child(5) { animation-delay: 0.28s; }
        .card-grid > *:nth-child(6) { animation-delay: 0.34s; }

        .card-lift { transition: transform 180ms ease, box-shadow 180ms ease; }
        .card-lift:hover  { transform: translate(-3px,-3px); box-shadow: 8px 8px 0 var(--ink) !important; }
        .card-lift:active { transform: translate(1px,1px);   box-shadow: 2px 2px 0 var(--ink) !important; }
      `}</style>

      <div className="min-h-screen w-full">

        {/* ── Ticker ──────────────────────────────────────────────────────── */}
        <div className="w-full overflow-hidden border-b-[3px] border-[#1a1a1a] bg-[#1a1a1a] py-2.5">
          <div className="marquee-inner">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="flex items-center gap-8 px-8 text-[10px] font-black uppercase tracking-[0.28em] whitespace-nowrap text-[#f2ece0]/70">
                <span className="blink" style={{ color: '#c8624a' }}>●</span>
                <span>Notification Hub</span>
                <span className="opacity-30">·</span>
                <span>Telegram Active</span>
                <span className="opacity-30">·</span>
                <span>Streak Monitor Live</span>
                <span className="opacity-30">·</span>
                <span style={{ color: '#d4a843' }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="opacity-30">·</span>
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 space-y-12">

          {/* Telegram */}
          <div className="fade-up delay-1">
            <TelegramStatus email={session?.user?.email} />
          </div>

          {/* 
              SUBSCRIPTIONS — Terracotta identity
           */}
          <section className="fade-up delay-2 border-[3px] border-[#1a1a1a] bg-[#faf6ef] shadow-[10px_10px_0_#1a1a1a] overflow-hidden">

            {/* Terracotta stripe */}
            <div className="h-[7px] border-b-[3px] border-[#1a1a1a]" style={{ backgroundColor: '#c8624a' }} />

            <div className="px-6 sm:px-10 py-8 space-y-8">

              {/* Header */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <span
                    className="inline-flex items-center gap-2 border-[3px] border-[#1a1a1a] px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] shadow-[4px_4px_0_#1a1a1a] text-white"
                    style={{ backgroundColor: '#c8624a' }}
                  >
                    <span className="blink">●</span> Subscriptions Live
                  </span>
                  <h1
                    className="text-[48px] sm:text-[64px] font-black uppercase leading-[0.88] text-[#1a1a1a]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.01em' }}
                  >
                    Notification<br />Hub
                  </h1>
                  <p className="text-sm font-medium text-[#1a1a1a]/50 max-w-sm leading-relaxed">
                    All your active notification flows in one place, synced across timezones.
                  </p>
                </div>
                <div className="shrink-0 pt-1">
                  <RefreshBtn loading={loadinginfo} onClick={fetchUserinfo} />
                </div>
              </div>

              {/* Stats — terracotta on first, neutral others */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Active Flows',   value: totalActiveTasks, bg: '#c8624a', text: 'white', icon: Zap   },
                  { label: 'Timezones',      value: uniqueTimezones,  bg: '#ffffff', text: '#1a1a1a', icon: Globe },
                  { label: 'Interval Based', value: intervalDriven,   bg: '#f2ece0', text: '#1a1a1a', icon: Timer },
                ].map(({ label, value, bg, text, icon: Icon }) => (
                  <div key={label} className="border-[3px] border-[#1a1a1a] shadow-[5px_5px_0_#1a1a1a] p-5 flex flex-col gap-3" style={{ backgroundColor: bg, color: text }}>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">{label}</span>
                      <Icon size={14} className="opacity-30" />
                    </div>
                    <p className="text-[42px] font-black leading-none tabular-nums">{String(value).padStart(2, '0')}</p>
                  </div>
                ))}
              </div>

              <div className="border-t-[2px] border-dashed border-[#1a1a1a]/15" />

              {userinfo.length === 0 ? (
                <EmptyState title="No Subscriptions Yet" body="Wire up a notification to watch it land here." />
              ) : (
                <div className="card-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {userinfo.map((data, i) => (
                    <div
                      key={data.taskname + i}
                      className="fade-up card-lift border-[3px] border-[#1a1a1a] bg-[#faf6ef] shadow-[5px_5px_0_#1a1a1a] flex flex-col overflow-hidden"
                    >
                      {/* Card top — terracotta tint, light enough for black text */}
                      <div
                        className="border-b-[3px] border-[#1a1a1a] px-4 py-2.5 flex items-center justify-between"
                        style={{ backgroundColor: '#f0d5cf' }}
                      >
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/50">Task</span>
                        <Tag>#{data.taskname.slice(0, 4).toUpperCase()}</Tag>
                      </div>

                      <div className="p-5 flex flex-col gap-4 flex-1">
                        <h3
                          className="text-[26px] font-black text-[#1a1a1a] leading-tight"
                          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}
                        >
                          {data.taskname}
                        </h3>
                        <p className="text-xs font-medium leading-relaxed text-[#1a1a1a]/50 pl-3 border-l-[3px] border-[#1a1a1a]/12 flex-1">
                          {data.taskdescription}
                        </p>
                        <div className="space-y-2 mt-auto">
                          {/* Notify row — straw yellow */}
                          <div
                            className="flex flex-wrap items-center justify-between gap-2 border-[2.5px] border-[#1a1a1a] px-3 py-2.5 shadow-[3px_3px_0_#1a1a1a]"
                            style={{ backgroundColor: '#f0d08a' }}
                          >
                            <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#1a1a1a]">Notify At</span>
                            <div className="flex flex-wrap gap-1.5">
                              <Tag>{getNotifyTime(data)}</Tag>
                              <Tag>{data.timezone}</Tag>
                            </div>
                          </div>
                          {/* Cadence row — neutral */}
                          <div className="flex items-center justify-between gap-2 border-[2.5px] border-[#1a1a1a] bg-white px-3 py-2.5 shadow-[3px_3px_0_#1a1a1a]">
                            <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#1a1a1a]/50">Cadence</span>
                            <Tag>{getCadence(data)}</Tag>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 
              DAILY STREAK — Steel blue identity
           */}
          <section className="fade-up delay-3 border-[3px] border-[#1a1a1a] bg-[#faf6ef] shadow-[10px_10px_0_#1a1a1a] overflow-hidden">

            {/* Steel stripe */}
            <div className="h-[7px] border-b-[3px] border-[#1a1a1a]" style={{ backgroundColor: '#4a7c9e' }} />

            <div className="px-6 sm:px-10 py-8 space-y-8">

              {/* Header */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <span
                    className="inline-flex items-center gap-2 border-[3px] border-[#1a1a1a] px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] shadow-[4px_4px_0_#1a1a1a] text-white"
                    style={{ backgroundColor: '#4a7c9e' }}
                  >
                    <span className="blink">●</span> Daily Streak Monitor
                  </span>
                  <h2
                    className="text-[48px] sm:text-[64px] font-black uppercase leading-[0.88] text-[#1a1a1a]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.01em' }}
                  >
                    Your Daily<br />Streak
                  </h2>
                  <p className="text-sm font-medium text-[#1a1a1a]/50 max-w-sm leading-relaxed">
                    Inputs logged via Telegram. Stay consistent — keep the streak alive.
                  </p>
                </div>
                <div className="shrink-0 pt-1">
                  <RefreshBtn loading={loadingstreak} onClick={fetchUserStreak} />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Steel highlight */}
                <div className="border-[3px] border-[#1a1a1a] shadow-[5px_5px_0_#1a1a1a] p-5 flex flex-col gap-3 text-white" style={{ backgroundColor: '#4a7c9e' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-70">Watching</span>
                    <Eye size={14} className="opacity-40" />
                  </div>
                  <p className="text-[42px] font-black leading-none tabular-nums">{String(currentlyWatching).padStart(2, '0')}</p>
                </div>
                {/* Neutral */}
                <div className="border-[3px] border-[#1a1a1a] bg-white shadow-[5px_5px_0_#1a1a1a] p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-50">Total Activity</span>
                    <TrendingUp size={14} className="opacity-25" />
                  </div>
                  <p className="text-[42px] font-black leading-none tabular-nums">{String(userActivityCount).padStart(2, '0')}</p>
                </div>
                {/* Straw date */}
                <div className="border-[3px] border-[#1a1a1a] shadow-[5px_5px_0_#1a1a1a] p-5 flex flex-col gap-3" style={{ backgroundColor: '#f0d08a' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60 text-[#1a1a1a]">Date Today</span>
                    <Calendar size={14} className="opacity-30" />
                  </div>
                  <p className="text-lg font-black leading-snug text-[#1a1a1a]">{new Date().toDateString()}</p>
                </div>
              </div>

              <div className="border-t-[2px] border-dashed border-[#1a1a1a]/15" />

              {userStreak.length === 0 ? (
                <EmptyState title="No Input Yet" body="Log inputs in the Telegram bot to watch them appear here." />
              ) : (
                <div className="card-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {userStreak.map((data, i) => (
                    <div
                      key={data.taskname}
                      className="fade-up card-lift border-[3px] border-[#1a1a1a] bg-[#faf6ef] shadow-[5px_5px_0_#1a1a1a] overflow-hidden"
                    >
                      {/* Steel tint header */}
                      <div
                        className="border-b-[3px] border-[#1a1a1a] px-4 py-2.5"
                        style={{ backgroundColor: '#c8dcea' }}
                      >
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/50">Streak Log</span>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                        <h3
                          className="text-[26px] font-black text-[#1a1a1a] leading-tight"
                          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}
                        >
                          {data.taskname}
                        </h3>
                        {/* Count row — straw accent */}
                        <div
                          className="flex items-center justify-between border-[2.5px] border-[#1a1a1a] px-3 py-3 shadow-[3px_3px_0_#1a1a1a]"
                          style={{ backgroundColor: '#f0d08a' }}
                        >
                          <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#1a1a1a]">Count</span>
                          <span className="border-[2.5px] border-[#1a1a1a] bg-white px-4 py-1 text-3xl font-black shadow-[3px_3px_0_#1a1a1a] tabular-nums text-[#1a1a1a]">
                            {String(data.count).padStart(2, '0')}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#1a1a1a]/50 pl-3 border-l-[2.5px] border-[#1a1a1a]/12">
                          {getStreakDesc(data.taskname)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 
              UPDATE SETTINGS
           */}
          <section className="fade-up delay-4 border-[3px] border-[#1a1a1a] bg-[#faf6ef] shadow-[10px_10px_0_#1a1a1a] overflow-hidden">
            <div className="h-[7px] border-b-[3px] border-[#1a1a1a]" style={{ backgroundColor: '#d4a843' }} />
            <div className="px-6 sm:px-10 py-8">
              <div className="mb-8 space-y-3">
                <span
                  className="inline-flex items-center gap-2 border-[3px] border-[#1a1a1a] px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] shadow-[4px_4px_0_#1a1a1a] text-[#1a1a1a]"
                  style={{ backgroundColor: '#f0d08a' }}
                >
                  <span className="blink">●</span> Manage
                </span>
                <h2
                  className="text-[48px] sm:text-[64px] font-black uppercase leading-[0.88] text-[#1a1a1a]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.01em' }}
                >
                  Update<br />Settings
                </h2>
              </div>
              <Update userid={userid} />
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center pb-4">
            <p className="text-[9px] font-black uppercase tracking-[0.45em] text-[#1a1a1a]/20">
              Notification Hub · {new Date().getFullYear()} · Brutalist by design
            </p>
          </footer>

        </div>
      </div>
    </>
  )
}

export default App