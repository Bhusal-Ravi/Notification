import { RefreshCcw, AlertCircle, Clock, Calendar, Globe, CheckCircle, ChevronDown, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import TimezoneSelect from "react-timezone-select"
import { AnimatePresence, motion } from 'framer-motion'
import CustomNotification from '../CustomNotification'
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form"

/**
 * PALETTE — matches App.tsx exactly:
 *  Ink        #1a1a1a
 *  Cream      #f2ece0  (page base)
 *  Card       #faf6ef  (card surface)
 *  Terracotta #c8624a  → Type 1 / primary accent
 *  Steel      #4a7c9e  → Type 2 accent
 *  Straw      #f0d08a  → Type 3 / highlight moments
 *
 *  Tints (for card headers, safe on black text):
 *    Terra tint  #f0d5cf
 *    Steel tint  #c8dcea
 *    Straw tint  #f9edca
 */

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
  showStatusCard: (text: string, variant: 'success' | 'error') => void
}

const COMMON_INTERVALS = [
  { label: '5 min',  value: '5 minutes'  },
  { label: '15 min', value: '15 minutes' },
  { label: '30 min', value: '30 minutes' },
  { label: '1 hr',   value: '1 hour'     },
  { label: '2 hr',   value: '2 hours'    },
  { label: '6 hr',   value: '6 hours'    },
  { label: '12 hr',  value: '12 hours'   },
  { label: '1 day',  value: '1 day'      },
]

type FormValues = { tasks: UserTask[] }

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

const validateNotifyAfter = (value: string): { isValid: boolean; error?: string } => {
  if (!value?.trim()) return { isValid: false, error: 'Notify After is required' }
  const pattern = /^\d+\s+(minute|hour|day)s?$/i
  if (!pattern.test(value.trim())) return { isValid: false, error: 'Format: "5 minutes", "1 hour", "2 days"' }
  return { isValid: true }
}

const isActiveTrue = (val: unknown): boolean => {
  if (typeof val === 'boolean') return val
  if (typeof val === 'number') return val === 1
  if (typeof val === 'string') return val === 'true' || val === '1'
  return false
}

// Per-type visual identity
const TYPE_META = {
  first:  { label: 'TYPE 1 · INTERVAL',   stripe: '#c8624a', tint: '#f0d5cf', pill: '#c8624a', pillText: '#fff', chipSel: '#c8624a', chipSelText: '#fff', chipBg: '#f0d5cf' },
  second: { label: 'TYPE 2 · FIXED TIME', stripe: '#4a7c9e', tint: '#c8dcea', pill: '#4a7c9e', pillText: '#fff', chipSel: '#4a7c9e', chipSelText: '#fff', chipBg: '#c8dcea' },
  third:  { label: 'TYPE 3 · SCHEDULED',  stripe: '#d4a843', tint: '#f9edca', pill: '#f0d08a', pillText: '#1a1a1a', chipSel: '#d4a843', chipSelText: '#1a1a1a', chipBg: '#f9edca' },
}

//  Spinner ─
const Spinner = ({ size = 14 }: { size?: number }) => (
  <svg style={{ width: size, height: size }} className="animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
)

//  Field Label ─
const FieldLabel = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
  <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]/60">
    <Icon size={11} />
    {children}
  </label>
)

//  Task Card ─
function TaskCard({ index, field, control, register, userid, showStatusCard, onDelete }: {
  index: number
  field: UserTask & { id: string }
  control: any
  register: any
  userid: string
  showStatusCard: (text: string, variant: 'success' | 'error') => void
  onDelete: (taskid: number) => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [showConfirmMsg, setShowConfirmMsg] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const notifType = field.notification_type
  const meta = TYPE_META[notifType]
  const taskValues = useWatch({ control, name: `tasks.${index}` }) as UserTask

  async function updateUserTask(data: UserTask) {
    if (!userid) return null
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
  }

  async function onConfirm() {
    if (notifType === 'first') {
      const v = validateNotifyAfter(taskValues.notify_after ?? '')
      if (!v.isValid) { showStatusCard(v.error ?? 'Invalid interval', 'error'); return }
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

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const base = API_BASE_URL ? `${API_BASE_URL}` : ''
      const response = await fetch(`${base}/api/deletetask/${userid}/${field.taskid}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)
      showStatusCard(`"${field.taskname}" deleted!`, 'success')
      setShowDeleteModal(false)
      onDelete(field.taskid)
    } catch (err: any) {
      showStatusCard(err?.message ?? 'Delete failed', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22, delay: index * 0.04 }}
      className="border-[3px] border-[#1a1a1a] bg-[#faf6ef] shadow-[5px_5px_0_#1a1a1a] overflow-hidden"
      style={{ transition: 'box-shadow 180ms ease, transform 180ms ease' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '8px 8px 0 #1a1a1a' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '5px 5px 0 #1a1a1a' }}
    >
      {/* Colored stripe */}
      <div className="h-[6px] border-b-[3px] border-[#1a1a1a]" style={{ backgroundColor: meta.stripe }} />

      {/*  Collapsed header  */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        <h3 className="flex-1 min-w-0 text-[15px] font-black uppercase text-[#1a1a1a] truncate leading-tight"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.03em', fontSize: '18px' }}>
          {field.taskname}
        </h3>

        {/* Active toggle */}
        <Controller
          control={control}
          name={`tasks.${index}.isactive`}
          render={({ field: f }) => {
            const active = isActiveTrue(f.value)
            const handleClick = (e: React.MouseEvent) => {
              e.stopPropagation()
              f.onChange(active ? 'false' : 'true')
              setShowConfirmMsg(true)
              if (timeoutRef.current) clearTimeout(timeoutRef.current)
              timeoutRef.current = setTimeout(() => setShowConfirmMsg(false), 4000)
            }
            useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])
            return (
              <div className="flex flex-col items-end gap-1">
                <button
                  type="button"
                  onClick={handleClick}
                  className="shrink-0 border-[2.5px] border-[#1a1a1a] px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0_#1a1a1a] transition-all"
                  style={{
                    backgroundColor: active ? '#c8624a' : '#e8e2d8',
                    color: active ? '#fff' : '#1a1a1a',
                  }}
                >
                  {active ? 'Active' : 'Paused'}
                </button>
                {showConfirmMsg && (
                  <span className="text-[9px] font-bold text-[#c8624a] text-right max-w-[140px] leading-tight">
                    Expand &amp; confirm to save changes
                  </span>
                )}
              </div>
            )
          }}
        />

        {/* Delete button */}
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="shrink-0 flex items-center justify-center border-[2.5px] border-[#1a1a1a] p-2 text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0_#1a1a1a] transition-all hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          style={{ backgroundColor: '#ffb5bd', color: '#1a1a1a' }}
        >
          <Trash2 size={14} strokeWidth={2.5} />
        </button>

        {/* Expand button */}
        <button
          type="button"
          onClick={() => setExpanded(p => !p)}
          className="shrink-0 flex items-center gap-1.5 border-[2.5px] border-[#1a1a1a] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0_#1a1a1a] transition-all hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          style={{ backgroundColor: meta.tint, color: '#1a1a1a' }}
        >
          <span>Edit</span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={13} strokeWidth={3} />
          </motion.div>
        </button>
      </div>

      {/*  Expanded body  */}
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
            <div className="border-t-[3px] border-[#1a1a1a] px-4 py-5 flex flex-col gap-5 bg-white/40">

              {/* Timezone */}
              <div className="flex flex-col gap-2">
                <FieldLabel icon={Globe}>Timezone</FieldLabel>
                <div className="border-[3px] border-[#1a1a1a] shadow-[3px_3px_0_#1a1a1a]">
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
                            fontWeight: 700, fontSize: '13px', background: '#faf6ef',
                          }),
                          option: (base, state) => ({
                            ...base, fontWeight: 600, fontSize: '13px',
                            background: state.isSelected ? '#1a1a1a' : state.isFocused ? meta.tint : '#faf6ef',
                            color: state.isSelected ? '#fff' : '#1a1a1a',
                          }),
                          menu: (base) => ({
                            ...base, border: '3px solid #1a1a1a', borderRadius: 0,
                            boxShadow: '5px 5px 0 #1a1a1a',
                          }),
                          singleValue: (base) => ({ ...base, fontWeight: 700, color: '#1a1a1a' }),
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              {/*  Type 1: Interval  */}
              {notifType === 'first' && (
                <div className="flex flex-col gap-3">
                  <FieldLabel icon={Clock}>Notify Interval</FieldLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_INTERVALS.map((opt) => (
                      <Controller
                        key={opt.value}
                        control={control}
                        name={`tasks.${index}.notify_after`}
                        render={({ field: f }) => {
                          const selected = f.value === opt.value
                          return (
                            <button
                              type="button"
                              onClick={() => f.onChange(opt.value)}
                              className="border-[2.5px] border-[#1a1a1a] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide transition-all"
                              style={{
                                backgroundColor: selected ? '#1a1a1a' : meta.chipBg,
                                color: selected ? meta.tint : '#1a1a1a',
                                boxShadow: selected ? 'none' : '3px 3px 0 #1a1a1a',
                                transform: selected ? 'translate(2px,2px)' : '',
                              }}
                            >
                              {opt.label}
                            </button>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <Controller
                    control={control}
                    name={`tasks.${index}.notify_after`}
                    render={({ field: f }) => {
                      const v = validateNotifyAfter(f.value ?? '')
                      const dirty = !!f.value
                      return (
                        <div className="flex flex-col gap-1.5">
                          <input
                            value={f.value ?? ''}
                            onChange={f.onChange}
                            placeholder='Custom: "30 minutes", "2 hours"'
                            className="border-[3px] border-[#1a1a1a] bg-[#faf6ef] px-3 py-2 text-sm font-bold placeholder:font-normal placeholder:text-[#1a1a1a]/30 shadow-[3px_3px_0_#1a1a1a] outline-none focus:shadow-[5px_5px_0_#1a1a1a] transition-all"
                            style={dirty && !v.isValid ? { borderColor: '#c8624a', backgroundColor: '#fdf0ee' } : {}}
                          />
                          {dirty && !v.isValid && (
                            <p className="text-[10px] font-bold text-[#c8624a] flex items-center gap-1">
                              <AlertCircle size={10} /> {v.error}
                            </p>
                          )}
                          {dirty && v.isValid && (
                            <p className="text-[10px] font-bold text-[#4a7c9e] flex items-center gap-1">
                              <CheckCircle size={10} /> Valid interval
                            </p>
                          )}
                        </div>
                      )
                    }}
                  />
                </div>
              )}

              {/*  Type 2: Fixed Time  */}
              {notifType === 'second' && (
                <div className="flex flex-col gap-2">
                  <FieldLabel icon={Clock}>Fixed Notify Time</FieldLabel>
                  <Controller
                    control={control}
                    name={`tasks.${index}.fixed_notify_time`}
                    rules={{ required: true }}
                    render={({ field: f }) => (
                      <input
                        type="time"
                        disabled={field.taskid === 5 || field.taskid === 6}
                        value={f.value || (field.taskid === 5 ? '00:00' : field.taskid === 6 ? '06:00' : '')}
                        onChange={f.onChange}
                        onBlur={f.onBlur}
                        className="border-[3px] border-[#1a1a1a] px-3 py-2 text-sm font-bold shadow-[3px_3px_0_#1a1a1a] outline-none focus:shadow-[5px_5px_0_#1a1a1a] transition-all"
                        style={{
                          backgroundColor: field.taskid === 5 || field.taskid === 6 ? '#e8e2d8' : '#faf6ef',
                          cursor: field.taskid === 5 || field.taskid === 6 ? 'not-allowed' : 'auto',
                          opacity: field.taskid === 5 || field.taskid === 6 ? 0.5 : 1,
                        }}
                      />
                    )}
                  />
                </div>
              )}

              {/*  Type 3: Fixed Time + Date  */}
              {notifType === 'third' && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <FieldLabel icon={Clock}>Fixed Notify Time</FieldLabel>
                    <Controller
                      control={control}
                      name={`tasks.${index}.fixed_notify_time`}
                      rules={{ required: true }}
                      render={({ field: f }) => (
                        <input
                          type="time"
                          disabled={field.taskid === 5 || field.taskid === 6}
                          value={f.value || (field.taskid === 5 ? '00:00' : field.taskid === 6 ? '06:00' : '')}
                          onChange={f.onChange}
                          onBlur={f.onBlur}
                          className="border-[3px] border-[#1a1a1a] px-3 py-2 text-sm font-bold shadow-[3px_3px_0_#1a1a1a] outline-none focus:shadow-[5px_5px_0_#1a1a1a] transition-all bg-[#faf6ef]"
                          style={{ opacity: field.taskid === 5 || field.taskid === 6 ? 0.5 : 1 }}
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <FieldLabel icon={Calendar}>Fixed Notify Date</FieldLabel>
                    <input
                      type="date"
                      {...register(`tasks.${index}.fixed_notify_date`, { required: true })}
                      className="border-[3px] border-[#1a1a1a] bg-[#faf6ef] px-3 py-2 text-sm font-bold shadow-[3px_3px_0_#1a1a1a] outline-none focus:shadow-[5px_5px_0_#1a1a1a] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Confirm button */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="border-[3px] border-[#1a1a1a] px-6 py-2.5 text-[11px] font-black uppercase tracking-wider shadow-[4px_4px_0_#1a1a1a] transition-all hover:shadow-[2px_2px_0_#1a1a1a] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: meta.stripe, color: notifType === 'third' ? '#1a1a1a' : '#fff' }}
                >
                  {isLoading
                    ? <span className="flex items-center gap-2"><Spinner size={13} /> Processing…</span>
                    : 'Confirm Update'
                  }
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>

    {/* Delete confirmation modal */}
    {showDeleteModal && createPortal(
      <>
        <div className="fixed inset-0 bg-[#1a1a1a]/60 backdrop-blur-sm z-50" onClick={() => !isDeleting && setShowDeleteModal(false)} />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="border-[3px] border-[#1a1a1a] bg-[#faf6ef] shadow-[8px_8px_0_#1a1a1a] max-w-md w-full"
          >
            <div className="h-[6px] border-b-[3px] border-[#1a1a1a] bg-[#ffb5bd]" />
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="border-[3px] border-[#1a1a1a] bg-[#ffb5bd] p-2">
                  <Trash2 size={20} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black uppercase mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}>
                    Delete Task?
                  </h3>
                  <p className="text-sm font-bold text-[#1a1a1a]/70">
                    Are you sure you want to delete <span className="text-[#1a1a1a] font-black">"{field.taskname}"</span>? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="border-[3px] border-[#1a1a1a] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-wider shadow-[3px_3px_0_#1a1a1a] transition-all hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="border-[3px] border-[#1a1a1a] bg-[#ffb5bd] px-4 py-2 text-[11px] font-black uppercase tracking-wider shadow-[3px_3px_0_#1a1a1a] transition-all hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting
                    ? <span className="flex items-center gap-2"><Spinner size={13} /> Deleting…</span>
                    : 'Delete Task'
                  }
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </>,
      document.body
    )}
    </>
  )
}

//  Task Section 
function TaskSection({ title, type, fields, control, register, userid, showStatusCard, onDelete }: {
  title: string
  type: NotificationType
  fields: (UserTask & { id: string })[]
  control: any
  register: any
  userid: string
  showStatusCard: (text: string, variant: 'success' | 'error') => void
  onDelete: (taskid: number) => void
}) {
  const filtered = fields.map((f, i) => ({ field: f, index: i })).filter(({ field }) => field.notification_type === type)
  if (filtered.length === 0) return null
  const meta = TYPE_META[type]

  return (
    <div className="mb-10">
      {/* Section divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 border-t-[3px] border-dashed border-[#1a1a1a]/20" />
        <span
          className="border-[3px] border-[#1a1a1a] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] shadow-[3px_3px_0_#1a1a1a] whitespace-nowrap"
          style={{ backgroundColor: meta.tint, color: '#1a1a1a' }}
        >
          {title}
        </span>
        <div className="flex-1 border-t-[3px] border-dashed border-[#1a1a1a]/20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(({ field, index }) => (
          <TaskCard
            key={field.id}
            index={index}
            field={field}
            control={control}
            register={register}
            userid={userid}
            showStatusCard={showStatusCard}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}

//  Main Update Component ─
function Update({ userid, showStatusCard }: UpdateProps) {
  const [refreshingTasks, setRefreshingTasks] = useState(false)
  const [customNotificationset, setCustomNotification] = useState(false)

  const { control, register, reset } = useForm<FormValues>({ defaultValues: { tasks: [] } })
  const { fields } = useFieldArray({ control, name: 'tasks' })

  async function fetchUsertask() {
    if (!userid) return
    setRefreshingTasks(true)
    try {
      const base = API_BASE_URL ? `${API_BASE_URL}` : ''
      const res = await fetch(`${base}/api/updateget/${userid}`, {
        method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message)
      reset({ tasks: result.data })
    } catch (error) {
      console.error(error)
      showStatusCard('Failed to load tasks', 'error')
    } finally {
      setRefreshingTasks(false)
    }
  }

  function handleDeleteTask(taskid: number) {
    // Remove the task from the form state
    const currentTasks = typedFields.filter(task => task.taskid !== taskid)
    reset({ tasks: currentTasks })
  }

  useEffect(() => {
    fetchUsertask()
  }, [userid])

  useEffect(() => {
    document.body.style.overflow = customNotificationset ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [customNotificationset])

  const typedFields = fields as (UserTask & { id: string })[]

  return (
    <div className="relative w-full">

      {/* Custom notification overlay — portaled to body to escape ancestor transforms */}
      {customNotificationset && createPortal(
        <>
          <div className="fixed inset-0 bg-[#1a1a1a]/50 backdrop-blur-sm z-40" onClick={() => setCustomNotification(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setCustomNotification(false)}>
            <div onClick={e => e.stopPropagation()}>
              <CustomNotification setCustomNotification={setCustomNotification} />
            </div>
          </div>
        </>,
        document.body
      )}

      {/*  Top bar: counts + actions  */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-6 border-b-[3px] border-dashed border-[#1a1a1a]/20">
        <div className="flex items-center gap-3">
          {/* Task count badge */}
          <div className="border-[3px] border-[#1a1a1a] bg-[#1a1a1a] px-4 py-2 shadow-[4px_4px_0_#1a1a1a]">
            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#f0d08a' }}>
              {typedFields.length} Task{typedFields.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Refresh */}
          <button
            type="button"
            disabled={refreshingTasks}
            onClick={fetchUsertask}
            className="group flex items-center gap-2 border-[3px] border-[#1a1a1a] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#1a1a1a] shadow-[4px_4px_0_#1a1a1a] transition-all hover:shadow-[2px_2px_0_#1a1a1a] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {refreshingTasks
              ? <><Spinner size={13} /><span>Loading…</span></>
              : <><RefreshCcw size={13} className="transition-transform duration-500 group-hover:rotate-180" /><span>Refresh</span></>
            }
          </button>
        </div>

        {/* Custom notification CTA */}
        <button
          onClick={() => setCustomNotification(p => !p)}
          className="border-[3px] border-[#1a1a1a] px-5 py-2 text-[11px] font-black uppercase tracking-wider shadow-[4px_4px_0_#1a1a1a] transition-all hover:shadow-[2px_2px_0_#1a1a1a] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none"
          style={{ backgroundColor: '#f0d08a', color: '#1a1a1a' }}
        >
          + Custom Notification
        </button>
      </div>

      {/* Empty state */}
      {typedFields.length === 0 && !refreshingTasks && (
        <div className="border-[3px] border-dashed border-[#1a1a1a]/20 px-8 py-16 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#1a1a1a]/30">No tasks found</p>
          <p className="mt-3 text-lg font-black text-[#1a1a1a]/40">Hit refresh to load your tasks</p>
        </div>
      )}

      {/* Task sections */}
      <TaskSection title="Interval Notifications"        type="first"  fields={typedFields} control={control} register={register} userid={userid} showStatusCard={showStatusCard} onDelete={handleDeleteTask} />
      <TaskSection title="Daily Fixed-Time Notifications" type="second" fields={typedFields} control={control} register={register} userid={userid} showStatusCard={showStatusCard} onDelete={handleDeleteTask} />
      <TaskSection title="Scheduled One-Time Notifications" type="third" fields={typedFields} control={control} register={register} userid={userid} showStatusCard={showStatusCard} onDelete={handleDeleteTask} />
    </div>
  )
}

export default Update