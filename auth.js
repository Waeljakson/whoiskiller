(() => {
  const config = window.SUPABASE_CONFIG || {};
  const configured = config.url && config.publishableKey && !config.url.includes('YOUR_') && !config.publishableKey.includes('YOUR_');
  const authGate = document.getElementById('authGate');
  const appShell = document.querySelector('.app-shell');
  const authStatus = document.getElementById('authStatus');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginTab = document.getElementById('showLogin');
  const signupTab = document.getElementById('showSignup');
  const logoutBtn = document.getElementById('logoutBtn');
  const headerPlayerName = document.getElementById('headerPlayerName');

  let client = null;
  let currentUser = null;
  let currentProfile = null;

  function status(message, isError = false) {
    authStatus.textContent = message || '';
    authStatus.classList.toggle('error', isError);
  }

  function switchForm(mode) {
    const login = mode === 'login';
    loginForm.classList.toggle('hidden', !login);
    signupForm.classList.toggle('hidden', login);
    loginTab.classList.toggle('active', login);
    signupTab.classList.toggle('active', !login);
    status('');
  }

  async function ensureProfile(user) {
    const { data, error } = await client
      .from('player_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    if (data) return data;

    const meta = user.user_metadata || {};
    const fallbackUsername = `detective_${user.id.replaceAll('-', '').slice(0, 8)}`;
    const payload = {
      id: user.id,
      display_name: meta.display_name || 'محقق جديد',
      username: meta.username || fallbackUsername,
      country: meta.country || 'غير محدد'
    };

    const { data: created, error: insertError } = await client
      .from('player_profiles')
      .insert(payload)
      .select('*')
      .single();

    if (insertError) throw insertError;
    return created;
  }

  async function enterGame(session) {
    if (!session?.user) {
      currentUser = null;
      currentProfile = null;
      appShell.classList.add('game-locked');
      authGate.classList.remove('hidden');
      logoutBtn.classList.add('hidden');
      headerPlayerName.textContent = 'زائر';
      return;
    }

    try {
      currentUser = session.user;
      currentProfile = await ensureProfile(session.user);
      headerPlayerName.textContent = currentProfile.username;
      logoutBtn.classList.remove('hidden');
      authGate.classList.add('hidden');
      appShell.classList.remove('game-locked');

      window.dispatchEvent(new CustomEvent('player-ready', {
        detail: { user: currentUser, profile: currentProfile }
      }));
    } catch (error) {
      console.error(error);
      status('تعذر تحميل ملف اللاعب: ' + (error.message || 'خطأ غير معروف'), true);
      authGate.classList.remove('hidden');
      appShell.classList.add('game-locked');
    }
  }

  async function savePlayerState({ points, rank, currentCase, casesSolved }) {
    if (!client || !currentUser) return;
    const { error } = await client
      .from('player_profiles')
      .update({
        points: Math.max(0, Number(points) || 0),
        rank: rank || 'محقق مبتدئ',
        current_case: Math.max(0, Number(currentCase) || 0),
        cases_solved: Math.max(0, Number(casesSolved) || 0),
        updated_at: new Date().toISOString()
      })
      .eq('id', currentUser.id);

    if (error) console.error('savePlayerState', error);
  }

  async function saveCaseProgress(caseIndex, solved, earnedPoints) {
    if (!client || !currentUser) return;
    const payload = {
      user_id: currentUser.id,
      case_index: Math.max(0, Number(caseIndex) || 0),
      solved: Boolean(solved),
      earned_points: Math.max(0, Number(earnedPoints) || 0),
      solved_at: solved ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    };
    const { error } = await client
      .from('game_progress')
      .upsert(payload, { onConflict: 'user_id,case_index' });
    if (error) console.error('saveCaseProgress', error);
  }

  async function loadLeaderboard(limit = 10) {
    if (!client || !currentUser) return [];
    const { data, error } = await client
      .from('player_profiles')
      .select('username,country,points,rank')
      .order('points', { ascending: false })
      .limit(limit);
    if (error) {
      console.error('loadLeaderboard', error);
      return [];
    }
    return data || [];
  }

  window.gameAuth = {
    get user() { return currentUser; },
    get profile() { return currentProfile; },
    savePlayerState,
    saveCaseProgress,
    loadLeaderboard
  };

  loginTab.addEventListener('click', () => switchForm('login'));
  signupTab.addEventListener('click', () => switchForm('signup'));

  if (!configured || !window.supabase?.createClient) {
    appShell.classList.add('game-locked');
    authGate.classList.remove('hidden');
    status('قاعدة البيانات لم يتم ربطها بالموقع بعد. سيتم تفعيل التسجيل بعد إنشاء مشروع Supabase الخاص باللعبة.', true);
    [...loginForm.elements, ...signupForm.elements].forEach(el => el.disabled = true);
    return;
  }

  client = window.supabase.createClient(config.url, config.publishableKey);

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    status('جارٍ تسجيل الدخول...');
    const form = new FormData(loginForm);
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');

    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      status('تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور.', true);
      return;
    }
    status('');
    await enterGame(data.session);
  });

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    status('جارٍ إنشاء حساب المحقق...');
    const form = new FormData(signupForm);
    const displayName = String(form.get('displayName') || '').trim();
    const username = String(form.get('username') || '').trim();
    const country = String(form.get('country') || '').trim();
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');

    if (displayName.length < 2) return status('أدخل الاسم بشكل صحيح.', true);
    if (!/^[A-Za-z0-9_\-]{3,24}$/.test(username)) return status('اسم المحقق يجب أن يكون 3-24 حرفاً إنجليزياً/رقماً ويمكن استخدام _ أو -.', true);
    if (country.length < 2) return status('أدخل الدولة.', true);
    if (password.length < 8) return status('كلمة المرور يجب ألا تقل عن 8 أحرف.', true);

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName, username, country } }
    });

    if (error) {
      if ((error.message || '').toLowerCase().includes('duplicate')) {
        status('تعذر إنشاء الحساب. جرّب بريداً أو اسم محقق مختلفاً.', true);
      } else {
        status('تعذر إنشاء الحساب: ' + error.message, true);
      }
      return;
    }

    if (data.session) {
      status('تم إنشاء الحساب بنجاح.');
      await enterGame(data.session);
    } else {
      status('تم إنشاء الحساب. راجع بريدك الإلكتروني لتأكيد الحساب ثم سجّل الدخول.');
      switchForm('login');
    }
  });

  logoutBtn.addEventListener('click', async () => {
    await client.auth.signOut();
    await enterGame(null);
  });

  client.auth.onAuthStateChange((_event, session) => {
    enterGame(session);
  });

  client.auth.getSession().then(({ data }) => enterGame(data.session));
})();
