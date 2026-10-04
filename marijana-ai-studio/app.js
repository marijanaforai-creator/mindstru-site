function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),2400)}function previewImage(e){const f=e.target.files?.[0],img=document.getElementById('image-preview');if(!f)return;img.src=URL.createObjectURL(f);img.style.display='block';document.getElementById('dropzone').style.display='none';showToast('Slika je učitana.')}function demoOcr(){document.getElementById('ocr-output').value='Danas radim na svom novom digitalnom proizvodu.\n\nOvo je [NEJASNO] mesto u rukopisu.\n\n🟡 AI pretpostavka: „novom“ — pouzdanost 82%.';showToast('Prepoznavanje je završeno. Proveri označene delove.')}async function callOpenAI(input){const r=await fetch('/api/openai/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({input})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'AI zahtev nije uspeo.');return d.text||''}
async function generateCopy(){const type=document.getElementById('copy-type').value,topic=document.getElementById('copy-topic').value.trim();if(!topic){showToast('Prvo napiši temu ili proizvod.');return}const out=document.getElementById('copy-output');out.value='AI radi…';try{out.value=await callOpenAI('Napiši '+type+' na srpskom jeziku za temu/proizvod: '+topic+'. Budi jasan, konkretan i profesionalan. Uključi CTA gde ima smisla.');showToast('AI nacrt je napravljen.')}catch(e){out.value='';showToast(e.message)}}function previewMockup(e){const f=e.target.files?.[0];if(!f)return;const stage=document.getElementById('mockup-stage');stage.innerHTML='';const type=document.getElementById('mockup-type')?.value||'';const img=document.createElement('img');img.className='mockup-image';img.src=URL.createObjectURL(f);img.alt='Pregled proizvoda';if(type==='Telefon ekran'){const frame=document.createElement('div');frame.className='mockup-screen-frame';frame.appendChild(img);stage.appendChild(frame);}else{stage.appendChild(img)}applyMockupFit();showToast('Slika je učitana bez razvlačenja.');}
function applyMockupFit(){const frame=document.querySelector('.mockup-screen-frame');const img=document.querySelector('.mockup-screen-frame .mockup-image');if(!frame||!img)return;const fit=document.getElementById('mockup-fit')?.value||'contain';const align=document.getElementById('mockup-align')?.value||'center';frame.classList.remove('fit-cover','fit-original','align-top','align-bottom');if(fit==='cover')frame.classList.add('fit-cover');if(fit==='original')frame.classList.add('fit-original');if(align==='top')frame.classList.add('align-top');if(align==='bottom')frame.classList.add('align-bottom');}
document.getElementById('mockup-type')?.addEventListener('change',()=>{const file=document.getElementById('mockup-input')?.files?.[0];if(file)renderMockupScene();});
function createMockup(){const file=document.getElementById('mockup-input')?.files?.[0];const type=document.getElementById('mockup-type')?.value||'proizvod';const prompt=document.getElementById('mockup-prompt')?.value.trim();if(!file){showToast('Prvo dodaj sliku proizvoda.');return}if(!prompt){showToast('Prompt je obavezan — opiši željenu scenu.');document.getElementById('mockup-prompt')?.focus();return}renderMockupScene();recordMockupUsage();showToast(type+' mockup je pripremljen prema promptu.');}
document.querySelectorAll('.nav-item').forEach(i=>i.addEventListener('click',()=>{document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));i.classList.add('active')}));
async function buildProduct(){const v=document.getElementById('product-idea')?.value.trim(),type=document.getElementById('product-type')?.value||'Digitalni proizvod',aud=document.getElementById('product-audience')?.value.trim()||'idealni korisnik',goal=document.getElementById('product-goal')?.value||'Prodaja',offer=document.getElementById('product-offer')?.value.trim()||'jasna korist proizvoda';if(!v){showToast('Unesi ideju proizvoda.');return}const fields=['product-output','sales-output','seo-output','pin-output','social-output','email-output','mockup-output','drive-output'];fields.forEach(id=>{const el=document.getElementById(id);if(el)el.value='AI priprema paket…'});const prompt=`Ti si AI Product Strategist za Marijana AI Studio. Radi na srpskom jeziku. Na osnovu podataka ispod napravi kompletan ONE PRODUCT → EVERYTHING paket. Budi konkretan, prodajno jasan, ali bez izmišljanja činjenica ili rezultata.

PROIZVOD: ${v}
TIP: ${type}
CILJNA PUBLIKA: ${aud}
CILJ: ${goal}
PONUDA: ${offer}

Vrati ISKLJUČIVO validan JSON objekat sa tačno ovim ključevima:
product, sales, seo, pinterest, social, email, mockup, drive.

product: naziv, obećanje, problem, ishod, detaljna struktura proizvoda, bonus ideje i CTA.
sales: kompletna struktura prodajne stranice sa headlineom, podnaslovom, problemom, rešenjem, benefitima, sadržajem, ponudom, FAQ pitanjima i CTA.
seo: primarna ključna fraza, 10 sekundarnih fraza, SEO naslov, meta opis, URL slug i 5 content cluster tema.
pinterest: 10 Pin naslova, 10 opisa sa CTA, 5 board ideja i ključne fraze.
social: 5 Instagram objava, 5 Reels ideja sa hookom, 5 Story ideja i 3 LinkedIn posta.
email: lead magnet ideja i welcome/prodajna sekvenca od 5 emailova sa subjectom, svrhom i CTA.
mockup: 5 konkretnih mockup scena, preporučeni preset za svaku scenu i gotov AI prompt za vizual.
drive: kompletna struktura foldera i naziv paketa koji treba sačuvati u Marijana Drive.

Ne koristi markdown oko JSON-a.`;
try{const raw=await callOpenAI(prompt);const data=JSON.parse(raw.replace(/^\s*\`\`\`json\s*/,'').replace(/\s*\`\`\`\s*$/,''));const map={product:'product-output',sales:'sales-output',seo:'seo-output',pinterest:'pin-output',social:'social-output',email:'email-output',mockup:'mockup-output',drive:'drive-output'};Object.entries(map).forEach(([k,id])=>{const el=document.getElementById(id);if(el)el.value=typeof data[k]==='string'?data[k]:JSON.stringify(data[k],null,2)});window.__lastProductAI=data;showToast('ONE PRODUCT → EVERYTHING je generisan pomoću AI-ja.')}catch(e){fields.forEach(id=>{const el=document.getElementById(id);if(el&&el.value==='AI priprema paket…')el.value=''});showToast('AI paket nije mogao da se obradi: '+e.message)}}
function saveProductSystem(){const name=document.getElementById('product-idea')?.value.trim()||'Novi proizvod';const data={id:'product-'+Date.now(),name,createdAt:new Date().toISOString(),status:'Spreman za razradu',type:document.getElementById('product-type')?.value||'',audience:document.getElementById('product-audience')?.value||'',goal:document.getElementById('product-goal')?.value||'',offer:document.getElementById('product-offer')?.value||'',sections:{product:document.getElementById('library-product-output')?.value||'',sales:document.getElementById('sales-output')?.value||'',seo:document.getElementById('seo-output')?.value||'',pinterest:document.getElementById('pin-output')?.value||'',social:document.getElementById('social-output')?.value||'',email:document.getElementById('email-output')?.value||'',mockup:document.getElementById('mockup-output')?.value||'',drive:document.getElementById('drive-output')?.value||''}};localStorage.setItem('marijanaProductSystem',JSON.stringify(data));const projects=JSON.parse(localStorage.getItem('marijanaProductProjects')||'[]');projects.unshift(data);localStorage.setItem('marijanaProductProjects',JSON.stringify(projects.slice(0,100)));showToast('Product System je sačuvan u Marijana Drive.');}
document.addEventListener('click',e=>{const tab=e.target.closest('.result-tab');if(!tab)return;document.querySelectorAll('.result-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.result-output').forEach(x=>x.classList.remove('active'));tab.classList.add('active');document.getElementById(tab.dataset.result)?.classList.add('active');});
function prepareMusic(){const p=document.getElementById('music-prompt').value.trim();const type=document.getElementById('music-type').value;const use=document.getElementById('music-use').value;if(!p){showToast('Opiši kakvu muziku želiš.');return}document.getElementById('music-output').value='MUZIČKI BRIEF\n\nOpis: '+p+'\n\nVrsta: '+type+'\nNamena: '+use+'\n\nAtmosfera: smirena, topla i dostojanstvena\nTempo: umeren / spor\nInstrumentacija: odabrati prema kulturnom i umetničkom kontekstu\nStruktura: uvod → glavna tema → razvoj → miran završetak\n\nNapomena: za stvarnu produkciju proveriti prava/licence za korišćene uzorke, snimke i muzičke materijale.';showToast('Muzički koncept je pripremljen.');}
function saveProject(){const data={savedAt:new Date().toISOString(),ocr:document.getElementById('ocr-output')?.value||'',copy:document.getElementById('copy-output')?.value||'',document:document.querySelector('.document-editor')?.innerHTML||'',product:document.getElementById('product-output')?.value||'',music:document.getElementById('music-output')?.value||''};localStorage.setItem('marijanaStudioProject',JSON.stringify(data));showToast('Projekat je sačuvan u ovom radnom prostoru.');}
function loadProject(){try{const d=JSON.parse(localStorage.getItem('marijanaStudioProject')||'null');if(!d)return;if(document.getElementById('ocr-output'))document.getElementById('ocr-output').value=d.ocr||'';if(document.getElementById('copy-output'))document.getElementById('copy-output').value=d.copy||'';if(document.querySelector('.document-editor')&&d.document)document.querySelector('.document-editor').innerHTML=d.document;if(document.getElementById('product-output'))document.getElementById('product-output').value=d.product||'';if(document.getElementById('music-output'))document.getElementById('music-output').value=d.music||'';}catch(e){}}
function newProject(){if(confirm('Otvoriti novi prazan projekat? Nesacuvan sadržaj u trenutnom projektu biće zamenjen.')){localStorage.removeItem('marijanaStudioProject');location.reload();}}
function exportDocument(kind){const editor=document.querySelector('.document-editor');const text=editor?.innerText||'';if(!text.trim()){showToast('Dokument je prazan.');return}const blob=new Blob([text],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Marijana-Dokument.txt';a.click();URL.revokeObjectURL(a.href);showToast(kind==='pdf'?'Sadržaj je izvezen kao tekstualni dokument; PDF modul će zadržati formatiranje.':'TXT je sačuvan.');}
function prepareImageBrief(){const area=[...document.querySelectorAll('#slika textarea,#slika input')].map(x=>x.value).filter(Boolean).join('\n');showToast('Vizuelni brief je spreman za povezivanje sa generatorom slike.');}
function prepareVideoBrief(){showToast('Video brief je spreman za povezivanje sa generatorom videa.');}
window.addEventListener('DOMContentLoaded',loadProject);

const CONTENT_LIBRARY={fitness:{name:'Fitness & Gym',visual:'moderan premium fitness studio, aktivna energija, čista sportska estetika',cta:'Rezerviši trening'},yoga:{name:'Yoga & Wellness',visual:'miran yoga studio, prirodno svetlo, neutralni tonovi, zen atmosfera',cta:'Zakaži svoj termin'},hotel:{name:'Hoteli',visual:'luksuzan hotel, editorial travel fotografija, elegantno osvetljenje',cta:'Rezerviši boravak'},restaurant:{name:'Restorani & Kafići',visual:'premium restoran, ukusno servirana hrana, lifestyle fotografija',cta:'Rezerviši sto'},business:{name:'Business / Preduzeća',visual:'premium corporate office, profesionalan poslovni ambijent, moderan minimalizam',cta:'Saznaj više'},beauty:{name:'Beauty & Spa',visual:'premium beauty studio, elegantna nega, soft luxury estetika',cta:'Zakaži termin'},pilates:{name:'Pilates',visual:'svetao pilates studio, elegantna wellness estetika, prirodno svetlo',cta:'Rezerviši čas'},realestate:{name:'Nekretnine',visual:'luksuzan moderan enterijer, arhitektonska fotografija, premium real estate',cta:'Pogledaj ponudu'},retail:{name:'Prodavnice & Retail',visual:'moderna prodavnica, premium product display, lifestyle retail scena',cta:'Pogledaj kolekciju'},coffee:{name:'Coffee Shop',visual:'cozy premium coffee shop, kafa u krupnom planu, lifestyle atmosfera',cta:'Poseti nas'},health:{name:'Zdravstvo',visual:'čist moderan zdravstveni prostor, poverenje, profesionalna estetika',cta:'Zakaži konsultaciju'},dental:{name:'Stomatologija',visual:'moderan dental studio, čist premium medicinski enterijer',cta:'Zakaži pregled'},fashion:{name:'Moda',visual:'editorial fashion scena, premium garderoba, sofisticirana rasveta',cta:'Pogledaj kolekciju'},jewelry:{name:'Nakit',visual:'luxury jewelry product photography, makro detalji, elegantna svetlost',cta:'Pogledaj kolekciju'},photography:{name:'Fotografija',visual:'editorial photography studio, premium camera/lifestyle scena',cta:'Rezerviši termin'},pets:{name:'Pet biznis',visual:'topao lifestyle kadar sa ljubimcem, čist premium brend stil',cta:'Saznaj više'},auto:{name:'Auto',visual:'premium automotive studio, automobil u dramatičnom ali čistom svetlu',cta:'Pogledaj ponudu'},travel:{name:'Travel',visual:'premium travel editorial, destinacija, hotel i lifestyle atmosfera',cta:'Istraži ponudu'},education:{name:'Edukacija',visual:'moderan edukativni prostor, knjige, laptop, učenje',cta:'Prijavi se'},coaching:{name:'Coaching',visual:'premium personal development workspace, editorial portrait/lifestyle',cta:'Zakaži razgovor'},saas:{name:'IT / SaaS',visual:'modern digital workspace, laptop interface, blue-indigo technology aesthetic',cta:'Isprobaj platformu'},finance:{name:'Finansije',visual:'premium financial consulting office, dokumenti, laptop, pouzdana corporate estetika',cta:'Zakaži konsultaciju'},insurance:{name:'Osiguranje',visual:'professional insurance consultation, family/business protection, clean corporate scene',cta:'Zatraži ponudu'},home:{name:'Home & Interior',visual:'premium interior design, elegantan moderan dom, editorial fotografija',cta:'Pogledaj inspiraciju'},spiritual:{name:'Spiritual / Tarot',visual:'elegantna mistična scena, tarot/oracle cards, sveće, tamni premium editorial stil',cta:'Istraži ponudu'},personal:{name:'Personal Brand',visual:'premium personal brand editorial portrait, moderan workspace, sofisticirana estetika',cta:'Upoznaj moj rad'},custom:{name:'Custom Industry',visual:'premium brand scena prilagođena konkretnoj industriji i identitetu klijenta',cta:'Saznaj više'}};
const CONTENT_FORMATS={ 'Instagram objava':{ratio:'4:5',type:'feed post'},'Instagram carousel':{ratio:'4:5',type:'carousel'},'Instagram Story':{ratio:'9:16',type:'story'},'Reel / Short video':{ratio:'9:16',type:'short video'},'Pinterest Pin':{ratio:'2:3',type:'Pinterest pin'},'LinkedIn post':{ratio:'1:1 ili 4:5',type:'LinkedIn post'},'Facebook post':{ratio:'4:5',type:'Facebook post'},'Newsletter':{ratio:'email',type:'newsletter'},'Promo kampanja':{ratio:'više formata',type:'campaign'},'Kompletan paket':{ratio:'više formata',type:'content package'}};
function getContentLibraryData(){const industry=document.getElementById('content-industry')?.value||'fitness',format=document.getElementById('content-format')?.value||'Instagram objava',goal=document.getElementById('content-goal')?.value||'Promocija usluge',client=document.getElementById('content-client')?.value||'Klijent',message=document.getElementById('content-message')?.value||'Premium sadržaj koji jasno komunicira korist ponude.';return {industry:CONTENT_LIBRARY[industry]||CONTENT_LIBRARY.custom,format:CONTENT_FORMATS[format]||CONTENT_FORMATS['Instagram objava'],formatName:format,goal,client,message};}
function updateContentLibrary(){const chips=document.getElementById('industry-chips');if(!chips)return;const data=getContentLibraryData();chips.innerHTML='<span>'+data.industry.name+'</span><span>'+data.formatName+'</span><span>'+data.goal+'</span>';generateContentPackage(false);}
function generateContentPackage(showToastAfter=true){const d=getContentLibraryData();const imagePrompt='Create a '+d.format.type+' for '+d.client+', '+d.industry.name+'. '+d.industry.visual+'. Format '+d.format.ratio+'. Brand-safe premium composition, strong visual hierarchy, realistic details, clean negative space for text, sophisticated lighting, no distorted text, no watermark. Main message: '+d.message+'.';const videoPrompt='Create a short vertical marketing video for '+d.client+' in the '+d.industry.name+' niche. '+d.industry.visual+'. Start with a strong visual hook, then 3-4 smooth cinematic shots, subtle camera movement, natural transitions, premium lighting, realistic motion, space for Serbian on-screen text, final CTA: '+d.industry.cta+'. Goal: '+d.goal+'. Duration 6-10 seconds, suitable for Reels/Shorts.';const template={title:d.client+' — '+d.industry.name,format:d.formatName,goal:d.goal,structure:['Hook / naslov','Glavna korist ili problem','Vizuelni dokaz / scena','CTA: '+d.industry.cta],design:'Koristi Brand Kit klijenta; premium, čist layout, jasna hijerarhija, dovoljno praznog prostora.'};const product='GOTOV PROIZVOD / PAKET\n\nKlijent: '+d.client+'\nIndustrija: '+d.industry.name+'\nFormat: '+d.formatName+'\nCilj: '+d.goal+'\n\nIsporuka:\n• 1 glavni vizual\n• 1 varijanta za testiranje\n• Caption / tekst objave\n• CTA: '+d.industry.cta+'\n• Prompt za sliku\n• Prompt za video\n• Predlog za Story/Reel adaptaciju\n• Predlog za Pinterest adaptaciju\n\nGlavna poruka: '+d.message;const t=document.getElementById('template-output');if(t)t.innerHTML='<div class="template-preview-card"><span class="mini-label">PRESET</span><h4>'+template.title+'</h4><p><b>Format:</b> '+template.format+' · <b>Cilj:</b> '+template.goal+'</p><ol>'+template.structure.map(x=>'<li>'+x+'</li>').join('')+'</ol><small>'+template.design+'</small></div>';const ip=document.getElementById('image-prompt-output'),vp=document.getElementById('video-prompt-output'),pp=document.getElementById('product-output');if(ip)ip.value=imagePrompt;if(vp)vp.value=videoPrompt;if(pp)pp.value=product;window.__contentPackage={template,imagePrompt,videoPrompt,product};if(showToastAfter)showToast('Paket za '+d.industry.name+' je pripremljen.');}
function showLibraryTab(id){document.querySelectorAll('.library-output').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.library-tab').forEach(x=>x.classList.remove('active'));document.getElementById(id)?.classList.add('active');document.querySelector('[data-library-tab="'+id+'"]')?.classList.add('active');}
async function copyContentPackage(){const p=window.__contentPackage;if(!p){generateContentPackage(false);return copyContentPackage();}const text=p.product+'\n\nPROMPT ZA SLIKU:\n'+p.imagePrompt+'\n\nPROMPT ZA VIDEO:\n'+p.videoPrompt;try{await navigator.clipboard.writeText(text);showToast('Kompletan paket je kopiran.')}catch(e){showToast('Paket je spreman za ručno kopiranje.');}}
function saveContentPackage(){const p=window.__contentPackage;if(!p)return showToast('Prvo pripremi paket.');localStorage.setItem('marijanaContentPackage',JSON.stringify({...p,createdAt:new Date().toISOString()}));showToast('Paket je sačuvan lokalno.');}

async function saveContentPackageToDrive(){const p=window.__contentPackage;if(!p){generateContentPackage(false);return saveContentPackageToDrive();}const d=getContentLibraryData();const payload={name:d.client+' — '+d.industry.name+' — '+d.formatName,type:'content_production_package',status:'draft',data:{client:d.client,industry:d.industry.name,format:d.formatName,goal:d.goal,message:d.message,template:p.template,imagePrompt:p.imagePrompt,videoPrompt:p.videoPrompt,product:p.product,source:'Biblioteka šablona'}};try{const res=await fetch('/api/projects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});if(!res.ok)throw new Error('save');const data=await res.json();localStorage.setItem('marijanaLastContentProductionProject',JSON.stringify(data));showToast('Content Production paket je sačuvan u Marijana Drive / Projekti.');}catch(e){localStorage.setItem('marijanaContentPackage',JSON.stringify({...p,...payload.data,createdAt:new Date().toISOString()}));showToast('Paket je sačuvan lokalno; prijava/cloud čuvanje nije dostupno.');}}
function openContentCalendar(){const d=getContentLibraryData();const params=new URLSearchParams({client:d.client,industry:d.industry.name,format:d.formatName,goal:d.goal});window.location.href='../marijana-kalendar-sadrzaja/index.html?'+params.toString();}
function previewImageToVideo(e){const file=e.target.files?.[0],box=document.getElementById('iv-preview');if(!file||!box)return;if(window.__ivObjectUrl)URL.revokeObjectURL(window.__ivObjectUrl);window.__ivObjectUrl=URL.createObjectURL(file);box.innerHTML='<img src="'+window.__ivObjectUrl+'" alt="Video source preview"><span>IMAGE SOURCE</span>';buildImageVideoPrompt(false);}
function buildImageVideoPrompt(showToastAfter=true){const file=document.getElementById('iv-image')?.files?.[0],style=document.getElementById('iv-style')?.value||'Cinematic',motion=document.getElementById('iv-motion')?.value||'Slow push-in',format=document.getElementById('iv-format')?.value||'9:16',duration=document.getElementById('iv-duration')?.value||'6 sekundi',cta=document.getElementById('iv-cta')?.value||'Zadrži pažnju i završi jasnim CTA-om';const d=getContentLibraryData();const prompt='IMAGE-TO-VIDEO PROMPT\\n\\nUse the uploaded image as the primary visual reference. Preserve the original subject, product, architecture, people, colors and brand identity. Do not redesign or distort the source image.\\n\\nIndustry: '+d.industry.name+'\\nStyle: '+style+'\\nCamera motion: '+motion+'\\nFormat: '+format+'\\nDuration: '+duration+'\\nGoal: '+d.goal+'\\nCTA: '+cta+'\\n\\nCreate natural, realistic motion with subtle depth and professional lighting. Keep the composition clean and premium. Avoid warped objects, duplicated elements, flickering, changing logos, changing faces, unreadable text and artificial movement. Begin with a strong visual frame, maintain subject consistency throughout, and finish on a clean CTA-ready frame.';const out=document.getElementById('iv-prompt');if(out)out.value=prompt;if(showToastAfter)showToast(file?'Video prompt je spreman iz tvoje slike.':'Video prompt je spreman; dodaj sliku za preview.');window.__imageVideoPrompt=prompt;}
async function copyImageVideoPrompt(){const p=window.__imageVideoPrompt||document.getElementById('iv-prompt')?.value;if(!p)return showToast('Prvo napravi video prompt.');try{await navigator.clipboard.writeText(p);showToast('Video prompt je kopiran.')}catch(e){showToast('Prompt je spreman za kopiranje.');}}
async function saveImageVideoProject(){const p=window.__imageVideoPrompt||document.getElementById('iv-prompt')?.value;if(!p)return showToast('Prvo napravi video prompt.');const d=getContentLibraryData();const payload={name:d.client+' — Image to Video',type:'image_to_video_project',status:'draft',data:{client:d.client,industry:d.industry.name,style:document.getElementById('iv-style')?.value,motion:document.getElementById('iv-motion')?.value,format:document.getElementById('iv-format')?.value,duration:document.getElementById('iv-duration')?.value,cta:document.getElementById('iv-cta')?.value,prompt:p,source:'Biblioteka šablona / Image → Video'}};try{const res=await fetch('/api/projects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});if(!res.ok)throw new Error('save');await res.json();showToast('Image → Video projekat je sačuvan u Drive projektima.')}catch(e){localStorage.setItem('marijanaImageVideoProject',JSON.stringify({...payload,createdAt:new Date().toISOString()}));showToast('Projekat je sačuvan lokalno.');}}
function buildClientProductionPackage(showToastAfter=true){const client=document.getElementById('cp-client')?.value||'Klijent',industry=document.getElementById('cp-industry')?.value||'Business / Preduzeća',offer=document.getElementById('cp-offer')?.value||'Premium usluga',message=document.getElementById('cp-message')?.value||'Jasan benefit i poziv na akciju';const pkg={client,industry,offer,message,caption:''+client+' — '+offer+'\\n\\n'+message+'\\n\\nSaznaj više i javi nam se danas.',story:'STORY 1 — HOOK\\n'+offer+'\\n\\nSTORY 2 — BENEFIT\\n'+message+'\\n\\nSTORY 3 — CTA\\nJavi nam se / Rezerviši / Saznaj više',reel:'REEL\\n0–2s: vizuelni hook\\n2–5s: prikaz usluge/proizvoda\\n5–8s: glavna korist\\n8–10s: CTA\\nCTA: '+message,pinterest:'PINTEREST PIN\\nNaslov: '+client+' — '+offer+'\\nOpis: '+message+'\\nCTA: Saznaj više',imagePrompt:'Premium '+industry+' marketing visual for '+client+'. Showcase '+offer+'. '+message+'. Clean premium composition, realistic details, strong visual hierarchy, brand-safe, commercial photography, space for Serbian headline, no watermark.',videoPrompt:'Create a 9:16 premium short marketing video for '+client+' in the '+industry+' niche. Showcase '+offer+'. Start with a strong visual hook, subtle cinematic camera movement, realistic lighting, consistent brand identity, clear benefit and finish with CTA: '+message+'. 8-10 seconds.',cta:'Saznaj više / Zakaži termin / Rezerviši / Zatraži ponudu'};window.__clientProductionPackage=pkg;const out=document.getElementById('cp-result');if(out)out.innerHTML='<div class="package-card"><span class="mini-label">READY-TO-PRODUCE PACKAGE</span><h4>'+client+'</h4><p><b>Industrija:</b> '+industry+' · <b>Ponuda:</b> '+offer+'</p><div class="package-grid"><div><b>Instagram Caption</b><p>'+pkg.caption.replaceAll('\\n','<br>')+'</p></div><div><b>Story</b><p>'+pkg.story.replaceAll('\\n','<br>')+'</p></div><div><b>Reel</b><p>'+pkg.reel.replaceAll('\\n','<br>')+'</p></div><div><b>Pinterest</b><p>'+pkg.pinterest.replaceAll('\\n','<br>')+'</p></div><div><b>Prompt za sliku</b><p>'+pkg.imagePrompt+'</p></div><div><b>Prompt za video</b><p>'+pkg.videoPrompt+'</p></div></div></div>';if(showToastAfter)showToast('Kompletan klijentski paket je spreman.');}
async function copyClientProductionPackage(){const p=window.__clientProductionPackage;if(!p){buildClientProductionPackage(false);return copyClientProductionPackage();}const text=Object.entries(p).map(([k,v])=>k.toUpperCase()+'\\n'+v).join('\\n\\n');try{await navigator.clipboard.writeText(text);showToast('Kompletan paket je kopiran.')}catch(e){showToast('Paket je spreman za kopiranje.');}}
async function saveClientProductionPackage(){const p=window.__clientProductionPackage;if(!p){buildClientProductionPackage(false);return saveClientProductionPackage();}const payload={name:p.client+' — '+p.industry+' — Content Production',type:'client_content_package',status:'draft',data:{...p,source:'Marijana AI Studio / Gotov proizvod'}};try{const res=await fetch('/api/projects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});if(!res.ok)throw new Error('save');await res.json();showToast('Klijentski paket je sačuvan u Drive projektima.')}catch(e){localStorage.setItem('marijanaClientContentPackage',JSON.stringify({...payload,createdAt:new Date().toISOString()}));showToast('Paket je sačuvan lokalno.');}}
function setMockupPreset(preset){const prompt=document.getElementById('mockup-prompt'),type=document.getElementById('mockup-type');const presets={editorial:{type:'Magazine Editorial',text:'Premium editorial mockup, clean studio background, realistic paper depth, subtle soft shadows, elegant composition, luxury digital product presentation.'},paper:{type:'Paper Stack / Layered',text:'Layered paper sheets, multiple pages with slight offsets, realistic paper thickness, soft directional shadow, clean premium background.'},book:{type:'Otvorena knjiga',text:'Open book mockup, realistic center fold, gently curved pages, visible left and right spreads, natural paper shadows, editorial photography.'},isometric:{type:'Isometric Pages',text:'Isometric digital product scene, multiple pages at different angles, controlled perspective, realistic depth and shadows, premium presentation.'},'device-set':{type:'Desktop + Laptop + Tablet + Telefon',text:'Responsive device ecosystem showing the same product across desktop, laptop, tablet and phone, coordinated perspective, clean premium scene.'},frame:{type:'Frame / Okvir',text:'Elegant framed digital artwork or printable page, realistic frame depth, wall or gallery presentation, soft natural shadow, premium minimal interior.'}}[preset];if(!presets)return;if(type)type.value=presets.type;if(prompt)prompt.value=presets.text;const file=document.getElementById('mockup-input')?.files?.[0];if(file)previewMockup({target:{files:[file]}});showToast('Preset '+preset+' je izabran.');}

function updateMockupPages(){const v=document.getElementById('mockup-pages')?.value||3;const out=document.getElementById('mockup-pages-value');if(out)out.textContent=v;renderMockupScene();}
function renderMockupScene(){const stage=document.getElementById('mockup-stage'),file=document.getElementById('mockup-input')?.files?.[0],type=document.getElementById('mockup-type')?.value||'';if(!stage||!file)return;const src=window.__mockupObjectUrl||URL.createObjectURL(file);window.__mockupObjectUrl=src;const n=Math.min(6,Math.max(1,Number(document.getElementById('mockup-pages')?.value||3)));const perspective=document.getElementById('mockup-perspective')?.value||'soft';const shadow=document.getElementById('mockup-shadow')?.value||'soft';
const img=s=>'<img src="'+s+'" alt="Proizvodni vizual">';
const paperTypes=['Jedan list','Lebdeći list','Dva lista','Više listova / Stack','Floating Sheets','Paper Stack / Layered','Isometric Pages','Isometric Wall','Zig-Zag Pages','3D Paper Scene','Multi-Page Presentation','Page Turn / Savijeni list'];
if(type==='Otvorena knjiga'||type==='Otvorena radna sveska'||type==='Magazine Spread'||type==='Magazine Editorial'||type==='Blank Book / Brochure'){stage.innerHTML='<div class="open-book"><div class="book-page left">'+img(src)+'</div><div class="book-gutter"></div><div class="book-page right">'+img(src)+'</div></div>';return}
if(type==='Frame / Okvir'||type==='Gallery Frames'){stage.innerHTML='<div class="frame-scene"><div class="frame-object">'+img(src)+'</div></div>';return}
if(paperTypes.includes(type)){const scene=document.createElement('div');scene.className='paper-scene '+perspective+' shadow-'+shadow+(type==='Page Turn / Savijeni list'?' page-turn':'');for(let i=0;i<n;i++){const sheet=document.createElement('div');sheet.className='paper-sheet';sheet.style.setProperty('--sheet-index',i);sheet.appendChild(Object.assign(document.createElement('img'),{src,alt:'Stranica proizvoda'}));scene.appendChild(sheet)}stage.innerHTML='';stage.appendChild(scene);apply3DTransform(scene);return}
if(type==='Desktop + Laptop + Tablet + Telefon'){stage.innerHTML='<div class="device-ecosystem"><div class="device desktop">'+img(src)+'</div><div class="device laptop">'+img(src)+'</div><div class="device tablet">'+img(src)+'</div><div class="device phone">'+img(src)+'</div></div>';return}
if(type==='Laptop ekran'||type==='Tablet ekran'||type==='Telefon ekran'){stage.innerHTML='';const wrap=document.createElement('div');wrap.className='single-device '+(type==='Laptop ekran'?'device-laptop':type==='Tablet ekran'?'device-tablet':'device-phone');wrap.innerHTML=img(src);stage.appendChild(wrap);apply3DTransform(wrap);return}
if(type==='Bundle proizvoda'||type==='Product Ecosystem'||type==='3D proizvod'){const scene=document.createElement('div');scene.className='product-ecosystem';for(let i=0;i<n;i++){const card=document.createElement('div');card.className='eco-card';card.style.setProperty('--i',i);card.innerHTML=img(src);scene.appendChild(card)}stage.innerHTML='';stage.appendChild(scene);apply3DTransform(scene);return}
if(type==='Desk Scene'||type==='Lifestyle Scene'||type==='Photo / Collage'){stage.innerHTML='<div class="lifestyle-scene"><div class="scene-backdrop"></div><div class="scene-product">'+img(src)+'</div><div class="scene-shadow"></div></div>';return}
previewMockup({target:{files:[file]}});}

function updateTransformValue(kind){const ids={['rotate-x']:'rotate-x-value',['rotate-y']:'rotate-y-value',['rotate-z']:'rotate-z-value',depth:'depth-value',scale:'scale-value'};const input=document.getElementById('mockup-'+kind),out=document.getElementById(ids[kind]);if(input&&out)out.textContent=input.value+(kind.startsWith('rotate')?'°':kind==='scale'?'%':'');renderMockupScene();}
function apply3DTransform(el){if(!el)return;const mode=document.getElementById('mockup-mode')?.value||'3d';const rx=document.getElementById('mockup-rotate-x')?.value||0,ry=document.getElementById('mockup-rotate-y')?.value||0,rz=document.getElementById('mockup-rotate-z')?.value||0,depth=document.getElementById('mockup-depth')?.value||0,scale=(document.getElementById('mockup-scale')?.value||100)/100;if(mode==='2d'){el.style.transform='translateZ('+depth+'px) rotateZ('+rz+'deg) scale('+scale+')';}else{el.style.transform='translateZ('+depth+'px) rotateX('+rx+'deg) rotateY('+ry+'deg) rotateZ('+rz+'deg) scale('+scale+')';}}


function getTrialDaysLeft(){const started=localStorage.getItem('marijanaTrialStartedAt');if(!started)return 30;const remaining=Math.max(0,30*24*60*60*1000-(Date.now()-new Date(started).getTime()));return Math.ceil(remaining/(24*60*60*1000));}
function updateDashboard(){const uRaw=localStorage.getItem('marijanaUser');let u=null;try{u=uRaw?JSON.parse(uRaw):null}catch(e){}const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};const d=getTrialDaysLeft();set('dash-user-name',u?.name||'Gost');set('dash-user-email',u?.email||'Prijavi se da vidiš svoj workspace.');set('dash-plan',u?'Free Trial':'Free Trial');set('dash-plan-status',d>0?'Aktivan trial':'Trial je istekao');set('dash-days',d>0?d+' '+(d===1?'dan':'dana'):'Istekao');let products=0;try{products=localStorage.getItem('marijanaProductSystem')?1:0}catch(e){}set('dash-products',products);set('dash-projects',localStorage.getItem('marijanaStudioProject')?'1':'0');const used=Number(localStorage.getItem('marijanaMockupCount')||0);set('dash-mockups',Math.min(used,10)+' / 10');}
function recordMockupUsage(){const used=Number(localStorage.getItem('marijanaMockupCount')||0)+1;localStorage.setItem('marijanaMockupCount',String(used));updateDashboard();}

function startFreeTrial(){let started=localStorage.getItem('marijanaTrialStartedAt');if(!started){started=new Date().toISOString();localStorage.setItem('marijanaTrialStartedAt',started);}localStorage.setItem('marijanaSelectedPlan','Free');updateTrialStatus();showToast('Free trial od 30 dana je aktiviran.');}
function updateTrialStatus(){const el=document.getElementById('trial-status');if(!el)return;const started=localStorage.getItem('marijanaTrialStartedAt');const title=document.getElementById('trial-status-title'),text=document.getElementById('trial-status-text'),days=document.getElementById('trial-days');if(!started){if(title)title.textContent='30 dana besplatno';if(text)text.textContent='Klikni „Počni besplatno“ da aktiviraš svoj trial.';if(days)days.textContent='30 dana';return;}const start=new Date(started).getTime(),now=Date.now(),total=30*24*60*60*1000,remaining=Math.max(0,total-(now-start)),left=Math.ceil(remaining/(24*60*60*1000));if(left<=0){if(title)title.textContent='Trial je istekao';if(text)text.textContent='Izaberi Pro, Premium ili Business za nastavak.';if(days)days.textContent='Istekao';el.classList.add('expired');return;}if(title)title.textContent='Free trial je aktivan';if(text)text.textContent='Trial je počeo '+new Date(start).toLocaleDateString('sr-RS')+'.';if(days)days.textContent=left+' '+(left===1?'dan':'dana');}
function selectPlan(plan){if(plan==='Free'){startFreeTrial();return}localStorage.setItem('marijanaSelectedPlan',plan);showToast(plan+' plan je izabran — naplata će biti povezana kada postavimo billing.');}
document.addEventListener('DOMContentLoaded',()=>{updateTrialStatus();setInterval(updateTrialStatus,60000);});

let authMode='login';
function openAuth(mode='login'){authMode=mode;const o=document.getElementById('auth-overlay');if(!o)return;o.classList.add('open');o.setAttribute('aria-hidden','false');updateAuthUI();setTimeout(()=>document.getElementById('auth-email')?.focus(),100);}
function closeAuth(){const o=document.getElementById('auth-overlay');if(o){o.classList.remove('open');o.setAttribute('aria-hidden','true');}}
function toggleAuthMode(){authMode=authMode==='login'?'register':'login';updateAuthUI();}
function updateAuthUI(){const reg=authMode==='register';const title=document.getElementById('auth-title'),sub=document.getElementById('auth-subtitle'),name=document.getElementById('auth-name-wrap'),submit=document.getElementById('auth-submit'),sw=document.getElementById('auth-switch');if(title)title.textContent=reg?'Napravi nalog':'Prijavi se';if(sub)sub.textContent=reg?'Kreiraj svoj Marijana AI Studio radni prostor.':'Uđi u svoj Marijana AI Studio nalog.';if(name)name.classList.toggle('auth-hidden',!reg);if(submit)submit.textContent=reg?'Kreiraj nalog':'Prijavi se';if(sw)sw.textContent=reg?'Već imam nalog — prijavi se':'Nemam nalog — napravi nalog';}
function submitAuth(e){e.preventDefault();const email=document.getElementById('auth-email')?.value.trim().toLowerCase(),password=document.getElementById('auth-password')?.value||'',name=document.getElementById('auth-name')?.value.trim()||'Marijana';if(!email||password.length<6){showToast('Unesi ispravan email i lozinku od najmanje 6 karaktera.');return}const user={email,name,plan:'Free',trialStartedAt:new Date().toISOString(),createdAt:new Date().toISOString()};localStorage.setItem('marijanaUser',JSON.stringify(user));localStorage.setItem('marijanaSelectedPlan','Free');if(!localStorage.getItem('marijanaTrialStartedAt'))localStorage.setItem('marijanaTrialStartedAt',user.trialStartedAt);closeAuth();updateAccountUI();updateTrialStatus();updateDashboard();showToast(regAuthMessage());}
function regAuthMessage(){return authMode==='register'?'Nalog je kreiran. Dobrodošla u Marijana AI Studio.':'Uspešno si prijavljena.';}
function logoutUser(){localStorage.removeItem('marijanaUser');updateAccountUI();updateDashboard();showToast('Odjavljena si iz ovog workspace-a.');}
function updateAccountUI(){const raw=localStorage.getItem('marijanaUser');let u=null;try{u=raw?JSON.parse(raw):null}catch(e){}const title=document.getElementById('account-title'),textEl=document.getElementById('account-text'),login=document.getElementById('account-login'),register=document.getElementById('account-register'),logout=document.getElementById('account-logout');if(u){if(title)title.textContent=u.name||'Moj nalog';if(textEl)textEl.textContent=(u.email||'')+' · Free trial';login?.classList.add('auth-hidden');register?.classList.add('auth-hidden');logout?.classList.remove('auth-hidden');}else{if(title)title.textContent='Tvoj nalog';if(textEl)textEl.textContent='Prijavi se da nastaviš.';login?.classList.remove('auth-hidden');register?.classList.remove('auth-hidden');logout?.classList.add('auth-hidden');}}
async function syncCloudProjects(){
  try{
    const r=await fetch('/api/projects',{credentials:'same-origin'});
    if(!r.ok)return;
    const d=await r.json();
    if(Array.isArray(d.projects)) localStorage.setItem('marijanaProductProjects',JSON.stringify(d.projects.map(p=>({id:p.id,name:p.name,createdAt:p.created_at,status:p.status,type:p.data?.type||p.type,audience:p.data?.audience||'',goal:p.data?.goal||'',offer:p.data?.offer||'',sections:p.data?.sections||{}}))));
  }catch(e){}
}
async function restoreCloudSession(){
  try{
    const r=await fetch('/api/auth/me',{credentials:'same-origin'});
    if(!r.ok)return;
    const d=await r.json();
    if(d.user){localStorage.setItem('marijanaUser',JSON.stringify(d.user));updateAccountUI();updateDashboard();}
    await syncCloudProjects();
  }catch(e){}
}
document.addEventListener('DOMContentLoaded',()=>{updateAccountUI();updateAuthUI();updateDashboard();restoreCloudSession();});

function connectCanva(){window.location.href='/api/canva/authorize';}
async function connectOpenAI(){try{const text=await callOpenAI('Napiši jednu kratku rečenicu na srpskom kojom potvrđuješ da je Marijana AI Studio povezan sa AI servisom.');if(text){localStorage.setItem('marijanaOpenAIConnection','connected');showToast('AI konekcija radi.');}}catch(e){localStorage.setItem('marijanaOpenAIConnection','pending');showToast(e.message)}updateConnections();}
function updateConnections(){const canva=localStorage.getItem('marijanaCanvaConnection'),openai=localStorage.getItem('marijanaOpenAIConnection');const a=document.getElementById('canva-status'),b=document.getElementById('openai-status');if(a)a.textContent=canva==='connected'?'POVEZANO':'PRIPREMLJENO';if(b)b.textContent=openai==='connected'?'POVEZANO':'PRIPREMLJENO';}
document.addEventListener('DOMContentLoaded',()=>{updateConnections();});

function connectService(name){localStorage.setItem('marijanaConnection_'+name,'pending');showToast(name+' konektor je dodat u Connections Hub. Pravo OAuth povezivanje će se aktivirati kroz developer podešavanja.');}

function handleConnectionCallback(){const p=new URLSearchParams(location.search);if(p.get('connection')==='canva'){const status=p.get('status');if(status==='connected'){localStorage.setItem('marijanaCanvaConnection','connected');showToast('Canva je povezana.');}else if(status==='denied'){showToast('Canva povezivanje je otkazano.');}history.replaceState({},document.title,location.pathname);updateConnections();}}
document.addEventListener('DOMContentLoaded',handleConnectionCallback);


/* CLOUD PERSISTENCE OVERRIDES */
async function submitAuth(e){
  e.preventDefault();
  const email=document.getElementById('auth-email')?.value.trim().toLowerCase();
  const password=document.getElementById('auth-password')?.value||'';
  const name=document.getElementById('auth-name')?.value.trim()||'Marijana';
  if(!email||password.length<8){showToast('Unesi ispravan email i lozinku od najmanje 8 karaktera.');return}
  const endpoint=authMode==='register'?'/api/auth/register':'/api/auth/login';
  try{
    const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password}),credentials:'same-origin'});
    const d=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(d.error||'Autentikacija nije uspela.');
    localStorage.setItem('marijanaUser',JSON.stringify(d.user));
    if(authMode==='register'&&!localStorage.getItem('marijanaTrialStartedAt'))localStorage.setItem('marijanaTrialStartedAt',new Date().toISOString());
    closeAuth();updateAccountUI();updateTrialStatus();updateDashboard();showToast(authMode==='register'?'Nalog je kreiran. Dobrodošla u Marijana AI Studio.':'Uspešno si prijavljena.');
    await syncCloudProjects();
  }catch(e){showToast(e.message)}
}

async function logoutUser(){
  try{await fetch('/api/auth/logout',{method:'POST',credentials:'same-origin'});}catch(e){}
  localStorage.removeItem('marijanaUser');
  updateAccountUI();updateDashboard();showToast('Odjavljena si iz ovog workspace-a.');
}

async function saveProductSystem(){
  const name=document.getElementById('product-idea')?.value.trim()||'Novi proizvod';
  const data={name,createdAt:new Date().toISOString(),status:'Spreman za razradu',type:document.getElementById('product-type')?.value||'',audience:document.getElementById('product-audience')?.value||'',goal:document.getElementById('product-goal')?.value||'',offer:document.getElementById('product-offer')?.value||'',sections:{product:document.getElementById('product-output')?.value||'',sales:document.getElementById('sales-output')?.value||'',seo:document.getElementById('seo-output')?.value||'',pinterest:document.getElementById('pin-output')?.value||'',social:document.getElementById('social-output')?.value||'',email:document.getElementById('email-output')?.value||'',mockup:document.getElementById('mockup-output')?.value||'',drive:document.getElementById('drive-output')?.value||''}};
  try{
    const r=await fetch('/api/projects',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({name,type:'product_system',status:data.status,data})});
    const d=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(d.error||'Cloud čuvanje nije uspelo.');
    data.id=d.project?.id||('product-'+Date.now());
    localStorage.setItem('marijanaProductSystem',JSON.stringify(data));
    await syncCloudProjects();
    showToast('Product System je sačuvan u cloud workspace.');
  }catch(e){
    const local={id:'product-'+Date.now(),...data};
    localStorage.setItem('marijanaProductSystem',JSON.stringify(local));
    const projects=JSON.parse(localStorage.getItem('marijanaProductProjects')||'[]');
    projects.unshift(local);localStorage.setItem('marijanaProductProjects',JSON.stringify(projects.slice(0,100)));
    showToast('Cloud nije dostupan — projekat je privremeno sačuvan lokalno.');
  }
}

async function syncCloudProjects(){
  try{
    const r=await fetch('/api/projects',{credentials:'same-origin'});
    if(!r.ok)return;
    const d=await r.json();
    if(Array.isArray(d.projects)){
      const normalized=d.projects.map(p=>({id:p.id,name:p.name,createdAt:p.created_at,status:p.status,type:p.data?.type||p.type,audience:p.data?.audience||'',goal:p.data?.goal||'',offer:p.data?.offer||'',sections:p.data?.sections||{}}));
      localStorage.setItem('marijanaProductProjects',JSON.stringify(normalized));
      if(typeof loadProjectProjects==='function')loadProjectProjects();
    }
  }catch(e){}
}

async function restoreCloudSession(){
  try{
    const r=await fetch('/api/auth/me',{credentials:'same-origin'});
    if(!r.ok)return;
    const d=await r.json();
    if(d.user){
      localStorage.setItem('marijanaUser',JSON.stringify(d.user));
      updateAccountUI();updateDashboard();
      await syncCloudProjects();
    }
  }catch(e){}
}
document.addEventListener('DOMContentLoaded',restoreCloudSession);


/* FUNNEL BRIDGE */
async function openFunnelFromProductSystem(){
  const raw=localStorage.getItem('marijanaProductSystem');
  if(!raw){alert('Prvo napravi Product System.');return;}
  try{
    const product=JSON.parse(raw);
    const r=await fetch('/api/funnels/from-product',{
      method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',
      body:JSON.stringify({name:product.name||'Product Funnel',product})
    });
    const d=await r.json();
    if(!r.ok){alert(d.error||'Nije moguće napraviti funnel.');return;}
    window.location.href='../marijana-funnel/index.html';
  }catch(e){alert('Funnel bridge trenutno nije dostupan.');}
}

async function loadMarijanaBrandKit(){
  if (window.MarijanaBrandKit?.load) return window.MarijanaBrandKit.load();
  return null;
}
window.loadMarijanaBrandKit=loadMarijanaBrandKit;
loadMarijanaBrandKit();

(() => {
const state={category:"digital",scene:"minimal"};
const $=id=>document.getElementById(id);
const colors=()=>{const c=window.MarijanaBrandKit?.get?.().colors||{};return {ivory:c.ivory||"#F7F3EA",black:c.black||"#111111",gold:c.champagneGold||"#D9BD82",azure:c.azure||"#4EA8FF",sage:c.sage||"#8EA386"}};
const sceneText={minimal:"minimal premium studio",luxury:"luxury editorial studio with champagne gold accents",editorial:"high-end editorial photography",desk:"elegant modern desk scene",studio:"clean creative studio",home:"warm refined home workspace",outdoor:"bright lifestyle outdoor scene","3d":"premium 3D product presentation",social:"clean social media content scene"};
const categoryText={digital:"digital product",fitness:"fitness and wellness",hotel:"luxury hotel",restaurant:"restaurant and hospitality",beauty:"beauty and spa",business:"business brand",finance:"finance brand",insurance:"insurance business",tarot:"spiritual and tarot brand",personal:"personal brand"};
function syncStage(){const stage=$("mockup-stage");if(!stage)return;const c=colors(),bg=$("mockup-background")?.value||"ivory",opacity=(Number($("mockup-opacity")?.value||100))/100,blur=Number($("mockup-bg-blur")?.value||0),map={ivory:c.ivory,black:c.black,gold:c.gold,azure:c.azure,sage:c.sage,gradient:"linear-gradient(135deg,"+c.ivory+","+c.sage+","+c.azure+")",transparent:"transparent"};stage.style.background=map[bg]||c.ivory;stage.style.opacity=opacity;stage.style.filter=blur?"blur("+blur+"px)":"";}
function buildPrompt(){const type=$("mockup-type")?.value||"mockup",p=$("mockup-prompt");if(p)p.value="Create a "+sceneText[state.scene]+" scene for a "+categoryText[state.category]+" using a "+type.toLowerCase()+". Preserve the uploaded product artwork exactly. Realistic materials, natural depth, controlled shadows, premium composition.";}
function wire(){document.querySelectorAll("#mockup-categories .mockup-chip").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#mockup-categories .mockup-chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.category=b.dataset.category;buildPrompt();}));document.querySelectorAll("#mockup-scenes .mockup-chip").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#mockup-scenes .mockup-chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.scene=b.dataset.scene;buildPrompt();}));$("mockup-background")?.addEventListener("change",syncStage);$("mockup-opacity")?.addEventListener("input",e=>{$("mockup-opacity-value").textContent=e.target.value+"%";syncStage()});$("mockup-bg-blur")?.addEventListener("input",e=>{$("mockup-bg-blur-value").textContent=e.target.value;syncStage()});syncStage();buildPrompt();}
document.addEventListener("DOMContentLoaded",wire);
window.MarijanaMockupStudio={state,buildPrompt,syncStage};
})();

(function(){
let bgUrl="";
function setupMockupSceneAssets(){
 const bg=document.getElementById("mockup-bg-input"),stage=document.getElementById("mockup-stage");
 if(bg)bg.addEventListener("change",e=>{const f=e.target.files?.[0];if(!f)return;bgUrl=URL.createObjectURL(f);stage.style.backgroundImage="url('"+bgUrl+"')";stage.style.backgroundSize="cover";stage.style.backgroundPosition="50% 50%";});
 [["mockup-pos-x","mockup-pos-x-value"],["mockup-pos-y","mockup-pos-y-value"]].forEach(([id,out])=>{const el=document.getElementById(id);if(el)el.addEventListener("input",()=>{document.getElementById(out).textContent=el.value+"%";const x=document.getElementById("mockup-pos-x")?.value||0,y=document.getElementById("mockup-pos-y")?.value||0;if(stage)stage.style.backgroundPosition=(50+Number(x))+"% "+(50+Number(y))+"%";});});
}
window.exportMockup=function(format){
 const stage=document.getElementById("mockup-stage");if(!stage){showToast("Preview nije pronađen.");return}
 const canvas=document.createElement("canvas"),rect=stage.getBoundingClientRect(),scale=2;
 canvas.width=Math.max(1,Math.round(rect.width*scale));canvas.height=Math.max(1,Math.round(rect.height*scale));
 const ctx=canvas.getContext("2d");if(format==="transparent")ctx.clearRect(0,0,canvas.width,canvas.height);else{const c=getComputedStyle(stage).backgroundColor||"#f7f3ea";ctx.fillStyle=c;ctx.fillRect(0,0,canvas.width,canvas.height);}
 const data=stage.querySelector(".mockup-image,.single-device img,.paper-sheet img,.scene-product img,.frame-object img");if(data){const im=new Image();im.crossOrigin="anonymous";im.onload=()=>{const maxW=canvas.width*.8,maxH=canvas.height*.78,s=Math.min(maxW/im.naturalWidth,maxH/im.naturalHeight);ctx.drawImage(im,(canvas.width-im.naturalWidth*s)/2,(canvas.height-im.naturalHeight*s)/2,im.naturalWidth*s,im.naturalHeight*s);downloadCanvas(canvas,format);};im.src=data.currentSrc||data.src;}else downloadCanvas(canvas,format);
};
function downloadCanvas(canvas,format){const mime=format==="jpg"?"image/jpeg":"image/png",url=canvas.toDataURL(mime,.92),a=document.createElement("a");a.href=url;a.download="marijana-mockup-"+Date.now()+"."+ (format==="jpg"?"jpg":"png");a.click();showToast("Mockup je izvezen.");}
document.addEventListener("DOMContentLoaded",setupMockupSceneAssets);
})();

(function(){
function setupMockupCanvasInteraction(){
 const stage=document.getElementById("mockup-stage");if(!stage)return;
 let target=null,drag=false,startX=0,startY=0,startLeft=0,startTop=0;
 const pick=e=>e.target.closest(".single-device,.paper-scene,.open-book,.frame-scene,.product-ecosystem,.lifestyle-scene,.device-ecosystem");
 stage.addEventListener("pointerdown",e=>{
   target=pick(e);if(!target)return;drag=true;stage.setPointerCapture?.(e.pointerId);
   const r=target.getBoundingClientRect(),sr=stage.getBoundingClientRect();
   startX=e.clientX;startY=e.clientY;
   startLeft=r.left-sr.left+stage.scrollLeft;startTop=r.top-sr.top+stage.scrollTop;
   target.classList.add("mockup-dragging");
 });
 stage.addEventListener("pointermove",e=>{
   if(!drag||!target)return;
   const x=startLeft+(e.clientX-startX),y=startTop+(e.clientY-startY);
   target.style.position="absolute";target.style.left=x+"px";target.style.top=y+"px";target.style.margin=0;
 });
 const stop=()=>{if(target)target.classList.remove("mockup-dragging");drag=false;target=null};
 stage.addEventListener("pointerup",stop);stage.addEventListener("pointercancel",stop);
 stage.addEventListener("wheel",e=>{
   const el=pick(e);if(!el)return;
   e.preventDefault();
   const input=document.getElementById("mockup-scale");if(!input)return;
   const next=Math.max(Number(input.min||50),Math.min(Number(input.max||160),Number(input.value||100)+(e.deltaY<0?5:-5)));
   input.value=next;window.updateTransformValue?.("scale");
 },{passive:false});
}
document.addEventListener("DOMContentLoaded",setupMockupCanvasInteraction);
})();

(function(){
let layers=[],activeLayer=0;
function layerSource(){return window.__mockupObjectUrl||document.querySelector("#mockup-stage img")?.src||""}
function refreshLayerList(){
 const list=document.getElementById("mockup-layer-list"),status=document.getElementById("mockup-layer-status");if(!list)return;
 list.innerHTML="";
 layers.forEach((l,i)=>{const b=document.createElement("button");b.type="button";b.className="mockup-layer-item"+(i===activeLayer?" active":"");b.textContent=(i+1)+". "+l.name;b.onclick=()=>selectMockupLayer(i);list.appendChild(b);});
 if(status)status.textContent="Sloj "+(activeLayer+1)+" / "+Math.max(1,layers.length);
}
function selectMockupLayer(i){activeLayer=Math.max(0,Math.min(i,layers.length-1));refreshLayerList();const el=layers[activeLayer]?.el;if(el){document.querySelectorAll(".mockup-layer-selected").forEach(x=>x.classList.remove("mockup-layer-selected"));el.classList.add("mockup-layer-selected")}}
window.addMockupLayer=function(){
 const src=layerSource();if(!src){showToast("Prvo dodaj sliku proizvoda.");return}
 const stage=document.getElementById("mockup-stage");if(!stage)return;
 const el=document.createElement("div");el.className="mockup-layer-object";el.innerHTML='<img src="'+src+'" alt="Proizvodni sloj">';
 el.style.left=(20+layers.length*6)+"%";el.style.top=(20+layers.length*5)+"%";el.style.transform="translate(-50%,-50%) scale(.7)";
 stage.appendChild(el);layers.push({name:"Proizvod "+(layers.length+1),el});selectMockupLayer(layers.length-1);
 showToast("Novi sloj je dodat.");
};
window.duplicateMockupLayer=function(){if(!layers.length){window.addMockupLayer();return}const src=layers[activeLayer]?.el?.querySelector("img")?.src;if(!src)return;const stage=document.getElementById("mockup-stage"),el=document.createElement("div");el.className="mockup-layer-object";el.innerHTML='<img src="'+src+'" alt="Duplirani proizvod">';el.style.left=(55+layers.length*3)+"%";el.style.top=(55+layers.length*3)+"%";el.style.transform="translate(-50%,-50%) scale(.7)";stage.appendChild(el);layers.push({name:"Kopija "+(layers.length+1),el});selectMockupLayer(layers.length-1);};
window.deleteMockupLayer=function(){if(!layers.length)return;layers[activeLayer].el.remove();layers.splice(activeLayer,1);activeLayer=Math.max(0,activeLayer-1);refreshLayerList();showToast("Sloj je obrisan.");};
document.addEventListener("DOMContentLoaded",()=>{layers=[];refreshLayerList()});
})();

(function(){
function currentLayer(){const s=window.__marijanaMockupLayers;return s?.layers?.[s.active]||null}
function syncLayerUI(){const l=currentLayer();const o=document.getElementById("mockup-layer-opacity"),v=document.getElementById("mockup-layer-opacity-value");if(o)o.value=Math.round((l?.opacity??1)*100);if(v)v.textContent=Math.round((l?.opacity??1)*100)+"%";}
window.__marijanaMockupLayers=window.__marijanaMockupLayers||{layers:[],active:0};
window.toggleMockupLayerVisibility=function(){const l=currentLayer();if(!l)return;l.visible=l.visible===false; l.el.style.display=l.visible?"":"none";refreshLayerList?.();};
window.toggleMockupLayerLock=function(){const l=currentLayer();if(!l)return;l.locked=!l.locked;l.el.classList.toggle("mockup-layer-locked",l.locked);refreshLayerList?.();};
window.setMockupLayerOpacity=function(v){const l=currentLayer();if(!l)return;l.opacity=Number(v)/100;l.el.style.opacity=l.opacity;const o=document.getElementById("mockup-layer-opacity-value");if(o)o.textContent=v+"%";};
window.moveMockupLayer=function(dir){
 const s=window.__marijanaMockupLayers,l=currentLayer();if(!l)return;
 let next=s.layers.indexOf(l);
 if(dir===-999)next=0;else if(dir===999)next=s.layers.length-1;else next=Math.max(0,Math.min(s.layers.length-1,next+dir));
 if(next===s.layers.indexOf(l))return;
 s.layers.splice(s.layers.indexOf(l),1);s.layers.splice(next,0,l);
 const stage=document.getElementById("mockup-stage");s.layers.forEach(x=>stage.appendChild(x.el));
 refreshLayerList?.();selectMockupLayer?.(next);syncLayerUI();
};
document.addEventListener("DOMContentLoaded",syncLayerUI);
})();