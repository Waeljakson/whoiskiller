(()=>{
const BUILD="800";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)], esc=t=>String(t??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const S={index:0,points:0,credits:0,rank:"محقق متدرب",solved:0,selected:0,docs:new Set(),evidence:new Set(),questions:new Set(),contradictions:new Set(),wrong:0,inventory:new Map(),storeItems:[],pendingNext:null,profile:{},briefStep:0,toolDiscoveries:new Set()};
const qbank=[["where","أين كنت وقت الجريمة؟"],["relation","ما علاقتك بالضحية؟"],["motive","هل لديك دافع لقتلها؟"],["evidence","ما تفسيرك لهذا الدليل؟"],["timeline","اشرح توقيت تحركاتك"],["contact","متى كان آخر تواصل؟"]];
const RANKS=[
 {cases:0,name:"محقق متدرب"},{cases:3,name:"محقق مساعد"},{cases:8,name:"محقق جنائي"},{cases:20,name:"محقق أول"},{cases:40,name:"محقق خبير"},
 {cases:80,name:"محقق مخضرم"},{cases:150,name:"رئيس فريق تحقيق"},{cases:250,name:"محقق دولي"},{cases:380,name:"قائد تحقيقات دولية"},{cases:500,name:"أسطورة التحقيق"}
];
const c=()=>CaseEngine.get(S.index);

function resetCaseSession(){S.selected=0;S.docs.clear();S.evidence.clear();S.questions.clear();S.contradictions.clear();S.wrong=0;S.toolDiscoveries.clear();S.pendingNext=null;$("#accusationMsg").textContent="";$("#hintText").textContent="";$("#toolDiscovery").classList.add("hidden");$("#toolDiscovery").innerHTML="";const layer=$("#specialClueLayer");if(layer)layer.innerHTML=""}
function setView(v){$$(".view").forEach(x=>x.classList.add("hidden"));$("#view-"+v)?.classList.remove("hidden");$$("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===v));if(v==="interrogate")renderInterrogation();if(v==="theory")renderTheory();if(v==="map")renderMap();if(v==="league")renderLeague();if(v==="store")renderStore();window.scrollTo({top:0,behavior:"smooth"})}
function toast(text,error=false){const el=$("#gameToast");el.textContent=text;el.className="game-toast"+(error?" error":"");setTimeout(()=>el.classList.add("hidden"),3300)}
function header(){const cc=c();$("#caseTitle").textContent=cc.title;$("#caseNo").textContent=`القضية ${cc.index+1} من ${CaseEngine.total}`;$("#locationTop").textContent=`${cc.scope} • ${cc.city} • ${cc.country}`;$("#points").textContent=S.points.toLocaleString("ar-EG");$("#credits").textContent=S.credits.toLocaleString("ar-EG");$("#rank").textContent=S.rank;$("#attempts").textContent=`${S.solved} / ${CaseEngine.total}`;$("#difficulty").textContent=cc.difficulty+"%";$("#storeCredits").textContent=S.credits.toLocaleString("ar-EG")}
function renderScene(){const cc=c();const scenePath=cc.sceneImage||"assets/scenes/hotel_case.png";const img=$("#sceneImg");if(img){img.src=gameAsset(scenePath)||gameAsset("assets/scenes/hotel_case.png");img.dataset.build=BUILD}$("#caseBrief").textContent=cc.brief;$("#victim").textContent=cc.victim;$("#casePlace").textContent=cc.location;$("#caseTime").textContent=cc.time}
function renderSuspects(){const cc=c();const html=cc.suspects.map((s,i)=>`<button class="sus-card ${i===S.selected?"active":""}" data-suspect="${i}"><img src="${gameAsset("assets/portraits/p"+String(s.portrait).padStart(2,"0")+".png")}" alt="${esc(s.name)}"><strong>${esc(s.name)}</strong><span>${esc(s.role)}</span><small>نسبة الاشتباه <b>${s.risk==="مرتفع"?"72":s.risk==="متوسط"?"48":"27"}%</b></small></button>`).join("");$$(".suspect-strip").forEach(x=>x.innerHTML=html)}
function renderEvidence(){const cc=c();const html=cc.evidence.map(e=>`<button class="ev-card ${S.evidence.has(e.id)?"done":""}" data-evidence="${e.id}"><img src="${gameAsset(e.image)}"><span>${esc(e.name)}</span><small>${e.code}</small></button>`).join("");$$(".evidence-grid").forEach(x=>x.innerHTML=html);$("#evidenceCount").textContent=cc.evidence.length}
function renderDocs(){const cc=c();$("#docList").innerHTML=cc.documents.map((d,i)=>`<button class="${S.docs.has(i)?"read":""}" data-doc="${i}"><strong>${esc(d.title)}</strong><span>${esc(d.type)}</span></button>`).join("")}
function openDoc(i){const d=c().documents[i];S.docs.add(i);$("#docView").innerHTML=`<span>سري للغاية</span><h2>${esc(d.title)}</h2><p>${esc(d.body)}</p>`;renderDocs()}
function analyze(id){const e=c().evidence.find(x=>x.id===id);S.evidence.add(id);$$(".lab").forEach(x=>x.innerHTML=`<strong>${esc(e.name)}</strong><p>${esc(e.result)}</p>`);renderEvidence()}
function renderInterrogation(){const s=c().suspects[S.selected];$("#interrogatePerson").innerHTML=`<img src="${gameAsset("assets/portraits/p"+String(s.portrait).padStart(2,"0")+".png")}"><h3>${esc(s.name)}</h3><p>${esc(s.role)}</p><small>${esc(s.alibi)}</small>`;$("#questionButtons").innerHTML=qbank.map(q=>`<button data-q="${q[0]}">${q[1]}</button>`).join("");$("#contradiction").textContent=S.contradictions.has(s.id)?"تم اكتشاف تناقض: توقيته لا يطابق السجل المصحح.":"لم يتم اكتشاف تناقض مؤكد بعد."}
function ask(id,text){const s=c().suspects[S.selected];S.questions.add(`${s.id}-${id}`);if((id==="timeline"||id==="evidence")&&s.risk==="مرتفع")S.contradictions.add(s.id);$("#chat").insertAdjacentHTML("beforeend",`<div class="me">${esc(text)}</div><div class="them"><b>${esc(s.name)}</b>${esc(s.answers[id])}</div>`);$("#chat").scrollTop=$("#chat").scrollHeight;renderInterrogation()}
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

async function useTool(id){
 const it=S.storeItems.find(x=>x.id===id);if(!it)return;
 if(itemQty(id)<=0)return setView("store");
 if(it.item_type==="consumable"){
  try{const r=await gameAuth.consumeStoreItem(id);S.inventory.set(id,Number(r.quantity||0))}catch(e){return toast("لا يوجد استخدام متبقٍ من هذه الأداة.",true)}
 }
 const text=toolMessage(it.effect_code);S.toolDiscoveries.add(it.effect_code);showToolVisual(it.effect_code);
 if(it.effect_code==="analyze_timeline"){
  const high=c().suspects.find(s=>s.risk==="مرتفع");if(high)S.contradictions.add(high.id);
 }
 if(it.effect_code==="digital_decoder"){
  const hidden=c().evidence.find(e=>!S.evidence.has(e.id));if(hidden)S.evidence.add(hidden.id);
 }
 $("#toolDiscovery").innerHTML=`<b>${it.icon} ${esc(it.name_ar)}</b><div>${esc(text)}</div>`;$("#toolDiscovery").classList.remove("hidden");
 renderToolbelt();renderEvidence();renderInterrogation();renderStore();toast("تم استخدام الأداة وإضافة النتيجة إلى ملاحظات التحقيق.")
}

async function accuse(){
 const cc=c(),miss=ready();if(miss.length)return $("#accusationMsg").textContent="استكمل: "+miss.join("، ");
 if($("#who").value!==cc.correct.suspectId||$("#why").value!==cc.correct.motive||$("#how").value!==cc.correct.method){S.wrong++;return $("#accusationMsg").textContent="الاتهام غير صحيح. راجع الأدلة والتوقيت."}
 try{
  const result=await gameAuth.completeCurrentCase(S.index);
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
 const cc=c();toast(`مهمة جديدة: ${cc.title} — ${cc.scope} — صعوبة ${cc.difficulty}%`);
}
function showPromotion(newRank,oldRank){
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
function renderAll(){header();renderScene();renderSuspects();renderEvidence();renderDocs();renderTheory();renderToolbelt()}

function showBriefing(){
 S.briefStep=0;const country=S.profile.country||"منطقتك";$("#missionStory").textContent=`صدر قرار بانتدابك إلى وحدة التحقيقات المحلية في نطاق ${country}. فريق المحققين يحتاج إلى خبرتك في قضية أولية. أثبت كفاءتك، ومع كل نجاح ستنتقل إلى قضايا أصعب ورتب أعلى.`;renderBriefStep();$("#missionBriefing").classList.remove("hidden")
}
function renderBriefStep(){
 $$("[data-brief-step]").forEach(x=>x.classList.toggle("hidden",Number(x.dataset.briefStep)!==S.briefStep));
 $("#briefBack").classList.toggle("hidden",S.briefStep===0);
 $("#briefNext").textContent=S.briefStep===5?"استلام أول مهمة":"متابعة";
}
async function nextBrief(){
 if(S.briefStep<5){S.briefStep++;renderBriefStep();return}
 $("#missionBriefing").classList.add("hidden");try{await gameAuth.markTutorialSeen()}catch(e){console.error(e)};toast("تم استلام المهمة الأولى. ابدأ بقراءة ملف القضية.")
}

document.addEventListener("click",e=>{
 const v=e.target.closest("[data-view]");if(v)return setView(v.dataset.view);
 const s=e.target.closest("[data-suspect]");if(s){S.selected=Number(s.dataset.suspect);renderSuspects();return}
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

window.addEventListener("player-ready",async e=>{
 const p=e.detail.profile||{};S.profile=p;S.points=Number(p.points)||0;S.credits=Number(p.credits)||0;S.rank=p.rank||"محقق متدرب";S.solved=Number(p.cases_solved)||0;S.index=Math.min(CaseEngine.total-1,Math.max(0,Number(p.current_case)||0));
 resetCaseSession();renderAll();renderRankRoadmap();await loadCommerce();
 if(!p.tutorial_seen)showBriefing();else toast(`مرحبًا ${p.username||"أيها المحقق"}. مهمتك الحالية: القضية ${S.index+1}.`);
});
renderAll();

document.addEventListener("error",e=>{const img=e.target;if(img&&img.tagName==="IMG"&&img.id==="sceneImg"){const fallback=gameAsset("assets/scenes/hotel_case.png");if(fallback&&img.src!==fallback)img.src=fallback}},true);
})();