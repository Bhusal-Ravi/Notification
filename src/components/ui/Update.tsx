import { RefreshCcw, AlertCircle, Clock, Calendar, Globe, CheckCircle, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import TimezoneSelect from "react-timezone-select"
import { AnimatePresence, motion } from 'framer-motion'
import CustomNotification from '../CustomNotification'
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form"

type NotificationType = "first" | "second" | "third"

type UserTask = {
  taskid: number
  isactive: string
  timezone: string
  notify_after?: string
  taskname: string
  notification_type: NotificationType
  fixed_notify_time?: string
  fixed_notify_date?: string
  createdat: string
  taskpriority: string
}

type UpdateProps = {
  userid: string
}

const COMMON_INTERVALS = [
  { label: '5 min', value: '5 minutes' },
  { label: '15 min', value: '15 minutes' },
  { label: '30 min', value: '30 minutes' },
  { label: '1 hr', value: '1 hour' },
  { label: '2 hr', value: '2 hours' },
  { label: '6 hr', value: '6 hours' },
  { label: '12 hr', value: '12 hours' },
  { label: '1 day', value: '1 day' },
]

type FormValues = {
  tasks: UserTask[]
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

const validateNotifyAfter = (value: string): { isValid: boolean; error?: string } => {
  if (!value?.trim()) return { isValid: false, error: 'Notify After is required' }
  const pattern = /^\d+\s+(minute|hour|day)s?$/i
  if (!pattern.test(value.trim())) {
    return { isValid: false, error: 'Format: "5 minutes", "1 hour", "2 days"' }
  }
  return { isValid: true }
}

// Normalize isactive to boolean — handles true/false booleans, "true"/"false" strings, 1/0
const isActiveTrue = (val: unknown): boolean => {
  if (typeof val === 'boolean') return val
  if (typeof val === 'number') return val === 1
  if (typeof val === 'string') return val === 'true' || val === '1'
  return false
}

const TYPE_META = {
  first:  { label: 'TYPE 1 · INTERVAL',   color: 'bg-[#c1ff72]', accent: '#c1ff72' },
  second: { label: 'TYPE 2 · FIXED TIME', color: 'bg-[#7df9ff]', accent: '#7df9ff' },
  third:  { label: 'TYPE 3 · SCHEDULED',  color: 'bg-[#ff9f66]', accent: '#ff9f66' },
}

// ─── Single Task Card ────────────────────────────────────────────────────────
function TaskCard({ index, field, control, register, userid, showStatusCard }: {
  index: number
  field: UserTask & { id: string }
  control: any
  register: any
  userid: string
  showStatusCard: (text: string, variant: 'success' | 'error') => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const notifType = field.notification_type
  const meta = TYPE_META[notifType]

  const taskValues = useWatch({ control, name: `tasks.${index}` }) as UserTask


  async function updateUserTask(data: UserTask) {
    if (!userid) return null
    try {
      const base = API_BASE_URL ? `${API_BASE_URL}` : ''
      const response = await fetch(`${base}/api/updateput/${userid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fixed_notify_time: data.fixed_notify_time,
          fixed_notify_date: data.fixed_notify_date,
          isactive: data.isactive,
          taskname: data.taskname,
          timezone: data.timezone,
          notify_after: data.notify_after,
          taskid: data.taskid,
          notification_type: data.notification_type,
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)
      return result
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async function onConfirm() {
    if (notifType === 'first') {
      const validation = validateNotifyAfter(taskValues.notify_after ?? '')
      if (!validation.isValid) {
        showStatusCard(validation.error ?? 'Invalid interval', 'error')
        return
      }
    }
    setIsLoading(true)
    try {
      await updateUserTask(taskValues)
      showStatusCard(`"${taskValues.taskname}" updated!`, 'success')
      setExpanded(false)
    } catch (err: any) {
      showStatusCard(err?.message ?? 'Update failed', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22, delay: index * 0.04 }}
      className="relative border-[4px] border-black bg-[#fefefe] shadow-[6px_6px_0_#0b0b0d] overflow-hidden"
    >
      {/* Accent stripe */}
      <div className={`h-[5px] w-full ${meta.color} border-b-[3px] border-black`} />

      {/* ── Collapsed header (always visible) ── */}
      <div className="flex items-center gap-3 px-5 py-4">
        {/* Task name */}
        <h3 className="flex-1 min-w-0 text-sm sm:text-[15px] font-black uppercase text-[#0b0b0d] truncate leading-tight">
          {field.taskname}
        </h3>

        {/* Active / Paused toggle */}
        <Controller
          control={control}
          name={`tasks.${index}.isactive`}
          render={({ field: f }) => {
            const active = isActiveTrue(f.value)
            return (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  // Always store as string "true"/"false" for consistency
                  f.onChange(active ? 'false' : 'true')
                }}
                className={`shrink-0 border-[2.5px] border-black px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-[3px_3px_0_#0b0b0d] transition-colors ${
                  active ? 'bg-[#2fff2f] text-[#0b0b0d]' : 'bg-[#e0e0e0] text-[#555]'
                }`}
              >
                {active ? 'Active' : 'Paused'}
              </button>
            )
          }}
        />

        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          className={`shrink-0 border-[2.5px] border-black p-1.5 shadow-[3px_3px_0_#0b0b0d] transition-all ${meta.color} hover:brightness-95`}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} strokeWidth={3} />
          </motion.div>
        </button>
      </div>

      {/* ── Expanded body ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t-[3px] border-black px-4 py-4 flex flex-col gap-4">

              {/* Timezone */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#0b0b0d]">
                  <Globe size={11} /> Timezone
                </label>
                <div className="border-[3px] border-black shadow-[4px_4px_0_#0b0b0d]">
                  <Controller
                    control={control}
                    name={`tasks.${index}.timezone`}
                    render={({ field: f }) => (
                      <TimezoneSelect
                        value={f.value}
                        onChange={(tz) => f.onChange(typeof tz === 'string' ? tz : tz.value)}
                        styles={{
                          control: (base) => ({
                            ...base, border: 'none', boxShadow: 'none', borderRadius: 0,
                            fontWeight: 700, fontSize: '13px', background: '#fefefe',
                          }),
                          option: (base, state) => ({
                            ...base, fontWeight: 600, fontSize: '13px',
                            background: state.isSelected ? '#0b0b0d' : state.isFocused ? meta.accent : '#fefefe',
                            color: state.isSelected ? '#fefefe' : '#0b0b0d',
                          }),
                          menu: (base) => ({ ...base, border: '3px solid #0b0b0d', borderRadius: 0, boxShadow: '6px 6px 0 #0b0b0d' }),
                          singleValue: (base) => ({ ...base, fontWeight: 700 }),
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              {/* ── Type 1: Interval ── */}
              {notifType === 'first' && (
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#0b0b0d]">
                    <Clock size={11} /> Notify Interval
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_INTERVALS.map((opt) => (
                      <Controller
                        key={opt.value}
                        control={control}
                        name={`tasks.${index}.notify_after`}
                        render={({ field: f }) => (
                          <button
                            type="button"
                            onClick={() => f.onChange(opt.value)}
                            className={`border-[2.5px] border-black px-2.5 py-1 text-[10px] font-black uppercase tracking-wide transition-all ${
                              f.value === opt.value
                                ? 'bg-[#0b0b0d] text-[#c1ff72] shadow-none translate-x-[2px] translate-y-[2px]'
                                : 'bg-[#c1ff72] shadow-[3px_3px_0_#0b0b0d] hover:bg-[#a8e060]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        )}
                      />
                    ))}
                  </div>
                  <Controller
                    control={control}
                    name={`tasks.${index}.notify_after`}
                    render={({ field: f }) => {
                      const validation = validateNotifyAfter(f.value ?? '')
                      const isDirty = !!f.value
                      return (
                        <div className="flex flex-col gap-1">
                          <input
                            value={f.value ?? ''}
                            onChange={f.onChange}
                            placeholder='Custom: "30 minutes", "2 hours"'
                            className={`border-[3px] border-black bg-[#fefefe] px-3 py-2 text-sm font-bold placeholder:font-normal placeholder:text-[#aaa] shadow-[4px_4px_0_#0b0b0d] outline-none focus:shadow-[6px_6px_0_#0b0b0d] transition-all ${
                              isDirty && !validation.isValid ? 'border-red-500 bg-[#fff0f0]' : ''
                            }`}
                          />
                          {isDirty && !validation.isValid && (
                            <p className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                              <AlertCircle size={10} /> {validation.error}
                            </p>
                          )}
                          {isDirty && validation.isValid && (
                            <p className="text-[10px] font-bold text-green-700 flex items-center gap-1">
                              <CheckCircle size={10} /> Valid interval
                            </p>
                          )}
                        </div>
                      )
                    }}
                  />
                </div>
              )}

              {/* ── Type 2: Fixed Time ── */}
              {notifType === 'second' && (
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#0b0b0d]">
                    <Clock size={11} /> Fixed Notify Time
                  </label>
                  <input
                    type="time"
                    {...register(`tasks.${index}.fixed_notify_time`, { required: true })}
                    className="border-[3px] border-black bg-[#fefefe] px-3 py-2 text-sm font-bold shadow-[4px_4px_0_#0b0b0d] outline-none focus:shadow-[6px_6px_0_#0b0b0d] transition-all"
                  />
                </div>
              )}

              {/* ── Type 3: Fixed Time + Date ── */}
              {notifType === 'third' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#0b0b0d]">
                      <Clock size={11} /> Fixed Notify Time
                    </label>
                    <input
                      type="time"
                      {...register(`tasks.${index}.fixed_notify_time`, { required: true })}
                      className="border-[3px] border-black bg-[#fefefe] px-3 py-2 text-sm font-bold shadow-[4px_4px_0_#0b0b0d] outline-none focus:shadow-[6px_6px_0_#0b0b0d] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#0b0b0d]">
                      <Calendar size={11} /> Fixed Notify Date
                    </label>
                    <input
                      type="date"
                      {...register(`tasks.${index}.fixed_notify_date`, { required: true })}
                      className="border-[3px] border-black bg-[#fefefe] px-3 py-2 text-sm font-bold shadow-[4px_4px_0_#0b0b0d] outline-none focus:shadow-[6px_6px_0_#0b0b0d] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Confirm */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`border-[3px] border-black px-5 py-2 text-xs font-black uppercase tracking-wider shadow-[4px_4px_0_#0b0b0d] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0b0b0d] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed ${meta.color}`}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : 'Confirm'}
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────
function TaskSection({ title, type, fields, control, register, userid, showStatusCard }: {
  title: string
  type: NotificationType
  fields: (UserTask & { id: string })[]
  control: any
  register: any
  userid: string
  showStatusCard: (text: string, variant: 'success' | 'error') => void
}) {
  const filtered = fields
    .map((f, i) => ({ field: f, index: i }))
    .filter(({ field }) => field.notification_type === type)

  if (filtered.length === 0) return null

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className={`h-[3px] flex-1 border-b-[3px] border-black ${TYPE_META[type].color}`} />
        <span className="border-[3px] border-black px-4 py-1 text-[11px] font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_#0b0b0d] bg-[#fefefe]">
          {title}
        </span>
        <div className={`h-[3px] flex-1 border-b-[3px] border-black ${TYPE_META[type].color}`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(({ field, index }) => (
          <TaskCard
            key={field.id}
            index={index}
            field={field}
            control={control}
            register={register}
            userid={userid}
            showStatusCard={showStatusCard}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
function Update({ userid }: UpdateProps) {
  const [refreshingTasks, setRefreshingTasks] = useState(false)
  const [statusCards, setStatusCards] = useState<{ id: number; text: string; variant: 'success' | 'error' }[]>([])
  const [customNotificationset, setCustomNotification] = useState(false)

  const { control, register, reset } = useForm<FormValues>({
    defaultValues: { tasks: [] }
  })

  const { fields } = useFieldArray({ control, name: 'tasks' })

  const messageIdRef = useRef(0)
  const timeoutsRef = useRef<number[]>([])

  const showStatusCard = (text: string, variant: 'success' | 'error' = 'success') => {
    const id = messageIdRef.current++
    setStatusCards(prev => [...prev, { id, text, variant }])
    const timeoutId = window.setTimeout(() => {
      setStatusCards(prev => prev.filter(card => card.id !== id))
    }, 2500)
    timeoutsRef.current.push(timeoutId)
  }

  async function fetchUsertask() {
    if (!userid) return
    setRefreshingTasks(true)
    try {
      const base = API_BASE_URL ? `${API_BASE_URL}` : ''
      const response = await fetch(`${base}/api/updateget/${userid}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)
      reset({ tasks: result.data })
    } catch (error) {
      console.error(error)
      showStatusCard('Failed to load tasks', 'error')
    } finally {
      setRefreshingTasks(false)
    }
  }

  useEffect(() => {
    fetchUsertask()
    return () => { timeoutsRef.current.forEach(clearTimeout) }
  }, [userid])

  useEffect(() => {
    document.body.style.overflow = customNotificationset ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [customNotificationset])

  const typedFields = fields as (UserTask & { id: string })[]

  return (
    <div className="relative w-full max-w-6xl self-start mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">

      {/* Soft background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-[#7df9ff] opacity-25 blur-2xl" />
        <div className="absolute top-28 -left-20 h-64 w-64 rounded-full bg-[#ff9f66] opacity-20 blur-2xl" />
        <div className="absolute bottom-0 right-10 h-48 w-48 rounded-full bg-[#c1ff72] opacity-20 blur-2xl" />
      </div>

      {/* Custom notification overlay */}
      {customNotificationset && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
            onClick={() => setCustomNotification(false)}
          />
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setCustomNotification(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <CustomNotification setCustomNotification={setCustomNotification} />
            </div>
          </div>
        </>
      )}

      {/* Toast notifications */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {statusCards.map(card => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 200 }}
              transition={{ type: 'spring', stiffness: 250, damping: 24 }}
              className={`pointer-events-auto border-[4px] border-black rounded-none px-5 py-3 shadow-[10px_10px_0_#0b0b0d] text-sm font-black uppercase tracking-wider flex gap-2 items-center ${
                card.variant === 'success'
                  ? 'bg-[#c1ff72] text-[#0b0b0d]'
                  : 'bg-[#ffb5bd] text-[#0b0b0d]'
              }`}
            >
              {card.variant === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              {card.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="relative mb-12 overflow-hidden border-[4px] border-black bg-[#fefefe] px-6 py-8 shadow-[12px_12px_0_#0b0b0d]">
        <div className="pointer-events-none absolute -top-8 -right-4 h-28 w-28 rotate-[12deg] border-[4px] border-black bg-[#7df9ff] opacity-70" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rotate-6 border-[4px] border-black bg-[#ff9f66] opacity-70" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="inline-flex items-center gap-2 border-[3px] border-black bg-[#ffff00] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] shadow-[6px_6px_0_#0b0b0d]">
                Update Center
              </p>
              {/* Refresh button */}
              <div className="relative ml-2 h-10 w-10 group">
                <button
                  type="button"
                  disabled={refreshingTasks}
                  onClick={fetchUsertask}
                  className="absolute inset-0 z-10 flex h-full w-full items-center justify-center border-[3px] border-black bg-[#2fff2f] shadow-[6px_6px_0_#0b0b0d] transition-colors group-hover:bg-[#08a036]"
                >
                  {refreshingTasks ? (
                    <svg className="h-4 w-4 animate-spin text-black" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  ) : (
                    <RefreshCcw size={16} />
                  )}
                </button>
                <span className="absolute inset-0 bg-[#7df9ff] transition duration-200 group-hover:-translate-x-3 group-hover:-translate-y-3" />
                <span className="absolute inset-0 bg-[#ff9f66] transition duration-200 group-hover:translate-x-5 group-hover:translate-y-5" />
              </div>
            </div>

            <h1 className="mt-4 text-3xl font-black uppercase leading-tight text-[#0b0b0d] sm:text-[44px]">
              Update Your Notifications
            </h1>
            <p className="mt-2 max-w-xl text-base font-medium text-[#333]">
              Fine tune intervals, timezones, and cadence rules to match your daily flow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="cursor-pointer border-[3px] border-black bg-[#c1ff72] px-4 py-2 text-sm font-bold uppercase tracking-wider shadow-[4px_4px_0_#000] transition-transform hover:-translate-x-1 hover:-translate-y-1"
              onClick={() => setCustomNotification(prev => !prev)}
            >
              + Custom Notification
            </button>
            <div className="border-[3px] border-black bg-[#0b0b0d] px-3 py-2 text-xs font-black uppercase tracking-widest text-[#fefefe] shadow-[4px_4px_0_#000]">
              {typedFields.length} Task{typedFields.length === 1 ? '' : 's'}
            </div>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {typedFields.length === 0 && !refreshingTasks && (
        <div className="border-[4px] border-black border-dashed bg-[#fefefe] px-8 py-16 text-center shadow-[8px_8px_0_#0b0b0d]">
          <p className="text-lg font-black uppercase tracking-widest text-[#aaa]">
            No tasks found — hit refresh to load
          </p>
        </div>
      )}

      {/* Task sections */}
      <TaskSection
        title="Type 1 · Interval Notifications"
        type="first"
        fields={typedFields}
        control={control}
        register={register}
        userid={userid}
        showStatusCard={showStatusCard}
      />
      <TaskSection
        title="Type 2 · Daily Fixed-Time Notifications"
        type="second"
        fields={typedFields}
        control={control}
        register={register}
        userid={userid}
        showStatusCard={showStatusCard}
      />
      <TaskSection
        title="Type 3 · Scheduled One-Time Notifications"
        type="third"
        fields={typedFields}
        control={control}
        register={register}
        userid={userid}
        showStatusCard={showStatusCard}
      />
    </div>
  )
}

export default Update