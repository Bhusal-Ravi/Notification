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

  if (!totalSent) return null;
  const totalValue:TotalSentType[]= months.map((item)=>{
    let countValue
    countValue = totalSent.filter((task)=>task.month===item)
    if(countValue.length>0){
      return {month:countValue[0].month.split(" ")[0],count:countValue[0].count}
    } else return {month: item.split(" ")[0],count:0}
  })

  return (
    totalSent.length>0 ? (
        <div className='relative'>
            <div className='absolute inset-0 bg-[#1a1a1a] translate-x-[8px] translate-y-[8px] -z-10' />

            <div className='border-[3px] border-[#1a1a1a] bg-[#faf6ef] overflow-hidden'>
                <div className='h-[7px] bg-[#4a7c9e] border-b-[3px] border-[#1a1a1a]' />

                <div className='p-6'>
                    <div className='mb-6 space-y-1'>
                        <p className='text-[10px] font-black uppercase tracking-[0.35em] text-[#1a1a1a]/40'>Year at a glance</p>
                        <h3
                            className='text-[32px] font-black uppercase leading-none text-[#1a1a1a]'
                            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}
                        >
                            Monthly Notifications
                        </h3>
                    </div>

                    <div className='border-[2px] border-[#1a1a1a] bg-white p-3'>
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={totalValue} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#c8624a" stopOpacity={0.55} />
                                        <stop offset="95%" stopColor="#c8624a" stopOpacity={0.04} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0d8cc" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    interval={1}
                                    stroke="#999"
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#1a1a1a', letterSpacing: '0.1em' }}
                                />
                                <YAxis
                                    width={36}
                                    stroke="#999"
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#1a1a1a' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        borderColor: '#1a1a1a',
                                        borderRadius: '0px',
                                        border: '2.5px solid #1a1a1a',
                                        boxShadow: '4px 4px 0 #1a1a1a',
                                        fontFamily: 'inherit',
                                    }}
                                    labelStyle={{ color: '#1a1a1a', fontWeight: 900, fontSize: '11px', letterSpacing: '0.1em' }}
                                    itemStyle={{ color: '#c8624a', fontWeight: 900 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#c8624a"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#sentGradient)"
                                    isAnimationActive={true}
                                    dot={{ r: 3.5, fill: '#c8624a', stroke: '#1a1a1a', strokeWidth: 2 }}
                                    activeDot={{ r: 6, fill: '#c8624a', stroke: '#1a1a1a', strokeWidth: 2.5 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className='border-[3px] border-dashed border-[#1a1a1a]/20 px-6 py-16 text-center'>
            <p className='text-[10px] font-black uppercase tracking-[0.35em] text-[#1a1a1a]/30'>No Data</p>
            <p className='mt-3 text-lg font-black text-[#1a1a1a]/40'>No data available</p>
        </div>
    )
  )
}

export default TotalSent