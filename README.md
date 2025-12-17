# Universal Connect

Widget JavaScript universel pour collecter des emails depuis n'importe quel site web, avec backend Vercel et MongoDB.

## 📁 Structure du projet

```
universal-connect/
├── api/
│   ├── subscribe.js         # API d'inscription (POST)
│   ├── export.js            # Export CSV des abonnés (GET)
│   └── subscribers-list.js  # Liste des abonnés (GET)
├── public/
│   ├── index.html           # Page de test
│   ├── connect-widget.js    # Bouton rond glossy (haut droite)
│   ├── connect-gate.js      # Barrière d'accès obligatoire
│   └── admin.html           # Interface admin
├── vercel.json              # Configuration Vercel
├── .env.example             # Template variables d'environnement
├── .vercelignore            # Fichiers ignorés au déploiement
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Déploiement sur Vercel

1. **Push le projet sur GitHub**
2. **Importe le repo sur Vercel** : [vercel.com/new](https://vercel.com/new)
3. **Configure les variables d'environnement** dans Vercel > Project Settings > Environment Variables :

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | URI de connexion MongoDB Atlas |
| `MONGODB_DB` | Nom de la base de données (défaut: `connect`) |
| `MONGODB_COLL` | Nom de la collection (défaut: `subscribers`) |
| `EXPORT_SECRET` | Mot de passe pour accéder à l'export CSV |

4. **Déploie !**

## 📦 Intégration du Widget

### Bouton rond glossy (haut droite)
```html
<script src="https://universal-connect.vercel.app/connect-widget.js?v=6" defer></script>
```

### Barrière d'accès obligatoire (overlay)
```html
<script src="https://universal-connect.vercel.app/connect-gate.js?v=6" defer></script>
```

### Intégration WordPress / Breakdance
1. Va dans **Breakdance > Settings > Custom Code** ou utilise le plugin **WPCode**
2. Colle le script dans le **Footer** et utilise `defer` + un paramètre de version (ex: `?v=6`) pour éviter le cache

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

### GET `/api/subscribers-list`

Retourne la liste des abonnés (JSON).

### GET `/api/export?auth=EXPORT_SECRET`

Exporte tous les abonnés en CSV.

**Paramètres:**
- `auth` : Le secret défini dans les variables d'environnement

### DELETE/POST `/api/unsubscribe`

Supprime un abonné par son email.

- En DELETE: `DELETE /api/unsubscribe?email=user@example.com`
- En POST: Body JSON `{ "email": "user@example.com" }`

Réponses:
- `{ "status": "deleted" }` si supprimé
- `{ "status": "not-found" }` si non trouvé

## 🔐 Interface Admin

Accède à l'interface admin via :
```
https://universal-connect.vercel.app/admin.html
```

Fonctionnalités :
- Connexion par mot de passe
- Liste des abonnés
- Export CSV

⚠️ **Important** : Modifie les mots de passe dans `public/admin.html` avant le déploiement :
- `ADMIN_PASSWORD` : mot de passe de connexion
- `EXPORT_SECRET` : secret pour l'export CSV

## 🍃 Base de données MongoDB

Les emails sont stockés dans MongoDB Atlas avec la structure :
```json
{
  "email": "user@example.com",
  "source": "monsite.com",
  "subscribed_at": "2025-12-15T12:00:00.000Z"
}
```

## 📝 Liens utiles

- **Page de test** : https://universal-connect.vercel.app/
- **Admin** : https://universal-connect.vercel.app/admin.html
- **GitHub** : https://github.com/onlymatt43/UNIVERSAL-CONNECT

## 📄 Licence

MIT

## 🛡️ Sécurité

- Le fichier `subscribers.json` est ignoré lors du déploiement (`.vercelignore`)
- L'export CSV est protégé par un secret
- L'interface admin requiert un mot de passe

## 📄 Licence

MIT
