
# Summary of Node.js App with Google OAuth 2.0 using Passport

## Project Structure Overview

```
├── app.js                 ← Main application entry
├── package.json           ← Project dependencies & metadata
├── /config                ← Passport and Google OAuth setup
├── /routes                ← Auth and profile route handlers
├── /models                ← Mongoose schema for users
├── /views                 ← EJS templates for front-end rendering
├── /node_modules          ← Project dependencies

```

---
## Key Components

### `app.js`
- Sets up the Express server.
- Integrates middleware like `cookie-session`, `passport.initialize()`, and `passport.session()`.
- Sets up view engine as EJS.
- Connects routes (`auth-routes`, `profile-routes`).
- Connects to MongoDB using Mongoose.

### `config/passport-setup.js`
- Configures **Passport** with the **Google Strategy**.
- Serializes and deserializes the user to/from the session.
- Uses `passport-google-oauth20` with `clientID`, `clientSecret`, and `callbackURL`.
- On successful authentication, checks if the user exists in DB or creates a new one.

### `routes/auth-routes.js`
- Handles Google OAuth flow:
  - `/auth/google`: Initiates Google login.
  - `/auth/google/redirect`: Handles the redirect callback.
  - `/auth/logout`: Logs the user out.

### `routes/profile-routes.js`
- Protected route (`/profile`) that displays user info if logged in.
- Uses a middleware `authCheck` to verify if the user is authenticated.

### `models/user-model.js`
- Defines the **User** schema with Mongoose.
- Stores basic info: `googleId`, `username`, and `thumbnail`.

### `views/*.ejs`
- EJS templates for rendering:
  - `login.ejs`: Login page with Google login link.
  - `home.ejs`: Home or landing page.
  - `profile.ejs`: Displays user info after login.

---

## Google OAuth 2.0 Flow (via Passport)
1. User clicks “Login with Google” on the login page.
2. Redirects to Google consent screen via `/auth/google`.
3. After user consents, Google redirects to `/auth/google/redirect`.
4. Passport handles the user info, saves or finds them in MongoDB.
5. User session is stored via cookie-session and accessible on protected routes.

---

## Passport: `serializeUser` and `deserializeUser`

### Purpose
When a user logs in using Google OAuth, Passport authenticates them and then stores info in the session.

### `serializeUser`
```js
passport.serializeUser((user, done) => {
    done(null, user.id);
});
```
- Stores only the MongoDB user ID in the session.

### `deserializeUser`
```js
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});
```
- Retrieves the full user object based on the ID in the session.

### How It Helps
- User logs in once, session persists via a cookie.
- On every request, `req.user` is populated with the full user object.
- Protected routes can use `req.user` to verify identity.

### Summary Table

| Function            | Purpose                                                                 |
|---------------------|-------------------------------------------------------------------------|
| `serializeUser()`   | Stores a lightweight ID in the session cookie                           |
| `deserializeUser()` | Reconstructs the full user object using the ID from the session cookie  |
| `req.user`          | Becomes available on every request, if the user is authenticated        |
