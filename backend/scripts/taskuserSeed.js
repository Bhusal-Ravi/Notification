import { pool } from "../config/dbConnection.js";



const DEFAULT_TASKS = [
  { taskid:1,taskname: 'Water' },
  { taskid:2,taskname: 'Exercise'},
  { taskid:3, taskname: 'Study'},
  { taskid:5, taskname: 'Midnight Report' },
  { taskid:6,taskname: 'Quote of the Day'}
];



export  function taskuserseed(){
    
    const payload= DEFAULT_TASKS.map((item)=>(
   `($1,${item.taskid},false,now(),now(),now())`
)).join(',')

return {payload:payload,tasknumber:DEFAULT_TASKS.length}

   
}