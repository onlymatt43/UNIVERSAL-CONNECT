# Universal Connect

Widget JavaScript universel pour collecter des emails depuis n'importe quel site web, avec backend Vercel.

## 📁 Structure du projet

```
universal-connect/
├── api/
│   ├── subscribe.js      # API d'inscription (POST)
│   └── export.js         # Export CSV des abonnés (GET)
├── public/
│   ├── connect-widget.js # Widget JS à embarquer
│   └── admin.html        # Interface admin
├── subscribers.json      # Stockage local des emails
├── vercel.json           # Configuration Vercel
├── .vercelignore         # Fichiers ignorés au déploiement
└── README.md
```

## 🚀 Déploiement sur Vercel

1. **Push le projet sur GitHub**
2. **Importe le repo sur Vercel** : [vercel.com/new](https://vercel.com/new)
3. **Configure les variables d'environnement** dans Vercel > Project Settings > Environment Variables :

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Clé API [Resend](https://resend.com) pour l'envoi d'emails |
| `EXPORT_SECRET` | Mot de passe pour accéder à l'export CSV |

4. **Déploie !**

## 📦 Intégration du Widget

Ajoute ce script sur n'importe quel site :

```html
<script src="https://TON_PROJET.vercel.app/connect-widget.js"></script>
```

Un bouton "Connect" apparaîtra en bas à droite. Au clic, l'utilisateur entre son email et est inscrit automatiquement.

## 🔧 API Endpoints

### POST `/api/subscribe`

Inscrit un nouvel email.

**Body (JSON):**
```json
{
  "email": "utilisateur@exemple.com",
  "source": "monsite.com"
}
```

**Réponse:**
```json
{ "status": "success" }
```

### GET `/api/export?auth=EXPORT_SECRET`

Exporte tous les abonnés en CSV.

**Paramètres:**
- `auth` : Le secret défini dans les variables d'environnement

## 🔐 Interface Admin

Accède à l'interface admin via :
```
https://TON_PROJET.vercel.app/admin.html
```

Fonctionnalités :
- Connexion par mot de passe
- Liste des abonnés
- Export CSV

⚠️ **Important** : Modifie le mot de passe admin dans `public/admin.html` (variable `AUTH`) avant le déploiement.

## 📧 Emails de confirmation

Les emails de confirmation sont envoyés automatiquement via [Resend](https://resend.com).

N'oublie pas de :
1. Créer un compte sur Resend
2. Vérifier ton domaine d'envoi
3. Mettre à jour l'adresse `from` dans `api/subscribe.js`

## 📝 Configuration

### vercel.json

Le fichier `vercel.json` configure le routing des API :

```json
{
  "version": 2,
  "builds": [
    { "src": "api/subscribe.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/subscribe", "dest": "/api/subscribe.js" }
  ]
}
```

## 🛡️ Sécurité

- Le fichier `subscribers.json` est ignoré lors du déploiement (`.vercelignore`)
- L'export CSV est protégé par un secret
- L'interface admin requiert un mot de passe

## 📄 Licence

MIT
