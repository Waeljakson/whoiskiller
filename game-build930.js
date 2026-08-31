(()=>{
const BUILD="930";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)], esc=t=>String(t??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const S={index:0,points:0,credits:0,rank:"محقق متدرب",solved:0,selected:0,docs:new Set(),evidence:new Set(),questions:new Set(),contradictions:new Set(),wrong:0,inventory:new Map(),storeItems:[],pendingNext:null,profile:{},briefStep:0,toolDiscoveries:new Set(),justDiscovered:null};

const AudioFx=(()=>{
 let ctx=null,enabled=localStorage.getItem("whoiskiller_sound")!=="0";
 function get(){if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();if(ctx.state==="suspended")ctx.resume();return ctx}
 function tone(freq,dur=.08,type="sine",gain=.06,delay=0){if(!enabled)return;try{const c=get(),o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,c.currentTime+delay);g.gain.exponentialRampToValueAtTime(gain,c.currentTime+delay+.01);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+delay+dur);o.connect(g).connect(c.destination);o.start(c.currentTime+delay);o.stop(c.currentTime+delay+dur+.02)}catch{}}
 function noise(dur=.15,gain=.035){if(!enabled)return;try{const c=get(),len=Math.floor(c.sampleRate*dur),buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);const s=c.createBufferSource(),g=c.createGain();s.buffer=buf;g.gain.value=gain;s.connect(g).connect(c.destination);s.start()}catch{}}
 return{
  isEnabled:()=>enabled,
  toggle(){enabled=!enabled;localStorage.setItem("whoiskiller_sound",enabled?"1":"0");return enabled},
  unlock(){if(enabled)try{get()}catch{}},
  evidence(){tone(420,.045,"square",.035);tone(760,.07,"sine",.04,.04)},
  paper(){noise(.18,.045);tone(180,.06,"triangle",.025,.02);tone(250,.08,"triangle",.02,.09)},
  radio(){tone(1180,.045,"square",.035);tone(940,.05,"square",.03,.07)},
  success(){tone(523,.15,"sine",.05);tone(659,.16,"sine",.05,.12);tone(784,.26,"sine",.055,.25)},
  error(){tone(180,.16,"sawtooth",.035);tone(145,.22,"sawtooth",.03,.12)},
  promotion(){tone(392,.18,"sine",.05);tone(523,.22,"sine",.055,.14);tone(659,.25,"sine",.06,.29);tone(784,.42,"sine",.055,.46)},
  siren(){for(let i=0;i<6;i++){tone(i%2?760:570,.22,"sine",.035,i*.22)}},
  click(){tone(880,.035,"square",.022)}
 }
})();

const qbank=[["where","أين كنت وقت الجريمة؟"],["relation","ما علاقتك بالضحية؟"],["motive","هل لديك دافع لقتلها؟"],["evidence","ما تفسيرك لهذا الدليل؟"],["timeline","اشرح توقيت تحركاتك"],["contact","متى كان آخر تواصل؟"]];
const RANKS=[
 {cases:0,name:"محقق متدرب"},{cases:3,name:"محقق مساعد"},{cases:8,name:"محقق جنائي"},{cases:20,name:"محقق أول"},{cases:40,name:"محقق خبير"},
 {cases:80,name:"محقق مخضرم"},{cases:150,name:"رئيس فريق تحقيق"},{cases:250,name:"محقق دولي"},{cases:380,name:"قائد تحقيقات دولية"},{cases:500,name:"أسطورة التحقيق"}
];
const c=()=>CaseEngine.get(S.index);

function resetCaseSession(){S.selected=0;S.docs.clear();S.evidence.clear();S.questions.clear();S.contradictions.clear();S.wrong=0;S.toolDiscoveries.clear();S.justDiscovered=null;S.pendingNext=null;$("#accusationMsg").textContent="";$("#hintText").textContent="";$("#toolDiscovery").classList.add("hidden");$("#toolDiscovery").innerHTML="";const layer=$("#specialClueLayer");if(layer)layer.innerHTML="";const hotspots=$("#sceneHotspotLayer");if(hotspots)hotspots.innerHTML="";const hit=$("#sceneHitResult");if(hit)hit.remove()}
function setView(v){$$(".view").forEach(x=>x.classList.add("hidden"));$("#view-"+v)?.classList.remove("hidden");$$("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===v));if(v==="interrogate")renderInterrogation();if(v==="theory")renderTheory();if(v==="map")renderMap();if(v==="league")renderLeague();if(v==="store")renderStore();window.scrollTo({top:0,behavior:"smooth"})}
function toast(text,error=false){const el=$("#gameToast");el.textContent=text;el.className="game-toast"+(error?" error":"");setTimeout(()=>el.classList.add("hidden"),3300)}
function header(){const cc=c();$("#soundToggle").textContent=AudioFx.isEnabled()?"🔊 الأصوات":"🔇 صامت";$("#soundToggle").classList.toggle("muted",!AudioFx.isEnabled());$("#caseTitle").innerHTML=(cc.special?'<span class="special-case-badge">مهمة خاصة</span>':"")+esc(cc.title);$("#caseNo").textContent=`القضية ${cc.index+1} من ${CaseEngine.total}`;$("#locationTop").textContent=`${cc.scope} • ${cc.city} • ${cc.country}`;$("#points").textContent=S.points.toLocaleString("ar-EG");$("#credits").textContent=S.credits.toLocaleString("ar-EG");$("#rank").textContent=S.rank;$("#attempts").textContent=`${S.solved} / ${CaseEngine.total}`;$("#difficulty").textContent=cc.difficulty+"%";$("#storeCredits").textContent=S.credits.toLocaleString("ar-EG")}

const SCENE_HOTSPOTS={
 hotel_case:[
  {x:52.1,y:85.1},{x:43.3,y:26.6},{x:84.2,y:39.4},
  {x:90.7,y:67.3},{x:14.3,y:82.0},{x:83.4,y:84.7}
 ],
 hotel_night:[
  {x:52.1,y:85.1},{x:43.3,y:26.6},{x:84.2,y:39.4},
  {x:90.7,y:67.3},{x:14.3,y:82.0},{x:83.4,y:84.7}
 ],
 office_dark:[
  {x:52.1,y:85.1},{x:43.3,y:26.6},{x:84.2,y:39.4},
  {x:90.7,y:67.3},{x:14.3,y:82.0},{x:83.4,y:84.7}
 ],
 hotel_mirror:[
  {x:47.9,y:85.1},{x:56.7,y:26.6},{x:15.8,y:39.4},
  {x:9.3,y:67.3},{x:85.7,y:82.0},{x:16.6,y:84.7}
 ],
 restaurant_lux:[
  {x:47.9,y:85.1},{x:56.7,y:26.6},{x:15.8,y:39.4},
  {x:9.3,y:67.3},{x:85.7,y:82.0},{x:16.6,y:84.7}
 ],
 archive_room:[
  {x:47.9,y:85.1},{x:56.7,y:26.6},{x:15.8,y:39.4},
  {x:9.3,y:67.3},{x:85.7,y:82.0},{x:16.6,y:84.7}
 ],
 villa_case:[
  {x:5.2,y:59.9},{x:76.7,y:53.0},{x:41.8,y:85.4},{x:85.3,y:73.2}
 ],
 villa_night:[
  {x:5.2,y:59.9},{x:76.7,y:53.0},{x:41.8,y:85.4},{x:85.3,y:73.2}
 ],
 lab_dark:[
  {x:5.2,y:59.9},{x:76.7,y:53.0},{x:41.8,y:85.4},{x:85.3,y:73.2}
 ],
 resort_room:[
  {x:5.2,y:59.9},{x:76.7,y:53.0},{x:41.8,y:85.4},{x:85.3,y:73.2}
 ],
 villa_mirror:[
  {x:94.8,y:59.9},{x:23.3,y:53.0},{x:58.2,y:85.4},{x:14.7,y:73.2}
 ],
 museum_room:[
  {x:94.8,y:59.9},{x:23.3,y:53.0},{x:58.2,y:85.4},{x:14.7,y:73.2}
 ]
};
function sceneKey(){
 const src=(c().sceneImage||"").split("/").pop()||"hotel_case.png";
 return src.replace(/\.(png|jpg|jpeg|webp|svg)$/i,"");
}
function renderSceneHotspots(){
 const layer=$("#sceneHotspotLayer");if(!layer)return;
 const cc=c(),spots=SCENE_HOTSPOTS[sceneKey()]||SCENE_HOTSPOTS.hotel_case;
 const usable=spots.slice(0,Math.min(spots.length,cc.evidence.length));
 layer.innerHTML=usable.map((p,i)=>{
  const ev=cc.evidence[i];
  return `<button type="button" class="scene-hotspot ${S.evidence.has(ev.id)?"found":""}" data-scene-evidence="${ev.id}" style="--x:${p.x}%;--y:${p.y}%;" aria-label="فحص ${esc(ev.name)}"><span class="hit-label">${esc(ev.name)}</span></button>`;
 }).join("");
}
function showSceneEvidenceResult(ev){
 let box=$("#sceneHitResult");
 if(!box){
  box=document.createElement("div");
  box.id="sceneHitResult";
  box.className="scene-hit-result";
  const note=document.querySelector(".scene-note");
  if(note)note.insertAdjacentElement("afterend",box);
 }
 box.innerHTML=`<b>🔎 تم كشف: ${esc(ev.name)}</b><span>${esc(ev.result)}</span>`;
}

function renderScene(){const cc=c();const scenePath=cc.sceneImage||"assets/scenes/hotel_case.png";const img=$("#sceneImg");if(img){img.src=gameAsset(scenePath)||gameAsset("assets/scenes/hotel_case.png");img.dataset.build=BUILD}$("#caseBrief").textContent=cc.brief;$("#victim").textContent=cc.victim;$("#casePlace").textContent=cc.location;$("#caseTime").textContent=cc.time;renderSceneHotspots()}
function renderSuspects(){const cc=c();const html=cc.suspects.map((s,i)=>`<button class="sus-card ${i===S.selected?"active":""}" data-suspect="${i}"><img src="${gameAsset("assets/portraits/p"+String(s.portrait).padStart(2,"0")+".png")}" alt="${esc(s.name)}"><strong>${esc(s.name)}</strong><span>${esc(s.role)}</span><small>نسبة الاشتباه <b>${s.risk==="مرتفع"?"72":s.risk==="متوسط"?"48":"27"}%</b></small></button>`).join("");$$(".suspect-strip").forEach(x=>x.innerHTML=html)}
function renderEvidence(){
 const cc=c();
 const discovered=cc.evidence.filter(e=>S.evidence.has(e.id));
 const html=discovered.length
  ? discovered.map(e=>`<button class="ev-card discovered-evidence ${S.justDiscovered===e.id?"evidence-drop":""}" data-evidence="${e.id}"><img src="${gameAsset(e.image)}" alt="${esc(e.name)}"><span>${esc(e.name)}</span><small>${e.code} • ${esc(e.type||"حرز")}</small></button>`).join("")
  : `<div class="evidence-empty-state"><span>🔍</span><b>لم تكتشف أي أحراز بعد</b><p>افحص أرقام الأدلة داخل مسرح الجريمة. كل حرز تكتشفه سيظهر هنا تلقائيًا.</p></div>`;
 $$(".evidence-grid").forEach(x=>x.innerHTML=html);
 $("#evidenceCount").textContent=`${discovered.length} / ${cc.evidence.length}`;
 if(S.justDiscovered){
  const remembered=S.justDiscovered;
  setTimeout(()=>{if(S.justDiscovered===remembered)S.justDiscovered=null},700);
 }
}
function renderDocs(){const cc=c();$("#docList").innerHTML=cc.documents.map((d,i)=>`<button class="${S.docs.has(i)?"read":""}" data-doc="${i}"><strong>${esc(d.title)}</strong><span>${esc(d.type)}</span></button>`).join("")}
function openDoc(i){
 const d=c().documents[i];S.docs.add(i);AudioFx.paper();
 $("#docView").innerHTML=`<span>سري للغاية</span><h2>${esc(d.title)}</h2><p>${esc(d.body)}</p>`;
 $("#paperType").textContent=d.type;$("#paperTitle").textContent=d.title;$("#paperBody").textContent=d.body;
 $("#animatedPaper").classList.remove("page-turn");void $("#animatedPaper").offsetWidth;$("#animatedPaper").classList.add("page-turn");
 $("#documentOverlay").classList.remove("hidden");renderDocs();updatePhase()
}
function analyze(id){
 const e=c().evidence.find(x=>x.id===id);if(!e)return;
 const firstTime=!S.evidence.has(id);
 AudioFx.evidence();
 S.evidence.add(id);
 if(firstTime)S.justDiscovered=id;
 $$(".lab").forEach(x=>x.innerHTML=`<strong>${esc(e.name)}</strong><p>${esc(e.result)}</p>`);
 renderEvidence();renderSceneHotspots();updatePhase();
}
function renderInterrogation(){const s=c().suspects[S.selected];$("#interrogatePerson").innerHTML=`<img src="${gameAsset("assets/portraits/p"+String(s.portrait).padStart(2,"0")+".png")}"><h3>${esc(s.name)}</h3><p>${esc(s.role)}</p><small>${esc(s.alibi)}</small>`;$("#questionButtons").innerHTML=qbank.map(q=>`<button data-q="${q[0]}">${q[1]}</button>`).join("");$("#contradiction").textContent=S.contradictions.has(s.id)?"تم اكتشاف تناقض: توقيته لا يطابق السجل المصحح.":"لم يتم اكتشاف تناقض مؤكد بعد."}
function ask(id,text){const s=c().suspects[S.selected];S.questions.add(`${s.id}-${id}`);if((id==="timeline"||id==="evidence")&&s.risk==="مرتفع")S.contradictions.add(s.id);$("#chat").insertAdjacentHTML("beforeend",`<div class="me">${esc(text)}</div><div class="them"><b>${esc(s.name)}</b>${esc(s.answers[id])}</div>`);$("#chat").scrollTop=$("#chat").scrollHeight;renderInterrogation()}

function updatePhase(){
 let text="مرحلة: استلام البلاغ";
 if(S.evidence.size>=1)text="مرحلة: جمع الأدلة";
 if(S.docs.size>=2)text="مرحلة: مراجعة المحاضر";
 if(S.questions.size>=2)text="مرحلة: استجواب المشتبهين";
 if(ready().length===0)text="مرحلة: بناء الاتهام";
 $("#casePhase").textContent=text;
 const msg=S.evidence.size>=3?"رئيس الوحدة: عندك خيوط كفاية. راجع التوقيت قبل ما تواجه المشتبهين.":S.docs.size>=2?"رئيس الوحدة: ركّز على أي اختلاف بين أقوال الشهود وسجلات الدخول.":"رئيس الوحدة: افحص الموقع بهدوء. أول دليل واضح مش دايمًا هو الأهم.";
 $("#radioMessage").textContent=msg;
}

function ready(){const x=[];if(S.docs.size<2)x.push("اقرأ محضرين");if(S.evidence.size<4)x.push("حلل 4 أحراز");if(S.questions.size<4)x.push("اسأل 4 أسئلة");if(!S.contradictions.size)x.push("اكتشف تناقضًا");return x}
function renderTheory(){const cc=c();$("#who").innerHTML='<option value="">اختر المشتبه</option>'+cc.suspects.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("");$("#why").innerHTML='<option value="">اختر الدافع</option>'+cc.motives.map(x=>`<option>${esc(x)}</option>`).join("");$("#how").innerHTML='<option value="">اختر الطريقة</option>'+cc.methods.map(x=>`<option>${esc(x)}</option>`).join("");const miss=ready();$("#readiness").innerHTML=(miss.length?miss:["ملف الاتهام جاهز"]).map(x=>`<div>${esc(x)}</div>`).join("")}

function itemQty(id){return Number(S.inventory.get(id)||0)}
function renderToolbelt(){
 const owned=S.storeItems.filter(it=>itemQty(it.id)>0);
 if(!owned.length){$("#toolbelt").innerHTML='<div class="toolbelt-empty">لا توجد أدوات في حقيبتك حتى الآن. افتح المتجر لشراء أدوات تحقيق.</div>';return}
 $("#toolbelt").innerHTML=owned.map(it=>`<button class="tool-item" data-use-tool="${it.id}"><span class="tool-icon">${it.icon}</span><span><strong>${esc(it.name_ar)}</strong><small>${it.item_type==="consumable"?`الكمية: <b class="qty">${itemQty(it.id)}</b>`:"أداة دائمة"}</small></span></button>`).join("")
}
function renderStore(){
 $("#storeCredits").textContent=S.credits.toLocaleString("ar-EG");
 $("#storeGrid").innerHTML=S.storeItems.map(it=>{const qty=itemQty(it.id),owned=qty>0,perm=it.item_type==="permanent";return `<article class="store-card ${owned?"owned":""}"><div class="store-icon">${it.icon}</div><h3>${esc(it.name_ar)}</h3><p>${esc(it.description_ar)}</p><div class="store-meta"><span class="store-price">${Number(it.price_credits).toLocaleString("ar-EG")} ◈</span><span class="store-type">${perm?"أداة دائمة":"استخدام واحد"}</span></div><button class="${!owned||!perm?"buy":""}" data-buy-item="${it.id}" ${owned&&perm?"disabled":""}>${owned&&perm?"مملوكة بالفعل":`شراء${!perm&&owned?` — لديك ${qty}`:""}`}</button></article>`}).join("");
 const owned=S.storeItems.filter(it=>itemQty(it.id)>0);
 $("#ownedTools").innerHTML=owned.length?owned.map(it=>`<span class="owned-pill">${it.icon} ${esc(it.name_ar)} <b>${it.item_type==="consumable"?`×${itemQty(it.id)}`:"✓"}</b></span>`).join(""):'<span class="toolbelt-empty">لم تشترِ أي أداة بعد.</span>';
}
async function loadCommerce(){
 try{
  S.storeItems=await gameAuth.loadStoreItems();
  const inv=await gameAuth.loadInventory();
  S.inventory=new Map(inv.map(x=>[x.item_id,Number(x.quantity)]));
  renderStore();renderToolbelt();
 }catch(e){console.error(e);toast("تعذر تحميل متجر الأدوات.",true)}
}
async function buyItem(id){
 const it=S.storeItems.find(x=>x.id===id);if(!it)return;
 if(S.credits<Number(it.price_credits))return toast("رصيد الأدوات غير كافٍ.",true);
 try{
  const result=await gameAuth.purchaseStoreItem(id);
  S.credits=Number(result.credits??S.credits);
  const inv=await gameAuth.loadInventory();S.inventory=new Map(inv.map(x=>[x.item_id,Number(x.quantity)]));
  header();renderStore();renderToolbelt();toast(`تم شراء ${it.name_ar} وإضافته إلى حقيبتك.`);
 }catch(e){
  const m=String(e?.message||e);if(m.includes("already_owned"))toast("هذه الأداة مملوكة بالفعل.",true);else if(m.includes("insufficient_credits"))toast("رصيد الأدوات غير كافٍ.",true);else toast("تعذر إتمام عملية الشراء.",true)
 }
}
function toolMessage(code){
 const suspect=c().suspects.find(s=>s.risk==="مرتفع")||c().suspects[0];
 const messages={
  reveal_blood:"كشف منظار اللومينول أثر بقعة دم خافتة تم تنظيفها جزئيًا. اتجاه الأثر يغيّر فهم حركة الفاعل داخل مسرح الجريمة.",
  reveal_fingerprint:`اكتشف ماسح البصمات بصمة جزئية مخفية. المقارنة الأولية تجعل ملف ${suspect.name} أكثر أهمية للتحقيق.`,
  reveal_uv_trace:"كشف مصباح UV أليافًا دقيقة وبقايا أثر على سطح لم يكن ظاهرًا بالعين المجردة. افحص الأحراز المرتبطة بالممر.",
  analyze_timeline:"قارن محلل الخط الزمني بين السجلات: هناك فرق زمني ثابت في أحد الأنظمة. ركز على المشتبه الذي يعتمد على توقيت النظام في حجته.",
  decode_digital:"فكك المفكك الرقمي طبقة محذوفة من أحد الأجهزة. ظهر سجل يربط نافذة الجريمة بحدث رقمي لم يكن ظاهرًا في التحليل الأولي.",
  expert_hint:"استشارة الخبير: لا تلاحق أكثر دليل يبدو دراميًا. الحل يجمع بين المشتبه الأعلى خطورة، الدافع الموجود في الملف، والطريقة الأولى المرتبطة بالتوقيت."
 };return messages[code]||"الأداة لم تكشف نتيجة إضافية في هذه القضية."
}

function showToolVisual(effect){
 const layer=$("#specialClueLayer");if(!layer)return;
 const visuals={
  reveal_blood:'<div class="special-clue blood" data-label="بقعة دم خفية"></div>',
  reveal_fingerprint:'<div class="special-clue fingerprint" data-label="بصمة مخفية"></div>',
  reveal_uv_trace:'<div class="special-clue uv" data-label="أثر UV"></div>',
  analyze_timeline:'<div class="special-clue timeline" data-label="فرق زمني">⚠ تم اكتشاف اختلاف في توقيت الأنظمة</div>',
  decode_digital:'<div class="special-clue digital" data-label="أثر رقمي">01</div>'
 };
 if(visuals[effect]&&!layer.querySelector(`.${effect==="reveal_blood"?"blood":effect==="reveal_fingerprint"?"fingerprint":effect==="reveal_uv_trace"?"uv":effect==="analyze_timeline"?"timeline":"digital"}`)) layer.insertAdjacentHTML("beforeend",visuals[effect]);
}

async function useTool(id){AudioFx.click();
 const it=S.storeItems.find(x=>x.id===id);if(!it)return;
 if(itemQty(id)<=0)return setView("store");
 if(it.item_type==="consumable"){
  try{const r=await gameAuth.consumeStoreItem(id);S.inventory.set(id,Number(r.quantity||0))}catch(e){return toast("لا يوجد استخدام متبقٍ من هذه الأداة.",true)}
 }
 const text=toolMessage(it.effect_code);S.toolDiscoveries.add(it.effect_code);showToolVisual(it.effect_code);
 if(it.effect_code==="analyze_timeline"){
  const high=c().suspects.find(s=>s.risk==="مرتفع");if(high)S.contradictions.add(high.id);
 }
 if(it.effect_code==="decode_digital"){
  const hidden=c().evidence.find(e=>!S.evidence.has(e.id));if(hidden){S.evidence.add(hidden.id);S.justDiscovered=hidden.id;}
 }
 $("#toolDiscovery").innerHTML=`<b>${it.icon} ${esc(it.name_ar)}</b><div>${esc(text)}</div>`;$("#toolDiscovery").classList.remove("hidden");
 renderToolbelt();renderEvidence();renderInterrogation();renderStore();toast("تم استخدام الأداة وإضافة النتيجة إلى ملاحظات التحقيق.")
}

async function accuse(){
 const cc=c(),miss=ready();if(miss.length)return $("#accusationMsg").textContent="استكمل: "+miss.join("، ");
 if($("#who").value!==cc.correct.suspectId||$("#why").value!==cc.correct.motive||$("#how").value!==cc.correct.method){S.wrong++;AudioFx.error();return $("#accusationMsg").textContent="الاتهام غير صحيح. راجع الأدلة والتوقيت."}
 try{
  AudioFx.success();const result=await gameAuth.completeCurrentCase(S.index);
  S.points=Number(result.points||S.points);S.credits=Number(result.credits||S.credits);S.solved=Number(result.cases_solved||S.solved);S.rank=result.rank||S.rank;S.pendingNext=Number(result.current_case);
  header();renderRankRoadmap();
  $("#solvedText").textContent=cc.conclusion;$("#solvedPoints").textContent=`+${Number(result.earned_points||0).toLocaleString("ar-EG")} نقطة خبرة`;$("#solvedCredits").textContent=`+${Number(result.credit_reward||0).toLocaleString("ar-EG")} ◈ رصيد أدوات`;
  $("#modal").classList.remove("hidden");
  if(result.promoted)showPromotion(result.rank,result.old_rank);
 }catch(e){console.error(e);$("#accusationMsg").textContent="تعذر اعتماد نتيجة القضية على الخادم. حدّث الصفحة وحاول مرة أخرى."}
}
function continueMission(){
 if(S.pendingNext===null)return;
 $("#modal").classList.add("hidden");
 S.index=S.pendingNext;resetCaseSession();renderAll();setView("case");
 showDispatchForNextCase();
}
function showDispatchForNextCase(){
 const cc=c();
 $("#dispatchTitle").textContent=cc.special?"مهمة خاصة من رئيس الوحدة":"تم انتدابك إلى قضية جديدة";
 $("#dispatchText").textContent=cc.dispatch;
 $("#dispatchScope").textContent=cc.scope;
 $("#dispatchDifficulty").textContent=cc.difficulty+"%";
 $("#dispatchPlace").textContent=cc.city;
 $("#dispatchOverlay").classList.remove("hidden");
 AudioFx.siren();
 $("#radioMessage").textContent=`بلاغ جديد: ${cc.title} — ${cc.scope} — صعوبة ${cc.difficulty}%`;
 updatePhase();
}
function showPromotion(newRank,oldRank){AudioFx.promotion();
 $("#promotionRank").textContent=newRank;$("#promotionReason").textContent=`تمت الترقية من ${oldRank||"الرتبة السابقة"} بعد اجتياز ${S.solved} قضية بنجاح.`;$("#promotionOverlay").classList.remove("hidden")
}
function renderRankRoadmap(){
 $("#rankRoadmap").innerHTML=RANKS.map((r,i)=>{const achieved=S.solved>=r.cases;const next=RANKS[i+1];const current=achieved&&(!next||S.solved<next.cases);return `<div class="rank-node ${achieved?"achieved":""} ${current?"current":""}"><strong>${r.name}</strong><span>${r.cases===0?"بداية المسار":`بعد ${r.cases} قضية`}</span><b>${achieved?"✓":"🔒"}</b></div>`}).join("")
}
function renderMap(){
 renderRankRoadmap();
 const start=Math.floor(S.index/40)*40;
 $("#caseMap").innerHTML=CaseEngine.range(start,40).map(cc=>{const solved=cc.index<S.solved,current=cc.index===S.index;return `<button disabled class="${current?"current":""} ${solved?"solved":""}"><b>${cc.index+1}</b><span>${esc(cc.title)}</span><small>${esc(cc.scope)} • صعوبة ${cc.difficulty}% • ${solved?"مغلقة":current?"المهمة الحالية":"مقفلة"}</small></button>`}).join("")
}
async function renderLeague(){const rows=await gameAuth?.loadLeaderboard?.()||[];$("#leaderboard").innerHTML=rows.map((r,i)=>`<div><b>${i+1}</b><span><strong>${esc(r.username)}</strong><small>${esc(r.country||"")} • ${esc(r.rank||"")}</small></span><em>${Number(r.points||0).toLocaleString("ar-EG")}</em></div>`).join("")||"<p>لا توجد بيانات بعد.</p>"}

function notesKey(){return `whoiskiller_notes_${S.index}`}
function loadNotes(){const el=$("#detectiveNotes");if(el)el.value=localStorage.getItem(notesKey())||""}
function saveNotes(){const el=$("#detectiveNotes");if(el)localStorage.setItem(notesKey(),el.value)}

function renderAll(){header();renderScene();renderSuspects();renderEvidence();renderDocs();renderTheory();renderToolbelt();loadNotes();updatePhase()}

function showBriefing(){
 S.briefStep=0;const country=S.profile.country||"منطقتك";$("#missionStory").textContent=`تم اختيارك للانضمام إلى وحدة التحقيقات في نطاق ${country}. أنت محقق في بداية الطريق، وفريق المحققين يحتاج إلى مجهودك في الملفات المحلية. أثبت قدرتك في القضايا البسيطة، ومع تراكم خبرتك ستُسند إليك ملفات أعقد ونطاقات أكبر.`;renderBriefStep();$("#missionBriefing").classList.remove("hidden")
}
function renderBriefStep(){
 $$("[data-brief-step]").forEach(x=>x.classList.toggle("hidden",Number(x.dataset.briefStep)!==S.briefStep));
 $("#briefBack").classList.toggle("hidden",S.briefStep===0);
 $("#briefNext").textContent=S.briefStep===5?"استلام أول مهمة":"متابعة";
}
async function nextBrief(){
 if(S.briefStep<5){S.briefStep++;renderBriefStep();return}
 $("#missionBriefing").classList.add("hidden");try{await gameAuth.markTutorialSeen()}catch(e){console.error(e)};toast("تم اعتمادك في الوحدة. استعد لأول بلاغ.");showDispatchForNextCase()
}

document.addEventListener("click",e=>{
 const v=e.target.closest("[data-view]");if(v)return setView(v.dataset.view);
 const s=e.target.closest("[data-suspect]");if(s){S.selected=Number(s.dataset.suspect);renderSuspects();return}
 const sev=e.target.closest("[data-scene-evidence]");
 if(sev){
  const id=sev.dataset.sceneEvidence,evd=c().evidence.find(x=>x.id===id);
  if(evd){analyze(id);showSceneEvidenceResult(evd);renderSceneHotspots();toast(`تم اكتشاف ${evd.name} ونقله إلى ملف الأدلة.`)}
  return;
 }
 const ev=e.target.closest("[data-evidence]");if(ev)return analyze(ev.dataset.evidence);
 const d=e.target.closest("[data-doc]");if(d)return openDoc(Number(d.dataset.doc));
 const q=e.target.closest("[data-q]");if(q){const item=qbank.find(x=>x[0]===q.dataset.q);return ask(item[0],item[1])}
 const buy=e.target.closest("[data-buy-item]");if(buy)return buyItem(buy.dataset.buyItem);
 const tool=e.target.closest("[data-use-tool]");if(tool)return useTool(tool.dataset.useTool);
});
$("#questionForm").onsubmit=e=>{e.preventDefault();const t=$("#questionInput").value.trim();if(!t)return;ask("evidence",t);$("#questionInput").value=""};
$("#accuseBtn").onclick=accuse;
$("#nextBtnModal").onclick=continueMission;
$("#reviewBtn").onclick=()=>$("#modal").classList.add("hidden");
$("#hintBtn").onclick=()=>{const owned=itemQty("forensic_hint")>0;if(owned)useTool("forensic_hint");else{$("#hintText").textContent="قارن توقيت الكاميرا بسجل الدخول، ثم اسأل المشتبه الأعلى خطورة عن الدليل والتوقيت. للحصول على تلميح أقوى اشترِ استشارة خبير من المتجر."}};
$("#acceptPromotion").onclick=()=>$("#promotionOverlay").classList.add("hidden");
$("#briefNext").onclick=nextBrief;$("#briefBack").onclick=()=>{if(S.briefStep>0){S.briefStep--;renderBriefStep()}};
$("#openTopupBtn").onclick=()=>$("#topupModal").classList.remove("hidden");$("#closeTopup").onclick=()=>$("#topupModal").classList.add("hidden");


$("#soundToggle").onclick=()=>{const on=AudioFx.toggle();$("#soundToggle").textContent=on?"🔊 الأصوات":"🔇 صامت";$("#soundToggle").classList.toggle("muted",!on);if(on)AudioFx.radio()};
document.addEventListener("pointerdown",()=>AudioFx.unlock(),{once:true});
$("#closePaper").onclick=()=>{$("#documentOverlay").classList.add("hidden");speechSynthesis?.cancel()};
$("#documentOverlay").addEventListener("click",e=>{if(e.target===$("#documentOverlay"))$("#closePaper").click()});
$("#readPaper").onclick=()=>{AudioFx.click();if(!window.speechSynthesis)return toast("القراءة الصوتية غير مدعومة في هذا المتصفح.",true);speechSynthesis.cancel();const u=new SpeechSynthesisUtterance($("#paperTitle").textContent+". "+$("#paperBody").textContent);u.lang="ar-SA";u.rate=.9;const voices=speechSynthesis.getVoices();const ar=voices.find(v=>v.lang?.toLowerCase().startsWith("ar"));if(ar)u.voice=ar;speechSynthesis.speak(u)};
$("#stopReading").onclick=()=>window.speechSynthesis?.cancel();
$("#acceptDispatch").onclick=()=>{AudioFx.radio();$("#dispatchOverlay").classList.add("hidden");toast("وصلت إلى مسرح الجريمة. ابدأ المعاينة.")};
$("#detectiveNotes").addEventListener("input",saveNotes);

window.addEventListener("player-ready",async e=>{
 const p=e.detail.profile||{};S.profile=p;S.points=Number(p.points)||0;S.credits=Number(p.credits)||0;S.rank=p.rank||"محقق متدرب";S.solved=Number(p.cases_solved)||0;S.index=Math.min(CaseEngine.total-1,Math.max(0,Number(p.current_case)||0));
 resetCaseSession();renderAll();renderRankRoadmap();await loadCommerce();
 if(!p.tutorial_seen)showBriefing();else{toast(`مرحبًا ${p.username||"أيها المحقق"}. ورد بلاغ جديد.`);setTimeout(showDispatchForNextCase,350)};
});
renderAll();

document.addEventListener("error",e=>{const img=e.target;if(img&&img.tagName==="IMG"&&img.id==="sceneImg"){const fallback=gameAsset("assets/scenes/hotel_case.png");if(fallback&&img.src!==fallback)img.src=fallback}},true);
})();