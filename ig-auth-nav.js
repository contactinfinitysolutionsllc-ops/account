<!--
  ig-auth-nav.js — Infinity Solutions shared auth snippet
  Drop this script tag into any app page, right before </body>
  It adds account awareness to the existing nav without changing layout.

  Usage:
  <script src="https://contactinfinitysolutionsllc-ops.github.io/account/ig-auth-nav.js"></script>

  What it does:
  - Checks if user is logged in via Supabase
  - If logged in: adds "👤 Your Account" link to .nav-right
  - If not: adds "Sign In" link pointing to account page
  - Stores email in localStorage as ig_account_email for subscription checks
-->
<script>
(function() {
  const SUPABASE_URL = 'https://zcvkgevcrgsujnqovxgd.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_WeAsyK0Xo7G-VbhIwFUlNQ_pGNmu75T';
  const ACCOUNT_URL  = 'https://contactinfinitysolutionsllc-ops.github.io/account/';

  // Load Supabase if not already loaded
  function loadSupabase() {
    return new Promise((resolve) => {
      if (window.supabase && window.supabase.createClient) { resolve(); return; }
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.onload = resolve;
      document.head.appendChild(s);
    });
  }

  function addNavItem(html) {
    const navRight = document.querySelector('.nav-right');
    if (!navRight) return;
    const div = document.createElement('div');
    div.innerHTML = html;
    // Insert before the nav-badge (last child usually)
    const badge = navRight.querySelector('.nav-badge');
    if (badge) navRight.insertBefore(div.firstChild, badge);
    else navRight.appendChild(div.firstChild);
  }

  loadSupabase().then(async () => {
    const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data: { session } } = await sb.auth.getSession();

    if (session && session.user) {
      const email = session.user.email;
      localStorage.setItem('ig_account_email', email);

      // Add account link with initial letter avatar
      addNavItem(`
        <a href="${ACCOUNT_URL}" style="
          display:inline-flex;align-items:center;gap:.4rem;
          font-size:.78rem;color:var(--muted2,#a0a8c0);text-decoration:none;
          background:rgba(79,142,255,.08);border:1px solid rgba(79,142,255,.18);
          border-radius:100px;padding:.22rem .7rem .22rem .3rem;transition:all .18s;
        " onmouseover="this.style.color='var(--text,#f0f2f8)'" onmouseout="this.style.color='var(--muted2,#a0a8c0)'">
          <span style="
            width:20px;height:20px;border-radius:50%;
            background:rgba(79,142,255,.2);
            display:inline-flex;align-items:center;justify-content:center;
            font-family:'Syne',sans-serif;font-weight:800;font-size:.65rem;
            color:#7eb0ff;flex-shrink:0;
          ">${email[0].toUpperCase()}</span>
          Account
        </a>
      `);
    } else {
      // Not logged in - show Sign In link
      addNavItem(`
        <a href="${ACCOUNT_URL}" style="
          font-size:.78rem;color:var(--muted2,#a0a8c0);text-decoration:none;transition:color .18s;
        " onmouseover="this.style.color='var(--text,#f0f2f8)'" onmouseout="this.style.color='var(--muted2,#a0a8c0)'">
          Sign in
        </a>
      `);
    }
  });
})();
</script>
