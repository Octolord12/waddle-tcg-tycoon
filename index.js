require("dotenv").config();
const { App } = require("@slack/bolt");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "cardshop.db");
const db = new sqlite3.Database(dbPath);

const PENGUIN_CARDS = {
  // --- COMMONS ---
  "blue_common": { name: "🐧 Little Blue Penguin (Common)", baseValue: 20, rarity: "Common" },
  "adelie_common": { name: "🎒 Adelie Pebble-Thief (Common)", baseValue: 25, rarity: "Common" },
  "magellanic_common": { name: "🕳️ Magellanic Burrower (Common)", baseValue: 25, rarity: "Common" },
  "humboldt_common": { name: "☀️ Humboldt Sun-Basker (Common)", baseValue: 30, rarity: "Common" },
  "african_common": { name: "🏖️ African Coast Guard (Common)", baseValue: 30, rarity: "Common" },
  "galapagos_common": { name: "🦎 Galapagos Explorer (Common)", baseValue: 35, rarity: "Common" },
  "fjordland_common": { name: "🌿 Fjordland Crested (Common)", baseValue: 35, rarity: "Common" },
  "snares_common": { name: "🪨 Snares Island Forager (Common)", baseValue: 40, rarity: "Common" },
  "erect_common": { name: "📐 Erect-Crested Stylist (Common)", baseValue: 40, rarity: "Common" },
  "yellow_common": { name: "👁️ Yellow-Eyed Lookout (Common)", baseValue: 45, rarity: "Common" },
  "waddle_hatch": { name: "🐣 Waddle Hatchling (Common)", baseValue: 20, rarity: "Common" },
  "snow_fleece": { name: "🧥 Snow-Fleece Yearling (Common)", baseValue: 25, rarity: "Common" },
  "igloo_guard": { name: "🧱 Igloo Gate-Watcher (Common)", baseValue: 30, rarity: "Common" },
  "fish_nibbler": { name: "🐟 Minnow Nibbler (Common)", baseValue: 35, rarity: "Common" },
  "shrimp_snacker": { name: "🦐 Krill Connoisseur (Common)", baseValue: 40, rarity: "Common" },
  // --- UNCOMMONS ---
  "rock_uncommon": { name: "🪨 Rockhopper High-Jumper (Uncommon)", baseValue: 75, rarity: "Uncommon" },
  "chinstrap_uncommon": { name: "🎖️ Chinstrap Sergeant (Uncommon)", baseValue: 80, rarity: "Uncommon" },
  "royal_uncommon": { name: "👑 Royal Crested Courtier (Uncommon)", baseValue: 85, rarity: "Uncommon" },
  "king_chick": { name: "🍼 King Penguin Fledgling (Uncommon)", baseValue: 60, rarity: "Uncommon" },
  "emperor_chick": { name: "❄️ Emperor Downy Chick (Uncommon)", baseValue: 65, rarity: "Uncommon" },
  "deep_diver": { name: "🤿 Pressure-Tested Diver (Uncommon)", baseValue: 70, rarity: "Uncommon" },
  "sled_slider": { name: "🛷 Belly Sled-Racer (Uncommon)", baseValue: 75, rarity: "Uncommon" },
  "ice_fisher": { name: "🎣 Ice-Hole Angler (Uncommon)", baseValue: 80, rarity: "Uncommon" },
  "blizzard_tracker": { name: "🧭 Blizzard Path-Finder (Uncommon)", baseValue: 85, rarity: "Uncommon" },
  "glacier_scout": { name: "🔭 Glacier Recon-Scout (Uncommon)", baseValue: 90, rarity: "Uncommon" },
  "frost_smith": { name: "🔨 Frost-Iron Blacksmith (Uncommon)", baseValue: 95, rarity: "Uncommon" },
  "tundra_merchant": { name: "⚖️ Tundra Fish-Monger (Uncommon)", baseValue: 100, rarity: "Uncommon" },
  "aurora_weaver": { name: "🌌 Aurora Light-Weaver (Uncommon)", baseValue: 105, rarity: "Uncommon" },
  "pack_hunter": { name: "🌊 Pack-Ice Harpooner (Uncommon)", baseValue: 110, rarity: "Uncommon" },
  "kelp_gatherer": { name: "🌱 Deep-Sea Kelp Harvester (Uncommon)", baseValue: 95, rarity: "Uncommon" },
  // --- RARES ---
  "gentoo_rare": { name: "🏎️ Gentoo Rocket-Diver (Rare!)", baseValue: 250, rarity: "Rare" },
  "emperor_rare": { name: "👑 Emperor Overlord (Rare!)", baseValue: 275, rarity: "Rare" },
  "king_rare": { name: "🏰 Golden-Collar King (Rare!)", baseValue: 300, rarity: "Rare" },
  "midnight_forager": { name: "🌙 Midnight Abyss Forager (Rare!)", baseValue: 320, rarity: "Rare" },
  "iceberg_captain": { name: "⚓ Iceberg Dreadnought Captain (Rare!)", baseValue: 340, rarity: "Rare" },
  "frost_mage": { name: "🔮 Sub-Zero Cryomancer (Rare!)", baseValue: 350, rarity: "Rare" },
  "tidal_warden": { name: "🔱 Tidal Barrier Warden (Rare!)", baseValue: 360, rarity: "Rare" },
  "snow_stormer": { name: "🌪️ Snow-Storm Vanguard (Rare!)", baseValue: 375, rarity: "Rare" },
  "sentinel_rare": { name: "🛡️ Permafrost Heavy Guard (Rare!)", baseValue: 380, rarity: "Rare" },
  "orca_trickster": { name: "🐋 Orca-Whispering Druid (Rare!)", baseValue: 400, rarity: "Rare" },
  "vault_overseer": { name: "🔑 High-Security Vault Keeper (Rare!)", baseValue: 350, rarity: "Rare" },
  "glacier_breaker": { name: "🚜 Heavy Icebreaker Engineer (Rare!)", baseValue: 390, rarity: "Rare" },
  // --- ULTRA RARES ---
  "macaroni_ultra": { name: "🕶️ Holographic Macaroni Superstar (ULTRA RARE!!)", baseValue: 1200, rarity: "Ultra Rare" },
  "cyber_emperor": { name: "🤖 Cybernetic Neo-Emperor (ULTRA RARE!!)", baseValue: 1350, rarity: "Ultra Rare" },
  "neon_galapagos": { name: "⚡ Neon-Grid Galapagos (ULTRA RARE!!)", baseValue: 1400, rarity: "Ultra Rare" },
  "cosmic_wanderer": { name: "🪐 Deep Space Cosmic Drifter (ULTRA RARE!!)", baseValue: 1550, rarity: "Ultra Rare" },
  "solar_fjord": { name: "☀️ Solar Flare Fjordland Shaman (ULTRA RARE!!)", baseValue: 1650, rarity: "Ultra Rare" },
  "quantum_hatch": { name: "🌀 Quantum-State Anomaly Hatchling (ULTRA RARE!!)", baseValue: 1800, rarity: "Ultra Rare" },
  // --- MYTHICS ---
  "kraken_mythic": { name: "🐙 Abyssal Kraken Leviathan (MYTHIC!!!)", baseValue: 4500, rarity: "Mythic" },
  "glacier_titan": { name: "🏔️ Primordial Glacier Titan (MYTHIC!!!)", baseValue: 5000, rarity: "Mythic" },
  "phoenix_penguin": { name: "🔥 Ancient Deep-Frost Phoenix (MYTHIC!!!)", baseValue: 5500, rarity: "Mythic" },
  "void_singularity": { name: "🕳️ Singularity Core Void Penguin (MYTHIC!!!)", baseValue: 6500, rarity: "Mythic" }
};

const PACKS = {
  "tundra": { name: "📦 Icy Tundra Pack", cost: 50, rates: { "Common": 65, "Uncommon": 25, "Rare": 9, "Ultra Rare": 1, "Mythic": 0 } },
  "abyssal": { name: "🌊 Abyssal Deep Pack", cost: 150, rates: { "Common": 15, "Uncommon": 45, "Rare": 30, "Ultra Rare": 8, "Mythic": 2 } }
};

function getDailyBounty() {
  const today = new Date().toISOString().split('T')[0]; let hash = 0;
  for (let i = 0; i < today.length; i++) { hash = today.charCodeAt(i) + ((hash << 5) - hash); }
  const nonMythics = Object.keys(PENGUIN_CARDS).filter(k => PENGUIN_CARDS[k].rarity !== "Mythic");
  const cardKey = nonMythics[Math.abs(hash) % nonMythics.length]; const qty = (Math.abs(hash >> 2) % 3) + 1;
  return { cardKey, qty, reward: Math.round(PENGUIN_CARDS[cardKey].baseValue * qty * 1.6) };
}

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS players (user_id TEXT PRIMARY KEY, shop_name TEXT, cash INTEGER DEFAULT 1000, shop_tier INTEGER DEFAULT 1)`);
  db.run(`CREATE TABLE IF NOT EXISTS inventory (item_id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, card_key TEXT, grade TEXT DEFAULT 'Raw', grade_mult REAL DEFAULT 1.0, is_foil INTEGER DEFAULT 0)`);
  db.run(`CREATE TABLE IF NOT EXISTS market_prices (card_key TEXT PRIMARY KEY, current_price INTEGER)`);
  db.run(`CREATE TABLE IF NOT EXISTS active_channels (channel_id TEXT PRIMARY KEY)`);
  db.run(`CREATE TABLE IF NOT EXISTS trades (trade_id INTEGER PRIMARY KEY AUTOINCREMENT, sender_id TEXT, receiver_id TEXT, item_id INTEGER, price INTEGER)`);
  db.run("ALTER TABLE players ADD COLUMN passive_level INTEGER DEFAULT 0", () => {});
  db.run("DELETE FROM active_channels WHERE channel_id LIKE 'D%'");
  for (const key in PENGUIN_CARDS) { db.run("INSERT OR IGNORE INTO market_prices (card_key, current_price) VALUES (?, ?)", [key, PENGUIN_CARDS[key].baseValue]); }
});

const app = new App({ token: process.env.SLACK_BOT_TOKEN, appToken: process.env.SLACK_APP_TOKEN, socketMode: true });

// Live Market Ticker Loop
setInterval(() => {
  db.all("SELECT * FROM market_prices", (err, rows) => {
    if (err || !rows) return;
    let text = "📊 *WADDLE SQUAWK EXCHANGE: LIVE MARKET BREAKOUT* 📊\n_Extreme 50% - 200% price volatility profile active._\n\n";
    rows.forEach((r) => {
      if (!PENGUIN_CARDS[r.card_key]) return;
      const oldP = r.current_price; const fluc = 0.5 + Math.random() * 1.5; const newP = Math.round(PENGUIN_CARDS[r.card_key].baseValue * fluc);
      text += `${newP - oldP >= 0 ? "🔺" : "🔻"} *${PENGUIN_CARDS[r.card_key].name}*\n  • Rate: *$${newP}* (${newP - oldP >= 0 ? "+" : ""}${newP - oldP})\n`;
      db.run("UPDATE market_prices SET current_price = ? WHERE card_key = ?", [newP, r.card_key]);
    });
    db.all("SELECT channel_id FROM active_channels", (ce, cr) => { if (!ce && cr) cr.forEach(c => { try { app.client.chat.postMessage({ channel: c.channel_id, text: text }); } catch(e){} }); });
  });
}, 120000);

setInterval(() => { db.run("UPDATE players SET cash = cash + (shop_tier * 5) + (passive_level * 15)", () => {}); }, 60000);

// RE-BRANDING WIRING
app.command("/waddle-rename", async ({ command, ack, respond }) => {
  await ack(); const uid = command.user_id; const newName = command.text.trim();
  if (!newName) return respond({ text: "❌ *Usage:* Type \`/waddle-rename [Your New Shop Name]\` to re-brand your storefront hub!" });
  if (newName.length > 35) return respond({ text: "❌ *Brand Limit Block:* Keep storefront signatures under 35 characters." });
  db.run("UPDATE players SET shop_name = ? WHERE user_id = ?", [newName, uid], () => {
    respond({ text: `🎉 *Brand Overhaul Complete!* Your enterprise is now operating as: *${newName}*!` });
  });
});

// GLOBAL CARD LOG CHECKLIST CATALOG
app.command("/waddle-library", async ({ command, ack, respond }) => {
  await ack(); const uid = command.user_id;
  db.all("SELECT DISTINCT card_key FROM inventory WHERE user_id = ?", [uid], (err, rows) => {
    if (err) return respond({ text: "❌ Catalog indexing failure." });
    const ownedKeys = new Set(rows ? rows.map(r => r.card_key) : []);
    const tiers = { "Common": [], "Uncommon": [], "Rare": [], "Ultra Rare": [], "Mythic": [] };
    for (const [key, card] of Object.entries(PENGUIN_CARDS)) { tiers[card.rarity].push(`${ownedKeys.has(key) ? "✅" : "❌"} ${card.name.split(" (")[0]}`); }
    const blocks = [{ type: "section", text: { type: "mrkdwn", text: `📜 *WADDLE TCG GLOBAL CARD CATALOG LOG* 📜\n_Overall Index Status: **${ownedKeys.size}/${Object.keys(PENGUIN_CARDS).length}** collected (**${Math.round((ownedKeys.size / Object.keys(PENGUIN_CARDS).length) * 100)}%**)_\n` } }, { type: "divider" }];
    for (const [rarity, list] of Object.entries(tiers)) { blocks.push({ type: "section", text: { type: "mrkdwn", text: `*🔹 ${rarity} Tier Check-list (${list.filter(c => c.startsWith("✅")).length}/${list.length})*\n${list.join("\n")}` } }); }
    respond({ blocks });
  });
});

// MULTIPLAYER DOSSIER INSPECTOR
app.command("/waddle-inspect", async ({ command, ack, respond }) => {
  await ack(); const match = command.text.match(/<@([A-Z0-9]+)>/i); const targetId = match ? match[1] : command.user_id;
  db.get("SELECT * FROM players WHERE user_id = ?", [targetId], (err, player) => {
    if (!player) return respond({ text: `❌ Target <@${targetId}> has not launched a Waddle Shop profile yet.` });
    db.all("SELECT card_key, is_foil FROM inventory WHERE user_id = ?", [targetId], (ie, rows) => {
      let showcase = ""; if (!rows || rows.length === 0) { showcase = "_Vault is completely empty._"; } 
      else {
        const counts = {}; rows.forEach(r => { if (PENGUIN_CARDS[r.card_key]) { const name = r.is_foil === 1 ? `✨ Foil ${PENGUIN_CARDS[r.card_key].name}` : PENGUIN_CARDS[r.card_key].name; counts[name] = (counts[name] || 0) + 1; } });
        showcase = Object.entries(counts).map(([lbl, q]) => `• ${lbl} *x${q}*`).join("\n");
      }
      respond({ blocks: [{ type: "section", text: { type: "mrkdwn", text: `🔍 *TYCOON INSPECTOR DOSSIER: ${player.shop_name}* (<@${targetId}>)\n• Store Level: *Tier ${player.shop_tier}* | Automation: *Level ${player.passive_level}*\n• Capital Balance: **$${player.cash}**` } }, { type: "divider" }, { type: "section", text: { type: "mrkdwn", text: `🗃 *Public Portfolio Inventory:* \n${showcase}` } }] });
    });
  });
});

// Reusable Vault Portfolio Renderer Matrix
function renderVault(userId, respond, header = null) {
  db.all(`SELECT inventory.item_id, inventory.card_key, inventory.grade, inventory.grade_mult, inventory.is_foil, market_prices.current_price FROM inventory JOIN market_prices ON inventory.card_key = market_prices.card_key WHERE inventory.user_id = ?`, [userId], (err, items) => {
    db.get("SELECT cash FROM players WHERE user_id = ?", [userId], (pe, player) => {
      const blocks = [{ type: "section", text: { type: "mrkdwn", text: header || `🗃️ *Your Card Vault Portfolio*\n💰 Liquid Balance: $${player.cash}` } }, { type: "divider" }];
      if (!items || items.length === 0) blocks.push({ type: "section", text: { type: "mrkdwn", text: "_Your vault is empty._" } });
      else {
        items.forEach((item) => {
          if (!PENGUIN_CARDS[item.card_key]) return;
          const isFoil = item.is_foil === 1; const price = Math.round(item.current_price * item.grade_mult * (isFoil ? 2.5 : 1.0));
          const lbl = isFoil ? `✨ *COSMIC FOIL* ✨ ${PENGUIN_CARDS[item.card_key].name}` : PENGUIN_CARDS[item.card_key].name;
          blocks.push({ type: "section", text: { type: "mrkdwn", text: `🃏 ${lbl}\n• Condition: *[${item.grade}]* | Value: *$${price}*` } });
          const btns = [{ type: "button", text: { type: "plain_text", text: "💸 Market Sell" }, action_id: "sell_vault_item", value: `${item.item_id}|${price}|${item.card_key}` }, { type: "button", text: { type: "plain_text", text: "🤝 P2P Trade" }, action_id: "p2p_trade_menu", value: `${item.item_id}|${price}|${item.card_key}` }];
          if (item.grade === "Raw") btns.push({ type: "button", text: { type: "plain_text", text: "🔍 Grade ($100)" }, action_id: "grade_vault_item", value: `${item.item_id}|${item.card_key}` });
          blocks.push({ type: "actions", elements: btns });
        });
      }
      blocks.push({ type: "divider" }, { type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: "🔙 Return to Counter" }, action_id: "back_to_menu" }] });
      respond({ blocks, replace_original: true });
    });
  });
}

function generateMenuBlocks(name, tier, cash, auto = 0, ev = null) {
  const blocks = []; if (ev) blocks.push({ type: "section", text: { type: "mrkdwn", text: ev } }, { type: "divider" });
  blocks.push({ type: "section", text: { type: "mrkdwn", text: `🏪 *${name}* (Tier ${tier})\n💰 *Cash Balance:* $${cash}\n💤 _Passive Generation: +$${(tier * 5) + (auto * 15)}/min (Auto Lvl ${auto})_` } });
  blocks.push({ type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: "📦 Tundra Pack ($50)" }, action_id: "buy_pack_tundra" }, { type: "button", text: { type: "plain_text", text: "🌊 Abyssal Pack ($150)" }, action_id: "buy_pack_abyssal" }, { type: "button", text: { type: "plain_text", text: "🗃️ Open Vault" }, action_id: "view_vault" }, { type: "button", text: { type: "plain_text", text: "🏆 Leaderboard" }, action_id: "view_leaderboard" }] });
  blocks.push({ type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: "🏟️ Host Tournament ($200)" }, action_id: "host_tournament" }, { type: "button", text: { type: "plain_text", text: "🧹 Store Ops & Scavenge" }, action_id: "clean_shop" }, { type: "button", text: { type: "plain_text", text: "📜 Daily Bounty" }, action_id: "view_bounty" }] });
  blocks.push({ type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: `🔼 Upgrade Shop ($${tier * 500})` }, action_id: "upgrade_shop" }, { type: "button", text: { type: "plain_text", text: `🤖 Upgrade Auto ($${(auto + 1) * 300})` }, action_id: "upgrade_automation" }] });
  return blocks;
}

// MAIN DASHBOARD PORTAL
app.command("/play-waddle", async ({ command, ack, respond }) => {
  await ack(); const uid = command.user_id; const channel = command.channel_id.startsWith("D") ? uid : command.channel_id; const initialInput = command.text.trim();
  db.run("INSERT OR IGNORE INTO active_channels (channel_id) VALUES (?)", [channel]);
  db.get("SELECT * FROM players WHERE user_id = ?", [uid], (err, p) => {
    if (!p) {
      if (!initialInput) return respond({ text: "🐧 *Welcome to Waddle TCG Tycoon!* 🐧\nTo claim your storefront slot and register your operational ledger, choose a custom brand name for your shop!\n\n👉 Run: \`/play-waddle [Your Custom Shop Name]\` (e.g., \`/play-waddle Penguin Paradigm\`)" });
      if (initialInput.length > 35) return respond({ text: "❌ *Brand Limit Block:* Storefront names must stay under 35 characters." });
      db.run("INSERT INTO players (user_id, shop_name) VALUES (?, ?)", [uid, initialInput], () => {
        respond({
          blocks: [
            { type: "section", text: { type: "mrkdwn", text: `🏁 *WELCOME TO THE CORE TRAINING LOOP, OPERATOR OF ${initialInput.toUpperCase()}!* (1/3)\n\nYou have been granted **$1,000 baseline capital**. Your store is currently *Tier 1*.\n\n• **Active Grind:** Clicking *Store Ops & Scavenge* lets you manually clean display cases for fast cash, with a **10% chance** to scavenge lost currency bills or drop items directly into your inventory vault!` } },
            { type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: "Next Step: Gacha & Asset Speculation ➡️" }, action_id: "tutorial_step_2", value: "initial", style: "primary" }] }
          ]
        });
      });
      return;
    }
    respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier, p.cash, p.passive_level), replace_original: true });
  });
});

// VOLUNTARY HANDBOOK REPLAY ENTRY GATEWAY (`/waddle-tutorial`)
app.command("/waddle-tutorial", async ({ command, ack, respond }) => {
  await ack(); const uid = command.user_id;
  db.get("SELECT * FROM players WHERE user_id = ?", [uid], (err, p) => {
    if (!p) return respond({ text: "❌ Please register your shop architecture first by running \`/play-waddle [Shop Name]\`!" });
    respond({
      blocks: [
        { type: "section", text: { type: "mrkdwn", text: `🏁 *WELCOME BACK TO WADDLE CORPORATION OPERATIONAL TRAINING* (1/3)\n\nLet's run through a manual refresh of the economic core layers. Remember:\n\n• **Active Scavenging:** Running store cleanup shifts nets you a base wage of \`Shop Tier × $20\` cash, with a rolling **10% loot table check** to fish out lost wallet bills ($50) or raw cards.` } },
        { type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: "Next Step: Gacha & Asset Speculation ➡️" }, action_id: "tutorial_step_2", value: "replay", style: "primary" }] }
      ]
    });
  });
});

// TUTORIAL WIZARD STEP INTERACTION MATRIX
app.action("tutorial_step_2", async ({ ack, body, respond }) => {
  await ack(); const mode = body.actions[0].value || "initial";
  respond({
    blocks: [
      { type: "section", text: { type: "mrkdwn", text: `📦 *TUTORIAL STEP 2: EXPONENTIAL GACHA & VALUATION VAULTS* (2/3)\n\n• **The Card Marketplace:** You can purchase *Tundra Packs ($50)* or premium *Abyssal Packs ($150)* to roll on a massive pool of **52 unique penguin species**.\n• **High Volatility Stock Market:** Every card has a fluctuating live rate that swings **from a 50% crash to a 200% boom** every 2 minutes workspace-wide!\n• **Condition Appraisal:** Pay $100 to submit raw assets into the *Grading Lab* to lock down condition multipliers—but watch out, damaged cards lose half their value!` } },
      { type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: "Next Step: Passive Wealth & Tournaments ➡️" }, action_id: "tutorial_step_3", value: mode, style: "primary" }] }
    ], replace_original: true
  });
});

app.action("tutorial_step_3", async ({ ack, body, respond }) => {
  await ack(); const mode = body.actions[0].value || "initial";
  respond({
    blocks: [
      { type: "section", text: { type: "mrkdwn", text: `🏟️ *TUTORIAL STEP 3: INFRASTRUCTURE & SOCIAL ESCROW* (3/3)\n\n• **Passive Automation:** Upgrading your shop tier and deploying sorting bots generates **unlocked passive income streams** every single minute your bot stays awake.\n• **High-Stakes Brackets:** Spend $200 to fund a tournament for big crowds. You can trigger massive viral jackpots or take heavy losses if a blizzard cuts out the grid!\n• **P2P Marketplace:** Sell assets safely via the live leaderboard or drop invoices straight to rival DMs using the interactive peer trading menu.` } },
      { type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: mode === "replay" ? "🏁 Finish Handbook Review" : "🏁 Finish Tutorial & Claim Starter Pack!" }, action_id: "tutorial_finish", value: mode, style: "primary" }] }
    ], replace_original: true
  });
});

// TUTORIAL TERMINATION GATEWAY (Enforces anti-exploit check bounds)
app.action("tutorial_finish", async ({ ack, body, respond }) => {
  await ack(); const uid = body.user.id; const mode = body.actions[0].value || "initial";

  if (mode === "replay") {
    db.get("SELECT * FROM players WHERE user_id = ?", [uid], (err, p) => {
      respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier, p.cash, p.passive_level, "🏁 *Refresher Training Log Cleared!* No duplicate completion rewards were distributed. Good luck back out on the exchange floor!"), replace_original: true });
    });
    return;
  }

  // Award standard baseline starter card only on their very first onboarding loop run
  const pack = PACKS["tundra"]; const rRoll = Math.floor(Math.random() * 100) + 1; let rarity = "Common"; let sum = 0;
  for (const [r, c] of Object.entries(pack.rates)) { sum += c; if (rRoll <= sum) { rarity = r; break; } }
  const pool = Object.keys(PENGUIN_CARDS).filter(k => PENGUIN_CARDS[k].rarity === rarity);
  const key = pool[Math.floor(Math.random() * pool.length)] || "blue_common";

  db.run("INSERT INTO inventory (user_id, card_key) VALUES (?, ?, 0)", [uid, key], () => {
    db.get("SELECT * FROM players WHERE user_id = ?", [uid], (err, p) => {
      const launchMsg = `🎉 *CONGRATULATIONS! TRAINING COMPLETE!* 🎉\nYou are officially certified open for business. Your first **Icy Tundra Starter Pack** has been opened and sent to your Vault portfolio!\n\n🎁 *Graduation Drop:* You pulled a raw **${PENGUIN_CARDS[key].name}**!`;
      respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier, p.cash, p.passive_level, launchMsg), replace_original: true });
    });
  });
});

// DAILY BOUNTY BOARD INTERFACE
app.action("view_bounty", async ({ ack, body, respond }) => {
  await ack(); const bounty = getDailyBounty(); const meta = PENGUIN_CARDS[bounty.cardKey];
  db.all("SELECT item_id FROM inventory WHERE user_id = ? AND card_key = ? AND is_foil = 0", [body.user.id, bounty.cardKey], (err, rows) => {
    const qty = rows ? rows.length : 0; const ready = qty >= bounty.qty;
    const blocks = [{ type: "section", text: { type: "mrkdwn", text: `📜 *GLOBAL DAILY BOUNTY BOARD* 📜\n📌 *Active Procurement Contract:* Deliver raw **${meta.name}**\n• Required Volume: **x${bounty.qty}**\n• Compensation Payload: **+$${bounty.reward} cash**\n\n${ready ? "✅ *Contract Match:* Ready." : `❌ *Shortage:* You have ${qty}/${bounty.qty} raw items.`}` } }];
    const row = []; if (ready) row.push({ type: "button", text: { type: "plain_text", text: "💼 Fulfill Contract" }, action_id: "fulfill_bounty", value: `${bounty.cardKey}|${bounty.qty}|${bounty.reward}`, style: "primary" });
    row.push({ type: "button", text: { type: "plain_text", text: "🔙 Return" }, action_id: "back_to_menu" });
    blocks.push({ type: "actions", elements: row }); respond({ blocks, replace_original: true });
  });
});

app.action("fulfill_bounty", async ({ ack, body, respond }) => {
  await ack(); const uid = body.user.id; const [key, qStr, rStr] = body.actions[0].value.split("|"); const qty = parseInt(qStr); const reward = parseInt(rStr);
  db.all("SELECT item_id FROM inventory WHERE user_id = ? AND card_key = ? AND is_foil = 0 LIMIT ?", [uid, key, qty], (err, rows) => {
    if (!rows || rows.length < qty) return respond({ text: "❌ Transaction error: Vault contents moved.", replace_original: false });
    const targets = rows.map(r => r.item_id);
    db.run(`DELETE FROM inventory WHERE item_id IN (${targets.map(() => "?").join(",")})`, targets, () => {
      db.get("SELECT * FROM players WHERE user_id = ?", [uid], (pe, p) => {
        db.run("UPDATE players SET cash = ? WHERE user_id = ?", [p.cash + reward, uid], () => { respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier, p.cash + reward, p.passive_level, `💼 *CONTRACT CLEARED:* Turned in x${qty} items for **+$${reward}** compensation credit!`), replace_original: true }); });
      });
    });
  });
});

// GACHA COMPILING PACK ENGINE
async function handlePackPurchase(packKey, uid, respond) {
  const pack = PACKS[packKey];
  db.get("SELECT * FROM players WHERE user_id = ?", [uid], (err, p) => {
    if (p.cash < pack.cost) return respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier, p.cash, p.passive_level, `❌ Need **$${pack.cost}** cash.`), replace_original: true });
    const rRoll = Math.floor(Math.random() * 100) + 1; let rarity = "Common"; let sum = 0;
    for (const [r, c] of Object.entries(pack.rates)) { sum += c; if (rRoll <= sum) { rarity = r; break; } }
    const pool = Object.keys(PENGUIN_CARDS).filter(k => PENGUIN_CARDS[k].rarity === rarity);
    const key = pool[Math.floor(Math.random() * pool.length)] || "blue_common";
    const isFoil = (Math.floor(Math.random() * 100) + 1) <= 5 ? 1 : 0;

    db.get("SELECT current_price FROM market_prices WHERE card_key = ?", [key], (me, m) => {
      const price = Math.round((m ? m.current_price : PENGUIN_CARDS[key].baseValue) * (isFoil ? 2.5 : 1.0));
      db.run("UPDATE players SET cash = ? WHERE user_id = ?", [p.cash - pack.cost, uid], () => {
        const title = isFoil ? `✨🔥 *OMG! HYPER-RARE PULL!* ✨🔥\nYou cracked a glossy **✨ COSMIC FOIL ✨** variant of:\n➡️ *${PENGUIN_CARDS[key].name}*!` : `🎉 *Opened ${pack.name}!* You pulled:\n➡️ *${PENGUIN_CARDS[key].name}*`;
        respond({ blocks: [{ type: "section", text: { type: "mrkdwn", text: `${title}\n• Rarity: *[${rarity}]*` } }, { type: "section", text: { type: "mrkdwn", text: `📈 *Live Valuation Estimate:* $${price}\n💰 Cash Remaining: $${p.cash - pack.cost}` } }, { type: "divider" }, { type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: "🎒 Vault It" }, action_id: "decision_keep", value: `${key}|${isFoil}`, style: "primary" }, { type: "button", text: { type: "plain_text", text: `💰 Quick Sell (+$${Math.floor(price * 0.8)})` }, action_id: "decision_sell", value: `${key}|${Math.floor(price * 0.8)}`, style: "danger" }] }], replace_original: true });
      });
    });
  });
}

app.action("buy_pack_tundra", async ({ ack, body, respond }) => { await ack(); handlePackPurchase("tundra", body.user.id, respond); });
app.action("buy_pack_abyssal", async ({ ack, body, respond }) => { await ack(); handlePackPurchase("abyssal", body.user.id, respond); });

app.action("decision_keep", async ({ ack, body, respond }) => {
  await ack(); const [k, f] = body.actions[0].value.split("|");
  db.run("INSERT INTO inventory (user_id, card_key, is_foil) VALUES (?, ?, ?)", [body.user.id, k, parseInt(f)], () => {
    db.get("SELECT * FROM players WHERE user_id = ?", [body.user.id], (err, p) => { respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier, p.cash, p.passive_level, `🎒 *Vault Encrypted:* Asset secure.`), replace_original: true }); });
  });
});

// DIRECT CONTRACT TRADING ENGINE HANDLERS
app.action("p2p_trade_menu", async ({ ack, body, respond }) => {
  await ack(); const [iid, price, key] = body.actions[0].value.split("|");
  respond({ blocks: [{ type: "section", text: { type: "mrkdwn", text: `🤝 *Propose Direct Trade Contract Offer*\nCard: *${PENGUIN_CARDS[key].name}*\nValue: **$${price}**` } }, { type: "actions", block_id: `${iid}|${price}|${key}`, elements: [{ type: "users_select", placeholder: { type: "plain_text", text: "Target partner..." }, action_id: "send_trade_proposal" }] }, { type: "divider" }, { type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: "🔙 Cancel" }, action_id: "view_vault" }] }], replace_original: true });
});

app.action("send_trade_proposal", async ({ ack, body, respond }) => {
  await ack(); const send = body.user.id; const recv = body.actions[0].selected_user; const [iid, p, key] = body.actions[0].block_id.split("|");
  if (send === recv) return respond({ text: "❌ Self-trading blocked.", replace_original: false });
  db.run("INSERT INTO trades (sender_id, receiver_id, item_id, price) VALUES (?, ?, ?, ?)", [send, recv, iid, p], function() {
    db.get("SELECT grade, is_foil FROM inventory WHERE item_id = ?", [iid], async (ie, item) => {
      try {
        await app.client.chat.postMessage({ channel: recv, text: `🤝 Incoming Trade Proposal from <@${send}>!`, blocks: [{ type: "section", text: { type: "mrkdwn", text: `🤝 *INCOMING TRADE PROPOSAL*\n💰 <@${send}> is pitching a card buyout offer:\n• Card: ${item.is_foil===1?"✨ Foil ":""}*${PENGUIN_CARDS[key].name}*\n• Grade: *[${item.grade}]*\n🔥 Total Bill: **$${p} cash**` } }, { type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: "✅ Accept" }, action_id: "accept_trade", value: `${this.lastID}`, style: "primary" }, { type: "button", text: { type: "plain_text", text: "❌ Decline" }, action_id: "decline_trade", value: `${this.lastID}`, style: "danger" }] }] });
        respond({ text: "✅ *Proposal dispatched directly to partner.*", replace_original: false });
      } catch(e) { respond({ text: "❌ Target user has not opened an active profile counter yet.", replace_original: false }); }
    });
  });
});

app.action("accept_trade", async ({ ack, body, respond }) => {
  await ack(); const recv = body.user.id; const tid = body.actions[0].value;
  db.get("SELECT * FROM trades WHERE trade_id = ?", [tid], (te, t) => {
    if (!t) return respond({ text: "❌ Expired offer contract.", replace_original: true });
    db.get("SELECT cash FROM players WHERE user_id = ?", [recv], (pe, buyer) => {
      if (buyer.cash < t.price) return respond({ text: "❌ Escrow block: Insufficient funds.", replace_original: true });
      db.get("SELECT user_id, card_key FROM inventory WHERE item_id = ?", [t.item_id], (ie, item) => {
        if (!item || item.user_id !== t.sender_id) { respond({ text: "❌ Card left owner portfolio tracker.", replace_original: true }); db.run("DELETE FROM trades WHERE trade_id = ?", [tid]); return; }
        db.run("UPDATE players SET cash = cash - ? WHERE user_id = ?", [t.price, recv], () => {
          db.run("UPDATE players SET cash = cash + ? WHERE user_id = ?", [t.price, t.sender_id], () => {
            db.run("UPDATE inventory SET user_id = ? WHERE item_id = ?", [recv, t.item_id], async () => {
              db.run("DELETE FROM trades WHERE trade_id = ?", [tid]); respond({ text: `🎉 Acquired *${PENGUIN_CARDS[item.card_key].name}*!`, replace_original: true });
              try { await app.client.chat.postMessage({ channel: t.sender_id, text: `🤝 <@${recv}> accepted trade contract and paid **+$${t.price}**!` }); } catch(e){}
            });
          });
        });
      });
    });
  });
});

app.action("decline_trade", async ({ ack, body, respond }) => { await ack(); db.get("SELECT * FROM trades WHERE trade_id = ?", [body.actions[0].value], (err, t) => { if (t) db.run("DELETE FROM trades WHERE trade_id = ?", [t.trade_id], async () => { respond({ text: "❌ Dropped.", replace_original: true }); try { await app.client.chat.postMessage({ channel: t.sender_id, text: "👎 Offer declined." }); }catch(e){} }); }); });
app.action("decision_sell", async ({ ack, body, respond }) => { await ack(); const [k, cash] = body.actions[0].value.split("|"); db.get("SELECT * FROM players WHERE user_id = ?", [body.user.id], (err, p) => { db.run("UPDATE players SET cash = ? WHERE user_id = ?", [p.cash + Number(cash), body.user.id], () => { respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier, p.cash + Number(cash), p.passive_level, `💰 Sold for **+$${cash}**`), replace_original: true }); }); }); });
app.action("view_vault", async ({ ack, body, respond }) => { await ack(); renderVault(body.user.id, respond); });
app.action("sell_vault_item", async ({ ack, body, respond }) => { await ack(); const uid = body.user.id; const [iid, val] = body.actions[0].value.split("|"); db.run("DELETE FROM inventory WHERE item_id = ? AND user_id = ?", [iid, uid], () => { db.get("SELECT cash FROM players WHERE user_id = ?", [uid], (pe, p) => { db.run("UPDATE players SET cash = ? WHERE user_id = ?", [p.cash + Number(val), uid], () => { renderVault(uid, respond, `💸 Liquidated asset for **+$${val}** cash!`); }); }); }); });

// GRADING FACILITY
app.action("grade_vault_item", async ({ ack, body, respond }) => {
  await ack(); const uid = body.user.id; const [iid, key] = body.actions[0].value.split("|");
  db.get("SELECT * FROM players WHERE user_id = ?", [uid], (err, p) => {
    if (p.cash < 100) return respond({ text: "❌ Need $100 submission fee!", replace_original: false });
    const roll = Math.floor(Math.random() * 100) + 1; let grade = "👍 PSA 8 Near-Mint"; let m = 1.1;
    if (roll <= 10) { grade = "🌟 PSA 10 Gem Mint"; m = 3.0; } else if (roll <= 40) { grade = "✨ PSA 9 Mint"; m = 1.5; } else if (roll > 85) { grade = "❌ PSA 5 Damaged"; m = 0.5; }
    db.run("UPDATE players SET cash = ? WHERE user_id = ?", [p.cash - 100, uid], () => {
      db.run("UPDATE inventory SET grade = ?, grade_mult = ? WHERE item_id = ? AND user_id = ?", [grade, m, iid, uid], () => {
        db.get("SELECT is_foil FROM inventory WHERE item_id = ?", [iid], (fe, row) => { renderVault(uid, respond, `🔍 *LAB REPORT:* ${row.is_foil===1?"✨ Foil ":""}*${PENGUIN_CARDS[key].name}* certified **[${grade}]** (${m}x premium stacked!)`); });
      });
    });
  });
});

// HIGH-CHAOS TOURNAMENT ENGINE
app.action("host_tournament", async ({ ack, body, respond }) => {
  await ack(); const uid = body.user.id; db.get("SELECT * FROM players WHERE user_id = ?", [uid], (err, p) => {
    if (p.cash < 200) return respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier, p.cash, p.passive_level, "❌ Need $200 operations capital!"), replace_original: true });
    const roll = Math.floor(Math.random() * 100) + 1; let title = ""; let rev = 0;
    if (roll <= 15) { title = "🌧️ *Disaster Blizzard!* Power grid cutout."; rev = Math.floor(Math.random() * 30); } 
    else if (roll <= 65) { title = "🃏 *Standard Turnout.* Casual brackets played."; rev = Math.floor(Math.random() * 150) + 40; } 
    else if (roll <= 95) { title = "🔥 *Hype Turnout!* Collectors trading live."; rev = Math.floor(Math.random() * 250) + 180; } 
    else { title = "👑 *Regional Championship Blowout!* Streamers covering finals."; rev = Math.floor(Math.random() * 500) + 450; }
    const profit = (rev + (p.shop_tier - 1) * 75) - 200;
    db.run("UPDATE players SET cash = ? WHERE user_id = ?", [p.cash + profit, uid], () => { respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier, p.cash + profit, p.passive_level, `🏟️ *TOURNAMENT EXECUTION REPORT*\n${title}\n• Net Change: **${profit>=0?"+":""}$${profit}** cash allocation credit.`), replace_original: true }); });
  });
});

// CORE MANAGEMENT INFRASTRUCTURE BUTTONS
app.action("upgrade_shop", async ({ ack, body, respond }) => { await ack(); db.get("SELECT * FROM players WHERE user_id = ?", [body.user.id], (err, p) => { const cost = p.shop_tier * 500; if (p.cash < cost) return respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier, p.cash, p.passive_level, `❌ Need $${cost}!`), replace_original: true }); db.run("UPDATE players SET shop_tier = ?, cash = ? WHERE user_id = ?", [p.shop_tier + 1, p.cash - cost, body.user.id], () => { respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier + 1, p.cash - cost, p.passive_level, `🔨 Upgraded to Tier *${p.shop_tier + 1}*!`), replace_original: true }); }); }); });
app.action("upgrade_automation", async ({ ack, body, respond }) => { await ack(); db.get("SELECT * FROM players WHERE user_id = ?", [body.user.id], (err, p) => { const cost = (p.passive_level + 1) * 300; if (p.cash < cost) return respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier, p.cash, p.passive_level, `❌ Need $${cost}!`), replace_original: true }); db.run("UPDATE players SET passive_level = ?, cash = ? WHERE user_id = ?", [p.passive_level + 1, p.cash - cost, body.user.id], () => { respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier, p.cash - cost, p.passive_level + 1, `🤖 Automation Level *${p.passive_level + 1}* deployed.`), replace_original: true }); }); }); });
app.action("view_leaderboard", async ({ ack, body, respond }) => { await ack(); db.all("SELECT shop_name, cash, shop_tier FROM players ORDER BY cash DESC LIMIT 5", (err, rows) => { const blocks = [{ type: "section", text: { type: "mrkdwn", text: "🏆 *WADDLE TCG TYCOON LEADERBOARD* 🏆" } }, { type: "divider" }]; rows.forEach((r, i) => { blocks.push({ type: "section", text: { type: "mrkdwn", text: `${i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1+'.'} *${r.shop_name}* (Tier ${r.shop_tier}) • Valuation: *$${r.cash}*` } }); }); blocks.push({ type: "divider" }, { type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: "🔙 Return" }, action_id: "back_to_menu" }] }); respond({ blocks, replace_original: true }); }); });
app.action("clean_shop", async ({ ack, body, respond }) => { await ack(); db.get("SELECT * FROM players WHERE user_id = ?", [body.user.id], (err, p) => { const base = p.shop_tier * 20; let cash = p.cash + base; const roll = Math.floor(Math.random() * 100) + 1; if (roll <= 8) { db.run("UPDATE players SET cash = ? WHERE user_id = ?", [cash + 50, body.user.id], () => { respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier, cash + 50, p.passive_level, `🧹 Shift complete (+$${base}). 💵 BONUS: Scavenged a **+$50** bill!`), replace_original: true }); }); } else if (roll <= 10) { db.run("UPDATE players SET cash = ? WHERE user_id = ?", [cash, body.user.id], () => { db.run("INSERT INTO inventory (user_id, card_key) VALUES (?, ?)", [body.user.id, "blue_common"], () => { respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier, cash, p.passive_level, `🧹 Shift complete (+$${base}). 🃏 MEGA BONUS: Found a lost card!`), replace_original: true }); }); }); } else { db.run("UPDATE players SET cash = ? WHERE user_id = ?", [cash, body.user.id], () => { respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier, cash, p.passive_level, `🧹 Wiped display structures clear. *Earned +$${base}*`), replace_original: true }); }); } }); });
app.action("back_to_menu", async ({ ack, body, respond }) => { await ack(); db.get("SELECT * FROM players WHERE user_id = ?", [body.user.id], (err, p) => { respond({ blocks: generateMenuBlocks(p.shop_name, p.shop_tier, p.cash, p.passive_level), replace_original: true }); }); });

(async () => { await app.start(); console.log("game active"); })();