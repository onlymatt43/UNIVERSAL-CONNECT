(function () {
  const TARGET_TEXT = 'CONNECT TO SUBSCRIBE';

  // Container button (pill) with glossy yellow style
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-label', 'Connect to subscribe');
  btn.style.cssText = [
    'position:fixed', 'top:20px', 'right:20px', 'z-index:99999',
    'height:56px', 'min-width:300px', 'max-width:80vw', 'padding:0 18px',
    'border-radius:9999px', 'border:none', 'overflow:hidden',
    'background: radial-gradient(circle at 30% 30%, #fff 0%, #FFE35C 55%, #FFC107 100%)',
    'color:#111', 'font-weight:700', 'font-size:14px', 'letter-spacing:0.5px', 'text-transform:uppercase',
    'box-shadow:0 8px 20px rgba(0,0,0,0.25)', 'cursor:pointer',
    'display:flex', 'align-items:center', 'justify-content:center', 'gap:8px',
    'transition: transform 120ms ease'
  ].join(';');

  btn.addEventListener('mouseenter', () => { btn.style.transform = 'scale(1.04)'; });
  btn.addEventListener('mouseleave', () => { btn.style.transform = 'scale(1.0)'; });

  // Animated label
  const label = document.createElement('span');
  label.style.cssText = [
    'position:absolute', 'inset:0', 'display:flex', 'align-items:center', 'justify-content:center',
    'padding:0 18px', 'pointer-events:none', 'user-select:none'
  ].join(';');
  btn.appendChild(label);

  // Input overlay (shown on hover/focus)
  const inputWrap = document.createElement('div');
  inputWrap.style.cssText = [
    'position:absolute', 'inset:0', 'display:flex', 'align-items:center', 'justify-content:center',
    'opacity:0', 'pointer-events:none', 'transition: opacity 160ms ease'
  ].join(';');

  const input = document.createElement('input');
  input.type = 'email';
  input.placeholder = 'Votre email';
  input.autocomplete = 'email';
  input.inputMode = 'email';
  input.style.cssText = [
    'height:38px', 'width:84%', 'max-width:520px',
    'background:rgba(255,255,255,0.95)', 'border:none', 'border-radius:9999px',
    'padding:0 16px', 'font-size:14px', 'color:#111', 'outline:none',
    'box-shadow: inset 0 1px 2px rgba(0,0,0,0.12)'
  ].join(';');

  inputWrap.appendChild(input);
  btn.appendChild(inputWrap);

  // Status message (success/error)
  const status = document.createElement('span');
  status.style.cssText = [
    'position:absolute', 'inset:0', 'display:flex', 'align-items:center', 'justify-content:center',
    'opacity:0', 'pointer-events:none', 'transition: opacity 160ms ease',
    'font-weight:700'
  ].join(';');
  btn.appendChild(status);

  // Mount button into page
  document.body.appendChild(btn);

  // Subtle glossy highlight drift (very slow, barely noticeable)
  (function glossyDrift() {
    let theta = 0; // phase
    const baseX = 30; // base center in percent
    const baseY = 30;
    const amp = 2.2; // tiny amplitude in percent
    const tickMs = 140; // slow cadence

    function step() {
      theta += 0.004; // hyper slow progression
      const x = baseX + Math.sin(theta) * amp;
      const y = baseY + Math.cos(theta * 0.85) * amp;
      btn.style.background = `radial-gradient(circle at ${x}% ${y}%, #fff 0%, #FFE35C 55%, #FFC107 100%)`;
      setTimeout(() => requestAnimationFrame(step), tickMs);
    }
    requestAnimationFrame(step);
  })();

  // Animation: appear/disappear 1-3 letters at a time, looping
  let visibleLen = 0;
  let mode = 'type'; // 'type' | 'delete'
  let pausedUntil = 0;

  function animateLabel(now) {
    if (!now) now = performance.now();
    if (now < pausedUntil) {
      requestAnimationFrame(animateLabel);
      return;
    }
    const step = 1 + Math.floor(Math.random() * 3); // 1..3
    if (mode === 'type') {
      visibleLen = Math.min(TARGET_TEXT.length, visibleLen + step);
      if (visibleLen === TARGET_TEXT.length) {
        pausedUntil = now + 900; // pause at full
        mode = 'delete';
      }
    } else {
      visibleLen = Math.max(0, visibleLen - step);
      if (visibleLen === 0) {
        pausedUntil = now + 500; // pause at empty
        mode = 'type';
      }
    }
    label.textContent = TARGET_TEXT.slice(0, visibleLen);
    setTimeout(() => requestAnimationFrame(animateLabel), 110); // cadence
  }
  requestAnimationFrame(animateLabel);

  // Hover shows input overlay (same size as button)
  let showingInput = false;
  function showInput() {
    if (showingInput) return;
    showingInput = true;
    label.style.opacity = '0';
    inputWrap.style.opacity = '1';
    inputWrap.style.pointerEvents = 'auto';
    // Focus after a tick to ensure visibility
    setTimeout(() => input.focus(), 10);
  }
  function hideInput() {
    showingInput = false;
    inputWrap.style.opacity = '0';
    inputWrap.style.pointerEvents = 'none';
    label.style.opacity = '1';
  }

  btn.addEventListener('mouseenter', showInput);
  btn.addEventListener('mouseleave', () => {
    if (document.activeElement !== input) hideInput();
  });
  input.addEventListener('blur', () => {
    // Small delay to allow clicking back
    setTimeout(() => { if (!btn.matches(':hover')) hideInput(); }, 50);
  });

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function setStatus(msg, color) {
    status.textContent = msg;
    status.style.color = color || '#111';
    status.style.opacity = '1';
    label.style.opacity = '0';
    inputWrap.style.opacity = '0';
    inputWrap.style.pointerEvents = 'none';
    setTimeout(() => { status.style.opacity = '0'; }, 1600);
  }

  async function submitEmail() {
    const email = (input.value || '').trim();
    if (!validateEmail(email)) {
      input.style.boxShadow = '0 0 0 2px rgba(244,67,54,0.55), inset 0 1px 2px rgba(0,0,0,0.12)';
      return;
    }
    input.disabled = true;
    btn.style.cursor = 'progress';
    try {
      const res = await fetch('https://universal-connect.vercel.app/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: window.location.hostname })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.status === 'success' || data.status === 'already')) {
        localStorage.setItem('hasSubscribed', 'true');
        setStatus(data.status === 'already' ? 'Déjà inscrit ✔' : 'Merci ✔', '#0A8F08');
        input.value = '';
      } else {
        setStatus('Erreur', '#B00020');
      }
    } catch (e) {
      setStatus('Erreur', '#B00020');
    } finally {
      btn.style.cursor = 'pointer';
      input.disabled = false;
      // Return to label after message fades
      setTimeout(() => { if (!showingInput) label.style.opacity = '1'; }, 1700);
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitEmail();
    }
  });
  input.addEventListener('input', () => {
    input.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.12)';
  });
})();
