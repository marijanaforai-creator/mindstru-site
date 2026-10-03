import {query} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;
  const [i,m]=await Promise.all([query("SELECT severity,status,COUNT(*)::int AS broj FROM system_incidents WHERE user_id=$1 GROUP BY severity,status",[userId]),query("SELECT metric_name,AVG(metric_value) AS prosek FROM system_metrics WHERE user_id=$1 GROUP BY metric_name",[userId])]);
  return res.status(200).json({incidenti:i.rows,metrike:m.rows});
 }catch(e){return res.status(500).json({error:"Reliability pregled nije dostupan."});}
}