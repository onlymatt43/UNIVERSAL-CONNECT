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

    var input = document.createElement('input');
    input.type = 'email';
    input.placeholder = 'Votre email';
    // Small pill by default, expands on focus/typing
    var SMALL_W = 140;
    function bigWidthPx() { return Math.min(380, Math.max(260, Math.floor(window.innerWidth * 0.8))); }
    input.style.cssText = 'height:48px;padding:0 16px;font-size:18px;width:'+SMALL_W+'px;max-width:90vw;margin-bottom:20px;border:none;border-radius:9999px;box-shadow:0 0 14px rgba(0,0,0,0.25);position:relative;z-index:1;transition:width 220ms ease, box-shadow 220ms ease;outline:none;background:#fff;color:#111;';
    function expand() {
      input.style.width = bigWidthPx() + 'px';
      input.style.boxShadow = '0 0 18px rgba(0,0,0,0.35)';
    }
    function collapse() {
      input.style.width = SMALL_W + 'px';
      input.style.boxShadow = '0 0 14px rgba(0,0,0,0.25)';
    }
    input.addEventListener('focus', expand);
    input.addEventListener('input', function(){ if (input.value.length>0) expand(); });
    input.addEventListener('blur', function(){ if (!input.value.trim()) collapse(); });
    window.addEventListener('resize', function(){ if (document.activeElement === input || input.value.trim()) expand(); });
    overlay.appendChild(input);

    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.style.cssText = 'width:100px;height:100px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#fff 0%,#FFE35C 55%,#FFC107 100%);color:#111;font-weight:800;font-size:12px;letter-spacing:0.5px;text-transform:uppercase;border:none;box-shadow:0 6px 20px rgba(0,0,0,0.4);cursor:pointer;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;transition:transform 0.2s ease;overflow:hidden;';
    var label = document.createElement('span');
    label.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;user-select:none;line-height:1;';
    button.appendChild(label);
    button.onmouseover = function() { this.style.transform = 'scale(1.1)'; };
    button.onmouseout = function() { this.style.transform = 'scale(1.0)'; };
    overlay.appendChild(button);

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

    // Organic scramble animation inside the circular button
    (function organicScramble(){
      var TARGET = 'CONNECT TO SUBSCRIBE';
      var ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var PAD = (TARGET + '   ' + TARGET).toUpperCase();
      var start = 0, length = 3, settleFrames = 14, frame = 0;
      var target = PAD.slice(start, start + length);
      var current = new Array(length).fill(' ');
      var settled = new Array(length).fill(false);
      function reseed(){
        start = (start + 1 + Math.floor(Math.random()*2)) % TARGET.length;
        length = 3 + Math.floor(Math.random()*3);
        target = PAD.slice(start, start + length);
        current = new Array(length).fill(' ');
        settled = new Array(length).fill(false);
        frame = 0;
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
    })();

    var error = document.createElement('p');
    error.style.cssText = 'color:#ffb3b3;display:none;margin-top:12px;position:relative;z-index:1;font-size:14px;';
    overlay.appendChild(error);

    button.onclick = function () {
      var email = input.value.trim();
      if (!email) {
        error.innerText = 'Veuillez entrer un email valide.';
        error.style.display = 'block';
        return;
      }
      console.log('[connect-gate] Envoi inscription', email);
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
          document.body.removeChild(overlay);
          console.log('[connect-gate] Inscription réussie, overlay retiré');
        } else {
          error.innerText = "Erreur lors de l'inscription.";
          error.style.display = 'block';
          console.log('[connect-gate] Erreur API');
        }
      }).catch(function() {
        error.innerText = 'Erreur réseau.';
        error.style.display = 'block';
        console.log('[connect-gate] Erreur réseau');
      });
    };

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
