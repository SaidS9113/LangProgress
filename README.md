# 🚀 LangProgress - Plateforme E-Learning

Une plateforme e-learning moderne et complète construite avec **Next.js 16**, **React 19**, **TypeScript**, **Prisma**, et **PostgreSQL (Neon)**.

> 🧪 **BAC À SABLE DÉMONSTRATIF** : Ceci est une version de démonstration présentant une partie de l'architecture développée. Explorez librement pour visualiser le potentiel de cette stack technique.

---

## 📋 Table des matières

- [Stack Technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement](#-lancement)
- [Déploiement](#-déploiement)
- [Fonctionnalités](#-fonctionnalités)
- [Structure du Projet](#-structure-du-projet)
- [API Routes](#-api-routes)
- [Contact](#-contact)

---

## 🛠️ Stack Technique

| Catégorie | Technologie | Version |
|-----------|-------------|---------|
| **Framework** | Next.js (App Router) | 16.x |
| **Frontend** | React | 19.x |
| **Langage** | TypeScript | 5.x |
| **Base de données** | PostgreSQL (Neon) | - |
| **ORM** | Prisma | 6.x |
| **Authentification** | JWT (Jose + cookies httpOnly) | - |
| **Styling** | Tailwind CSS | 4.x |
| **Animations** | Framer Motion | 12.x |
| **Icônes** | Lucide React | - |
| **Paiements** | Stripe | - |
| **Vidéo** | Cloudflare Stream | - |
| **Email** | Nodemailer | - |
| **Police** | Urbanist (Google Fonts) | - |

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** >= 18.x ([Télécharger](https://nodejs.org/))
- **npm** >= 9.x (inclus avec Node.js)
- **Git** ([Télécharger](https://git-scm.com/))

### Optionnel (pour la production)
- Compte **Neon** ([neon.tech](https://neon.tech)) - Base de données PostgreSQL gratuite
- Compte **Vercel** ([vercel.com](https://vercel.com)) - Hébergement gratuit
- Compte **Stripe** ([stripe.com](https://stripe.com)) - Paiements (optionnel)

---

## 🔧 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/SaidS9113/LangProgress.git
cd LangProgress
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Générer le client Prisma

```bash
npx prisma generate
```

---

## ⚙️ Configuration

### 1. Créer le fichier d'environnement

Copiez le fichier exemple et configurez vos variables :

```bash
cp .env.example .env
```

### 2. Configuration du fichier `.env`

```env
# ===========================================
# BASE DE DONNÉES (Neon PostgreSQL)
# ===========================================
# Récupérez ces URLs depuis https://neon.tech
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

# ===========================================
# AUTHENTIFICATION
# ===========================================
JWT_SECRET="votre-secret-jwt-minimum-32-caracteres-securise"
ADMIN_EMAIL="admin@votredomaine.com"

# ===========================================
# APPLICATION
# ===========================================
APP_URL="http://localhost:3000"
NODE_ENV="development"

# ===========================================
# STRIPE (optionnel)
# ===========================================
# STRIPE_SECRET_KEY="sk_test_..."
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
# STRIPE_WEBHOOK_SECRET="whsec_..."

# ===========================================
# EMAIL (optionnel mais recommandé)
# ===========================================
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT="587"
# SMTP_SECURE="false"
# SMTP_USER="votre@email.com"
# SMTP_PASSWORD="votre-mot-de-passe-app"
# SMTP_FROM="noreply@langprogress.com"
# LINKEDIN_URL="https://www.linkedin.com/in/votre-profil"
```

### 3. Configuration Neon (Base de données)

1. Créez un compte sur [neon.tech](https://neon.tech)
2. Créez un nouveau projet
3. Allez dans **Connection Details**
4. Sélectionnez **Prisma** dans le dropdown
5. Copiez les URLs `DATABASE_URL` et `DIRECT_URL`

### 4. Initialiser la base de données

```bash
# Créer les tables
npx prisma db push

# Ajouter les données de démonstration
npx tsx prisma/seed.ts
```

---

## 🚀 Lancement

### Mode développement

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

### Identifiants de démo

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Utilisateur** | demo@sandbox.com | demo123 |
| **Admin** | admin@sandbox.com | admin123 |

### Autres commandes utiles

```bash
# Lancer les tests unitaires
npm run test

# Lancer les tests E2E
npm run e2e

# Ouvrir Prisma Studio (visualiser la BDD)
npm run db:studio

# Réinitialiser la base de données
npm run db:reset

# Build de production
npm run build

# Lancer en production
npm run start
```

---

## 🌐 Déploiement

### Option 1 : Vercel (Recommandé)

#### Étape 1 : Préparer le repository

```bash
# Initialiser Git
git init
git add .
git commit -m "Initial commit"

# Lier au repository GitHub
git remote add origin https://github.com/SaidS9113/LangProgress.git
git push -u origin main
```

#### Étape 2 : Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"New Project"**
3. Importez votre repository GitHub
4. Configurez les **Environment Variables** :
   - `DATABASE_URL` (depuis Neon)
   - `DIRECT_URL` (depuis Neon)
   - `JWT_SECRET`
   - `APP_URL` (votre domaine Vercel)
5. Cliquez sur **Deploy**

#### Étape 3 : Configurer la base de données en production

```bash
# Après le déploiement, exécutez le seed depuis votre terminal local
# avec les variables d'environnement de production
npx prisma db push
npx tsx prisma/seed.ts
```

### Option 2 : Docker

#### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - DIRECT_URL=${DIRECT_URL}
      - JWT_SECRET=${JWT_SECRET}
      - APP_URL=${APP_URL}
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=langprogress
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### Commandes Docker

```bash
# Build et lancer
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

### Option 3 : Hébergement PostgreSQL local

Si vous préférez utiliser PostgreSQL localement plutôt que Neon :

```bash
# Installer PostgreSQL
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt install postgresql

# Créer la base de données
createdb langprogress

# Configurer .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/langprogress"
DIRECT_URL="postgresql://postgres:password@localhost:5432/langprogress"
```

---

## 🎯 Fonctionnalités

### 🔐 Authentification & Utilisateurs

| Fonctionnalité | Description |
|----------------|-------------|
| **Inscription** | Création de compte avec email/mot de passe |
| **Connexion** | Authentification JWT avec cookies httpOnly |
| **Déconnexion** | Suppression sécurisée du token |
| **Mot de passe oublié** | Réinitialisation par email |
| **Profil utilisateur** | Gestion des informations personnelles |
| **Rôles** | Utilisateur, Admin |

### 📚 Apprentissage

| Fonctionnalité | Description |
|----------------|-------------|
| **Chapitres** | Structure modulaire par niveaux |
| **Vidéos** | Streaming via Cloudflare |
| **Quiz interactifs** | QCM avec scoring automatique |
| **Progression** | Suivi en temps réel avec graphiques |
| **Devoirs** | Soumission et correction |
| **Niveaux** | Système de progression (Plan A / Plan B) |

### 💳 Paiements (Stripe)

| Fonctionnalité | Description |
|----------------|-------------|
| **Abonnements** | Plans mensuels/annuels |
| **Checkout** | Paiement sécurisé Stripe |
| **Webhooks** | Gestion automatique des événements |
| **Codes promo** | Réductions personnalisées |

### 🛠️ Administration

| Fonctionnalité | Description |
|----------------|-------------|
| **Dashboard admin** | Vue d'ensemble des statistiques |
| **Gestion utilisateurs** | CRUD complet |
| **Gestion vidéos** | Upload et organisation |
| **Gestion devoirs** | Correction et feedback |
| **Analytics** | Graphiques de progression |

### 📱 Mobile

| Fonctionnalité | Description |
|----------------|-------------|
| **Responsive** | Design adaptatif |
| **PWA ready** | Installation sur mobile |

---

## 📁 Structure du Projet

```
LangProgress/
├── app/                          # App Router Next.js 15
│   ├── api/                      # Routes API
│   │   ├── auth/                 # Authentification
│   │   │   ├── get-user/         # Récupérer utilisateur
│   │   │   ├── login/            # Connexion
│   │   │   ├── logout/           # Déconnexion
│   │   │   ├── me/               # Utilisateur courant
│   │   │   └── register/         # Inscription
│   │   ├── contact/              # Support contact
│   │   ├── demo-login/           # Connexion démo
│   │   ├── progress/             # Progression
│   │   │   └── validate/         # Validation des étapes
│   │   └── visitors/             # Compteur visiteurs
│   ├── chapters/                 # Pages des chapitres
│   │   └── [chapitres]/          # Route dynamique chapitre
│   │       ├── [page]/           # Route dynamique leçon
│   │       ├── introduction/     # Page introduction
│   │       ├── quiz/             # Page quiz
│   │       ├── video/            # Page vidéo
│   │       └── layout.tsx        # Layout chapitre (sidebar mobile)
│   ├── checkout/                 # Page paiement Stripe
│   ├── coaching/                 # Page coaching
│   ├── complete-profile/         # Compléter profil
│   ├── components/               # Composants React
│   │   ├── chapters/             # Composants des leçons
│   │   │   ├── chapter1/         # Chapitre 1 (Lecon1-3.tsx)
│   │   │   ├── chapter2/         # Chapitre 2
│   │   │   ├── ...               # Chapitres 3-9
│   │   │   └── chapter10/        # Chapitre 10
│   │   ├── layout/               # Layouts responsifs
│   │   │   ├── DesktopLayout.tsx # Layout desktop
│   │   │   ├── LayoutSwitcher.tsx# Sélecteur de layout
│   │   │   └── MobileLayout.tsx  # Layout mobile
│   │   ├── quiz/                 # Composants quiz
│   │   │   └── QuestionReponse.tsx
│   │   ├── thank-you/            # Page merci
│   │   ├── AutoProgressWrapper.tsx
│   │   ├── CloudflareVideoPlayer.tsx
│   │   ├── CourseHeader.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── InactivityDetector.tsx
│   │   ├── InactivityWarning.tsx
│   │   ├── LandingHeader.tsx
│   │   ├── Logo.tsx
│   │   ├── NextButton.tsx
│   │   ├── PageNavigation.tsx
│   │   ├── RealtimeProgressIndicator.tsx
│   │   ├── ReciterList.tsx
│   │   ├── SidebarContent.tsx
│   │   ├── UniversalNavigation.tsx
│   │   └── VisitorCounter.tsx
│   ├── dashboard/                # Tableau de bord
│   ├── devoirs/                  # Page devoirs (ancienne)
│   ├── forgot-password/          # Mot de passe oublié
│   ├── guide/                    # Guide utilisateur
│   ├── homework/                 # Page devoirs
│   ├── levels/                   # Niveaux de progression
│   ├── login/                    # Page connexion
│   ├── register/                 # Page inscription
│   ├── reset-password/           # Réinitialisation MDP
│   ├── subscription/             # Gestion abonnement
│   ├── thank-you/                # Page remerciement
│   ├── tips/                     # Conseils
│   ├── globals.css               # Styles globaux (Tailwind)
│   ├── layout.tsx                # Layout racine
│   ├── page.tsx                  # Landing page
│   ├── robots.ts                 # SEO robots
│   └── sitemap.ts                # SEO sitemap
├── db/
│   └── config.ts                 # Configuration BDD
├── hooks/                        # Hooks React personnalisés
│   ├── useActiveElement.ts
│   ├── useAutoOpenSidebar.ts     # Auto-ouverture sidebar
│   ├── useAutoProgress.ts        # Progression automatique
│   ├── useChapterVideos.ts
│   ├── useInactivityLogout.ts    # Déconnexion inactivité
│   ├── useLocalStorageSync.ts
│   ├── useModuleContext.ts
│   ├── useNavigationNext.ts
│   ├── useSimpleTimer.ts         # Timer d'étude
│   └── useUserProgress.ts        # Progression utilisateur
├── lib/                          # Utilitaires
│   ├── admin-auth.ts             # Auth admin
│   ├── auth.ts                   # Fonctions auth
│   ├── chapters.ts               # Configuration chapitres
│   ├── email.ts                  # Envoi emails
│   ├── homework-email.ts         # Emails devoirs
│   ├── module-access.ts          # Accès modules
│   ├── prisma.ts                 # Client Prisma
│   ├── progressTracking.ts       # Suivi progression
│   ├── security.ts               # Utilitaires sécurité
│   ├── stripe-client.ts          # Client Stripe
│   └── stripe.ts                 # Config Stripe
├── prisma/
│   ├── migrations/               # Migrations BDD
│   ├── schema.prisma             # Schéma Prisma
│   └── seed.ts                   # Données de démo
├── public/                       # Assets statiques
│   ├── audio/                    # Fichiers audio
│   ├── img/                      # Images
│   └── uploads/                  # Uploads utilisateurs
├── types/
│   └── chapter.ts                # Types TypeScript
├── .env.exemple                  # Exemple variables env
├── .gitignore
├── LICENSE                       # Licence MIT
├── middleware.ts                 # Middleware Next.js (auth, sécurité)
├── next.config.ts                # Configuration Next.js
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── vercel.json                   # Configuration Vercel
```

---

## 🔌 API Routes

### Authentification

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription utilisateur |
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/logout` | Déconnexion |
| GET | `/api/auth/me` | Utilisateur courant (JWT) |
| GET | `/api/auth/get-user` | Données utilisateur détaillées |
| POST | `/api/demo-login` | Connexion démo rapide |

### Progression

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/progress/validate` | Valider une page/quiz |

### Autres

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/visitors` | Compteur de visiteurs |
| POST | `/api/contact` | Envoyer message support |

---

## 🐛 Résolution de problèmes

### Erreur "Prisma Client not generated"

```bash
npx prisma generate
```

### Erreur de connexion à la base de données

1. Vérifiez vos variables `DATABASE_URL` et `DIRECT_URL`
2. Assurez-vous que l'IP est autorisée dans Neon
3. Vérifiez que `?sslmode=require` est présent dans l'URL

### Erreur "Module not found"

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Le seed ne fonctionne pas

```bash
npx prisma db push --force-reset
npx tsx prisma/seed.ts
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 📧 Contact

**Said Soidroudine** - Développeur Fullstack

- 📧 Email : **soidroudinesaid@gmail.com**
- 💼 LinkedIn : [linkedin.com/in/soidroudine-said](https://www.linkedin.com/in/soidroudine-said/)
- 🐙 GitHub : [github.com/SaidS9113](https://github.com/SaidS9113)

---

<p align="center">
  <strong>⭐ Si ce projet vous a été utile, n'hésitez pas à lui donner une étoile sur GitHub !</strong>
</p>

---

*Développé avec ❤️ par Said Soidroudine - 2026*
