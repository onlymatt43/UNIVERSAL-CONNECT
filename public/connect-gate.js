(function () {
  if (localStorage.getItem('hasSubscribed')) return;

  // Overlay avec effet de fond "goutte"
  const overlay = document.createElement('div');
  overlay.style = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    z-index:99999;display:flex;
    align-items:center;justify-content:center;
    flex-direction:column;
  `;

  // Créer des cercles flous aléatoires
  for (let i = 0; i < 10; i++) {
    const circle = document.createElement('div');
    const size = Math.random() * 100 + 50;
    circle.style = `
      position:absolute;
      width:${size}px;
      height:${size}px;
      top:${Math.random() * 100}%;
      left:${Math.random() * 100}%;
      background: rgba(255,255,255,0.15);
      border-radius:50%;
      filter: blur(8px);
      z-index:0;
    `;
    overlay.appendChild(circle);
  }

  // Zone centrale avec bouton
  const input = document.createElement('input');
  input.type = 'email';
  input.placeholder = 'Votre email';
  input.style = `
    padding:15px; font-size:18px; width:80%; max-width:300px;
    margin-bottom:20px; border:none; border-radius:8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    z-index:1;
  `;
  overlay.appendChild(input);

  const button = document.createElement('button');
  button.innerText = 'connect';
  button.style = `
    width:100px; height:100px; border-radius:50%;
    background: radial-gradient(circle at 30% 30%, #fff 0%, #FFD700 60%, #FFA500 100%);
    color:black; font-weight:bold; font-size:16px;
    border:none; box-shadow: 0 6px 20px rgba(0,0,0,0.4);
    cursor:pointer; z-index:1;
    display:flex; align-items:center; justify-content:center;
    transition: transform 0.2s ease;
  `;

  button.onmouseover = () => button.style.transform = "scale(1.1)";
  button.onmouseout = () => button.style.transform = "scale(1.0)";

  const error = document.createElement('p');
  error.style = 'color:red; display:none; margin-top:10px; z-index:1;';
  overlay.appendChild(button);
  overlay.appendChild(error);

  button.onclick = function () {
    const email = input.value.trim();
    if (!email) {
      error.innerText = 'Veuillez entrer un email valide.';
      error.style.display = 'block';
      return;
    }

    fetch('https://universal-connect.vercel.app/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        source: window.location.hostname
      })
    }).then(res => {
      if (res.ok) {
        localStorage.setItem('hasSubscribed', 'true');
        document.body.removeChild(overlay);
      } else {
        error.innerText = "Erreur lors de l'inscription.";
        error.style.display = 'block';
      }
    }).catch(err => {
      error.innerText = "Erreur réseau.";
      error.style.display = 'block';
    });
  };

  document.body.appendChild(overlay);
})();
