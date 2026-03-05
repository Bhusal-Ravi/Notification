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
    if (!totalTask) return null;
    const coloredData = totalTask.map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length],
    }));

    return (
    totalTask.length>0 ? (
        <div className='relative'>
            <div className='absolute inset-0 bg-[#1a1a1a] translate-x-[8px] translate-y-[8px] -z-10' />

            <div className='border-[3px] border-[#1a1a1a] bg-[#faf6ef] overflow-hidden'>
                <div className='h-[7px] bg-[#c8624a] border-b-[3px] border-[#1a1a1a]' />

                <div className='p-6'>
                    <div className='mb-6 space-y-1'>
                        <p className='text-[10px] font-black uppercase tracking-[0.35em] text-[#1a1a1a]/40'>Overview</p>
                        <h3
                            className='text-[32px] font-black uppercase leading-none text-[#1a1a1a]'
                            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}
                        >
                            Task Distribution
                        </h3>
                    </div>

                    <div className='border-[2px] border-[#1a1a1a] bg-white p-2 mb-6'>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={coloredData}
                                    dataKey="taskcount"
                                    nameKey="notification_type"
                                    isAnimationActive={true}
                                    cx="45%"
                                    cy="50%"
                                    innerRadius={72}
                                    outerRadius={112}
                                    paddingAngle={3}
                                >
                                    {coloredData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} stroke='#1a1a1a' strokeWidth={2} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        borderColor: '#1a1a1a',
                                        borderRadius: '0px',
                                        border: '2.5px solid #1a1a1a',
                                        boxShadow: '4px 4px 0 #1a1a1a',
                                        fontFamily: 'inherit',
                                    }}
                                    labelStyle={{ color: '#1a1a1a', fontWeight: 900 }}
                                />
                                <Legend
                                    wrapperStyle={{
                                        fontFamily: 'inherit',
                                        fontSize: '10px',
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.15em',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className='grid grid-cols-3 gap-3 pt-5 border-t-[3px] border-[#1a1a1a]'>
                        {totalTask.map((item, index) => (
                            <div
                                key={item.notification_type}
                                className='relative group'
                            >
                                <div className='absolute inset-0 bg-[#1a1a1a] translate-x-[4px] translate-y-[4px] -z-10' />
                                <div
                                    className='border-[2.5px] border-[#1a1a1a] bg-white p-4 text-center relative z-10'
                                >
                                    <div className='h-[4px] mb-3 -mx-4 -mt-4 border-b-[2.5px] border-[#1a1a1a]' style={{ backgroundColor: COLORS[index] }} />
                                    <p
                                        className='text-[9px] font-black uppercase tracking-[0.2em] mb-2'
                                        style={{ color: COLORS[index] }}
                                    >
                                        {item.notification_type==='first'?'Frequent':item.notification_type==='second'?'Daily':item.notification_type==='third'?'One Time':''}
                                    </p>
                                    <p
                                        className='text-[36px] font-black leading-none text-[#1a1a1a]'
                                        
                                    >
                                        {item.taskcount}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className='border-[3px] border-dashed border-[#1a1a1a]/20 px-6 py-16 text-center'>
            <p className='text-[10px] font-black uppercase tracking-[0.35em] text-[#1a1a1a]/30'>No Data</p>
            <p className='mt-3 text-lg font-black text-[#1a1a1a]/40'>No task data available</p>
        </div>
    ))
}

export default TotalTask