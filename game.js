(() => {
"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const S={index:0,points:0,solved:0,docs:new Set(),evidence:new Set(),hotspots:new Set(),questions:new Set(),contradictions:new Set(),selected:0,wrong:0,hint:false,view:"case"};
const qBank=[
 ["where","أين كنت وقت الجريمة؟",["اين","فين","مكان","وقت"]],
 ["timeline","اشرح التوقيت بالتفصيل",["توقيت","الساعة","متى","وقت"]],
 ["relation","ما علاقتك بالضحية؟",["علاقة","تعرف","ضحية"]],
 ["motive","هل لديك دافع؟",["دافع","سبب","مال","خلاف"]],
 ["evidence","كيف تفسر الأدلة ضدك؟",["دليل","حرز","بطاقة","كاميرا","بصمة","سجل"]],
 ["contact","متى كان آخر تواصل؟",["تواصل","مكالمة","رسالة","اتصل"]]
];
function c(){return CaseEngine.get(S.index)}
function esc(x){return String(x??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]))}
function rank(p){if(p>=250000)return"أسطورة التحقيق";if(p>=160000)return"مدير تحقيقات دولية";if(p>=100000)return"رئيس وحدة";if(p>=60000)return"محقق مخضرم";if(p>=30000)return"خبير جنائي";if(p>=15000)return"محقق أول";if(p>=6000)return"محقق ميداني";if(p>=1500)return"محقق مبتدئ";return"محقق متدرب"}
function resetCase(){S.docs.clear();S.evidence.clear();S.hotspots.clear();S.questions.clear();S.contradictions.clear();S.selected=0;S.wrong=0;S.hint=false;$("#hintText").textContent="";$("#accusationMessage").classList.add("hidden")}
function progress(){const cc=c();return Math.min(100,Math.round(Math.min(1,S.hotspots.size/3)*15+Math.min(1,S.docs.size/3)*18+Math.min(1,S.evidence.size/5)*32+Math.min(1,S.questions.size/5)*25+(S.contradictions.size?10:0)))}
function hud(){ $("#points").textContent=S.points.toLocaleString("ar-EG");$("#rank").textContent=rank(S.points);$("#solvedCount").textContent=`${S.solved}/${CaseEngine.total}`;const p=progress();$("#progressLabel").textContent=p+"%";$("#progressMeter").style.width=p+"%";$("#energyText").textContent=Math.max(25,100-Math.min(75,S.wrong*10))+" / 100"}
function setView(v){S.view=v;$$(".game-view").forEach(x=>x.classList.add("hidden"));$("#view-"+v)?.classList.remove("hidden");$$(".main-tab").forEach(b=>b.classList.toggle("active",b.dataset.view===v));if(v==="map")renderMap();if(v==="interrogate")renderInterrogate();window.scrollTo({top:0,behavior:"smooth"})}
function portrait(s,seed=0){
 const n=Math.abs(Number(seed)||0)%64;
 const path=`assets/portraits/p${String(n).padStart(2,"0")}.svg`; return `<img class="portrait-file" src="${gameAsset(path)}" alt="صورة كرتونية ثلاثية الأبعاد للمشتبه ${esc(s.name)}">`;
}
function setAllHTML(selector,html){$$(selector).forEach(el=>el.innerHTML=html)}
function setAllText(selector,text){$$(selector).forEach(el=>el.textContent=text)}
function renderCase(){
 const cc=c();$("#caseTitle").textContent=cc.title;$("#caseNo").textContent=`القضية ${cc.index+1} من ${CaseEngine.total}`;$("#caseScope").textContent=cc.scope;$("#caseCategory").textContent=cc.category;$("#caseLocation").textContent=`${cc.city}، ${cc.country}`;$("#caseDifficulty").textContent=cc.difficulty+"%";$("#caseReward").textContent=cc.reward.toLocaleString("ar-EG");$("#caseBrief").textContent=cc.brief;$("#victimName").textContent=cc.victim;$("#victimPlace").textContent=cc.location;$("#victimTime").textContent=cc.time;$("#sceneImage").src=gameAsset(`assets/scenes/${cc.sceneSlug}.svg`);$("#sceneCaption").textContent=cc.location;$("#timeline").innerHTML=cc.timeline.map(x=>`<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join("");
 renderHotspots();renderSuspects();renderEvidence();renderDocuments();renderInterrogate();renderTheory();hud();
}
function renderHotspots(){const cc=c();$("#hotspotLayer").innerHTML=cc.hotspots.map((h,i)=>`<button type="button" class="hotspot ${S.hotspots.has(i)?"done":""}" data-hotspot="${i}" style="--x:${[44,25,75,61][i%4]}%;--y:${[66,38,34,70][i%4]}%">${i+1}</button>`).join("")}
function hotspot(i){const h=c().hotspots[i];S.hotspots.add(i);$("#sceneFinding").innerHTML=`<b>${esc(h.label)}</b><span>${esc(h.detail)}</span>`;renderHotspots();hud()}
function renderSuspects(){
 const cc=c();
 const strip=cc.suspects.map((s,i)=>`<button type="button" class="suspect-mini ${S.selected===i?"active":""}" data-suspect="${i}"><div>${portrait(s,s.portraitSeed)}</div><strong>${esc(s.name)}</strong><span>${esc(s.role)}</span><small>اشتباه: ${esc(s.risk)}</small></button>`).join("");
 setAllHTML(".suspect-strip-target",strip);
 const s=cc.suspects[S.selected];
 $("#suspectFocus").innerHTML=`<div class="focus-portrait">${portrait(s,s.portraitSeed)}</div><div><span class="eyebrow">ملف مشتبه</span><h3>${esc(s.name)}</h3><p>${esc(s.role)} • ${s.age} سنة</p><dl><div><dt>الدافع المحتمل</dt><dd>${esc(s.motive)}</dd></div><div><dt>الحجة الزمنية</dt><dd>${esc(s.alibi)}</dd></div><div><dt>التناقض</dt><dd>${esc(s.contradiction)}</dd></div></dl><button type="button" class="gold-btn" data-start-interrogate="${S.selected}">بدء الاستجواب</button></div>`;
}
function renderEvidence(){
 const cc=c();
 const html=cc.evidence.map(e=>`<article class="evidence-card ${S.evidence.has(e.id)?"analyzed":""}"><img src="${gameAsset(e.image)}" alt="${esc(e.name)}"><div><span>${e.code} • ${esc(e.type)}</span><h3>${esc(e.name)}</h3><p>${esc(e.location)}</p><button type="button" data-evidence="${e.id}">${S.evidence.has(e.id)?"عرض نتيجة التحليل":"تحليل الحرز"}</button></div></article>`).join("");
 setAllHTML(".evidence-grid-target",html);
 setAllText(".evidence-count-target",`${S.evidence.size}/${cc.evidence.length}`);
}
function analyze(id){const e=c().evidence.find(x=>x.id===id);S.evidence.add(id);setAllHTML(".lab-result-target",`<strong>${esc(e.name)}</strong><p>${esc(e.result)}</p><small>${esc(e.custody)}</small>`);renderEvidence();hud()}
function renderDocuments(){
 const cc=c();$("#docList").innerHTML=cc.documents.map((d,i)=>`<button type="button" class="${S.docs.has(i)?"read":""}" data-doc="${i}"><b>${esc(d.title)}</b><span>${esc(d.type)}</span></button>`).join("");$("#docsRead").textContent=`${S.docs.size}/${cc.documents.length}`
}
function openDoc(i){const d=c().documents[i];S.docs.add(i);$("#docViewer").innerHTML=`<span>سري للغاية</span><h2>${esc(d.title)}</h2><p>${esc(d.body)}</p><footer>تمت إضافة الوثيقة إلى ملف التحقيق.</footer>`;renderDocuments();hud()}
function classify(t){const n=t.toLowerCase();let best=qBank[4];for(const q of qBank){if(q[2].some(k=>n.includes(k))){best=q;break}}return best[0]}
function renderInterrogate(){
 const cc=c(),s=cc.suspects[S.selected];$("#interrogateWho").innerHTML=`${portrait(s,s.portraitSeed)}<h3>${esc(s.name)}</h3><p>${esc(s.role)}</p>`;$("#questionChips").innerHTML=qBank.map(q=>`<button type="button" data-q="${q[0]}">${q[1]}</button>`).join("");$("#questionsAsked").textContent=S.questions.size;const found=S.contradictions.has(s.id);$("#contradiction").className=found?"found":"";$("#contradiction").textContent=found?"تم تثبيت تناقض: "+s.contradiction:"لم يتم تثبيت تناقض بعد."
}
function ask(text,id){const s=c().suspects[S.selected],qid=id||classify(text);S.questions.add(`${S.index}-${s.id}-${qid}`);if((qid==="timeline"||qid==="evidence")&&s.risk==="مرتفع")S.contradictions.add(s.id);$("#chatLog").insertAdjacentHTML("beforeend",`<div class="q"><small>المحقق</small>${esc(text)}</div><div class="a"><small>${esc(s.name)}</small>${esc(s.answers[qid]||s.answers.evidence)}</div>`);$("#chatLog").scrollTop=$("#chatLog").scrollHeight;renderInterrogate();hud()}
function ready(){const missing=[];if(S.hotspots.size<2)missing.push("معاينة نقطتين");if(S.docs.size<2)missing.push("قراءة محضرين");if(S.evidence.size<4)missing.push("تحليل 4 أحراز");if(S.questions.size<4)missing.push("4 أسئلة استجواب");if(!S.contradictions.size)missing.push("اكتشاف تناقض");return{ok:!missing.length,missing}}
function renderTheory(){const cc=c();$("#theorySuspect").innerHTML='<option value="">اختر المشتبه</option>'+cc.suspects.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join("");$("#theoryMotive").innerHTML='<option value="">اختر الدافع</option>'+cc.motives.map(x=>`<option>${esc(x)}</option>`).join("");$("#theoryMethod").innerHTML='<option value="">اختر الطريقة</option>'+cc.methods.map(x=>`<option>${esc(x)}</option>`).join("");const r=ready();$("#readiness").innerHTML=(r.ok?["ملف التحقيق جاهز للاتهام"]:r.missing).map((x,i)=>`<div class="${r.ok?"done":""}">${esc(x)}</div>`).join("")}
async function accuse(){
 const cc=c(),r=ready();if(!r.ok)return showAcc("استكمل التحقيق أولًا: "+r.missing.join("، "),false);
 const sid=$("#theorySuspect").value,m=$("#theoryMotive").value,method=$("#theoryMethod").value;if(!sid||!m||!method)return showAcc("اختر المشتبه والدافع والطريقة.",false);
 const ok=sid===cc.correct.suspectId&&m===cc.correct.motive&&method===cc.correct.method;
 if(!ok){S.wrong++;S.points=Math.max(0,S.points-120);hud();showAcc("الاتهام غير صحيح. راجع التوقيت والأحراز والتناقضات. خُصم 120 نقطة.",false);await save();return}
 const already=S.index<S.solved,bonus=Math.max(0,180-S.wrong*50-(S.hint?50:0)),earned=already?0:cc.reward+bonus;
 if(!already){S.points+=earned;S.solved=Math.max(S.solved,S.index+1)}
 showAcc("تم إغلاق القضية بنجاح.",true);$("#solvedText").textContent=cc.conclusion;$("#solvedScore").textContent=already?"مغلقة سابقًا — لا نقاط إضافية":`+${earned.toLocaleString("ar-EG")} نقطة`;$("#solvedModal").classList.remove("hidden");hud();if(gameAuth){await gameAuth.saveCaseProgress(S.index,true,earned);await save()}
}
function showAcc(t,ok){const x=$("#accusationMessage");x.textContent=t;x.className=ok?"success":""}
async function save(){if(gameAuth)await gameAuth.savePlayerState({points:S.points,rank:rank(S.points),currentCase:S.index,casesSolved:S.solved})}
async function nextCase(){ $("#solvedModal").classList.add("hidden"); if(S.index<CaseEngine.total-1){S.index++;resetCase();await save();renderCase();setView("case")}else setView("map") }
function renderMap(){
 const page=Math.floor(S.index/40)*40;const cases=CaseEngine.range(page,40);$("#mapRange").textContent=`القضايا ${page+1} – ${Math.min(CaseEngine.total,page+40)}`;$("#caseMap").innerHTML=cases.map(cc=>{const unlocked=cc.index<=S.solved;return `<button type="button" data-case="${cc.index}" ${unlocked?"":"disabled"} class="${cc.index===S.index?"current":""} ${cc.index<S.solved?"solved":""}"><b>${cc.index+1}</b><span>${esc(cc.title)}</span><small>${esc(cc.city)} • ${cc.difficulty}%</small></button>`}).join("")
}
async function selectCase(i){if(i>S.solved)return;S.index=i;resetCase();await save();renderCase();setView("case")}
async function leaderboard(){const rows=await gameAuth?.loadLeaderboard?.(15)||[];$("#leaderboard").innerHTML=rows.length?rows.map((r,i)=>`<div><b>${i+1}</b><span><strong>${esc(r.username)}</strong><small>${esc(r.country||"")}</small></span><em>${Number(r.points||0).toLocaleString("ar-EG")}</em></div>`).join(""):'<p>لا توجد بيانات بعد.</p>'}
function renderStats(){const cc=c();$("#seasonName").textContent=cc.season;$("#mainCaseName").textContent=cc.title;$("#mapCaseCount").textContent=CaseEngine.total}
$$(".main-tab").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));
document.addEventListener("click",e=>{
 const h=e.target.closest("[data-hotspot]");if(h)return hotspot(Number(h.dataset.hotspot));
 const s=e.target.closest("[data-suspect]");if(s){S.selected=Number(s.dataset.suspect);renderSuspects();renderInterrogate();return}
 const ie=e.target.closest("[data-evidence]");if(ie)return analyze(ie.dataset.evidence);
 const d=e.target.closest("[data-doc]");if(d)return openDoc(Number(d.dataset.doc));
 const q=e.target.closest("[data-q]");if(q){const item=qBank.find(x=>x[0]===q.dataset.q);return ask(item[1],item[0])}
 const si=e.target.closest("[data-start-interrogate]");if(si){S.selected=Number(si.dataset.startInterrogate);renderInterrogate();setView("interrogate");return}
 const ci=e.target.closest("[data-case]");if(ci)return selectCase(Number(ci.dataset.case));
});
$("#questionForm").addEventListener("submit",e=>{e.preventDefault();const t=$("#questionInput").value.trim();if(t){ask(t);$("#questionInput").value=""}});
$("#accuseBtn").addEventListener("click",accuse);$("#nextCaseBtn").addEventListener("click",nextCase);$("#reviewBtn").addEventListener("click",()=>$("#solvedModal").classList.add("hidden"));
$("#hintBtn").addEventListener("click",async()=>{if(!S.hint){S.hint=true;S.points=Math.max(0,S.points-50);await save()}$("#hintText").textContent="قارن توقيت سجل الدخول مع الأدلة الرقمية، ثم استجوب المشتبه الأعلى خطورة عن التوقيت والدليل.";hud()});
$("#refreshLeaderboard").addEventListener("click",leaderboard);
window.addEventListener("player-ready",e=>{const p=e.detail.profile||{};S.points=Number(p.points)||0;S.solved=Math.max(0,Number(p.cases_solved)||0);S.index=Math.min(CaseEngine.total-1,Math.max(0,Number(p.current_case)||0));if(S.index<S.solved&&S.solved<CaseEngine.total)S.index=S.solved;resetCase();renderCase();renderStats();leaderboard()});
renderCase();renderStats();

document.addEventListener("error",e=>{
  const img=e.target;
  if(img && img.tagName==="IMG" && img.dataset.fallbackDone!=="1"){
    img.dataset.fallbackDone="1";
    const fallback=window.GAME_ASSETS?.["assets/evidence/document.svg"];
    if(fallback && img.src!==fallback) img.src=fallback;
  }
},true);

})();