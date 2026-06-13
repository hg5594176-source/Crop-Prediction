/* =============================================
   AUTH.JS — Supabase Authentication
   AI Crop Dashboard
   ============================================= */

/* ---- Show / Hide Auth Overlay ---- */
function showAuthOverlay() {
  const overlay = document.getElementById('authOverlay');
  if (overlay) overlay.style.display = 'flex';
}

function hideAuthOverlay() {
  const overlay = document.getElementById('authOverlay');
  if (overlay) overlay.style.display = 'none';
}

/* ---- Tab Switching ---- */
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`${tab}Form`).classList.add('active');
}

/* ---- Sign Up (Supabase) ---- */
async function handleSignUp(e) {
  e.preventDefault();
  const name     = document.getElementById('signupName').value.trim();
  const email    = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;
  const confirm  = document.getElementById('signupConfirm').value;
  const errEl    = document.getElementById('signupError');
  const btn      = e.target.querySelector('button[type=submit]');

  errEl.classList.remove('show');

  if (!name || !email || !password || !confirm) {
    return showAuthError(errEl, 'All fields are required.');
  }
  if (!isValidEmail(email)) {
    return showAuthError(errEl, 'Please enter a valid email address.');
  }
  if (password.length < 6) {
    return showAuthError(errEl, 'Password must be at least 6 characters.');
  }
  if (password !== confirm) {
    return showAuthError(errEl, 'Passwords do not match.');
  }

  btn.textContent = 'Creating account...';
  btn.disabled = true;

  const { data, error } = await _supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }
    }
  });

  btn.disabled = false;
  btn.textContent = 'Create Account →';

  if (error) {
    return showAuthError(errEl, error.message);
  }

  // Supabase may require email confirmation depending on settings
  if (data?.user?.identities?.length === 0) {
    return showAuthError(errEl, 'An account with this email already exists. Please sign in.');
  }

  showToast('success', `Welcome, ${name}! Account created. 🌾`);

  // If email confirmation is disabled in Supabase, user is signed in immediately
  if (data.session) {
    hideAuthOverlay();
    updateSidebarUser(data.user, name);
    onPageInit();
  } else {
    showAuthError(errEl,
      '✅ Account created! Check your email to confirm, then sign in.',
      true
    );
    switchAuthTab('signin');
  }
}

/* ---- Sign In (Supabase) ---- */
async function handleSignIn(e) {
  e.preventDefault();
  const email    = document.getElementById('signinEmail').value.trim().toLowerCase();
  const password = document.getElementById('signinPassword').value;
  const errEl    = document.getElementById('signinError');
  const btn      = e.target.querySelector('button[type=submit]');

  errEl.classList.remove('show');

  if (!email || !password) {
    return showAuthError(errEl, 'Please enter your email and password.');
  }

  btn.textContent = 'Signing in...';
  btn.disabled = true;

  const { data, error } = await _supabase.auth.signInWithPassword({ email, password });

  btn.disabled = false;
  btn.textContent = 'Sign In →';

  if (error) {
    // Special handling for unconfirmed email
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return showAuthError(errEl,
        '📧 Email not yet confirmed. Please check your inbox and click the confirmation link sent by Supabase, then try signing in again. ' +
        'Alternatively, in your Supabase dashboard → Authentication → Settings → disable "Enable email confirmations".',
        false
      );
    }
    return showAuthError(errEl, error.message);
  }

  const name = data.user?.user_metadata?.full_name || email.split('@')[0];
  showToast('success', `Welcome back, ${name}! 🌾`);
  hideAuthOverlay();
  updateSidebarUser(data.user, name);
  onPageInit();
}

/* ---- Logout (Supabase) ---- */
async function handleLogout() {
  await _supabase.auth.signOut();
  showAuthOverlay();
  updateSidebarUser(null, null);
  showToast('info', 'Signed out successfully.');
}

/* ---- Update Sidebar UI ---- */
function updateSidebarUser(user, name) {
  const displayName = name
    || user?.user_metadata?.full_name
    || (user?.email ? user.email.split('@')[0] : 'Farmer');

  const nameEl  = document.getElementById('sidebarUserName');
  const initEl  = document.getElementById('sidebarUserInit');
  const emailEl = document.getElementById('sidebarEmail');

  if (nameEl)  nameEl.textContent  = user ? displayName : 'Guest';
  if (initEl)  initEl.textContent  = user ? displayName.charAt(0).toUpperCase() : 'G';
  if (emailEl) emailEl.textContent = user ? (user.email || '—') : 'Not signed in';

  // Toggle user badge status dot classes
  const badge = document.querySelector('.user-badge');
  if (badge) {
    if (user) {
      badge.classList.add('logged-in');
    } else {
      badge.classList.remove('logged-in');
    }
  }
}

/* ---- Get Current Session ---- */
async function getCurrentUser() {
  const { data: { session } } = await _supabase.auth.getSession();
  return session ? session.user : null;
}

/* ---- Auth Init (called on page load) ---- */
async function initAuth() {
  // Bind tab switching
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
  });

  // Bind forms
  const signupForm = document.getElementById('signupForm');
  const signinForm = document.getElementById('signinForm');
  if (signupForm) signupForm.addEventListener('submit', handleSignUp);
  if (signinForm) signinForm.addEventListener('submit', handleSignIn);

  // Bind logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

  // Listen for auth state changes (handles token refresh, tab sync)
  _supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      hideAuthOverlay();
      updateSidebarUser(session.user, null);
    } else if (event === 'SIGNED_OUT') {
      showAuthOverlay();
      updateSidebarUser(null, null);
    }
  });

  // Check existing session
  const user = await getCurrentUser();
  if (user) {
    hideAuthOverlay();
    updateSidebarUser(user, null);
    return user;
  } else {
    showAuthOverlay();
    return null;
  }
}

/* ---- Dark Mode ---- */
function initDarkMode() {
  const toggle = document.getElementById('darkToggle');
  const themeText = document.getElementById('themeText');
  const isDark = localStorage.getItem('acd_dark') === 'true';

  const updateLabel = (dark) => {
    if (themeText) themeText.textContent = dark ? 'Dark Mode' : 'Light Mode';
  };

  if (isDark) {
    document.body.classList.add('dark-mode');
    if (toggle) toggle.checked = true;
    updateLabel(true);
  } else {
    updateLabel(false);
  }

  if (toggle) {
    toggle.addEventListener('change', () => {
      const dark = toggle.checked;
      document.body.classList.toggle('dark-mode', dark);
      localStorage.setItem('acd_dark', dark);
      updateLabel(dark);
    });
  }
}

/* ---- Helpers ---- */
function showAuthError(el, msg, isSuccess = false) {
  el.textContent = msg;
  el.style.background    = isSuccess ? 'rgba(34,197,94,0.1)'  : '';
  el.style.borderColor   = isSuccess ? 'rgba(34,197,94,0.3)'  : '';
  el.style.color         = isSuccess ? 'var(--success)'        : '';
  el.classList.add('show');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Placeholder — overridden per page
function onPageInit() {}
