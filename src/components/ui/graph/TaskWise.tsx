import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer } from 'recharts';

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

function TaskWise({taskWise}:TaskWiseProps) {
  
  let type1taskuserid:number[] =[]
  let type2taskuserid:number[] =[]

  const firstNotificationType= taskWise.filter((task)=>task.notification_type==='first')
              firstNotificationType.map((item)=> {
                if(!type1taskuserid.includes(item.taskuser_id)){
                  type1taskuserid.push(item.taskuser_id)
                }
              })

                         
    const secondNotificationType= taskWise.filter((task)=>task.notification_type==='second')
               secondNotificationType.map((item)=> {
                if(!type2taskuserid.includes(item.taskuser_id)){
                  type2taskuserid.push(item.taskuser_id)
                }
              })

  return (
    
    <div className='space-y-12'>
      
      <div>
        <h2 className='text-2xl font-black text-[#1a1a1a] mb-8 uppercase tracking-tight'>Frequently Reoccuring Tasks</h2>
        <div className='space-y-6'>
        { type1taskuserid.map((item)=>{
              const dataPartial= firstNotificationType.filter((task)=>task.taskuser_id===item)
                 if (!dataPartial.length) return null;
              const data = days.map((day)=>{
                  const check = dataPartial.filter((task)=>task.day===day)
                  if(check.length>0) return check[0]
                  else {
                    return {
                      day:day,
                      taskuser_id:dataPartial[0].taskuser_id,
                      taskname: dataPartial[0].taskname ,
                      notification_type:dataPartial[0].notification_type,
                      sent_count: 0,
                      completed_count:0
                    }
                  }
              })
              console.log("taskwise dataid",data)
              const totalSentCount= dataPartial.reduce((acc,curr)=>acc + curr.sent_count,0)
              const totalCompletedCount= dataPartial.reduce((acc,curr)=>acc + curr.completed_count,0)
              
              const efficiency = totalSentCount===0? (0):((totalCompletedCount/totalSentCount)*100)

        return (
        <div key={item} className='bg-[#f2ece0] border-[3px] border-[#1a1a1a] p-6 shadow-[6px_6px_0_#1a1a1a]'>
          <h3 className='text-lg font-black text-[#1a1a1a] mb-6 uppercase tracking-wide'>{data[0].taskname}</h3>
           <p className="mb-2 text-lg">Statistics For <span className="font-semibold">[ {months[new Date().getMonth()]} ] </span></p>
          <div className='grid grid-cols-3 gap-3 mb-6'>
            <div className='bg-white border-[2.5px] border-[#c8624a] p-4 shadow-[3px_3px_0_#1a1a1a]'>
              <p className='text-xs font-black uppercase tracking-wider text-[#1a1a1a] opacity-70 mb-2'>Sent</p>
              <p className='text-3xl font-black text-[#c8624a]'>{totalSentCount}</p>
            </div>
            <div className='bg-white border-[2.5px] border-[#4a7c9e] p-4 shadow-[3px_3px_0_#1a1a1a]'>
              <p className='text-xs font-black uppercase tracking-wider text-[#1a1a1a] opacity-70 mb-2'>Completed</p>
              <p className='text-3xl font-black text-[#4a7c9e]'>{totalCompletedCount}</p>
            </div>
            <div className='bg-white border-[2.5px] border-[#d4a843] p-4 shadow-[3px_3px_0_#1a1a1a]'>
              <p className='text-xs font-black uppercase tracking-wider text-[#1a1a1a] opacity-70 mb-2'>Rate</p>
              <p className='text-3xl font-black text-[#d4a843]'>{efficiency.toFixed(1)}%</p>
            </div>
          </div>
        <div className='border-2 border-[#1a1a1a] overflow-hidden'>
        <ResponsiveContainer   width="100%" height={280}>
               <LineChart
      
      responsive
      data={data}
      margin={{
        top: 5,
        right: 7,
        left: 7,
        bottom: 2,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" vertical={false} />
      <XAxis dataKey="day" stroke="#666" interval={2} textAnchor="end" tick={{ fontSize: 11 }} />
      <YAxis width="auto" stroke="#666" tick={{ fontSize: 11 }} />
      <Tooltip
        cursor={{
          stroke: '#c8624a',
          strokeWidth: 2
        }}
        contentStyle={{
          backgroundColor: '#ffffff',
          borderColor: '#c8624a',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '2px solid #c8624a'
        }}
        labelStyle={{ color: '#1a1a1a' }}
      />
      <Legend wrapperStyle={{ paddingTop: '20px' }} />
      <Line
        type="monotone"
        dataKey="sent_count"
          stroke="#c8624a"
        strokeWidth={2.5}
      dot={{ r: 2, fill: '#c8624a' }}
      activeDot={{ r: 4, fill: '#c8624a' }}
      />
      <Line
        type="monotone"
        dataKey="completed_count"
        stroke="#4a7c9e"
        strokeWidth={2.5}
        dot={{
          r: 2, fill: '#4a7c9e'
        }}
         activeDot={{ r: 4, fill: '#4a7c9e' }}
      />
      
    </LineChart>
        </ResponsiveContainer>
        </div>
            </div>)
})}
        </div>
      </div>
     
     <div>
        <h2 className='text-2xl font-black text-[#1a1a1a] mb-8 uppercase tracking-tight'>Daily Occuring Tasks</h2>
        <div className='space-y-6'>
       { type2taskuserid.map((item)=>{
              const dataPartial= secondNotificationType.filter((task)=>task.taskuser_id===item)
               if (!dataPartial.length) return null;
              const data = days.map((day)=>{
                  const check = dataPartial.filter((task)=>task.day===day)
                  if(check.length>0) return check[0]
                  else {
                    return {
                      day:day,
                      taskuser_id:dataPartial[0].taskuser_id,
                      taskname: dataPartial[0].taskname ,
                      notification_type:dataPartial[0].notification_type,
                      sent_count: 0,
                      completed_count:0
                    }
                  }
              })
              const totalSentCount= dataPartial.reduce((acc,curr)=>acc + curr.sent_count,0)
              const totalCompletedCount= dataPartial.reduce((acc,curr)=>acc + curr.completed_count,0)
              
              const efficiency = totalSentCount===0? (0):((totalCompletedCount/totalSentCount)*100)
              console.log("taskwise dataid",data)

        return (
        <div key={item} className='bg-[#f2ece0] border-[3px] border-[#1a1a1a] p-6 shadow-[6px_6px_0_#1a1a1a]'>
          <h3 className='text-lg font-black text-[#1a1a1a] mb-6 uppercase tracking-wide'>{data[0].taskname}</h3>
          <p className="mb-2 text-lg">Statistics For <span className="font-semibold">[ {months[new Date().getMonth()]} ] </span></p>
          <div className='grid grid-cols-3 gap-3 mb-6'>
            <div className='bg-white border-[2.5px] border-[#c8624a] p-4 shadow-[3px_3px_0_#1a1a1a]'>
              <p className='text-xs font-black uppercase tracking-wider text-[#1a1a1a] opacity-70 mb-2'>Sent</p>
              <p className='text-3xl font-black text-[#c8624a]'>{totalSentCount}</p>
            </div>
            <div className='bg-white border-[2.5px] border-[#4a7c9e] p-4 shadow-[3px_3px_0_#1a1a1a]'>
              <p className='text-xs font-black uppercase tracking-wider text-[#1a1a1a] opacity-70 mb-2'>Completed</p>
              <p className='text-3xl font-black text-[#4a7c9e]'>{totalCompletedCount}</p>
            </div>
            <div className='bg-white border-[2.5px] border-[#d4a843] p-4 shadow-[3px_3px_0_#1a1a1a]'>
              <p className='text-xs font-black uppercase tracking-wider text-[#1a1a1a] opacity-70 mb-2'>Rate</p>
              <p className='text-3xl font-black text-[#d4a843]'>{efficiency.toFixed(1)}%</p>
            </div>
          </div>
        <div className='border-2 border-[#1a1a1a] overflow-hidden'>
        <ResponsiveContainer   width="100%" height={300}>
               <LineChart
      
      responsive
      data={data}
      margin={{
        top: 5,
        right: 7,
        left: 7,
        bottom: 2,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" vertical={false} />
      <XAxis dataKey="day" stroke="#666" interval={2} textAnchor="end" tick={{ fontSize: 11 }} />
      <YAxis width="auto" stroke="#666" tick={{ fontSize: 11 }} />
      <Tooltip
        cursor={{
          stroke: '#c8624a',
          strokeWidth: 2
        }}
        contentStyle={{
          backgroundColor: '#ffffff',
          borderColor: '#c8624a',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '2px solid #c8624a'
        }}
        labelStyle={{ color: '#1a1a1a' }}
      />
      <Legend wrapperStyle={{ paddingTop: '20px' }} />
      <Line
        type="monotone"
        dataKey="sent_count"
          stroke="#c8624a"
        strokeWidth={2.5}
      dot={{ r: 2, fill: '#c8624a' }}
      activeDot={{ r: 4, fill: '#c8624a' }}
      />
      <Line
        type="monotone"
        dataKey="completed_count"
        stroke="#4a7c9e"
        strokeWidth={2.5}
        dot={{
          r: 2, fill: '#4a7c9e'
        }}
         activeDot={{ r: 2, fill: '#4a7c9e' }}
      />
      
    </LineChart>
            </ResponsiveContainer>
            </div>
            </div>)
})}
        </div>
      </div>
    </div>
  )
}

export default TaskWise