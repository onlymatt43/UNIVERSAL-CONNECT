(function () {
  const button = document.createElement('button');
  button.innerText = 'connect';
  button.style = `
    position:fixed; top:20px; right:20px; z-index:9999;
    width:60px; height:60px; border-radius:50%;
    background: radial-gradient(circle at 30% 30%, #fff 0%, #FFD700 60%, #FFA500 100%);
    color:black; font-weight:bold; font-size:12px; text-transform:uppercase;
    border:none; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    transition: transform 0.2s ease;
  `;

  button.onmouseover = () => button.style.transform = "scale(1.1)";
  button.onmouseout = () => button.style.transform = "scale(1.0)";

  button.onclick = function () {
    const email = prompt("Entrez votre email pour vous connecter :");
    if (email) {
      fetch('https://universal-connect.vercel.app/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          source: window.location.hostname
        })
      }).then(res => {
        alert("Merci ! Vous êtes inscrit.");
        localStorage.setItem('hasSubscribed', 'true');
      }).catch(err => {
        alert("Erreur lors de l'inscription.");
      });
    }
  };

  document.body.appendChild(button);
})();
