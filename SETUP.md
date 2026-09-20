# Vessel Purchasing List: setup (GitHub only)

How it works: everything lives on GitHub. The list is saved in `data.json` in a private repository. People sign in with an ID and password. Behind the scenes, each password unlocks a GitHub token that is stored, locked, in `users.json`. You, the admin, create the IDs and passwords inside the app.

You do this once. It takes about 15 minutes.

## What goes where

| Where | What |
|---|---|
| GitHub repo **vessel-app** (public) | `index.html`, `manifest.json`, `service-worker.js`, `icon-192.png`, `icon-512.png`, `users.json` |
| GitHub repo **vessel-data** (private) | `data.json` (optional, the app creates it if it is missing) |

Two repositories on purpose: the token you create in step 1 can only touch the private data repository. Nobody can use it to change the app itself, and nobody can read the list without signing in.

## 1. The data repository and the token

1. On GitHub, create a new repository called `vessel-data` and set it to **Private**.
2. Upload `data.json` to it (Add file, Upload files). You can skip this step.
3. Go to GitHub Settings, then Developer settings, then Personal access tokens, then Fine-grained tokens, then Generate new token.
4. Give it a name and set an expiry (for example 1 year, and note the date in your calendar). Under Repository access choose **Only select repositories** and pick `vessel-data`.
5. Under Repository permissions set **Contents** to **Read and write**. Leave everything else alone.
6. Generate the token and keep the page open. GitHub shows it only once.

## 2. The app

1. Create a **Public** repository called `vessel-app` and upload the six app files listed above.
2. In that repo go to Settings, then Pages, and publish from the `main` branch, root folder. The app will be at `https://yourname.github.io/vessel-app/`.

## 3. Connect this device as admin

1. Open the app. On the sign-in screen tap **Admin setup**.
2. Enter the data repository (`yourname/vessel-data`), keep branch `main` and file `data.json`, paste the token, and tap **Save and connect**.
3. This device is now the admin device. It holds the token and is the only one that can add users.

## 4. Add people

1. Tap **Users** in the sidebar.
2. Type an ID, tap **Make a random password**, and tap **Save user**. Copy the ID and password at that moment. The app cannot show the password again. If it is lost, use **Reset password**.
3. Tap **Download users.json**. On GitHub, open the `vessel-app` repository, choose Add file, Upload files, and upload it to replace the old `users.json`. (If downloading does not work on your device, use **Copy as text**, open `users.json` on GitHub, click the pencil, select all, paste, and commit.)
4. About a minute later the person can sign in with their ID and password.

Repeat step 4 whenever you add, reset or remove someone. The Users screen tells you when the list has changed but is not published yet.

## Good to know

- Everyone signed in can add, edit and delete items and vessels. Only the admin device sees **Users** and **Settings**.
- **Use the random passwords.** `users.json` is public, so anyone could try to guess a password offline. A random 12 character password makes that impractical; a short or common one does not. The app requires at least 10 characters.
- Every signed-in device holds the GitHub token in its memory once the person signs in. That means someone technical could copy it. Because it only works on the private `vessel-data` repository, the worst they could do is damage the list, and every save is a commit you can go back to.
- **Removing a user** stops new sign-ins once you publish the new `users.json`. A phone that is already signed in keeps working until the token is replaced. If you need to cut someone off straight away, make a new token (step 1), delete the old one on GitHub, paste the new one in **Settings**, then reset every remaining user's password and publish. Devices with the old token are signed out at their next sync.
- **Replacing the token** (for example when it expires) works the same way: new token, **Settings**, reset each user, publish.
- Each person stays signed in on a device until they tap **Sign out**, which also clears the list from that device.
- Every save is a commit in `vessel-data` with the person's ID in the message, so you can see who changed what.
- If you update the app files later, change `CACHE_VERSION` in `service-worker.js` (for example `v4` to `v5`) so devices pick up the new version.
