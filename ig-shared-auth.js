// ── INFINITY SOLUTIONS SHARED AUTH BRIDGE ──
// Add this script tag to any subscription app page, right before </body>
// It auto-logs in users who are already signed in on the account page

(function() {
  const SB_KEY = 'sb-zcvkgevcrgsujnqovxgd-auth-token';
  const ACCOUNT_URL = 'https://contactinfinitysolutionsllc-ops.github.io/account/';

  function getSharedSession() {
    try {
      const raw = localStorage.getItem(SB_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const sess = parsed?.currentSession || parsed?.session || parsed;
      const user = sess?.user;
      const token = sess?.access_token;
      // Check token not expired
      const exp = sess?.expires_at;
      if (exp && Date.now() / 1000 > exp) return null;
      if (user?.email && token) {
        return {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0],
          token
        };
      }
    } catch(e) {}
    return null;
  }

  function updateNavForLoggedInUser(email) {
    // Replace Sign in / Start free buttons with account link
    const btns = document.querySelector('.land-nav-btns');
    if (!btns) return;
    btns.innerHTML =
      '<a href="' + ACCOUNT_URL + '" ' +
      'style="display:inline-flex;align-items:center;gap:.4rem;font-family:Syne,sans-serif;' +
      'font-weight:700;font-size:.82rem;color:var(--text);text-decoration:none;' +
      'background:rgba(240,180,41,.1);border:1px solid rgba(240,180,41,.22);' +
      'padding:.45rem 1.1rem;border-radius:100px">' +
      '<span style="width:22px;height:22px;border-radius:50%;background:rgba(240,180,41,.2);' +
      'display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;color:var(--accent);">' +
      email[0].toUpperCase() + '</span> My Account</a>' +
      '<button class="btn-n btn-n-solid" onclick="showScreen(\'app\')">Open App →</button>';
  }

  window.addEventListener('DOMContentLoaded', function() {
    // Small delay to let the page's own DOMContentLoaded run first
    setTimeout(function() {
      // If already in app (own session restored), just update nav
      if (typeof currentUser !== 'undefined' && currentUser && currentUser.email) {
        updateNavForLoggedInUser(currentUser.email);
        return;
      }

      // Try shared session
      var shared = getSharedSession();
      if (!shared) return;

      // Store email for subscription checks
      localStorage.setItem('ig_account_email', shared.email);

      // Auto-login if the page has loginSuccess function
      if (typeof loginSuccess === 'function') {
        loginSuccess(shared, shared.token, shared.name);
        updateNavForLoggedInUser(shared.email);
      }
    }, 100);
  });
})();
