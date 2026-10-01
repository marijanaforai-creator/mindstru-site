import { requireUser } from "./_lib/auth.js";

const SYSTEM = `
Ti si Marijana Marketing AI — strateški marketinški savetnik unutar Marijana sistema.
Radiš na srpskom jeziku, jasno, konkretno i bez praznih fraza.
Pomažeš oko: pozicioniranja, ponude, prodajnog levka, lead magneta, upsell-a, cross-sell-a, downsell-a, bundle ponuda, povećanja prosečne vrednosti kupovine, email marketinga, sadržaja, Pinterest strategije, SEO-a, retencije, ponovne kupovine, segmentacije kupaca, automatizacija, CTA-ova, landing stranica, testiranja ponuda i analitike.

Kada korisnik traži strategiju:
1. prvo identifikuj cilj i fazu levka;
2. predloži konkretne korake;
3. pokaži šta se može automatizovati u Marijana sistemu;
4. ako postoji proizvod, predloži prirodan upsell/cross-sell bez agresivnog pritiska;
5. razlikuj činjenice, pretpostavke i preporuke;
6. ne izmišljaj podatke o performansama.
Odgovor strukturiraj naslovima, listama i konkretnim primerima.
`;

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const userId=requireUser(req,res); if(!userId) return;
  if(!process.env.OPENAI_API_KEY) return res.status(503).json({error:"OPENAI_API_KEY nije podešen na serveru."});
  try{
    const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
    const message=String(body.message||"").trim();
    if(!message) return res.status(400).json({error:"Napiši pitanje ili zadatak."});
    const mode=String(body.mode||"Strategija");
    const context=String(body.context||"").trim();
    const input=`${SYSTEM}

REŽIM: ${mode}
KONTEKST KORISNIKA:
${context||"Nije dodat poseban kontekst."}

PORUKA:
${message}`;

    const response=await fetch("https://api.openai.com/v1/responses",{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},
      body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-5.6-luna",input,store:false})
    });
    const data=await response.json();
    if(!response.ok) return res.status(response.status).json({error:data?.error?.message||"OpenAI zahtev nije uspeo."});
    return res.status(200).json({text:data.output_text||"",mode});
  }catch(e){return res.status(500).json({error:"Greška na serveru pri radu Marketing AI asistenta."});}
}
