import { requireUser } from "../_lib/auth.js";

const MAX_PROMPT_LENGTH=4000;
const MAX_IMAGE_DATA_LENGTH=6_000_000;

function json(res,status,payload){return res.status(status).json(payload);}

function dataUrlToBlob(dataUrl){
  const match=String(dataUrl||'').match(/^data:(image\\/(?:png|jpe?g|webp));base64,([A-Za-z0-9+/=]+)$/i);
  if(!match)return null;
  const mime=match[1].toLowerCase().replace('jpg','jpeg');
  return new Blob([Buffer.from(match[2],'base64')],{type:mime});
}

function buildPrompt(prompt,preserveIdentity){
  const identity=preserveIdentity
    ? 'Preserve the persons identity, facial structure, recognizable features and overall likeness as strongly as possible. Do not change who the person is.'
    : 'Follow the requested transformation without an identity-preservation constraint.';
  return [
    'Create a polished photorealistic image from the supplied reference photograph.',
    identity,
    'Change only what the user requests. Keep unrelated aspects of the reference stable whenever possible.',
    'Do not add watermarks or unrelated people. Keep anatomy, hands, lighting and proportions natural.',
    'User request: '+prompt
  ].join('\\n\\n');
}

async function generateImage({prompt,imageData,quality,preserveIdentity}){
  const model=process.env.OPENAI_IMAGE_MODEL||'gpt-image-2.5-flare';
  const size=quality==='ultra'?'1536x1024':quality==='fast'?'1024x1024':'1536x1024';
  const responseUrl='https://api.openai.com/v1/images/edits';
  const blob=dataUrlToBlob(imageData);
  if(!blob)throw new Error('Referentna fotografija nije u podržanom formatu.');

  const form=new FormData();
  form.append('model',model);
  form.append('prompt',buildPrompt(prompt,preserveIdentity));
  form.append('size',size);
  form.append('quality',quality==='fast'?'low':'medium');
  form.append('output_format','png');
  form.append('image',blob,'moj-ai-lik-reference.png');

  const response=await fetch(responseUrl,{method:'POST',headers:{Authorization:'Bearer '+process.env.OPENAI_API_KEY},body:form});
  const raw=await response.json().catch(()=>({}));
  if(!response.ok){
    console.error('Private persona image error',raw);
    throw new Error(raw?.error?.message||'AI servis trenutno nije vratio sliku.');
  }
  const image=raw?.data?.[0];
  if(!image?.b64_json)throw new Error('AI servis nije vratio generisanu sliku.');
  return {imageData:image.b64_json,size,model,revisedPrompt:image.revised_prompt||''};
}

export default async function handler(req,res){
  if(req.method!=='POST')return json(res,405,{error:'Method not allowed.'});

  const userId=requireUser(req,res);
  if(!userId)return;

  if(!process.env.OPENAI_API_KEY)return json(res,503,{error:'OPENAI_API_KEY nije podešen na serveru.'});

  try{
    const body=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});
    const prompt=String(body.prompt||'').trim();
    const imageData=String(body.imageData||'');
    const preserveIdentity=body.preserveIdentity!==false;
    const quality=['fast','high','ultra'].includes(body.quality)?body.quality:'high';

    if(!prompt)return json(res,400,{error:'Napiši šta želiš da promeniš.'});
    if(prompt.length>MAX_PROMPT_LENGTH)return json(res,400,{error:'Prompt je predugačak.'});
    if(!imageData)return json(res,400,{error:'Referentna fotografija je obavezna.'});
    if(imageData.length>MAX_IMAGE_DATA_LENGTH)return json(res,413,{error:'Fotografija je prevelika. Pokušaj sa manjom fotografijom.'});

    const result=await generateImage({prompt,imageData,quality,preserveIdentity});
    return json(res,200,result);
  }catch(error){
    console.error('Moj AI Lik error:',error);
    return json(res,502,{error:error?.message||'Greška pri generisanju slike.'});
  }
}
