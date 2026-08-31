(()=>{
const TOTAL=520;
const maleNames=[
 "أدهم الشامي","خالد المنوفي","سامي بدر","عماد يوسف","كريم فوزي","مازن فؤاد","رامي صبري",
 "يزن حمدي","فارس عادل","دانيال روث","مالك فريد","تيمور عادل","جلال رفعت","عاصم توفيق",
 "أحمد ناصر","مروان شريف","حسام منصور","عمر السعدي","نبيل مراد","زياد توفيق","إلياس فوزي"
];
const femaleNames=[
 "ليلى ناصر","هالة مراد","نادين سالم","نور خالد","سارة توفيق","مها شريف","نورة السالم",
 "هالة السعدي","صوفيا كراوس","أميليا روسي","هند شريف","لارا منصور","ديمة ناصر","يارا نبيل",
 "سلمى فريد","رنا عادل","مريم توفيق","ليان مراد","جوليا روسي","إيلينا كراوس"
];
const maleRoles=[
 "شريك أعمال","مستثمر","صحفي تحقيق","مسؤول أمن","محاسب","مهندس أنظمة","سائق خاص",
 "مستشار قانوني","موظف استقبال","مدير تشغيل","مراقب جودة","باحث","وسيط عقاري",
 "ممرض","خبير تقني","مدير مخزن"
];
const femaleRoles=[
 "شريكة أعمال","مستثمرة","صحفية تحقيق","مسؤولة أمن","محاسبة","مهندسة أنظمة","محامية",
 "مستشارة قانونية","موظفة استقبال","مديرة تشغيل","مراقبة جودة","باحثة","وسيطة عقارية",
 "ممرضة","خبيرة تقنية","مديرة مخزن","مديرة مكتب","مديرة علاقات"
];
const malePortraits=[0,2,3,4,5,7,8,9,11,12,14,15,16,17,19,20,21,23,24,26,27];
const femalePortraits=[1,6,10,13,18,22,25];
const cities=[["الكويت","الكويت"],["الرياض","السعودية"],["جدة","السعودية"],["القاهرة","مصر"],["الإسكندرية","مصر"],["دبي","الإمارات"],["إسطنبول","تركيا"],["فيينا","النمسا"],["براغ","التشيك"],["باريس","فرنسا"],["لندن","بريطانيا"],["روما","إيطاليا"],["الدوحة","قطر"],["عمّان","الأردن"],["مسقط","عُمان"],["مدريد","إسبانيا"],["برلين","ألمانيا"],["سنغافورة","سنغافورة"],["طوكيو","اليابان"],["تورنتو","كندا"]];
const titleA=["النافذة","الساعة","المفتاح","الملف","الصمت","الظل","الممر","الحقيبة","الرحلة","النسخة","الطابق","الإشارة","العقد","الغرفة","النداء","الرمز","المحطة","الشاهد","الليلة","البصمة"];
const titleB=["الأخيرة","المفقودة","المكسورة","المشفرة","الصامتة","المحذوفة","الباردة","المزدوجة","الذهبية","المغلقة","المزورة","السابعة","السوداء","الخافتة","المنسية","المخفية","الخامسة","المؤجلة","السرية","المجهولة"];
const motives=["إخفاء تحويلات مالية","منع كشف فضيحة مهنية","نزاع على صفقة كبيرة","الانتقام من قرار إداري","حماية عميل متورط","سرقة مستندات حساسة","إخفاء تضارب مصالح","منع شهادة رسمية","إخفاء تزوير في السجلات","السيطرة على أصل مالي","إفشال تحقيق داخلي","الاستفادة من عقد تأمين"];
const methods=["تسميم مشروب ثم تضليل التوقيت","استغلال بطاقة دخول مؤقتة","استدراج الضحية ثم تبديل المستندات","استغلال نافذة صيانة وحذف سجل","استخدام وصول مادي ثم تضليل التحقيق رقميًا","إخفاء الأثر داخل فترة انقطاع مراقبة","تبديل حقيبة أصلية بأخرى مشابهة","استغلال دخول خدمة مصرح به"];
const evidenceCatalog=[
 {img:"e00",name:"سكين ملطخ بآثار دم",type:"أداة حادة"},
 {img:"e01",name:"كأس زجاجي مكسور",type:"حرز زجاجي"},
 {img:"e02",name:"بصمة إصبع واضحة",type:"بصمة"},
 {img:"e03",name:"بطاقة غرفة 1708",type:"بطاقة دخول"},
 {img:"e04",name:"هاتف محمول",type:"جهاز إلكتروني"},
 {img:"e05",name:"مستند رسمي",type:"مستند"},
 {img:"e06",name:"قطعة زجاج متشقق",type:"أثر زجاجي"},
 {img:"e07",name:"هاتف محمول ثانٍ",type:"جهاز إلكتروني"},
 {img:"e08",name:"كأس يحتوي على بقايا سائل",type:"عينة"},
 {img:"e09",name:"مفتاح سيارة",type:"مفتاح"},
 {img:"e10",name:"بصمة مرفوعة من مسرح الجريمة",type:"بصمة"},
 {img:"e11",name:"هاتف غير مقفل",type:"جهاز إلكتروني"},
 {img:"e12",name:"حقيبة جلدية",type:"متعلقات شخصية"},
 {img:"e13",name:"إيصال أو مستند مالي",type:"مستند مالي"},
 {img:"e14",name:"أداة حادة صغيرة",type:"أداة حادة"}
];
const archetypes=["فندق","فيلا","مكتب تنفيذي","مختبر","مستودع","قطار ليلي","كابينة سفينة","سطح برج","متحف","مطعم فاخر","عيادة","جراج سيارات","بنك","مركز بيانات","مسرح","صالة مطار","موقع إنشاء","استوديو فني","مكتبة","ورشة","مرسى يخوت","محطة مترو","كوخ جبلي","مطبخ فاخر","مختبر مدرسة","قاعة محكمة"];
const cinematicScenes=["hotel_case.png","villa_case.png","hotel_night.png","villa_night.png","office_dark.png","restaurant_lux.png","lab_dark.png","museum_room.png","archive_room.png","resort_room.png","hotel_mirror.png","villa_mirror.png"];
function params(i){
 if(i<10)return{sus:3,ev:5,docs:3,scope:"محيط منطقتك"};
 if(i<30)return{sus:4,ev:6,docs:4,scope:"محيط مدينتك"};
 if(i<80)return{sus:4,ev:7,docs:4,scope:"محلية"};
 if(i<150)return{sus:5,ev:8,docs:5,scope:"وطنية"};
 if(i<250)return{sus:5,ev:9,docs:5,scope:"إقليمية"};
 if(i<360)return{sus:6,ev:10,docs:6,scope:"دولية"};
 if(i<470)return{sus:6,ev:11,docs:6,scope:"دولية متقدمة"};
 return{sus:7,ev:12,docs:6,scope:"نخبة عالمية"};
}
function get(i){
 i=Math.max(0,Math.min(TOTAL-1,Number(i)||0));
 const p=params(i), correct=(i*3+1)%p.sus, city=cities[(i*7)%cities.length], difficulty=Math.min(99,22+Math.floor(i/519*77));
 const suspects=Array.from({length:p.sus},(_,j)=>{
  const female=((i+j*2)%4===1);
  const namePool=female?femaleNames:maleNames;
  const rolePool=female?femaleRoles:maleRoles;
  const portraitPool=female?femalePortraits:malePortraits;
  const name=namePool[(i*5+j*3)%namePool.length];
  const role=rolePool[(i+j*2)%rolePool.length];
  const portrait=portraitPool[(i*3+j)%portraitPool.length];
  return {
   id:"s"+j,name,role,gender:female?"female":"male",risk:j===correct?"مرتفع":j%3===0?"متوسط":"منخفض",portrait,
   alibi:["كان في اجتماع موثق","قال إنه غادر قبل الواقعة","اعتمد على توقيت نظام الدخول","كان في ممر آخر","لديه شاهد واحد","ظهر في كاميرا بعيدة","كان في مكالمة طويلة"][j%7],
   motive:j===correct?motives[i%motives.length]:motives[(i+j+4)%motives.length],
   answers:{
    where:j===correct?"غادرت قبل الوقت اللي بتقولوا عليه. لو السجل مختلف يبقى النظام عندكم فيه مشكلة.":"كنت في المكان اللي ذكرته وأقدر أثبت ده.",
    relation:"كانت بيننا علاقة عمل وفيه خلافات، لكنها لم تصل لعداء شخصي.",
    motive:j===correct?"الموضوع المالي أو المهني اتفهم أكبر من حجمه.":"ما عنديش مصلحة مباشرة في اللي حصل.",
    evidence:j===correct?"الدليل ده ممكن يتفسر بطريقة تانية، ومش كفاية لوحده.":"وجود أثري له تفسير طبيعي مرتبط بعملي.",
    timeline:j===correct?"أنا متمسك بالتوقيت اللي قلته. راجعوا ساعة النظام.":"التوقيت عندي مدعوم بشاهد أو سجل مستقل.",
    contact:"آخر تواصل كان في نفس اليوم ضمن موضوع العمل."
   }
  };
 });
 const sceneInfo=window.SCENE_LIBRARY_CLEAN?.[i] || window.CINEMATIC_SCENES?.[i%window.CINEMATIC_SCENES.length];
 const evidence=Array.from({length:p.ev},(_,j)=>{
  const sev=sceneInfo?.evidence?.[j];
  if(sev){
   const key=j<Math.min(5,p.ev-1);
   return {id:"e"+j,code:"E-"+String(j+1).padStart(2,"0"),name:sev.name,type:sev.type,image:sev.image,hotspot:{x:sev.x,y:sev.y},key,result:key?`فحص ${sev.name} داخل ${sceneInfo.name} كشف معلومة مهمة مرتبطة بالتوقيت أو الفرصة، ويزيد أهمية ملف ${suspects[correct].name}.`:`${sev.name} حرز حقيقي من مسرح الجريمة، لكنه يحتاج للربط بباقي الأدلة.`};
  }
  const item=evidenceCatalog[(i+j)%evidenceCatalog.length];
  const key=j<Math.min(5,p.ev-1);
  return {id:"e"+j,code:"E-"+String(j+1).padStart(2,"0"),name:item.name,type:item.type,image:`assets/evidence/${item.img}.png`,key,result:key?`تحليل ${item.name} يكشف معلومة مهمة مرتبطة بالتوقيت أو الفرصة أو الدافع، ويزيد أهمية ملف ${suspects[correct].name}.`:`${item.name} حرز إضافي من ملف التحقيق، لكنه لا يكفي منفردًا لتوجيه الاتهام.`};
 });
 const allDocs=[
  {title:"محضر معاينة مسرح الجريمة",type:"محضر رسمي",body:"تم تأمين موقع الواقعة وتصويره قبل تحريك أي شيء. لا تظهر آثار اقتحام مباشرة. توجد عدة نقاط تستحق الفحص، ويبدو أن الفاعل كان يعرف المكان أو طريقة الدخول."},
  {title:"التقرير الطبي الأولي",type:"طب شرعي",body:"التقدير الأولي يضع الواقعة داخل نافذة زمنية محدودة. لا يمكن الاعتماد على مؤشر واحد لتحديد الدقيقة، ويجب مقارنة النتائج بالسجلات الرقمية وأقوال الشهود."},
  {title:"تقرير تحليل البصمات والآثار",type:"معمل جنائي",body:"رُفعت عدة آثار من مسرح الجريمة. بعض الآثار طبيعي بحكم المكان، لكن هناك أثرًا واحدًا على الأقل لا يتفق مع الرواية الأولية لأحد المشتبهين."},
  {title:"تقرير كاميرات المراقبة",type:"أدلة رقمية",body:"يوجد اختلاف زمني بين إحدى الكاميرات وسجل الدخول. بعد تصحيح الفرق يتغير ترتيب الأحداث وتضع البيانات شخصًا مهمًا داخل النافذة الحرجة."},
  {title:"أقوال شاهد رئيسي",type:"أقوال وتحريات",body:"أفاد الشاهد أنه لاحظ حركة غير معتادة قرب موقع الواقعة، وشاهد شخصًا يغادر المنطقة قبل اكتشاف الجريمة بدقائق، لكنه لم ير الوجه كاملًا."},
  {title:"ملخص الدافع المالي والمهني",type:"تحريات",body:"تكشف المستندات وجود مصلحة مالية أو مهنية مباشرة لشخص داخل دائرة المشتبهين. الإجراء الذي كان الضحية على وشك اتخاذه قد يسبب خسارة كبيرة لذلك الشخص."}
 ].slice(0,p.docs);
 const correctMotive=suspects[correct].motive, correctMethod=methods[i%methods.length];
 const special=(i+1)%10===0;
 return {index:i,id:"CASE-"+String(i+1).padStart(4,"0"),title:`${titleA[i%titleA.length]} ${titleB[(i*7)%titleB.length]} ${i+1}`,city:city[0],country:city[1],sceneType:(sceneInfo?.name||archetypes[i%archetypes.length]),sceneImage:(sceneInfo?.image||`assets/cinematic-scenes/${cinematicScenes[i%cinematicScenes.length]}`),hotspots:(sceneInfo?.evidence||[]).map(x=>({x:x.x,y:x.y})),scope:p.scope,difficulty,reward:280+difficulty*11+(special?250:0),special,
 victim:maleNames[(i+9)%maleNames.length]+" — "+maleRoles[(i+3)%maleRoles.length],location:`${sceneInfo?.name||archetypes[i%archetypes.length]} — ${city[0]}`,time:`${String(18+(i%6)).padStart(2,"0")}:${String((i*11)%60).padStart(2,"0")} – ${String(19+(i%6)).padStart(2,"0")}:${String((i*17+23)%60).padStart(2,"0")}`,
 brief:`${special?"هذه مهمة خاصة من رئيس الوحدة. ":""}وقعت الجريمة في ${sceneInfo?.name||archetypes[i%archetypes.length]} داخل ${city[0]}. لديك ${p.sus} مشتبهين و${p.ev} أحراز. مستوى التعقيد ${difficulty}%. ابحث عن السلسلة المنطقية التي تجمع بين الفرصة والدافع والطريقة.`,
 suspects,evidence,documents:allDocs,motives:[correctMotive,...motives.filter(x=>x!==correctMotive).slice(0,3)],methods:[correctMethod,...methods.filter(x=>x!==correctMethod).slice(0,3)],correct:{suspectId:suspects[correct].id,motive:correctMotive,method:correctMethod},
 conclusion:`أُغلقت القضية بعد ربط ${suspects[correct].name} بالتوقيت المصحح والأحراز والدافع. ${special?"نجاحك في هذه المهمة الخاصة رفع تقييمك داخل الوحدة.":""}`,
 dispatch:special?`رئيس الوحدة يطلبك شخصيًا. لدينا ملف خاص في ${city[0]}، والمحققون الميدانيون يحتاجون إلى تدخلك.`:`ورد بلاغ جديد من ${city[0]}. فريق الموقع بدأ التأمين وينتظر وصولك لقيادة التحقيق.`};
}
window.CaseEngine={total:TOTAL,get,range:(s,n)=>Array.from({length:Math.min(n,TOTAL-s)},(_,j)=>get(s+j))};
})();