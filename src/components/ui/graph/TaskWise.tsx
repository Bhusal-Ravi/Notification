import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TaskWiseType {
    day:number,
    taskuser_id:number
    taskname:string 
    notification_type:string ,
    sent_count: number,
    completed_count: number
}

interface TaskWiseProps{
  taskWise:TaskWiseType[]
}

const year=new Date().getFullYear();

const months= [`Jan ${year}`,`Feb ${year}`,`Mar ${year}`,`Apr ${year}`,`May ${year}`,`Jun ${year}`,`Jul ${year}`,`Aug ${year}`,`Sep ${year}`,`Oct ${year}`,`Nov ${year}`,`Dec ${year}`]

const days = [
  1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31
];


function TaskCard({ item, notificationType }: { item: number, notificationType: TaskWiseType[], allTasks: TaskWiseType[] }) {
  const dataPartial = notificationType.filter((task) => task.taskuser_id === item)
  if (!dataPartial.length) return null;

  const data = days.map((day) => {
    const check = dataPartial.filter((task) => task.day === day)
    if (check.length > 0) return check[0]
    else return {
      day,
      taskuser_id: dataPartial[0].taskuser_id,
      taskname: dataPartial[0].taskname,
      notification_type: dataPartial[0].notification_type,
      sent_count: 0,
      completed_count: 0
    }
  })

  const totalSentCount = dataPartial.reduce((acc, curr) => acc + curr.sent_count, 0)
  const totalCompletedCount = dataPartial.reduce((acc, curr) => acc + curr.completed_count, 0)
  const efficiency = totalSentCount === 0 ? 0 : (totalCompletedCount / totalSentCount) * 100
  const isStrong = efficiency >= 80

  return (
    <div className='relative group'>
      <div className='absolute inset-0 bg-[#1a1a1a] translate-x-[6px] translate-y-[6px] -z-10' />

      <div className='border-[3px] border-[#1a1a1a] bg-[#faf6ef] overflow-hidden'>
        <div className='h-[5px] bg-[#d4a843] border-b-[3px] border-[#1a1a1a]' />

        <div className='p-6'>
          <div className='flex items-start justify-between gap-4 mb-5'>
            <div>
              <p className='text-[9px] font-black uppercase tracking-[0.3em] text-[#1a1a1a]/40 mb-1'>Task</p>
              <h3
                className='text-[26px] font-black uppercase leading-none text-[#1a1a1a]'
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                {data[0].taskname}
              </h3>
            </div>
            <div
              className='border-[3px] border-[#1a1a1a] px-4 py-2 text-center shrink-0 transform rotate-1'
              style={{ backgroundColor: isStrong ? '#c8624a' : '#f0d08a' }}
            >
              <p className='text-[9px] font-black uppercase tracking-[0.2em] text-[#1a1a1a] mb-0.5'>Rate</p>
              <p
                className='text-[28px] font-black leading-none text-[#1a1a1a]'
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {efficiency.toFixed(0)}%
              </p>
            </div>
          </div>

          <p className='text-[10px] font-black uppercase tracking-[0.25em] text-[#1a1a1a]/50 mb-4'>
            ◆ {months[new Date().getMonth()]}
          </p>

          <div className='grid grid-cols-2 gap-3 mb-5'>
            <div className='relative'>
              <div className='absolute inset-0 bg-[#1a1a1a] translate-x-[3px] translate-y-[3px] -z-10' />
              <div className='border-[2.5px] border-[#1a1a1a] bg-white p-4 relative z-10'>
                <div className='h-[3px] bg-[#c8624a] -mx-4 -mt-4 mb-3 border-b-[2px] border-[#1a1a1a]' />
                <p className='text-[9px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/50 mb-1'>Sent</p>
                <p
                  className='text-[40px] font-black leading-none text-[#c8624a]'
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {totalSentCount}
                </p>
              </div>
            </div>
            <div className='relative'>
              <div className='absolute inset-0 bg-[#1a1a1a] translate-x-[3px] translate-y-[3px] -z-10' />
              <div className='border-[2.5px] border-[#1a1a1a] bg-white p-4 relative z-10'>
                <div className='h-[3px] bg-[#4a7c9e] -mx-4 -mt-4 mb-3 border-b-[2px] border-[#1a1a1a]' />
                <p className='text-[9px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/50 mb-1'>Completed</p>
                <p
                  className='text-[40px] font-black leading-none text-[#4a7c9e]'
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {totalCompletedCount}
                </p>
              </div>
            </div>
          </div>

          <div className='border-[2.5px] border-[#1a1a1a] bg-white p-3'>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={data}
                margin={{ top: 8, right: 10, left: 0, bottom: 2 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0d8cc" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#999"
                  interval={2}
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#1a1a1a' }}
                />
                <YAxis
                  width={32}
                  stroke="#999"
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#1a1a1a' }}
                />
                <Tooltip
                  cursor={{ stroke: '#1a1a1a', strokeWidth: 1.5, strokeDasharray: '4 2' }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#1a1a1a',
                    borderRadius: '0px',
                    border: '2.5px solid #1a1a1a',
                    boxShadow: '4px 4px 0 #1a1a1a',
                    fontFamily: 'inherit',
                  }}
                  labelStyle={{ color: '#1a1a1a', fontWeight: 900, fontSize: '11px', letterSpacing: '0.1em' }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '16px',
                    fontSize: '10px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sent_count"
                  stroke="#c8624a"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: '#c8624a', stroke: '#1a1a1a', strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: '#c8624a', stroke: '#1a1a1a', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="completed_count"
                  stroke="#4a7c9e"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: '#4a7c9e', stroke: '#1a1a1a', strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: '#4a7c9e', stroke: '#1a1a1a', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}


function TaskWise({taskWise}: TaskWiseProps) {

  if (!taskWise) return null;

  let type1taskuserid: number[] = []
  let type2taskuserid: number[] = []

  const firstNotificationType = taskWise.filter((task) => task.notification_type === 'first')
  firstNotificationType.map((item) => {
    if (!type1taskuserid.includes(item.taskuser_id)) {
      type1taskuserid.push(item.taskuser_id)
    }
  })

  const secondNotificationType = taskWise.filter((task) => task.notification_type === 'second')
  secondNotificationType.map((item) => {
    if (!type2taskuserid.includes(item.taskuser_id)) {
      type2taskuserid.push(item.taskuser_id)
    }
  })

  return (
    <div className='space-y-16'>

      <div>
        <div className='flex items-center gap-4 mb-8'>
          <div className='h-[3px] flex-1 bg-[#1a1a1a]/10' />
          <h2
            className='text-[28px] font-black uppercase text-[#1a1a1a]'
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}
          >
            Frequently Recurring Tasks
          </h2>
          <div className='h-[3px] flex-1 bg-[#1a1a1a]/10' />
        </div>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
          {type1taskuserid.map((item) => (
            <TaskCard key={item} item={item} notificationType={firstNotificationType} allTasks={taskWise} />
          ))}
        </div>
      </div>

      <div>
        <div className='flex items-center gap-4 mb-8'>
          <div className='h-[3px] flex-1 bg-[#1a1a1a]/10' />
          <h2
            className='text-[28px] font-black uppercase text-[#1a1a1a]'
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}
          >
            Daily Occurring Tasks
          </h2>
          <div className='h-[3px] flex-1 bg-[#1a1a1a]/10' />
        </div>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
          {type2taskuserid.map((item) => (
            <TaskCard key={item} item={item} notificationType={secondNotificationType} allTasks={taskWise} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default TaskWise