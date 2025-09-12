# 🎬 YouTube Clone (Client + Server)

A full-stack YouTube clone built with a React client and an Express server. The platform features video streaming, micro-tweets, playlists, likes & dislikes, subscriptions, comments, watch history, and watch later. — delivering a complete video-sharing and social interaction experience.

## 🏗️ Monorepo Structure

- `client/` – React app for the UI
- `server/` – Express REST API with MongoDB

## 🛠️ Tech Stack

### Client

- **Core**: React 19, React Router 7
- **Styling**: Tailwind CSS 4, DaisyUI, Ant Design
- **Data**: React Query (@tanstack/react-query), Axios
- **Forms**: React Hook Form
- **Utils**: Day.js, date-fns, Intersection Observer
- **UI/UX**: React Hot Toast, React Icons, Lucide React

### Server

- **Core**: Node.js, Express.js
- **Database**: MongoDB, Mongoose (+ aggregate paginate)
- **Auth/Security**: JSONWebTokens, bcrypt cookie-parser, CORS
- **Config**: dotenv
- **Uploads**: Multer (file parsing), Cloudinary (media storage)

## ✨ Key Features

### Client Features

- Theming and layout with context providers
- Auth flows (login/register hooks), private Studio routes
- Videos: list, details, upload, update, delete
- Interactions: like/dislike (videos/tweets/comments)
- Playlists: create, update, add/remove videos, details page
- Subscriptions: subscribe/unsubscribe, subscription feed
- Watch History: add/view/remove
- Watch Later: add/view/remove
- Tweets: create, edit, delete, list, details
- Studio/Dashboard: stats, content management, customization

### Server Features (REST API)

- Users: auth, profile, subscriptions
- Videos: CRUD, view count, list/feed
- Tweets: CRUD
- Playlists: CRUD, add/remove videos
- Comments: CRUD for videos and tweets
- Likes & Dislikes: toggle for videos/tweets/comments
- Watch History and Watch Later management
- Dashboard stats

## 📡 API Surface (Base: `/api/v1`)

- `/users` – user routes
- `/videos` – video routes
- `/tweet` – tweet routes
- `/playlist` – playlist routes
- `/comment` – comment routes
- `/likes` – like routes
- `/dislikes` – dislike routes
- `/subscribe` – subscription routes
- `/watchlater` – watch-later routes
- `/watched` – watch-history routes
- `/dashboard` – dashboard stats

## 🚀 Getting Started

### 🔹 Prerequisites

- Node.js 18+
- MongoDB instance
- Cloudinary account (if using media uploads)

### 🔹 Client Setup

1. Optionally set API base URL in `client/src/hooks/axios/useAxiosPublic.js` and
   `useAxiosSecure.js`.

2. Dependencies (from `client/package.json`):

```bash
   @tailwindcss/vite ^4.1.11
   @tanstack/react-query ^5.83.0
   antd ^5.26.7
   axios ^1.10.0
   date-fns ^4.1.0
   dayjs ^1.11.13
   lucide-react ^0.536.0
   prop-types ^15.8.1
   react ^19.1.0
   react-dom ^19.1.0
   react-hook-form ^7.60.0
   react-hot-toast ^2.5.2
   react-icons ^5.5.0
   react-intersection-observer ^9.16.0
   react-router ^7.6.3
   sweetalert2 ^11.22.4
   tailwindcss ^4.1.11
```

DevDependencies:

```bash
@eslint/js ^9.25.0
@types/react ^19.1.2
@types/react-dom ^19.1.2
@vitejs/plugin-react ^4.4.1
daisyui ^5.0.46
eslint ^9.25.0
eslint-plugin-react-hooks ^5.2.0
eslint-plugin-react-refresh ^0.4.19
globals ^16.0.0
vite ^6.3.5
```

3. Install and run:

```bash
cd client
npm install
npm run dev
```

The client runs on Vite (typically `http://localhost:5173`). Ensure the server
CORS origin allows this URL.

### 🔹 Server Setup

1. Create `server/.env` with at least:

   - `PORT=8000`
   - `CORS_ORIGIN=http://localhost:5173`
   - `MONGODB_URI=YOUR_MONGODB_URI`
   - `JWT_SECRET=YOUR_SECRET`
   - `ACCESS_TOKEN_SECRET=YOUR_SECRET`
   - `ACCESS_TOKEN_EXPIRY=...`
   - `REFRESH_TOKEN_SECRET=YOUR_SECRET`
   - `REFRESH_TOKEN_EXPIRY=...`
   - `CLOUDINARY_CLOUD_NAME=...`
   - `CLOUDINARY_API_KEY=...`
   - `CLOUDINARY_API_SECRET=...`

2. Dependencies (from `server/package.json`):

```bash
 bcrypt ^6.0.0
 cloudinary ^2.6.1
 cookie-parser ^1.4.7
 cors ^2.8.5
 dotenv ^16.5.0
 express ^5.1.0
 jsonwebtoken ^9.0.2
 mongoose ^8.15.1
 mongoose-aggregate-paginate-v2 ^1.1.4
 multer ^2.0.1
```

DevDependencies:

```bash
prettier ^3.5.3
```

3. Install and run:

```bash
cd server
npm install
npm run dev
```

## 📜 Scripts

- **Client**: `dev`, `build`, `preview`
- **Server**: `dev`
