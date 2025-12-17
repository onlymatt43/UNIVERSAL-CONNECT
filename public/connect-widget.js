(function () {
  const TARGET_TEXT = 'CONNECT TO SUBSCRIBE';

  // Container button (fixed circular) with glossy yellow style
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-label', 'Connect to subscribe');
  btn.style.cssText = [
    'position:fixed', 'top:20px', 'right:20px', 'z-index:99999',
    'width:60px', 'height:60px', 'padding:0',
    'border-radius:50%', 'border:none', 'overflow:hidden',
    'background: radial-gradient(circle at 30% 30%, #fff 0%, #FFE35C 55%, #FFC107 100%)',
    'color:#111', 'font-weight:700', 'font-size:11px', 'letter-spacing:0.5px', 'text-transform:uppercase',
    'box-shadow:0 8px 20px rgba(0,0,0,0.25)', 'cursor:pointer',
    'display:flex', 'align-items:center', 'justify-content:center',
    'transition: transform 120ms ease'
  ].join(';');

  // Subtle breathing (scale + micro-rotation) that composes with hover
  let hover = false;
  btn.addEventListener('mouseenter', () => { hover = true; });
  btn.addEventListener('mouseleave', () => { hover = false; });

  // Animated label (short substrings fit inside the circle)
  const label = document.createElement('span');
  label.style.cssText = [
    'position:absolute', 'inset:0', 'display:flex', 'align-items:center', 'justify-content:center',
    'padding:0 6px', 'text-align:center', 'pointer-events:none', 'user-select:none',
    'line-height:1', 'white-space:nowrap'
  ].join(';');
  btn.appendChild(label);

  // Input overlay (shown on hover/focus), can extend beyond circle
  const inputWrap = document.createElement('div');
  inputWrap.style.cssText = [
    'position:absolute', 'top:50%', 'left:50%', 'transform:translate(-50%,-50%)',
    'display:flex', 'align-items:center', 'justify-content:center',
    'opacity:0', 'pointer-events:none', 'transition: opacity 160ms ease', 'z-index:2'
  ].join(';');

  const input = document.createElement('input');
  input.type = 'email';
  input.placeholder = 'EMAIL';
  input.autocomplete = 'email';
  input.inputMode = 'email';
  input.style.cssText = [
    'height:30px',
    'background:rgba(255,255,255,0.95)', 'border:none', 'border-radius:9999px',
    'padding:0 10px', 'font-size:12px', 'color:#111', 'outline:none',
    'box-shadow: inset 0 1px 2px rgba(0,0,0,0.12)'
  ].join(';');

  inputWrap.appendChild(input);
  btn.appendChild(inputWrap);

  // Hidden sizer to compute natural width of email
  const sizer = document.createElement('span');
  sizer.style.cssText = [
    'position:absolute', 'visibility:hidden', 'white-space:pre', 'pointer-events:none',
    'font-size:12px', 'font-family:inherit', 'font-weight:400'
  ].join(';');
  document.body.appendChild(sizer);

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

  // Breathing transform loop (micro rotation + scale), independent cadence
  (function breathing() {
    let t = 0;
    function step() {
      t += 0.05; // slow
      const breath = 1 + 0.005 * Math.sin(t); // ~0.5%
      const rot = 0.5 * Math.sin(t * 0.7); // +/- 0.5deg
      const scale = (hover ? 1.04 : 1.0) * breath;
      btn.style.transform = `rotate(${rot.toFixed(3)}deg) scale(${scale.toFixed(3)})`;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  })();

  // Animation: organic scramble revealing short substrings inside the circle
  const scramble = (function organicScramble() {
    const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let SCR_TARGET = TARGET_TEXT.toUpperCase();
    let PADDED = (SCR_TARGET + '   ' + SCR_TARGET).toUpperCase();
    let start = 0;
    let length = 3; // will vary between 3..5
    let settleFrames = 14; // frames to settle into target
    let frame = 0;
    let target = PADDED.slice(start, start + length);
    let current = new Array(length).fill(' ');
    let settled = new Array(length).fill(false);

    function reseedWindow() {
      start = (start + 1 + Math.floor(Math.random() * 2)) % SCR_TARGET.length;
      length = 3 + Math.floor(Math.random() * 3); // 3..5
      target = PADDED.slice(start, start + length);
      current = new Array(length).fill(' ');
      settled = new Array(length).fill(false);
      frame = 0;
    }

    function setTarget(t) {
      SCR_TARGET = (t || TARGET_TEXT).toUpperCase();
      PADDED = (SCR_TARGET + '   ' + SCR_TARGET).toUpperCase();
      reseedWindow();
    }

    function tick() {
      frame++;
      const p = Math.min(1, frame / settleFrames);
      for (let i = 0; i < length; i++) {
        if (settled[i]) continue;
        if (Math.random() < p * 0.55 + (target[i] === ' ' ? 0.3 : 0)) {
          current[i] = target[i];
          settled[i] = true;
        } else {
          current[i] = ABC[Math.floor(Math.random() * ABC.length)];
        }
      }
      label.textContent = current.join('');
      if (settled.every(Boolean)) {
        setTimeout(() => { reseedWindow(); requestAnimationFrame(tick); }, 500 + Math.random() * 500);
      } else {
        setTimeout(() => requestAnimationFrame(tick), 60 + Math.random() * 40);
      }
    }

    requestAnimationFrame(tick);
    return { setTarget };
  })();

  // Hover shows input overlay (same size as button)
  let showingInput = false;
  function showInput() {
    if (showingInput) return;
    showingInput = true;
    label.style.opacity = '0';
    inputWrap.style.opacity = '1';
    inputWrap.style.pointerEvents = 'auto';
    btn.style.overflow = 'visible';
    // Focus after a tick to ensure visibility
    setTimeout(() => { resizeToContent(); input.focus(); }, 10);
  }
  function hideInput() {
    showingInput = false;
    inputWrap.style.opacity = '0';
    inputWrap.style.pointerEvents = 'none';
    label.style.opacity = '1';
    btn.style.overflow = 'hidden';
    // Switch to YOU'RE AWSOME for a short while, then revert
    scramble.setTarget("YOU'RE AWSOME");
    setTimeout(() => scramble.setTarget('CONNECT TO SUBSCRIBE'), 3000);
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

  // Auto-submit after short pause when valid, still supports Enter
  let autoTimer = null;
  function scheduleAutoSubmit() {
    if (autoTimer) clearTimeout(autoTimer);
    if (validateEmail(input.value.trim())) {
      autoTimer = setTimeout(() => submitEmail(), 800); // 0.8s debounce
    }
  }

  // Resize input to content width
  function resizeToContent() {
    const text = (input.value && input.value.trim()) ? input.value.trim() : input.placeholder;
    sizer.textContent = text;
    const natural = Math.ceil(sizer.getBoundingClientRect().width);
    const padding = 20; // 10px left + 10px right
    const minW = 140;
    const maxW = Math.min(600, Math.floor(window.innerWidth * 0.9));
    const next = Math.max(minW, Math.min(maxW, natural + padding));
    input.style.width = next + 'px';
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitEmail();
    }
  });
  input.addEventListener('input', () => {
    input.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.12)';
    resizeToContent();
    scheduleAutoSubmit();
  });
  input.addEventListener('focus', () => {
    resizeToContent();
  });
  window.addEventListener('resize', () => {
    if (showingInput || (input.value && input.value.trim())) resizeToContent();
  });
})();
