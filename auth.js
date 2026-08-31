(() => {
  "use strict";
  const cfg=window.SUPABASE_CONFIG;
  const gate=document.getElementById("authGate");
  const app=document.querySelector(".app-shell");
  const statusBox=document.getElementById("authStatus");
  let client=null, profile=null;

  function status(msg,error=false){statusBox.textContent=msg||"";statusBox.classList.toggle("error",!!error)}
  function showForm(which){
    const login=which==="login";
    document.getElementById("loginForm").classList.toggle("hidden",!login);
    document.getElementById("signupForm").classList.toggle("hidden",login);
    document.getElementById("showLogin").classList.toggle("active",login);
    document.getElementById("showSignup").classList.toggle("active",!login);
    status("");
  }
  async function loadProfile(user){
    const {data}=await client.from("player_profiles").select("*").eq("id",user.id).maybeSingle();
    profile=data||null;
    return profile;
  }
  async function enter(session){
    if(!session?.user)return;
    await loadProfile(session.user);
    gate.classList.add("hidden"); app.classList.remove("game-locked");
    document.getElementById("logoutBtn").classList.remove("hidden");
    document.getElementById("headerPlayerName").textContent=profile?.username||session.user.email?.split("@")[0]||"محقق";
    window.dispatchEvent(new CustomEvent("player-ready",{detail:{profile:profile||{},user:session.user}}));
  }
  async function savePlayerState(v){
    if(!client)return;
    const {data:{user}}=await client.auth.getUser(); if(!user)return;
    const payload={id:user.id,points:Math.max(0,Number(v.points)||0),rank:v.rank||"محقق متدرب",current_case:Math.max(0,Number(v.currentCase)||0),cases_solved:Math.max(0,Number(v.casesSolved)||0),updated_at:new Date().toISOString()};
    await client.from("player_profiles").update(payload).eq("id",user.id);
    profile={...(profile||{}),...payload};
  }
  async function saveCaseProgress(caseIndex,solved,earnedPoints){
    if(!client)return;
    const {data:{user}}=await client.auth.getUser(); if(!user)return;
    await client.from("game_progress").upsert({user_id:user.id,case_index:Number(caseIndex),solved:!!solved,earned_points:Number(earnedPoints)||0,solved_at:solved?new Date().toISOString():null,updated_at:new Date().toISOString()},{onConflict:"user_id,case_index"});
  }
  async function leaderboard(limit=20){
    if(!client)return[];
    const {data}=await client.from("player_profiles").select("username,country,points,rank,cases_solved").order("points",{ascending:false}).limit(limit);
    return data||[];
  }

  window.gameAuth={savePlayerState,saveCaseProgress,loadLeaderboard:leaderboard};

  if(!window.supabase||!cfg){status("تعذر تحميل خدمة تسجيل الدخول.",true);return}
  client=window.supabase.createClient(cfg.url,cfg.publishableKey);

  document.getElementById("showLogin").addEventListener("click",()=>showForm("login"));
  document.getElementById("showSignup").addEventListener("click",()=>showForm("signup"));
  document.querySelectorAll("[data-password-target]").forEach(btn=>btn.addEventListener("click",()=>{
    const input=document.getElementById(btn.dataset.passwordTarget); if(!input)return;
    input.type=input.type==="password"?"text":"password"; btn.textContent=input.type==="password"?"عرض":"إخفاء";
  }));

  document.getElementById("loginForm").addEventListener("submit",async e=>{
    e.preventDefault(); const f=new FormData(e.currentTarget); status("جارٍ تسجيل الدخول...");
    const {data,error}=await client.auth.signInWithPassword({email:String(f.get("email")||"").trim(),password:String(f.get("password")||"")});
    if(error)return status("بيانات الدخول غير صحيحة.",true); status(""); await enter(data.session);
  });

  document.getElementById("signupForm").addEventListener("submit",async e=>{
    e.preventDefault(); const f=new FormData(e.currentTarget);
    const body={displayName:String(f.get("displayName")||"").trim(),username:String(f.get("username")||"").trim(),country:String(f.get("country")||"").trim(),email:String(f.get("email")||"").trim().toLowerCase(),password:String(f.get("password")||"")};
    if(body.username.length<3||body.password.length<8)return status("اسم المحقق 3 أحرف على الأقل وكلمة المرور 8 أحرف على الأقل.",true);
    status("جارٍ إنشاء الحساب...");
    try{
      const res=await fetch(`${cfg.url}/functions/v1/signup-player`,{method:"POST",headers:{"Content-Type":"application/json","apikey":cfg.publishableKey},body:JSON.stringify(body)});
      const out=await res.json().catch(()=>({}));
      if(!res.ok)return status(out.message||"تعذر إنشاء الحساب.",true);
      const {data,error}=await client.auth.signInWithPassword({email:body.email,password:body.password});
      if(error)return status("تم إنشاء الحساب. انتقل لتسجيل الدخول.",false);
      status(""); await enter(data.session);
    }catch{status("تعذر الاتصال بخدمة إنشاء الحساب.",true)}
  });

  document.getElementById("logoutBtn").addEventListener("click",async()=>{await client.auth.signOut();location.reload()});
  client.auth.getSession().then(({data})=>{if(data.session)enter(data.session)});
})();