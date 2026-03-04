
import { Pie, PieChart, Tooltip } from 'recharts';


interface TotalTaskType {
    notification_type:string,
    taskcount:number
}

interface TotalTaskProps {
    totalTask:TotalTaskType []
}
const COLORS = ['#1a9b49', '#1a9b88', '#9b1a47'];
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
            <h1>Total number of task by their types</h1>
        <PieChart width={400} height={400}>
      <Pie
        
        data={coloredData}
        dataKey="taskcount"
        nameKey="notification_type"
        isAnimationActive={true}
      >
        

        </Pie>
      <Tooltip defaultIndex={3} />
      

    </PieChart>
    <div>
        {totalTask.map((item)=>(
            <div>
                {item.notification_type==='first'?"First= Frequently Reoccuring Task":item.notification_type==='second'?"Second= Daily occuring task":item.notification_type==='third'?"Third= One time occuring task":""}
            </div>
        ))}
    </div>
    </div>):(<div>No data</div>)
  )
}

export default TotalTask