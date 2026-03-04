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


function TotalSent({totalSent}:TotalSentProps) {
  console.log("totalsent",totalSent)
  return (
    totalSent.length>0 ? 
    (<div className='max-w-7xl flex'>
      <ResponsiveContainer   width="100%" height={400}>
       <AreaChart
    
    
    data={totalSent}
    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
  >
    <defs>
      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8884dd" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
      </linearGradient>
    
    </defs>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" interval={0} />
    <YAxis width="auto" />
    <Tooltip />
    <Area
      type="monotone"
      dataKey="count"
      stroke="#8884d8"
      fillOpacity={1}
      fill="url(#colorUv)"
      isAnimationActive={true}
    />
   
    
  </AreaChart>
    </ResponsiveContainer>
    </div>):(<div>No data available</div>)
  )
}

export default TotalSent