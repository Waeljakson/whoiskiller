const cases=[
{title:"سرقة خزنة الميناء",meta:"الإسكندرية • مستوى 1",scope:"المستوى المحلي",difficulty:42,story:"اختفى صندوق مستندات حساس من خزنة شركة شحن بين 22:00 و22:30. لا يوجد كسر في الباب، والكاميرا تعطلت 11 دقيقة فقط.",reward:320,correct:"سامر",evidence:[{id:"e1",name:"سجل الدخول",type:"رقمي",text:"بطاقة سامر استُخدمت 22:14، لكنه قال إنه غادر 21:50.",key:true},{id:"e2",name:"أثر زيت صناعي",type:"مادي",text:"نفس نوع الزيت المستخدم في ورشة صيانة الرافعات.",key:true},{id:"e3",name:"كاميرا الرصيف",type:"مرئي",text:"شخص بسترة صيانة مر قرب الرصيف أثناء انقطاع الكاميرا.",key:true},{id:"e4",name:"بصمة على الخزنة",type:"مادي",text:"البصمة تعود لمدير الحسابات الذي يستخدم الخزنة يومياً.",key:false},{id:"e5",name:"رسالة غاضبة",type:"رقمي",text:"رسالة قديمة بين المدير وأحد الموظفين قبل ثلاثة أشهر.",key:false},{id:"e6",name:"فاتورة سيارة",type:"زمني",text:"فاتورة وقود تشير لتحرك سيارة خارج المنطقة الساعة 22:05.",key:false}],suspects:[{name:"سامر",role:"فني صيانة",motive:"ديون كبيرة",alibi:"قال إنه غادر مبكراً",risk:"مرتفع"},{name:"ليلى",role:"مديرة الحسابات",motive:"تعرف محتوى الصندوق",alibi:"اجتماع مسجل",risk:"متوسط"},{name:"حازم",role:"مشرف الأمن",motive:"خلاف إداري",alibi:"دورية خارجية",risk:"متوسط"}]},
{title:"اللوحة المفقودة",meta:"القاهرة • مستوى 2",scope:"المستوى المحلي",difficulty:67,story:"اختفت لوحة أصلية من قاعة عرض خاصة دون تشغيل أي إنذار. النسخة المعلقة مكانها مطابقة بصرياً، ما يعني أن الاستبدال تم بتخطيط مسبق.",reward:520,correct:"نادين",evidence:[{id:"e1",name:"سجل حساسات القاعة",type:"رقمي",text:"الحساس عُطّل بوضع الصيانة 14 دقيقة بحساب داخلي.",key:true},{id:"e2",name:"ألياف قفاز",type:"مادي",text:"ألياف نادرة من قفاز ترميم متخصص وليست قفاز أمن.",key:true},{id:"e3",name:"صورة النسخة",type:"فني",text:"مادة الورنيش في النسخة استُخدمت داخل معمل الترميم نفسه.",key:true},{id:"e4",name:"مكالمة خارجية",type:"رقمي",text:"المكالمة تخص حجز شحنة لكنها حدثت بعد الجريمة.",key:false},{id:"e5",name:"بطاقة زائر",type:"زمني",text:"زائر دخل قبل الاختفاء بساعتين وغادر أمام الموظفين.",key:false},{id:"e6",name:"حذاء موحل",type:"مادي",text:"أثر طين قرب الباب الخلفي يعود ليوم ممطر سابق.",key:false}],suspects:[{name:"نادين",role:"مرممة فنية",motive:"وصول كامل للمعمل",alibi:"قالت إنها لم تدخل القاعة",risk:"مرتفع"},{name:"فارس",role:"حارس",motive:"حاجة مالية",alibi:"الكاميرات تظهره بالبوابة",risk:"متوسط"},{name:"رائد",role:"تاجر فنون",motive:"اهتمام سابق باللوحة",alibi:"سجل خروجه قبل الحادث",risk:"متوسط"}]},
{title:"شفرة الفندق 409",meta:"إسطنبول • مستوى دولي 1",scope:"المستوى الدولي",difficulty:88,story:"خلال مؤتمر دولي اختفت وحدة تخزين مشفرة من جناح 409. ثلاثة ضيوف استخدموا المصعد في الفترة نفسها، وسجل الفندق يحتوي على توقيتات غير متطابقة بين نظامين.",reward:780,correct:"إلياس",evidence:[{id:"e1",name:"اختلاف التوقيت",type:"رقمي",text:"نظام الأقفال متقدم 6 دقائق عن كاميرات المصعد؛ بعد التصحيح تتغير النافذة الزمنية بالكامل.",key:true},{id:"e2",name:"سجل باب 409",type:"رقمي",text:"بطاقة خدمة مؤقتة فتحت الباب مرة واحدة في النافذة المصححة.",key:true},{id:"e3",name:"طلب صيانة مزيف",type:"وثيقة",text:"رقم الغرفة في الطلب كُتب بنفس نمط اختصارات موظف تقني بالمؤتمر.",key:true},{id:"e4",name:"لقطة المصعد",type:"مرئي",text:"ضيفة دخلت الطابق لكنها ظهرت في بث مباشر بعدها بدقائق.",key:false},{id:"e5",name:"مفتاح معدني",type:"مادي",text:"مفتاح قديم لا يعمل مع أقفال الفندق الرقمية.",key:false},{id:"e6",name:"إيصال مقهى",type:"زمني",text:"إيصال باسم مشتبه لكن الدفع تم بواسطة مساعده.",key:false}],suspects:[{name:"إلياس",role:"تقني شبكات",motive:"بيع معلومات",alibi:"اعتمد على توقيت الكاميرا فقط",risk:"مرتفع"},{name:"ماريا",role:"صحفية",motive:"سبق صحفي",alibi:"بث مباشر موثق",risk:"منخفض"},{name:"كمال",role:"منظم المؤتمر",motive:"وصول إداري",alibi:"كان في اجتماع عام",risk:"متوسط"}]}
];
const state={index:0,points:0,selectedEvidence:new Set(),selectedSuspect:null,analyzed:false,solved:false};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function getRank(){return state.points>=1500?"محقق مخضرم":state.points>=800?"محقق أول":state.points>=350?"محقق ميداني":"محقق مبتدئ"}
function setTab(name){
  $$('.tab-page').forEach(p=>p.classList.add('hidden'));
  const page=$('#tab-'+name);
  if(!page) return;
  page.classList.remove('hidden');
  $$('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
  if(name==='suspects'){
    renderSuspects();
    requestAnimationFrame(()=>renderSuspects());
  }
  if(name==='evidence'){
    renderEvidence();
  }
}
function updateProgress(){const v=Math.min(100,state.selectedEvidence.size*11+(state.analyzed?18:0)+(state.selectedSuspect?16:0)+(state.solved?25:0));$('#progressLabel').textContent=v+'%';$('#progressMeter').style.width=v+'%'}
function renderEvidence(){const c=cases[state.index],g=$('#evidenceGrid');g.innerHTML='';c.evidence.forEach((x,i)=>{const b=document.createElement('button');b.type='button';b.className='evidence-card'+(state.selectedEvidence.has(x.id)?' selected':'');b.dataset.evidence=x.id;b.innerHTML=`<div class="card-top"><span class="code">E-${String(i+1).padStart(2,'0')}</span><span class="type">${x.type}</span></div><h3>${x.name}</h3><p>${x.text}</p>`;g.appendChild(b)});$('#evidenceCount').textContent=state.selectedEvidence.size}
function renderSuspects(){
  const g=$('#suspectGrid');
  if(!g) return;
  const c=cases[state.index] || cases[0];
  const suspects=Array.isArray(c?.suspects)?c.suspects:[];
  g.innerHTML='';
  if(!suspects.length){
    g.innerHTML='<div class="suspects-empty">تعذر تحميل المشتبهين. أعد فتح التبويب.</div>';
    return;
  }
  suspects.forEach((s,i)=>{
    const b=document.createElement('button');
    b.type='button';
    b.className='suspect-card'+(state.selectedSuspect===s.name?' selected':'');
    b.dataset.suspect=s.name;
    b.innerHTML=`<div class="suspect-avatar">${String.fromCharCode(65+i)}</div><h3>${s.name}</h3><p>${s.role}</p><div class="suspect-meta"><div><b>الدافع:</b> ${s.motive}</div><div><b>الحجة:</b> ${s.alibi}</div><div><b>الاشتباه:</b> ${s.risk}</div></div>`;
    g.appendChild(b);
  });
  const selected=$('#selectedSuspectName');
  if(selected) selected.textContent=state.selectedSuspect||'لم يتم الاختيار';
}
function render(){const c=cases[state.index];$('#caseTitle').textContent=c.title;$('#caseMeta').textContent=`${c.meta} • صعوبة ${c.difficulty}%`;$('#scopeBadge').textContent=c.scope;$('#story').textContent=c.story;$('#difficultyLabel').textContent=c.difficulty+'%';$('#difficultyText').textContent=c.difficulty+'%';$('#difficultyMeter').style.width=c.difficulty+'%';$('.difficulty-ring').style.background=`radial-gradient(circle,#111419 55%,transparent 57%),conic-gradient(var(--yellow) 0 ${c.difficulty}%,#2a2f35 ${c.difficulty}% 100%)`;$('#points').textContent=state.points.toLocaleString('ar-EG');$('#leaguePoints').textContent=state.points.toLocaleString('ar-EG');$('#rank').textContent=getRank();$('#caseNo').textContent=`القضية ${state.index+1} / ${cases.length}`;renderEvidence();renderSuspects();updateProgress();$('#caseResult').classList.add('hidden');$('#caseActions').classList.add('hidden')}
function showAnalysis(m){$('#analysisResult').textContent=m;$('#analysisResult').classList.remove('hidden')}
function analyzeEvidence(){const c=cases[state.index];if(state.selectedEvidence.size<2){showAnalysis('اختر دليلين على الأقل حتى يمكن بناء علاقة منطقية بينهما.');return}state.analyzed=true;const sel=c.evidence.filter(x=>state.selectedEvidence.has(x.id)),k=sel.filter(x=>x.key).length;showAnalysis(k>=3?'تحليل قوي: الأدلة المختارة تكوّن سلسلة مترابطة من الفرصة + التوقيت + الارتباط بمكان الجريمة. انتقل الآن للمشتبهين وحدد صاحب التناقض الأقوى.':k===2?'هناك رابط مهم، لكن السلسلة ما زالت ناقصة. ابحث عن دليل ثالث يربط التوقيت بمكان الجريمة.':'الترابط ضعيف. يبدو أنك اعتمدت على أدلة لافتة لكنها لا تثبت الفرصة الزمنية. أعد تقييم اختيارك.');updateProgress()}
function showResult(ok,m){const b=$('#caseResult');b.className='case-result'+(ok?'':' error');b.innerHTML=`<strong>${ok?'القضية مغلقة ✓':'مراجعة التحقيق'}</strong><div>${m}</div>`;b.classList.remove('hidden');$('#caseActions').classList.remove('hidden');$('#nextCase').disabled=!ok||state.index>=cases.length-1}
function accuse(){const c=cases[state.index];if(!state.selectedSuspect){showResult(false,'يجب اختيار مشتبه قبل توجيه الاتهام.');return}if(!state.analyzed||state.selectedEvidence.size<3){showResult(false,'ملف الاتهام غير مكتمل. حلل ثلاثة أدلة على الأقل قبل القرار النهائي.');return}const k=c.evidence.filter(x=>state.selectedEvidence.has(x.id)&&x.key).length,ok=state.selectedSuspect===c.correct&&k>=3;if(ok){if(!state.solved){state.points+=c.reward;state.solved=true}showResult(true,`تم حل القضية. الاستنتاج صحيح لأنك جمعت الأدلة الحاسمة وحددت التناقض الزمني في أقوال ${c.correct}. حصلت على ${c.reward} نقطة.`)}else{state.points=Math.max(0,state.points-90);showResult(false,'الاتهام غير صحيح أو غير مدعوم بما يكفي. خُصم 90 نقطة. راجع الأدلة المضللة وابحث عن السلسلة التي تربط المكان بالتوقيت والفرصة.')}$('#points').textContent=state.points.toLocaleString('ar-EG');$('#leaguePoints').textContent=state.points.toLocaleString('ar-EG');$('#rank').textContent=getRank();updateProgress()}
function resetCase(){state.selectedEvidence.clear();state.selectedSuspect=null;state.analyzed=false;state.solved=false;$('#analysisResult').classList.add('hidden');render();setTab('case')}
$$('.nav-btn').forEach(b=>b.addEventListener('click',()=>{
  const tab=b.dataset.tab;
  setTab(tab);
  if(tab==='suspects') setTimeout(renderSuspects,0);
}));$('#startInvestigation').addEventListener('click',()=>setTab('evidence'));$('#evidenceGrid').addEventListener('click',e=>{const b=e.target.closest('[data-evidence]');if(!b)return;const id=b.dataset.evidence;state.selectedEvidence.has(id)?state.selectedEvidence.delete(id):state.selectedEvidence.add(id);renderEvidence();updateProgress()});$('#suspectGrid').addEventListener('click',e=>{const b=e.target.closest('[data-suspect]');if(!b)return;state.selectedSuspect=b.dataset.suspect;renderSuspects();updateProgress()});$('#analyzeEvidence').addEventListener('click',analyzeEvidence);$('#clearEvidence').addEventListener('click',()=>{state.selectedEvidence.clear();state.analyzed=false;renderEvidence();$('#analysisResult').classList.add('hidden');updateProgress()});$('#accuse').addEventListener('click',accuse);$('#retryCase').addEventListener('click',resetCase);$('#nextCase').addEventListener('click',()=>{if(state.index<cases.length-1){state.index++;state.selectedEvidence.clear();state.selectedSuspect=null;state.analyzed=false;state.solved=false;render();setTab('case')}});render();
