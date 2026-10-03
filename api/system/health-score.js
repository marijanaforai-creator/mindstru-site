import {query} from "../_lib/db.js";
import {requireUser} from "../_lib/auth.js";
export default async function handler(req,res){
 try{const userId=requireUser(req,res);if(!userId)return;
  const [inc,workers,queue]=await Promise.all([
   query("SELECT COUNT(*)::int AS n FROM system_incidents WHERE user_id=$1 AND status='open'",[userId]),
   query("SELECT COUNT(*)::int AS n FROM system_workers WHERE user_id=$1 AND status='offline'",[userId]),
   query("SELECT COUNT(*)::int AS n FROM system_queue WHERE user_id=$1 AND status='failed'",[userId])
  ]);
  let score=100-scoreFactor(inc.rows[0].n,30)-scoreFactor(workers.rows[0].n,20)-scoreFactor(queue.rows[0].n,50);
  return res.status(200).json({score:Math.max(0,score),detalji:{otvoreni_incidenti:inc.rows[0].n,offline_radnici:workers.rows[0].n,neuspeli_poslovi:queue.rows[0].n}});
 }catch(e){return res.status(500).json({error:"Health score nije dostupan."});}
}
function scoreFactor(n,max){return Math.min(max,Number(n)*5);}