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
- **Node.js (LTS)** — https://nodejs.org/ (runs the app and its local backend)
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

## 2. Install and run the app locally
Each student runs the Node server from their own project folder. It serves the
front end and backend together. In Terminal, run:
```sh
npm install
npm start
```
Run `npm install` once after cloning the project. Each time you work on it, run
`npm start`. Open `http://localhost:3000` in your browser. The status should say
**Shared board connected**. The server saves the board in `data/board.json` on your
computer, so it is still there after restarting the server.
Outside Webex, the console may show a warning that the Webex SDK isn't available —
that's expected; everything except Webex-only features still works.

> **Keep this running while you develop.** Almost all of your work — fixing bugs and
> adding features — is tested here, locally, with instant reloads.

### Use one shared board with your team

Each student's local server has its own board. To work together on one board, one
person starts their Node server and Quick Tunnel and shares the tunnel URL with the
team. Everyone else opens that same URL in their browser or Webex app. The host's
computer must stay on, with both the Node server and tunnel running. The other
students can still run their own local servers for development; those servers have
separate boards.

The app connects to the Node server at `/api/board` and `/ws`. The server sends the
current board to connected browsers. When someone adds, deletes, or votes on a card,
the server saves the change to `data/board.json` and sends the updated board to
everyone connected to that server. The Webex **Share with everyone** button shares
the app URL; the Node backend keeps the board data in sync.

The trial backend has no login and one board per server. Anyone with the tunnel URL
can view and change that board, so use demo data only and stop the tunnel when the
session is over.

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

1. Leave the Node server running from step 2.
2. Open a **second Terminal window** and run:
   ```sh
   cloudflared tunnel --url http://localhost:3000
   ```
3. Wait for `cloudflared` to print a URL like
   `https://some-words.trycloudflare.com`. Open it in a browser and confirm the
   board loads. Keep this Terminal window open too.

> The tunnel URL is temporary. It stops working when you stop `cloudflared`, and a
> new tunnel may have a different URL. Keep both the Node server and tunnel running
> while you use the app in Webex. Quick Tunnels are intended for testing and
> development, not as a permanent website.

### Alternative for a static demo: GitHub Pages

If you only need to demonstrate the app without a Node backend, you can host
the static files with GitHub Pages instead of running a Quick Tunnel. Push your
project to GitHub, then open its **Settings → Pages** and deploy the `main` branch
from the `/ (root)` folder. GitHub will provide a stable HTTPS URL for the app.
When you follow step 5, use that URL with `/index.html` as the Webex **Start Page URL** and
its host (for example, `<your-username>.github.io`) as the **Valid domain**, instead
of the Quick Tunnel URL.

This is convenient for a static demo, but updates appear only after you push your
changes and Pages finishes deploying. GitHub Pages serves only the front end, so
the board is saved separately in each browser. Use the Node server and Quick Tunnel
for the normal setup and shared boards.

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
  there? If not, check that the Node server and `cloudflared` are both running.
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

# Task 2 — Explore the Retro Board app

The goal of this task is to become more familiar with how the code is structured
and to explore some of the features of the Retro Board app.

Open `app.js`. It's organised into **four clearly commented areas**:

1. **Webex SDK helper (`webexHelper`)** — everything that talks to Webex (who the
   user is, the theme, sharing).
2. **State** — the `board` object and the functions that change it: `addCard`,
   `deleteCard`, `voteCard`, and `saveState`/`loadState` (which use the Node backend
   by default, or `localStorage` as a fallback if the backend is unavailable).
3. **Render** — functions that turn the `board` into what you see: `renderBoard`,
   `renderColumn`, `createCardElement`, `updateCounts`.
4. **Events** — wiring buttons and the form to state changes, then re-rendering.

## Explore the features together

Now that everyone has their own copy running, pick one person's tunnel URL from
Task 1 and have everyone on the team open that same board — inside Webex
(**Open for all** / **Add to tab**) or by pasting the tunnel URL into a browser
tab.

### Features to try

Try these as a team and watch what happens on the other screens:

- **Add a card** to each of the three columns (**Start**, **Stop**, **Continue**).
- **Vote** on a teammate's card.
- **Delete** a card.

Once everyone can see each other's changes show up, your shared board is working
— your Node server keeps one shared board, and everyone who opens the same
tunnel URL is looking at the same board, live. You're ready to move on to the
next task.

---

# Task 3 — Make improvements to the Retro Board app

For this section, the aim will be to extend the functionality of the retro board
app. You will be adding new features of your own and addressing some issues with
the current implementation.

## Part A — Discover some issues

Before adding anything new, try out the board together and see if you can spot
any issues with how it currently behaves.

Discuss in your group what would happen if:
+ You click vote on the same card several times.
+ You start the 5-minute timer, then refresh the page.
+ Two people each start their own timer on their own screens.
+ You delete a card that someone else on the team added.

* **Exercise:** Try these out to determine what the current behaviour is and
  have a think about what the desired behaviour should be.

The most obvious one: right now, anyone can vote on the same card as many
times as they like, which defeats the point of voting in a retro. Can you
think of a good way to prevent this?

- **Exercise:** Change `voteCard` so each person can only vote once per card.

  <details>
  <summary><b>Hint</b></summary>

  You'll need some way of remembering *who* has already voted on a card, not
  just *how many* votes it has got. Look at how `card.votes` is currently
  stored in the **State** area, and think about what shape of data could
  replace a single number.

  </details>

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

- Add an edit button so cards can be changed after they are posted.
- Add filters so the team can show cards by column or vote count.
- Add support for multiple boards, each with its own ID in the URL.

## Present your work
Wrap up by showing the team what you built:

- Demo your app running **inside Webex**.
- Explain one bug you fixed and how you found it.
- Show the feature you added and why you made your choices.

> _TODO: add any presentation format / time limit / rubric for the workshop._
