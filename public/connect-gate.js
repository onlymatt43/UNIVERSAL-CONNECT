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

    for (var i = 0; i < 10; i++) {
      var circle = document.createElement('div');
      var size = Math.random() * 100 + 50;
      circle.style.cssText = 'position:absolute;width:'+size+'px;height:'+size+'px;top:'+Math.random()*100+'%;left:'+Math.random()*100+'%;background:rgba(255,255,255,0.1);border-radius:50%;filter:blur(8px);';
      overlay.appendChild(circle);
    }

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
    button.innerText = 'connect';
    button.style.cssText = 'width:100px;height:100px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#fff 0%,#FFD700 60%,#FFA500 100%);color:black;font-weight:bold;font-size:16px;border:none;box-shadow:0 6px 20px rgba(0,0,0,0.4);cursor:pointer;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;transition:transform 0.2s ease;';
    button.onmouseover = function() { this.style.transform = 'scale(1.1)'; };
    button.onmouseout = function() { this.style.transform = 'scale(1.0)'; };
    overlay.appendChild(button);

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
