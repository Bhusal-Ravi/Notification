
import { Pie, PieChart, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';


interface TotalTaskType {
    notification_type:string,
    taskcount:number
}

interface TotalTaskProps {
    totalTask:TotalTaskType []
}
const COLORS = ['#c8624a', '#4a7c9e', '#d4a843'];

function TotalTask({totalTask}:TotalTaskProps) {
    console.log(totalTask)
      const coloredData = totalTask.map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length],
    }));
    return (
        
    totalTask.length>0?
        (
        <div>
            <h3 className='text-xl font-black text-[#1a1a1a] mb-6 uppercase tracking-wide'>Task Distribution by Type</h3>
        <div className='bg-[#f2ece0] border-[3px] border-[#1a1a1a] p-6 shadow-[6px_6px_0_#1a1a1a] lg:min-h-125 lg:flex lg:flex-col'>
            <div className='flex-1'>
            <ResponsiveContainer width="100%" height={300}>
        <PieChart>
      <Pie
        
        data={coloredData}
        dataKey="taskcount"
        nameKey="notification_type"
        isAnimationActive={true}
        cx="45%"
        cy="50%"
        innerRadius={80}
        outerRadius={120}
        paddingAngle={2}
      >
        {coloredData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.fill} />
        ))}
        </Pie>
      <Tooltip 
        contentStyle={{
          backgroundColor: '#ffffff',
          borderColor: '#c8624a',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '2px solid #c8624a'
        }}
        labelStyle={{ color: '#1a1a1a' }}
      />
      <Legend />
    </PieChart>
            </ResponsiveContainer>
            </div>
    <div className='grid grid-cols-3 gap-3 mt-8 pt-8 border-t-[3px] border-[#1a1a1a]'>
        {totalTask.map((item, index)=>(
            <div key={item.notification_type} className='text-center p-4 bg-white border-[2.5px] shadow-[3px_3px_0_#1a1a1a]' style={{borderColor: COLORS[index]}}>
                <div className='flex items-center justify-center gap-2 mb-2'>
                    <div className='w-3 h-3' style={{backgroundColor: COLORS[index]}}></div>
                    <p className='text-xs font-black uppercase tracking-wider' style={{color: COLORS[index]}}>
                        {item.notification_type==='first'?'Frequent':item.notification_type==='second'?'Daily':item.notification_type==='third'?'One Time':''}
                    </p>
                </div>
                <p className='text-2xl font-black' style={{color: COLORS[index]}}>{item.taskcount}</p>
            </div>
        ))}
    </div>
    </div>
    </div>):(<div className='bg-[#f2ece0] border-[3px] border-dashed border-[#1a1a1a] p-8 text-center'>
        <p className='text-xs font-black uppercase tracking-[0.35em] text-[#1a1a1a]/30'>No Data</p>
        <p className='mt-3 text-lg font-black text-[#1a1a1a]/40'>No task data available</p>
    </div>)
  )
}

export default TotalTask