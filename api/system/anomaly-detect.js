import {query,newId} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;
  const r=await query("SELECT metric_name,AVG(metric_value) AS prosek,STDDEV_POP(metric_value) AS odstupanje,COUNT(*)::int AS uzoraka FROM system_metrics WHERE user_id=$1 GROUP BY metric_name",[userId]);
  const anomalies=r.rows.filter(x=>Number(x.uzoraka)>=3&&Number(x.odstupanje)>0);
  return res.status(200).json({anomalije:anomalies.map(x=>({...x,status:"za_proveru"}))});
 }catch(e){return res.status(500).json({error:"Detekcija anomalija nije uspela."});}
}