(() => {
  "use strict";

  const TOTAL_CASES = 520;
  const cities = [
    ["القاهرة","مصر"],["الإسكندرية","مصر"],["الرياض","السعودية"],["جدة","السعودية"],
    ["دبي","الإمارات"],["أبوظبي","الإمارات"],["عمّان","الأردن"],["الدوحة","قطر"],
    ["الكويت","الكويت"],["مسقط","عُمان"],["إسطنبول","تركيا"],["أثينا","اليونان"],
    ["روما","إيطاليا"],["فيينا","النمسا"],["براغ","التشيك"],["باريس","فرنسا"],
    ["برلين","ألمانيا"],["مدريد","إسبانيا"],["لندن","بريطانيا"],["سنغافورة","سنغافورة"],
    ["طوكيو","اليابان"],["تورنتو","كندا"],["نيويورك","الولايات المتحدة"],["بوينس آيرس","الأرجنتين"]
  ];

  const firstNamesM = ["آدم","أحمد","كريم","سامر","فارس","مازن","يزن","حازم","رامي","زياد","سامي","نبيل","عمر","مالك","إلياس","دانيال","لوكاس","نيكولاس","رافاييل","مارك"];
  const firstNamesF = ["سلمى","ليلى","نادين","هالة","نورة","رنا","مها","ليان","سارة","صوفيا","إيلينا","أميليا","لارا","ميرنا","جوليا","هنا"];
  const lastNames = ["ناصر","مراد","فوزي","السعدي","شريف","حمدي","البدر","منصور","توفيق","الخطيب","كراوس","روث","شميت","روسّي","ميلر","نجيب","الدسوقي","القحطاني","الراوي","عادل"];

  const archetypes = [
    {slug:"hotel", category:"قتل داخل فندق", place:"جناح فندقي", victimRole:"رجل أعمال", method:"تسميم مشروب ثم تضليل التوقيت",
      motives:["إخفاء تحويلات مالية","منع كشف سر مهني","نزاع على ملكية شركة","ابتزاز مالي"],
      roles:["شريك أعمال","مديرة علاقات","مسؤول أمن","صحفية اقتصادية","محاسب","مدير فندق"],
      scene:["الكأس الزجاجي","قارئ الباب","هاتف الضحية","زر كم معدني"], ev:["glass","keycard","phone","fabric","document","camera","watch","usb"]},
    {slug:"villa", category:"جريمة منزل ذكي", place:"فيلا ذكية", victimRole:"مستثمر عقاري", method:"استغلال وضع الصيانة في المنزل الذكي",
      motives:["إيقاف صفقة عقارية","نزاع عائلي على أصول","إخفاء علاقة مالية","الانتقام من قرار بيع"],
      roles:["شريكة أعمال","ابنة الضحية","مهندس نظام","وسيط عقاري","مستشار قانوني","مدير أملاك"],
      scene:["وحدة التحكم","نافذة المكتب","الجهاز اللوحي","عقد ممزق"], ev:["laptop","camera","document","keycard","phone","fingerprint","harddrive","watch"]},
    {slug:"lab", category:"وفاة داخل مختبر", place:"مختبر أبحاث", victimRole:"باحث رئيسي", method:"تعطيل منظومة الأمان أثناء تجربة حساسة",
      motives:["إخفاء تلاعب في بيانات السلامة","نزاع على بحث علمي","إيقاف تدقيق داخلي","حماية تمويل مشروع"],
      roles:["فني أنظمة","باحثة مشاركة","مسؤولة جودة","ممثل ممول","مدير مختبر","مهندس أجهزة"],
      scene:["لوحة الحساسات","محطة العمل","خزانة العينات","باب المنطقة"], ev:["laptop","harddrive","bottle","keycard","document","camera","usb","fingerprint"]},
    {slug:"train", category:"قتل وسرقة مستندات", place:"قطار ليلي", victimRole:"مدقق مالي", method:"تهدئة الضحية ثم تبديل حقيبة المستندات",
      motives:["منع تسليم ملف تدقيق","إخفاء مدفوعات مشبوهة","سرقة مستندات أصلية","حماية عميل متورط"],
      roles:["مدير مالي سابق","عامل خدمة","محامية","رجل أعمال","موظف شركة","مرافق شخصي"],
      scene:["رف الحقائب","كوب القهوة","باب الممر","إيصال الخدمة"], ev:["bag","glass","ticket","camera","document","keycard","phone","fingerprint"]},
    {slug:"office", category:"قتل في مقر شركة", place:"مكتب تنفيذي", victimRole:"مدير تنفيذي", method:"استدراج الضحية ثم التلاعب بسجل الدخول",
      motives:["صراع على منصب","كشف اختلاس","نزاع أسهم","منع صفقة استحواذ"],
      roles:["نائب المدير","محاسب أول","مديرة الموارد","مستشار قانوني","رئيس أمن","منافس تجاري"],
      scene:["الحاسب","خزنة المكتب","بطاقة دخول","مذكرة ورقية"], ev:["laptop","document","keycard","fingerprint","camera","usb","phone","watch"]},
    {slug:"museum", category:"قتل وسرقة أثر فني", place:"متحف خاص", victimRole:"خبير مقتنيات", method:"استبدال قطعة أصلية بنسخة ثم إسكات الخبير",
      motives:["تهريب قطعة نادرة","إخفاء تزوير فني","صفقة سوق سوداء","الانتقام من رفض تقييم"],
      roles:["مرممة","حارس","تاجر فنون","مديرة معرض","جامع مقتنيات","مصوّر"],
      scene:["قاعدة العرض","كاميرا القاعة","قفاز ترميم","بطاقة زائر"], ev:["fabric","camera","keycard","document","fingerprint","bag","phone","usb"]},
    {slug:"warehouse", category:"قتل في مستودع", place:"مستودع شحن", victimRole:"مشرف لوجستي", method:"استغلال منطقة عمياء في المراقبة ونقل الحرز",
      motives:["تهريب شحنة","إخفاء نقص مخزون","تصفية حسابات","منع كشف تزوير مستندات"],
      roles:["مدير مخزن","سائق شاحنة","مسؤول أمن","موظفة جرد","مالك شركة","مخلص جمركي"],
      scene:["منصة تحميل","سجل بوابة","صندوق مكسور","كاميرا سقف"], ev:["document","camera","shoe","fabric","keycard","phone","bag","fingerprint"]},
    {slug:"airport", category:"جريمة في صالة خاصة", place:"صالة مطار خاصة", victimRole:"مدير إقليمي", method:"تبديل حقيبة أثناء إجراء أمني مزيف",
      motives:["سرقة معلومات تجارية","منع سفر شاهد","تهريب مستندات","إخفاء علاقة مالية"],
      roles:["مرافق تنفيذي","موظف خدمات","رئيس أمن","محامية","صحفي","مندوب شركة"],
      scene:["بوابة الصالة","الحقيبة","بطاقة الصعود","كاميرا الممر"], ev:["bag","ticket","camera","keycard","phone","document","fingerprint","watch"]},
    {slug:"ship", category:"قتل على سفينة", place:"كابينة سفينة", victimRole:"وسيط دولي", method:"التلاعب بدخول الكابينة أثناء تغيير النوبات",
      motives:["سرقة عقد دولي","نزاع شحنة","إخفاء هوية عميل","انتقام تجاري"],
      roles:["ربان مساعد","مدير شحنة","مسؤولة ضيافة","مستشار","راكب أعمال","فني اتصالات"],
      scene:["باب الكابينة","نافذة دائرية","خزانة الأوراق","جهاز اتصال"], ev:["keycard","document","phone","camera","fabric","watch","bag","fingerprint"]},
    {slug:"theater", category:"جريمة خلف الكواليس", place:"مسرح", victimRole:"منتج فني", method:"استغلال تبديل الإضاءة والدخول الخلفي",
      motives:["نزاع حقوق","إلغاء عقد","غيرة مهنية","فضح تلاعب مالي"],
      roles:["مخرج","ممثلة","مدير إنتاج","فني إضاءة","وكيل أعمال","كاتب"],
      scene:["غرفة الملابس","لوحة الإضاءة","الباب الخلفي","عقد ممزق"], ev:["document","camera","fabric","keycard","phone","fingerprint","watch","usb"]},
    {slug:"archive", category:"سرقة أرشيف وقتل محلل", place:"أرشيف رقمي", victimRole:"محلل امتثال", method:"استخدام وصول مادي ثم تضليل التحقيق بهوية رقمية",
      motives:["إخفاء تضارب مصالح","منع كشف شبكة شركات","حماية عميل دولي","إخفاء اختراق سابق"],
      roles:["مستشارة تدقيق","مهندس أمن","مسؤول أرشيف","مديرة برنامج","محامٍ دولي","مسؤول بنية"],
      scene:["الخزانة الآمنة","قارئ الممر","محطة العمل","لوحة الخدمات"], ev:["harddrive","keycard","laptop","usb","document","camera","fingerprint","phone"]},
    {slug:"restaurant", category:"قتل في مطعم فاخر", place:"مطعم خاص", victimRole:"رجل أعمال", method:"التلاعب بطلب خاص قبل اجتماع سري",
      motives:["إسكات شاهد","نزاع استثماري","ابتزاز","إخفاء صفقة"],
      roles:["شريك","مديرة مطعم","طاهٍ","محاسب","صحفية","حارس شخصي"],
      scene:["الكأس","فاتورة الطلب","كاميرا المطبخ","حقيبة الضحية"], ev:["glass","ticket","camera","bag","phone","document","fingerprint","bottle"]},
    {slug:"bank", category:"جريمة مالية داخل بنك", place:"مكتب بنك خاص", victimRole:"مدقق مخاطر", method:"استغلال جلسة مصرفية داخلية وحذف سجل جزئي",
      motives:["إخفاء تحويلات","حماية عميل كبير","منع تقرير مخاطر","سرقة مفتاح تشفير"],
      roles:["مدير فرع","مسؤولة امتثال","خبير نظم","عميل كبير","محامٍ","موظف خزينة"],
      scene:["خزنة جانبية","حاسب المكتب","بطاقة موظف","ملف تحويلات"], ev:["laptop","document","keycard","harddrive","usb","camera","fingerprint","phone"]},
    {slug:"resort", category:"جريمة في منتجع", place:"منتجع جبلي", victimRole:"مالك منتجع", method:"استغلال عاصفة وانقطاع اتصال قصير",
      motives:["نزاع ملكية","تأمين ضخم","صفقة بيع","إخفاء مخالفة إنشائية"],
      roles:["شريك","مديرة تشغيل","مهندس","مرشد","محامية","مدير أمن"],
      scene:["الشرفة","مولد الكهرباء","مكتب الإدارة","كاميرا المدخل"], ev:["camera","document","keycard","phone","shoe","watch","fingerprint","bag"]},
    {slug:"clinic", category:"وفاة غامضة في عيادة", place:"عيادة خاصة", victimRole:"طبيب استشاري", method:"التلاعب بجدول المواعيد وسجل غرفة خاصة",
      motives:["نزاع شراكة","إخفاء مخالفة","ابتزاز مهني","منع كشف مستند"],
      roles:["طبيب شريك","مديرة عيادة","ممرضة","محاسب","مندوب شركة","مراجع"],
      scene:["غرفة الفحص","حاسب الاستقبال","خزانة الملفات","كاميرا الممر"], ev:["document","laptop","camera","keycard","bottle","phone","fingerprint","watch"]},
    {slug:"data_center", category:"جريمة داخل مركز بيانات", place:"مركز بيانات", victimRole:"مهندس بنية تحتية", method:"استغلال نافذة صيانة وحذف مسار رقمي",
      motives:["إخفاء اختراق","سرقة مفاتيح تشفير","منع تدقيق","حماية جهة خارجية"],
      roles:["مهندس أمن","مسؤول شبكة","مديرة عمليات","مقاول صيانة","مدقق","عميل مؤسسي"],
      scene:["خزانة خوادم","قارئ الدخول","وحدة طاقة","حاسب محمول"], ev:["harddrive","keycard","laptop","usb","camera","document","phone","fingerprint"]}
  ];

  const titleWordsA = ["ملف","سر","صمت","ظل","شفرة","ليلة","نافذة","الساعة","الممر","الغرفة","المفتاح","الأثر","النسخة","الوجه","الطابق","المحطة","العقد","الرحلة","الحقيبة","الشاهد"];
  const titleWordsB = ["الأخير","المفقود","المزدوج","الأسود","المكسور","الصامت","المحذوف","الخفي","البارد","المغلق","الذهبي","المزوّر","المؤجل","المنسي","المشفّر","الخامس","الثامن","17","409","86"];

  function mulberry32(seed) {
    return function() {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }
  function pick(r, arr){ return arr[Math.floor(r()*arr.length)] }
  function uniqueNames(r,n){
    const out=[]; const used=new Set();
    while(out.length<n){
      const isF=r()>.56; const name=pick(r,isF?firstNamesF:firstNamesM)+" "+pick(r,lastNames);
      if(!used.has(name)){used.add(name);out.push({name,isF})}
    }
    return out;
  }
  function stageFor(i){
    if(i<80) return {scope:"محلية",label:"الموسم 1",bonus:0};
    if(i<180) return {scope:"وطنية",label:"الموسم 2",bonus:7};
    if(i<300) return {scope:"إقليمية",label:"الموسم 3",bonus:14};
    if(i<420) return {scope:"دولية",label:"الموسم 4",bonus:21};
    return {scope:"نخبة عالمية",label:"الموسم 5",bonus:27};
  }
  function buildSuspects(index, a, r, count, correctIdx){
    const names=uniqueNames(r,count);
    const motivePool=[...a.motives,"خلاف شخصي قديم","مصلحة مهنية","الخوف من فضيحة","منع شهادة رسمية"];
    return names.map((n,j)=>{
      const role=a.roles[j%a.roles.length];
      const risk=j===correctIdx?"مرتفع":(j%3===0?"متوسط":"منخفض");
      const motive=j===correctIdx?a.motives[index%a.motives.length]:motivePool[(index+j+2)%motivePool.length];
      const alibis=["كان في اجتماع مسجل","ادعى أنه غادر مبكرًا","قال إنه كان في مكان آخر","لديه شاهد واحد فقط","يعتمد على سجل رقمي غير متزامن","توجد كاميرا تدعم جزءًا من كلامه"];
      return {
        id:`s${j+1}`, name:n.name, female:n.isF, role, age:27+Math.floor(r()*27), risk, motive,
        alibi:alibis[(index+j)%alibis.length],
        contradiction:j===correctIdx?"توقيت أقواله لا يطابق السجل المصحح":"يوجد اختلاف محدود يحتاج تفسيرًا",
        portraitSeed:(index*11+j*37)%997,
        answers:{
          where:j===correctIdx?"كنت بعيدًا عن المكان وقتها... على الأقل ده اللي فاكره.":"كنت في المكان المذكور في أقوالي، وممكن التحقق من ده.",
          relation:"كانت بيننا علاقة عمل، وفيه خلافات لكن مش لدرجة جريمة.",
          motive:j===correctIdx?`الموضوع المتعلق بـ${motive} اتفهم بشكل أكبر من حجمه.`:"ما عنديش مصلحة حقيقية في اللي حصل.",
          evidence:j===correctIdx?"الدليل ده ممكن يكون له تفسير تاني. التوقيت عندكم نفسه مش واضح.":"وجود أثري في المكان له سبب طبيعي مرتبط بعملي.",
          timeline:j===correctIdx?"أنا متمسك بالتوقيت اللي قلته، لو السجلات مختلفة راجعوا النظام.":"التوقيت عندي مدعوم بسجل أو شهود.",
          contact:"آخر تواصل كان في نفس اليوم ضمن موضوع العمل."
        }
      }
    });
  }
  function buildEvidence(index,a,r,correctIdx,count){
    const labels=["دليل رقمي","حرز مادي","تسجيل كاميرا","مستند مالي","أثر زمني","سجل دخول","عينة معملية","جهاز إلكتروني","أثر بصمة","مقتطف صوتي","إيصال","قطعة نسيج"];
    const names=[
      "سجل الدخول المصحح","كاميرا الممر","هاتف الضحية","مستند سري","أثر بصمة جزئية","إيصال بتوقيت مختلف",
      "وحدة تخزين مشفرة","قطعة نسيج","سجل نظام احتياطي","مكالمة مستعادة","حقيبة بديلة","عينة من المشروب"
    ];
    return Array.from({length:count},(_,j)=>{
      const key=j<Math.min(5,Math.max(3,Math.floor(count*.48)));
      const img=a.ev[j%a.ev.length];
      return {
        id:`e${j+1}`, code:`E-${String(j+1).padStart(2,"0")}`, name:names[(index+j)%names.length],
        type:labels[(index*2+j)%labels.length], image:`assets/evidence/${img}.svg`,
        location:["مسرح الجريمة","الممر الخارجي","مكتب الضحية","نظام المنشأة","متعلقات مشتبه","وحدة المراقبة"][j%6],
        custody:"تم التصوير والتحريز وتسجيل سلسلة الحيازة إلكترونيًا.",
        key,
        result:key
          ? `التحليل يكشف علاقة مباشرة بين هذا الحرز والتوقيت الحقيقي للقضية، ويضع المشتبه رقم ${correctIdx+1} داخل نافذة الجريمة أو يثبت دافعه.`
          : "النتيجة لافتة لكنها لا تربط شخصًا بعينه بالجريمة، وقد تكون دليلًا مضللًا إذا استُخدمت منفردة."
      }
    });
  }
  function buildDocuments(index,a,r,correctName,motive){
    return [
      {type:"محضر معاينة",title:"محضر إثبات حالة مسرح الجريمة",body:`تم تأمين ${a.place} ومنع الدخول بعد البلاغ. لم تظهر آثار اقتحام واضحة، بينما وُجدت أربعة مواضع تستحق الفحص الفني. يشير التقدير الأولي إلى أن الجريمة وقعت داخل نافذة زمنية قصيرة وأن الفاعل كان يعرف المكان أو إجراءات الدخول.`},
      {type:"أقوال شاهد",title:"أقوال شاهد رئيسي",body:`قرر الشاهد أنه لاحظ حركة غير معتادة قرب موقع الواقعة، وأن ساعة أحد الأنظمة لم تكن متطابقة مع هاتفه. كما ذكر أنه شاهد شخصًا يحمل شيئًا داكنًا أو حقيبة صغيرة لكنه لم يتعرف على الوجه بشكل مؤكد.`},
      {type:"تقرير فني",title:"تقرير مزامنة الأنظمة",body:`بمقارنة نظام الدخول مع الكاميرات والسجل الإداري ظهر فرق زمني ثابت. بعد تصحيح الفرق يتغير ترتيب الأحداث، ويصبح أحد المشتبهين داخل المكان في وقت كان يدعي فيه أنه غادر بالفعل.`},
      {type:"تقرير مالي/مهني",title:"تقرير الدافع المحتمل",body:`تكشف المستندات أن القضية ترتبط بـ${motive}. كان الضحية بصدد اتخاذ إجراء أو تسليم مستند قد يسبب خسارة مباشرة لشخص داخل دائرة المشتبهين.`},
      {type:"أقوال مشتبه",title:`أقوال ${correctName}`,body:`أنكر المشتبه وجوده في النافذة الحرجة، وتمسك بتوقيت لا يطابق السجلات بعد تصحيحها. أقر بوجود خلاف مرتبط بموضوع القضية لكنه قلل من أهميته.`},
      {type:"تقرير معمل",title:"ملخص نتائج الأحراز",body:"عدة أحراز تتفق في اتجاه واحد: هناك دليل على الفرصة، ودليل على الدافع، ودليل يفسر طريقة تنفيذ الجريمة. بقية الأحراز بعضها طبيعي وبعضها لا يكفي وحده للاتهام."}
    ];
  }
  function makeCase(index){
    const r=mulberry32(94321+index*7919);
    const a=archetypes[index%archetypes.length];
    const st=stageFor(index);
    const city=cities[(index*5+Math.floor(r()*cities.length))%cities.length];
    const suspectCount=Math.min(7,4+Math.floor((index/TOTAL_CASES)*4));
    const evCount=Math.min(12,8+Math.floor((index/TOTAL_CASES)*5));
    const correctIdx=(index*3+Math.floor(r()*suspectCount))%suspectCount;
    const suspects=buildSuspects(index,a,r,suspectCount,correctIdx);
    const correct=suspects[correctIdx];
    const motive=a.motives[index%a.motives.length];
    const evidence=buildEvidence(index,a,r,correctIdx,evCount);
    const docs=buildDocuments(index,a,r,correct.name,motive);
    const difficulty=Math.min(99,45+Math.floor(index/TOTAL_CASES*48)+st.bonus);
    const reward=250+Math.floor(difficulty*12)+(index%7)*35;
    const hour=18+(index%7); const min=(index*13)%60;
    const title=`${titleWordsA[index%titleWordsA.length]} ${titleWordsB[(index*7)%titleWordsB.length]} ${index+1}`;
    const timeline=[
      [`${String(hour).padStart(2,"0")}:${String(min).padStart(2,"0")}`,"آخر ظهور مؤكد للضحية قبل النافذة الحرجة."],
      [`${String((hour+(min+11>=60?1:0))%24).padStart(2,"0")}:${String((min+11)%60).padStart(2,"0")}`,"حدث رقمي أو حركة دخول تظهر في أحد الأنظمة."],
      [`${String((hour+(min+24>=60?1:0))%24).padStart(2,"0")}:${String((min+24)%60).padStart(2,"0")}`,"تظهر فجوة أو تناقض في السجل يحتاج إلى تفسير."],
      [`${String((hour+(min+39>=60?1:0))%24).padStart(2,"0")}:${String((min+39)%60).padStart(2,"0")}`,"اكتشاف الواقعة وبدء إجراءات التأمين."]
    ];
    return {
      id:`CASE-${String(index+1).padStart(4,"0")}`, index, title, city:city[0], country:city[1],
      scope:st.scope, season:st.label, category:a.category, sceneSlug:a.slug, sceneTitle:a.place,
      difficulty, reward, suspectCount, victim:`${pick(r,firstNamesM)} ${pick(r,lastNames)} — ${a.victimRole}`,
      location:`${a.place} — ${city[0]}`, time:`${timeline[0][0]} – ${timeline[3][0]}`,
      objective:`حدد الفاعل، دافعه، وطريقة التنفيذ في قضية ${a.category}.`,
      brief:`قضية ${a.category} داخل ${a.place} في ${city[0]}. لا يوجد تفسير بسيط لما حدث؛ السجلات تبدو متعارضة، وهناك ${evCount} أحراز و${suspectCount} مشتبهين. نقطة الحسم هي الربط بين التوقيت الحقيقي والدافع بدل الاعتماد على أول دليل لافت.`,
      timeline, hotspots:a.scene.map((x,j)=>({label:x,detail:`فحص ${x} يضيف معلومة جديدة إلى سجل المعاينة وقد يرتبط بالحرز ${evidence[j]?.code||""}.`, evidence:evidence[j]?.id})),
      evidence, suspects, documents:docs,
      motives:[motive,...a.motives.filter(x=>x!==motive),"خلاف شخصي غير مثبت"].slice(0,4),
      methods:[a.method,"اقتحام مباشر للموقع","استدراج الضحية إلى مكان آخر","تلفيق أثر رقمي لإخفاء الفاعل"],
      correct:{suspectId:correct.id,suspect:correct.name,motive,method:a.method},
      conclusion:`تم ربط ${correct.name} بالقضية عبر التوقيت المصحح وسلسلة الأحراز. الدافع الأساسي هو ${motive}، وطريقة التنفيذ الأقرب للأدلة هي: ${a.method}.`
    };
  }

  const cache = new Map();
  window.CaseEngine = {
    total: TOTAL_CASES,
    get(index){
      const i=Math.max(0,Math.min(TOTAL_CASES-1,Number(index)||0));
      if(!cache.has(i)) cache.set(i,makeCase(i));
      return cache.get(i);
    },
    range(start,count){
      const out=[]; for(let i=start;i<Math.min(TOTAL_CASES,start+count);i++) out.push(this.get(i)); return out;
    },
    search(q,start=0,count=80){
      const n=String(q||"").trim().toLowerCase();
      if(!n) return this.range(start,count);
      const out=[];
      for(let i=0;i<TOTAL_CASES&&out.length<count;i++){
        const c=this.get(i);
        if(`${c.title} ${c.city} ${c.country} ${c.category} ${c.scope}`.toLowerCase().includes(n)) out.push(c);
      }
      return out;
    }
  };
})();