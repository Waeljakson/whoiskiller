(()=>{
const cfg=window.SUPABASE_CONFIG, gate=document.getElementById("authGate"), app=document.querySelector(".app-shell"), status=document.getElementById("authStatus");
let client=null,profile=null,currentUser=null;
function msg(t,e=false){status.textContent=t||"";status.classList.toggle("error",e)}
function toggle(login){document.getElementById("loginForm").classList.toggle("hidden",!login);document.getElementById("signupForm").classList.toggle("hidden",login);document.getElementById("showLogin").classList.toggle("active",login);document.getElementById("showSignup").classList.toggle("active",!login);msg("")}
async function loadProfile(user){const {data,error}=await client.from("player_profiles").select("*").eq("id",user.id).maybeSingle();if(error)console.error(error);profile=data||{};currentUser=user;return profile}
async function enter(session){if(!session?.user)return;await loadProfile(session.user);gate.classList.add("hidden");app.classList.remove("game-locked");document.getElementById("logoutBtn").classList.remove("hidden");document.getElementById("headerPlayerName").textContent=profile.username||session.user.email.split("@")[0];window.dispatchEvent(new CustomEvent("player-ready",{detail:{profile,user:session.user}}))}
async function leaders(){const {data}=await client.from("player_profiles").select("username,country,points,rank,cases_solved").order("points",{ascending:false}).limit(15);return data||[]}
async function completeCurrentCase(caseIndex){const {data,error}=await client.rpc("complete_current_case",{p_case_index:Number(caseIndex)});if(error)throw error;await loadProfile(currentUser);return data}
async function markTutorialSeen(){const {data,error}=await client.rpc("mark_tutorial_seen");if(error)throw error;if(profile)profile.tutorial_seen=true;return data}
async function loadStoreItems(){const {data,error}=await client.from("store_items").select("id,name_ar,description_ar,price_credits,item_type,effect_code,icon,sort_order").eq("is_active",true).order("sort_order");if(error)throw error;return data||[]}
async function loadInventory(){const {data,error}=await client.from("player_inventory").select("item_id,quantity,updated_at").gt("quantity",0);if(error)throw error;return data||[]}
async function purchaseStoreItem(itemId){const {data,error}=await client.rpc("purchase_store_item",{p_item_id:itemId});if(error)throw error;await loadProfile(currentUser);return data}
async function consumeStoreItem(itemId){const {data,error}=await client.rpc("consume_store_item",{p_item_id:itemId});if(error)throw error;return data}
async function loadWallet(){const {data,error}=await client.from("wallet_transactions").select("amount,balance_after,transaction_type,reference,created_at").order("created_at",{ascending:false}).limit(20);if(error)throw error;return data||[]}
function getProfile(){return profile||{}}
window.gameAuth={loadLeaderboard:leaders,completeCurrentCase,markTutorialSeen,loadStoreItems,loadInventory,purchaseStoreItem,consumeStoreItem,loadWallet,getProfile};

if(!window.supabase||!cfg){msg("تعذر تحميل Supabase",true);return}
client=window.supabase.createClient(cfg.url,cfg.publishableKey);
showLogin.onclick=()=>toggle(true);showSignup.onclick=()=>toggle(false);
loginForm.onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget);msg("جارٍ الدخول...");const {data,error}=await client.auth.signInWithPassword({email:f.get("email"),password:f.get("password")});if(error)return msg("بيانات الدخول غير صحيحة",true);msg("");await enter(data.session)};
signupForm.onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget),body={displayName:f.get("displayName"),username:f.get("username"),country:f.get("country"),email:f.get("email"),password:f.get("password")};msg("جارٍ إنشاء الحساب...");const r=await fetch(`${cfg.url}/functions/v1/signup-player`,{method:"POST",headers:{"Content-Type":"application/json","apikey":cfg.publishableKey},body:JSON.stringify(body)});const o=await r.json().catch(()=>({}));if(!r.ok)return msg(o.message||"تعذر إنشاء الحساب",true);const {data,error}=await client.auth.signInWithPassword({email:body.email,password:body.password});if(error)return msg("تم إنشاء الحساب. سجل الدخول.",false);msg("");await enter(data.session)};
logoutBtn.onclick=async()=>{await client.auth.signOut();location.reload()};
client.auth.getSession().then(({data})=>data.session&&enter(data.session));
})();