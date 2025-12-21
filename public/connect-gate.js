(function () {
  console.log('[connect-gate] Script loaded');
  if (localStorage.getItem('hasSubscribed') === 'true') {
    console.log('[connect-gate] Déjà inscrit, overlay non affiché');
    return;
  }

  function initGate() {
    console.log('[connect-gate] DOM prêt, création overlay');
    var overlay = document.createElement('div');
    overlay.setAttribute('data-connect-gate-overlay','1');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);backdrop-filter:blur(10px);z-index:99999;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:24px;box-sizing:border-box;';

    // Soft white blurred circles with ultra-slow drift
    var bgCircles = [];
    for (var i = 0; i < 10; i++) {
      var circle = document.createElement('div');
      var size = Math.random() * 100 + 50;
      var x0 = Math.random() * 100;
      var y0 = Math.random() * 100;
      var ax = 0.6 + Math.random() * 0.8; // tiny amplitude
      var ay = 0.6 + Math.random() * 0.8;
      var ph = Math.random() * Math.PI * 2;
      circle.style.cssText = 'position:absolute;width:'+size+'px;height:'+size+'px;top:'+y0+'%;left:'+x0+'%;background:rgba(255,255,255,0.10);border-radius:50%;filter:blur(10px);transition:top 200ms linear,left 200ms linear;';
      overlay.appendChild(circle);
      bgCircles.push({el: circle, x0: x0, y0: y0, ax: ax, ay: ay, ph: ph});
    }

    (function driftCircles(){
      var t = Date.now() * 0.00015; // very slow
      for (var i = 0; i < bgCircles.length; i++) {
        var c = bgCircles[i];
        var x = c.x0 + Math.sin(t + c.ph) * c.ax;
        var y = c.y0 + Math.cos(t*0.9 + c.ph) * c.ay;
        c.el.style.left = x + '%';
        c.el.style.top = y + '%';
      }
      setTimeout(function(){ requestAnimationFrame(driftCircles); }, 180);
    })();

    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.style.cssText = 'width:100px;height:100px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#fff 0%,#FFE35C 55%,#FFC107 100%);color:#111;font-weight:800;font-size:12px;letter-spacing:0.5px;text-transform:uppercase;border:none;box-shadow:0 6px 20px rgba(0,0,0,0.4);cursor:pointer;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;transition:transform 0.2s ease;overflow:hidden;';
    var label = document.createElement('span');
    label.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;user-select:none;line-height:1;';
    button.appendChild(label);
    // Input overlay inside the button
    var inputWrap = document.createElement('div');
    inputWrap.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 160ms ease;z-index:2;';
    var input = document.createElement('input');
    input.type = 'email';
    input.placeholder = 'EMAIL';
    input.autocomplete = 'email';
    input.inputMode = 'email';
    input.style.cssText = 'height:30px;background:rgba(255,255,255,0.95);border:none;border-radius:9999px;padding:0 10px;font-size:12px;color:#111;outline:none;box-shadow: inset 0 1px 2px rgba(0,0,0,0.12)';
    inputWrap.appendChild(input);
    button.appendChild(inputWrap);
    // Compose breathing with hover scaling
    var hover = false;
    button.onmouseover = function() { hover = true; };
    button.onmouseout = function() { hover = false; };
    overlay.appendChild(button);

    // Satellite buttons orbiting around main button
    var satellites = [
      { text: 'ONLYFANS', url: 'https://onlyfans.com/onlymatt-43', angle: 0 },
      { text: 'PAYPAL', url: 'https://paypal.me/onlymatt43', angle: 120 },
      { text: 'JUSTFORFANS', url: 'https://justfor.fans/OnlyMatt43', angle: 240 }
    ];
    var satButtons = [];
    var orbitRadius = 140; // Distance from center
    
    satellites.forEach(function(sat) {
      var satBtn = document.createElement('a');
      satBtn.href = sat.url;
      satBtn.target = '_blank';
      satBtn.rel = 'noopener noreferrer';
      satBtn.style.cssText = 'position:absolute;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#fff 0%,#FFE35C 55%,#FFC107 100%);color:#111;font-weight:700;font-size:9px;letter-spacing:0.3px;text-transform:uppercase;border:none;box-shadow:0 4px 12px rgba(0,0,0,0.35);cursor:pointer;display:flex;align-items:center;justify-content:center;text-decoration:none;z-index:1;transition:transform 0.2s ease;';
      satBtn.textContent = sat.text;
      satBtn.onmouseover = function() { this.style.transform = 'scale(1.1)'; };
      satBtn.onmouseout = function() { this.style.transform = 'scale(1)'; };
      overlay.appendChild(satBtn);
      satButtons.push({ el: satBtn, baseAngle: sat.angle });
    });

    // Orbit animation for satellites
    (function orbitSatellites(){
      var t = 0;
      function step(){
        t += 0.008; // Slow orbit speed
        var centerX = window.innerWidth / 2;
        var centerY = window.innerHeight / 2;
        satButtons.forEach(function(sat) {
          var angle = (sat.baseAngle + t * 40) * Math.PI / 180; // Convert to radians
          var x = centerX + Math.cos(angle) * orbitRadius - 30; // -30 to center the 60px button
          var y = centerY + Math.sin(angle) * orbitRadius - 30;
          sat.el.style.left = x + 'px';
          sat.el.style.top = y + 'px';
        });
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    })();

    // Hidden sizer to compute natural width of email
    var sizer = document.createElement('span');
    sizer.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font-size:12px;font-weight:400;pointer-events:none;';
    document.body.appendChild(sizer);

    function resizeToContent(){
      sizer.textContent = (input.value && input.value.trim()) ? input.value.trim() : input.placeholder;
      var natural = Math.ceil(sizer.getBoundingClientRect().width);
      var padding = 20; // 10px left + 10px right
      var minW = 140;
      var maxW = Math.min(600, Math.floor(window.innerWidth * 0.9));
      var next = Math.max(minW, Math.min(maxW, natural + padding));
      input.style.width = next + 'px';
    }

    // Show/hide input overlay within the button
    var showingInput = false;
    function showInput(){
      if (showingInput) return;
      showingInput = true;
      label.style.opacity = '0';
      inputWrap.style.opacity = '1';
      inputWrap.style.pointerEvents = 'auto';
      button.style.overflow = 'visible';
      setTimeout(function(){ resizeToContent(); input.focus(); }, 10);
      if (typeof scramble !== 'undefined') scramble.setTarget('CONNECT TO SUBSCRIBE');
    }
    function hideInput(){
      showingInput = false;
      inputWrap.style.opacity = '0';
      inputWrap.style.pointerEvents = 'none';
      label.style.opacity = '1';
      button.style.overflow = 'hidden';
      if (typeof scramble !== 'undefined') {
        scramble.setTarget("YOU'RE AWESOME");
        setTimeout(function(){ scramble.setTarget('CONNECT TO SUBSCRIBE'); }, 2000);
      }
    }

    button.addEventListener('mouseenter', showInput);
    button.addEventListener('mouseleave', function(){ if (document.activeElement !== input) hideInput(); });
    input.addEventListener('blur', function(){ setTimeout(function(){ if (!button.matches(':hover')) hideInput(); }, 50); });

    // Auto-submit after short pause when valid, still supports Enter
    var autoTimer = null;
    function scheduleAutoSubmit(){
      if (autoTimer) clearTimeout(autoTimer);
      var v = (input.value||'').trim();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        autoTimer = setTimeout(function(){ submitEmail(); }, 800);
      }
    }
    input.addEventListener('input', function(){ resizeToContent(); scheduleAutoSubmit(); });
    input.addEventListener('keydown', function(e){ if (e.key === 'Enter') { e.preventDefault(); submitEmail(); } });

    // Subtle glossy drift on the button
    (function glossyDrift(){
      var theta = 0;
      var baseX = 30, baseY = 30, amp = 2.0, tickMs = 140;
      function step(){
        theta += 0.004;
        var x = baseX + Math.sin(theta) * amp;
        var y = baseY + Math.cos(theta*0.85) * amp;
        button.style.background = 'radial-gradient(circle at '+x+'% '+y+'%, #fff 0%, #FFE35C 55%, #FFC107 100%)';
        setTimeout(function(){ requestAnimationFrame(step); }, tickMs);
      }
      requestAnimationFrame(step);
    })();

    // Breathing loop (micro rotation + subtle scale) that composes with hover
    (function breathing(){
      var t = 0;
      function step(){
        t += 0.05;
        var breath = 1 + 0.005 * Math.sin(t);
        var rot = 0.5 * Math.sin(t * 0.7);
        var scale = (hover ? 1.08 : 1.0) * breath;
        button.style.transform = 'rotate(' + rot.toFixed(3) + 'deg) scale(' + scale.toFixed(3) + ')';
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    })();

    // Organic scramble animation inside the circular button with dynamic target
    var scramble = (function organicScramble(){
      var SCR_TARGET = 'CONNECT TO SUBSCRIBE';
      var ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var PAD = (SCR_TARGET + '   ' + SCR_TARGET).toUpperCase();
      var start = 0, length = 3, settleFrames = 14, frame = 0;
      var target = PAD.slice(start, start + length);
      var current = new Array(length).fill(' ');
      var settled = new Array(length).fill(false);
      function reseed(){
        start = (start + 1 + Math.floor(Math.random()*2)) % SCR_TARGET.length;
        length = 3 + Math.floor(Math.random()*3);
        target = PAD.slice(start, start + length);
        current = new Array(length).fill(' ');
        settled = new Array(length).fill(false);
        frame = 0;
      }
      function setTarget(t){
        SCR_TARGET = (t || 'CONNECT TO SUBSCRIBE').toUpperCase();
        PAD = (SCR_TARGET + '   ' + SCR_TARGET).toUpperCase();
        reseed();
      }
      function tick(){
        frame++;
        var p = Math.min(1, frame/settleFrames);
        for (var i=0;i<length;i++){
          if (settled[i]) continue;
          if (Math.random() < p*0.55 + (target[i]===' '?0.3:0)){
            current[i] = target[i];
            settled[i] = true;
          } else {
            current[i] = ABC[Math.floor(Math.random()*ABC.length)];
          }
        }
        label.textContent = current.join('');
        if (settled.every(Boolean)){
          setTimeout(function(){ reseed(); requestAnimationFrame(tick); }, 500 + Math.random()*500);
        } else {
          setTimeout(function(){ requestAnimationFrame(tick); }, 60 + Math.random()*40);
        }
      }
      requestAnimationFrame(tick);
      return { setTarget: setTarget };
    })();

    var error = document.createElement('p');
    error.style.cssText = 'color:#ffb3b3;display:none;margin-top:12px;position:relative;z-index:1;font-size:14px;';
    overlay.appendChild(error);

    function submitEmail() {
      var email = input.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        error.innerText = 'Veuillez entrer un email valide.';
        error.style.display = 'block';
        return;
      }
      console.log('[connect-gate] Envoi inscription', email);
      // Disable button to prevent double submission
      button.style.pointerEvents = 'none';
      input.disabled = true;
      
      fetch('https://universal-connect.vercel.app/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          source: window.location.hostname
        })
      }).then(function(res) {
        if (res.ok) {
          localStorage.setItem('hasSubscribed', 'true');
          console.log('[connect-gate] Inscription réussie, début fade-out');
          // Smooth fade-out animation
          overlay.style.transition = 'opacity 0.5s ease-out, backdrop-filter 0.5s ease-out';
          overlay.style.opacity = '0';
          overlay.style.backdropFilter = 'blur(0px)';
          setTimeout(function() {
            if (overlay && overlay.parentNode) {
              overlay.parentNode.removeChild(overlay);
              console.log('[connect-gate] Overlay retiré du DOM');
            }
          }, 500);
        } else {
          error.innerText = "Erreur lors de l'inscription.";
          error.style.display = 'block';
          button.style.pointerEvents = 'auto';
          input.disabled = false;
          console.log('[connect-gate] Erreur API');
        }
      }).catch(function() {
        error.innerText = 'Erreur réseau.';
        error.style.display = 'block';
        button.style.pointerEvents = 'auto';
        input.disabled = false;
        console.log('[connect-gate] Erreur réseau');
      });
    }

    button.onclick = submitEmail;

    document.body.appendChild(overlay);
    console.log('[connect-gate] Overlay ajouté au body');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGate);
    console.log('[connect-gate] En attente du DOM');
  } else {
    initGate();
  }
})();
