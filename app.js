/*
 * Team Retro Board — Webex Embedded App
 * Organised into four areas:
 *   1) webexHelper  — everything that talks to the Webex SDK
 *   2) State        — the board data + how it changes (+ persistence)
 *   3) Render       — turning state into DOM
 *   4) Events       — wiring buttons/forms to state, then re-rendering
 */

// ----- The three columns, defined once -----
const COLUMNS = ["start", "stop", "continue"];

// ----- App state: one object holds the whole board -----
let board = { cards: [] };

/* =========================================================
 * 1) WEBEX SDK HELPER
 * Wraps the v2 Embedded Apps SDK so the rest of the app
 * doesn't need to know SDK details.
 * ========================================================= */
const webexHelper = {
  app: null,

  // Create the SDK app object and wait until it's ready.
  async init() {
    if (!window.webex || !window.webex.Application) {
      console.warn("Webex SDK not found — running outside Webex? UI still works.");
      return false;
    }
    this.app = new window.webex.Application();
    await this.app.onReady();
    return true;
  },

  // Read the signed-in user's display name (may be empty if PII disabled).
  getUserName() {
    try {
      const user = this.app && this.app.application.states.user;
      if (user && user.displayName) return user.displayName;
    } catch (e) {
      // fall through to default
    }
    return "there";
  },

  // Apply LIGHT/DARK theme to the page by setting a data attribute.
  applyTheme(theme) {
    const value = theme === "DARK" ? "DARK" : "LIGHT";
    document.documentElement.dataset.theme = value;
    const badge = document.getElementById("theme-badge");
    if (badge) badge.textContent = value;
  },

  // Match Webex's theme now, and keep matching when the user changes it.
  watchTheme() {
    if (!this.app) return;
    this.applyTheme(this.app.theme);
    this.app.listen().then(() => {
      this.app.on("application:themeChanged", (theme) => this.applyTheme(theme));
    }).catch((reason) => console.warn("Could not listen for theme changes:", reason));
  },

  // Share the board with everyone in the meeting/space.
  shareBoard() {
    if (!this.app) {
      alert("Sharing only works when the app is running inside Webex.");
      return;
    }
    if (this.app.isShared) return; // already shared — do nothing
    const url = window.location.href;
    this.app.setShareUrl(url, "", "Team Retro Board")
      .catch((code) => console.warn("setShareUrl failed:", code));
  },
};

/* =========================================================
 * 2) STATE — how the board changes
 * ========================================================= */

// Make a reasonably unique id for a new card.
function makeId() {
  return "c_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}

// Add a card to a column. Returns the new card, or null if rejected.
function addCard(text, column) {
  const clean = (text || "").trim();
  if (clean === "") return null;                 // validation: no empty cards
  if (!COLUMNS.includes(column)) return null;    // validation: real column only
  const card = {
    id: makeId(),
    text: clean,
    column: column,
    votes: 0,
    author: webexHelper.getUserName(),
  };
  board.cards.push(card);
  saveState();
  return card;
}

// Delete a card by its unique id.
function deleteCard(id) {
  board.cards = board.cards.filter((card) => card.id !== id);
  saveState();
}

// Add one vote to a card by id.
function voteCard(id) {
  const card = board.cards.find((c) => c.id === id);
  if (card) {
    card.votes += 1;
    saveState();
  }
}

// Persist the board so a refresh doesn't lose it.
// (In the backend stretch goal, these two functions call the API instead.)
function saveState() {
  try {
    localStorage.setItem("retroBoard", JSON.stringify(board));
  } catch (e) {
    console.warn("Could not save board:", e);
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem("retroBoard");
    if (saved) board = JSON.parse(saved);
  } catch (e) {
    console.warn("Could not load board:", e);
    board = { cards: [] };
  }
}

/* =========================================================
 * 3) RENDER — turning state into DOM
 * ========================================================= */

// Escape user text so it can't inject HTML into the page.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Build the DOM element for a single card.
function createCardElement(card) {
  const li = document.createElement("li");
  li.className = "card";
  li.dataset.id = card.id;
  li.innerHTML =
    '<p class="card-text">' + escapeHtml(card.text) + "</p>" +
    '<div class="card-footer">' +
      '<span class="card-author">' + escapeHtml(card.author) + "</span>" +
      '<span class="card-actions">' +
        '<button type="button" class="vote-btn">▲ <span class="vote-count">' + card.votes + "</span></button>" +
        '<button type="button" class="delete-btn">Delete</button>' +
      "</span>" +
    "</div>";
  return li;
}

// Render one column's cards.
function renderColumn(columnKey) {
  const section = document.querySelector('.column[data-column="' + columnKey + '"]');
  if (!section) return;
  const list = section.querySelector(".card-list");
  list.innerHTML = "";
  board.cards
    .filter((card) => card.column === columnKey)
    .forEach((card) => list.appendChild(createCardElement(card)));
}

// Update the little count badge on each column.
function updateCounts() {
  COLUMNS.forEach((key) => {
    const section = document.querySelector('.column[data-column="' + key + '"]');
    if (!section) return;
    const count = board.cards.filter((card) => card.column === key).length;
    section.querySelector(".column-count").textContent = count;
  });
}

// Render the whole board.
function renderBoard() {
  COLUMNS.forEach((key) => renderColumn(key));
  updateCounts();
}

/* =========================================================
 * 4) EVENTS — wire the UI to state, then re-render
 * ========================================================= */

function wireEvents() {
  // Add card form
  const form = document.getElementById("add-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const textEl = document.getElementById("card-text");
    const columnEl = document.getElementById("column-select");
    const added = addCard(textEl.value, columnEl.value);
    if (added) {
      textEl.value = "";
      renderBoard();
    }
  });

  // Vote / delete via event delegation on the board
  document.querySelector(".board").addEventListener("click", (e) => {
    const cardEl = e.target.closest(".card");
    if (!cardEl) return;
    const id = cardEl.dataset.id;
    if (e.target.closest(".delete-btn")) {
      deleteCard(id);
      renderBoard();
    } else if (e.target.closest(".vote-btn")) {
      voteCard(id);
      renderBoard();
    }
  });

  // Share button
  document.getElementById("share-btn")
    .addEventListener("click", () => webexHelper.shareBoard());

  // Timer button (simple 5-minute countdown)
  wireTimer();
}

function wireTimer() {
  const btn = document.getElementById("timer-btn");
  const display = document.getElementById("timer-display");
  let remaining = 5 * 60;
  let handle = null;

  function format(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
  }

  btn.addEventListener("click", () => {
    if (handle) {                      // running -> stop/reset
      clearInterval(handle);
      handle = null;
      remaining = 5 * 60;
      display.hidden = true;
      btn.textContent = "Start 5-min timer";
      return;
    }
    remaining = 5 * 60;
    display.hidden = false;
    display.textContent = format(remaining);
    btn.textContent = "Stop timer";
    handle = setInterval(() => {
      remaining -= 1;
      display.textContent = format(remaining);
      if (remaining <= 0) {
        clearInterval(handle);
        handle = null;
        btn.textContent = "Start 5-min timer";
      }
    }, 1000);
  });
}

/* =========================================================
 * BOOTSTRAP
 * ========================================================= */
async function init() {
  loadState();
  wireEvents();
  renderBoard();

  const ready = await webexHelper.init();
  if (ready) {
    document.getElementById("greeting").textContent = webexHelper.getUserName();
    webexHelper.watchTheme();
  }
}

document.addEventListener("DOMContentLoaded", init);
