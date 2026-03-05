import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface TotalSentType {
    month:string,
    count:number
}

interface TotalSentProps {
 totalSent: TotalSentType[]
}

const year=new Date().getFullYear();

const months= [`Jan ${year}`,`Feb ${year}`,`Mar ${year}`,`Apr ${year}`,`May ${year}`,`Jun ${year}`,`Jul ${year}`,`Aug ${year}`,`Sep ${year}`,`Oct ${year}`,`Nov ${year}`,`Dec ${year}`]


function TotalSent({totalSent}:TotalSentProps) {

  const totalValue:TotalSentType[]= months.map((item)=>{
    let countValue
     countValue=  totalSent.filter((task)=>task.month===item)
    if(countValue.length>0){
      return {month:countValue[0].month.split(" ")[0],count:countValue[0].count}
    }else return {month: item.split(" ")[0],count:0}
})

  console.log("totalValue",totalValue)
 
  return (
    totalSent.length>0 ? 
    (<div>
      <h3 className='text-xl font-black text-[#1a1a1a] mb-6 uppercase tracking-wide'>Monthly Notifications Sent</h3>
      <div className='bg-[#f2ece0] border-[3px] border-[#1a1a1a] p-6 shadow-[6px_6px_0_#1a1a1a] lg:min-h-125 lg:flex lg:flex-col'>
      <div className='flex-1 flex items-center justify-center'>
      <ResponsiveContainer   width="100%" height={300}>
       <AreaChart
    
    
    data={totalValue}
     margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
  >
    <defs>
      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#c8624a" stopOpacity={0.6} />
        <stop offset="95%" stopColor="#c8624a" stopOpacity={0.1} />
      </linearGradient>
    
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" vertical={false} />
    <XAxis  dataKey="month" interval={1} stroke="#666" tick={{ fontSize: 11 }} />
    <YAxis width="auto" stroke="#666" tick={{ fontSize: 11 }} />
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
    <Area
      type="monotone"
      dataKey="count"
      stroke="#c8624a"
      strokeWidth={2.5}
      fillOpacity={1}
      fill="url(#colorUv)"
      isAnimationActive={true}
      dot={{ r: 3, fill: '#c8624a' }}
      activeDot={{ r: 5, fill: '#c8624a' }}
    />
   
    
  </AreaChart>
    </ResponsiveContainer>
      </div>
    </div>
    </div>):(<div className='bg-[#f2ece0] border-[3px] border-dashed border-[#1a1a1a] p-8 text-center'>
        <p className='text-xs font-black uppercase tracking-[0.35em] text-[#1a1a1a]/30'>No Data</p>
        <p className='mt-3 text-lg font-black text-[#1a1a1a]/40'>No data available</p>
    </div>)
  )
}

export default TotalSent