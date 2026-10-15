# Webex Retro Board Project

Welcome! Over this project you'll build and improve a **Webex Embedded App** — a
*team retro board* that runs right inside Webex. Along the way you'll do the things
a software engineer does every day: set up a project, read existing code, **fix
bugs**, and **add features**.

A "retro" (retrospective) is a meeting where a team reflects on how things are going
using three columns: **Start / Went well**, **Stop**, and **Continue**. Your app
lets a team fill those columns with cards, vote on them, and share the board with
everyone in a Webex meeting or space.

> **What's an Embedded App?** Unlike a chatbot that runs on a server, an embedded
> app is a small web page (HTML/CSS/JavaScript) that Webex loads *inside* the client.
> You'll write real front-end code and use the **Webex Embedded Apps SDK** to read
> who the user is, match the light/dark theme, and share your board.

## The project at a glance

You'll work through four tasks — the same arc a real engineer follows on a new
codebase:

1. **Task 1 — Set up & run "Hello Retro"** — get the starter app running inside Webex.
2. **Task 2 — Explore the code** — read and understand what's already there.
3. **Task 3 — Fix bugs & add features** — the main event.
4. **Task 4 — Make it your own** — extend it, and present your work.

## What you'll need

- **git** — https://git-scm.com/download/
- **Python 3** — https://www.python.org/downloads/ (used to run the app locally while
  you develop; on macOS you may already have it as `python3`)
- **A code editor** — [VS Code](https://code.visualstudio.com/) is recommended
- **A GitHub account** — free; https://github.com/join (used to fork and store your
  project code)
- **Cloudflare Tunnel (`cloudflared`)** — free; install it using
  [Cloudflare's instructions](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/)
  to give your locally running app a temporary public HTTPS address
- **A Webex Developer Sandbox** — free; see Task 1 (a normal free Webex account
  **cannot** create embedded apps)

---

# Task 1 — Set up and run "Hello Retro"

The goal of Task 1 is to get the starter app running *inside Webex* and see it greet
you by name. You'll develop the app **locally** for fast feedback, then use a
**Cloudflare Quick Tunnel** to give Webex a temporary public HTTPS address for your
locally running app.

## 1. Get the code
Fork this repository on GitHub (top-right **Fork** button) so you have your own copy,
then clone it to your Mac:
```sh
git clone https://github.com/<your-username>/webex-retro-board-project.git
cd webex-retro-board-project
ls
```
The app files are at the top level of the project: `index.html`, `styles.css`,
`app.js`.

## 2. Run the app locally (fast dev loop)
While you're writing code, run the app on your own machine — changes show up the
instant you reload the browser. In Terminal, from the project folder:
```sh
python3 -m http.server 8000
```
Open `http://localhost:8000` in your browser. You'll see the board. (Outside Webex,
the console shows one warning that the Webex SDK isn't available — that's expected;
everything except the Webex-only features still works.)

> **Keep this running while you develop.** Almost all of your work — fixing bugs and
> adding features — is tested here, locally, with instant reloads. Keep it running
> when you start the Quick Tunnel and test the app in Webex.

## 3. Get a Webex Developer Sandbox (per team)
Embedded apps need a *licensed* Webex organisation. Cisco gives these to developers
for free as a **Developer Sandbox**.

1. As a team, pick one person to open
   https://developer.webex.com/docs/developer-sandbox-guide and click
   **Request a Sandbox**.
2. Check email for the credentials (organisation name, admin username, password).
   - **Use an email that is _not_ already registered with Webex** when requesting.
     Using an existing-Webex email can trigger a password-reset on that account
     instead of creating a sandbox. A `+alias` like `you+retro@gmail.com` works well.
3. That person signs in to [Webex Control Hub](https://admin.webex.com) in an
   **incognito window** and adds their teammates as users. Each sandbox allows up to
   **10 people**.
4. Everyone signs in to the Webex app using their **sandbox** account for this
   project.

## 4. Give your local app a public HTTPS address
Webex needs a **public HTTPS** address for your app; it can't load `localhost` on
your computer directly. A Cloudflare Quick Tunnel temporarily makes your local app
available at a public `trycloudflare.com` address. You do not need a Cloudflare
account or a domain.

1. Leave the Python server running from step 2.
2. Open a **second Terminal window** and run:
   ```sh
   cloudflared tunnel --url http://localhost:8000
   ```
3. Wait for `cloudflared` to print a URL like
   `https://some-words.trycloudflare.com`. Open it in a browser and confirm the
   board loads. Keep this Terminal window open too.

> The tunnel URL is temporary. It stops working when you stop `cloudflared`, and a
> new tunnel may have a different URL. Keep both the Python server and tunnel running
> while you use the app in Webex. Quick Tunnels are intended for testing and
> development, not as a permanent website.

### Alternative for a static demo: GitHub Pages

If you only need to demonstrate the current app, you can host its static files with
GitHub Pages instead of running a Quick Tunnel. Push your project to GitHub, then
open your repository's **Settings → Pages** and deploy the `main` branch from the
`/ (root)` folder. GitHub will provide a stable HTTPS URL for the app. When you
follow step 5, use that URL with `/index.html` as the Webex **Start Page URL** and
its host (for example, `<your-username>.github.io`) as the **Valid domain**, instead
of the Quick Tunnel URL.

This is convenient for a demo, but updates appear only after you push your changes
and Pages finishes deploying. Use the Quick Tunnel workflow above when you want to
test the version running on your computer.

## 5. Create the Embedded App in the Developer Portal
1. Go to https://developer.webex.com and sign in **with your sandbox account**.
2. Open **My Webex Apps → Create a New App → Create Embedded App**.
3. Fill in:
   - **Where does your app work?** — tick **Meeting** and **Messaging**.
   - **Embedded app name** — e.g. "Team Retro Board".
   - **Start Page URL** — your current tunnel URL + `/index.html`, e.g.
     `https://some-words.trycloudflare.com/index.html`.
   - **Valid domains** — the host from your current tunnel URL, e.g.
     `some-words.trycloudflare.com` (just the host — **not** `https://` or a path).
4. Click **Add Embedded App**.

> If you stop and restart the tunnel, its URL may change. Update the Start Page URL
> and Valid domains in your embedded app settings to match the new URL.

## 6. Open it in Webex
1. In the Webex desktop app (signed in with your sandbox account), start a meeting
   or open a space.
2. Click the **Apps** button/tab, scroll to in-development apps, and open
   **Team Retro Board**.
3. Choose **Open and share my personal information** so the app can greet you.

You should see the board — and the header should say **"Hi <your name>"**. 🎉

<details>
<summary><b>Nothing loads / errors?</b></summary>

- Open the current tunnel URL directly in a browser first — does the board load
  there? If not, check that the Python server and `cloudflared` are both running.
- Check the **Start Page URL** ends in `/index.html` and **Valid domains** matches
  the host in your current tunnel URL.
- If you restarted `cloudflared`, copy its new URL into the embedded app settings.
- Make sure you're signed in with the **sandbox** account, not a personal one.
- Right-click inside the app and choose **Inspect** to open developer tools and read
  the console.

</details>

<details>
<summary><b>It says "Hi there" instead of my name?</b></summary>

- Outside Webex (a plain browser tab) this is expected — the name only comes through
  when the app runs **inside** the Webex client.
- Inside Webex, make sure you chose **Open and share my personal information** when
  launching the app. Without it, Webex withholds your name and the app falls back to
  a friendly default.
- Reload the app (close and reopen it) — embedded apps cache aggressively.

</details>

---

# Task 2 — Explore the Retro Board code

Before changing code, a good engineer reads it. Open `app.js`. It's organised
into **four clearly commented areas**:

1. **Webex SDK helper (`webexHelper`)** — everything that talks to Webex (who the
   user is, the theme, sharing).
2. **State** — the `board` object and the functions that change it: `addCard`,
   `deleteCard`, `voteCard`, and `saveState`/`loadState` (which use the browser's
   `localStorage`).
3. **Render** — functions that turn the `board` into what you see: `renderBoard`,
   `renderColumn`, `createCardElement`, `updateCounts`.
4. **Events** — wiring buttons and the form to state changes, then re-rendering.

> _More of Task 2 (guided reading exercises) to follow._

---

# Task 3 — Fix bugs & add a feature

This is the main event. First you'll hunt down and fix some **planted bugs**, then
you'll **add a feature** of your own.

## Part A — Find and fix the bugs

> _TODO: list the planted bugs here. For each: a short symptom to reproduce, and a
> `<details>` hint dropdown — students fix them, so don't include the solution._

- [ ] Bug 1 — _symptom / how to reproduce_
- [ ] Bug 2 — _symptom / how to reproduce_
- [ ] Bug 3 — _symptom / how to reproduce_
- [ ] Bug 4 — _symptom / how to reproduce_

## Part B — Add a feature: upvoting

Retros work best when the team can see which points matter most. Your feature: let
people **upvote** a card, so the most-agreed items stand out.

**Goal:** each card has an upvote button and a running vote count. Clicking it adds
a vote and the count updates immediately.

Steps to think about:
1. Where is a card drawn? (Look in the **Render** area — `createCardElement`.)
   Add an upvote button and somewhere to show the count.
2. Where does clicking happen? (Look in the **Events** area.) Wire the button so a
   click calls the right state function.
3. Where does the count actually change? (Look in the **State** area — there's a
   `voteCard` function.) Make sure the number goes up and the board re-renders.

<details>
<summary><b>Hint — where to start</b></summary>

The three areas of `app.js` map to the three steps above: **Render** (show the
button + count), **Events** (react to the click), **State** (change the count).
Follow an existing action like *delete* to see how a button flows through all three.

</details>

### Bonus — reorder cards by votes

Once upvoting works, make each column **sort its cards so the most-upvoted appear at
the top**. When someone votes, the card should move up if it overtakes another.

<details>
<summary><b>Hint</b></summary>

Sorting happens at **render** time. Before drawing a column's cards, sort that
column's list by vote count (highest first). Array `.sort()` with a comparator is
all you need — the state doesn't have to change, only the order you draw them in.

</details>

---

# Task 4 — Make it your own + present

You've now set up, read, fixed, and extended a real app. Time to make it yours.

## Extend it
Pick one or two ideas (or invent your own):

- _TODO: idea 1_
- _TODO: idea 2_
- _TODO: idea 3_

## Present your work
Wrap up by showing the team what you built:

- Demo your app running **inside Webex**.
- Explain one bug you fixed and how you found it.
- Show the feature you added and why you made your choices.

> _TODO: add any presentation format / time limit / rubric for the workshop._
