(()=>{
const cfg=window.SUPABASE_CONFIG, gate=document.getElementById("authGate"), app=document.querySelector(".app-shell"), status=document.getElementById("authStatus");
let client=null,profile=null;
function msg(t,e=false){status.textContent=t||"";status.classList.toggle("error",e)}
function toggle(login){document.getElementById("loginForm").classList.toggle("hidden",!login);document.getElementById("signupForm").classList.toggle("hidden",login);document.getElementById("showLogin").classList.toggle("active",login);document.getElementById("showSignup").classList.toggle("active",!login);msg("")}
async function loadProfile(user){const {data}=await client.from("player_profiles").select("*").eq("id",user.id).maybeSingle();profile=data||{};return profile}
async function enter(session){if(!session?.user)return;await loadProfile(session.user);gate.classList.add("hidden");app.classList.remove("game-locked");document.getElementById("logoutBtn").classList.remove("hidden");document.getElementById("headerPlayerName").textContent=profile.username||session.user.email.split("@")[0];window.dispatchEvent(new CustomEvent("player-ready",{detail:{profile,user:session.user}}))}
async function save(v){const {data:{user}}=await client.auth.getUser();if(!user)return;await client.from("player_profiles").update({points:v.points,rank:v.rank,current_case:v.currentCase,cases_solved:v.casesSolved,updated_at:new Date().toISOString()}).eq("id",user.id)}
async function progress(i,solved,pts){const {data:{user}}=await client.auth.getUser();if(!user)return;await client.from("game_progress").upsert({user_id:user.id,case_index:i,solved,earned_points:pts,updated_at:new Date().toISOString(),solved_at:solved?new Date().toISOString():null},{onConflict:"user_id,case_index"})}
async function leaders(){const {data}=await client.from("player_profiles").select("username,country,points,rank").order("points",{ascending:false}).limit(15);return data||[]}
window.gameAuth={savePlayerState:save,saveCaseProgress:progress,loadLeaderboard:leaders};
if(!window.supabase||!cfg){msg("تعذر تحميل Supabase",true);return}
client=window.supabase.createClient(cfg.url,cfg.publishableKey);
showLogin.onclick=()=>toggle(true);showSignup.onclick=()=>toggle(false);
loginForm.onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget);msg("جارٍ الدخول...");const {data,error}=await client.auth.signInWithPassword({email:f.get("email"),password:f.get("password")});if(error)return msg("بيانات الدخول غير صحيحة",true);await enter(data.session)};
signupForm.onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget),body={displayName:f.get("displayName"),username:f.get("username"),country:f.get("country"),email:f.get("email"),password:f.get("password")};msg("جارٍ إنشاء الحساب...");const r=await fetch(`${cfg.url}/functions/v1/signup-player`,{method:"POST",headers:{"Content-Type":"application/json","apikey":cfg.publishableKey},body:JSON.stringify(body)});const o=await r.json().catch(()=>({}));if(!r.ok)return msg(o.message||"تعذر إنشاء الحساب",true);const {data,error}=await client.auth.signInWithPassword({email:body.email,password:body.password});if(error)return msg("تم إنشاء الحساب. سجل الدخول.",false);await enter(data.session)};
logoutBtn.onclick=async()=>{await client.auth.signOut();location.reload()};
client.auth.getSession().then(({data})=>data.session&&enter(data.session));
})();