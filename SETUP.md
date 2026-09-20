# Vessel Purchasing List: setup (GitHub only)

How it works: everything lives on GitHub. The list is saved in `data.json` in a private repository. People sign in with an ID and a 6-digit PIN that you create for them inside the app. After that, each phone can open the app with a fingerprint or the same PIN.

You do this once. It takes about 20 minutes.

## What goes where

| Where | What |
|---|---|
| GitHub repo **vessel-app** (public) | `index.html`, `manifest.json`, `service-worker.js`, `icon-192.png`, `icon-512.png`, `users.json` |
| GitHub repo **vessel-data** (private) | `data.json` (optional, the app creates it if it is missing) |

Two repositories on purpose: the data token can only touch the private data repository, so nobody can use it to change the app itself, and nobody can read the list without signing in.

## 1. The data repository and the data token

1. On GitHub, create a repository called `vessel-data` and set it to **Private**.
2. Upload `data.json` to it (optional).
3. Go to GitHub Settings, then Developer settings, then Personal access tokens, then Fine-grained tokens, then Generate new token.
4. Name it "vessel data", set an expiry (for example 1 year, and note the date), and under Repository access choose **Only select repositories** and pick `vessel-data`.
5. Under Repository permissions set **Contents** to **Read and write**. Generate it and keep the page open. GitHub shows the token only once.

## 2. The app repository and the app token

1. Create a **Public** repository called `vessel-app` and upload the six app files listed above.
2. In that repo go to Settings, then Pages, and publish from the `main` branch, root folder. The app will be at `https://yourname.github.io/vessel-app/`.
3. Make a second fine-grained token the same way, named "vessel app", limited to **only `vessel-app`**, with **Contents: Read and write**. This one lets the app add users for you without any file uploads. It stays on your admin device only. (You can skip it and upload `users.json` by hand each time, but then you are back to uploading.)

## 3. Connect your device as admin

1. Open the app. On the sign-in screen tap **Admin setup**.
2. Enter the data repository (`yourname/vessel-data`), paste the data token, check the app repository (`yourname/vessel-app`, filled in for you on github.io), paste the app token, and tap **Save and connect**.
3. This device is now the admin device. It is the only one that can add users. Tap **Lock** in the sidebar and turn the lock on for this device too.

## 4. Add people

1. Tap **Users** in the sidebar.
2. Type an ID and tap **Make a random PIN** (or type your own 6 digits). Tap **Save user**.
3. The app publishes the change straight to GitHub. The person can sign in within seconds. Nothing to upload.
4. Give the person their ID and PIN. The app shows the PIN only at that moment, so copy it then. If it is lost, use **Reset PIN**.

## 5. Fingerprint or PIN on each phone

After a person signs in the first time, the app offers to turn on the fingerprint lock. From then on the app asks for their fingerprint or 6-digit PIN whenever it is opened, and again after it has been in the background for 2 minutes. Phones without a fingerprint reader can still turn on the PIN lock with the **Lock** link. After 5 wrong PINs the device is signed out.

## Good to know

- **How strong the PIN is.** Each person's copy of the data token is locked with their PIN inside `users.json`, and that file is public. A 6-digit PIN has only a million possibilities, so someone with special software and a good graphics card could work it out in minutes. What they would get is the data token, which opens only the private `vessel-data` repository: they could read or damage the list, and every save is a commit you can go back to. If you want stronger protection, tell me and I will change it so the PIN only lives on each phone and a long one-time code does the first sign-in.
- **The lock is an app lock.** The fingerprint or PIN stops other people using the app on someone's phone. It does not encrypt what the phone stores.
- **Removing a person** stops new sign-ins right away. A phone that is already signed in keeps working until the data token is replaced. To cut someone off straight away, make a new data token (step 1), delete the old one on GitHub, paste the new one in **Settings**, then **Reset PIN** for everyone who should stay. Phones with the old token are signed out at their next sync.
- **Replacing the data token** (for example when it expires) works the same way.
- Everyone signed in can add, edit and delete items and vessels. Only the admin device sees **Users** and **Settings**.
- Every save is a commit in `vessel-data` with the person's ID in the message, so you can see who changed what.
- If you update the app files later, change `CACHE_VERSION` in `service-worker.js` (for example `v5` to `v6`) so phones pick up the new version.
