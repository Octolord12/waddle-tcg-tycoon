Waddle TCG Tycoon 🐧🃏🏭

I Declare to the use of A.I in this project. I used it to scale and refine the ideas that I had.

Welcome to Waddle TCG Tycoon! An economy-driven Slack simulation game powered by the Bolt framework. Step into the flippers of an enterprising manager running a Trading Card Game shop. From cracking card packs and submitting raw assets to the Grading Lab, to running tournament brackets and out-bidding rivals across a live, volatile global marketplace.

---
Disclaimer: A lot of this code was done by AI. I do not have a huge CS background, so I designed the initial features and had AI help me to scale and modify them. 

Core Gameplay & Features

- Live Volatile Market Exchange: A decentralized marketplace cycle triggers global price spikes and crashes (50% to 200% base value fluctuations) every 2 minutes workspace-wide.
- Card Pack Gacha Mechanics: Pull from 52 unique penguin cards across 5 distinct rarity tiers (Common to Mythic), with a rolling 5% chance to score a premium ` COSMIC FOIL ` variant worth a 2.5x price multiplier.
- Grading Lab Appraisals: Risk capital on the appraisal table ($100 fee) to turn a "Raw" status card into a multiplier stacker (up to 3.0x value for a PSA 10 Gem Mint, or risk value loss for damage.
- P2P Escrow & Trading: Seamless peer-to-peer trading via Slack direct message payloads with active cash balance and portfolio ownership verification checks.
- Shop Ops & Automation: Run manual active scavenging shifts to sweep the sales counter for fast cash, or scale shop infrastructure tiers and checkout-bots for passive production income every minute.

---

Tech Stack & Database Architecture

- Runtime Environment: Node.js (v18+)
- Application Engine: `@slack/bolt` (Socket Mode setup)
- Database Storage Engine: SQLite3 (Local file-based persistent logging)

Database Matrix

The application handles persistent local storage through five primary data structures mapping transactional game layers:

| Table | Primary / Key Relations | Managed Columns / Default Targets | Purpose |
| :--- | :--- | :--- | :--- |
| **`players`** | `user_id` (PK) | `shop_name`, `cash` ($1000 base), `shop_tier`, `passive_level` | Stores corporate balance sheets and automation tiers. |
| **`inventory`** | `item_id` (PK Auto) | `user_id`, `card_key`, `grade` ('Raw'), `grade_mult` (1.0), `is_foil` | Tracks individual instances of card ownership and conditions. |
| **`market_prices`**| `card_key` (PK) | `current_price` | Tracks dynamic value shifts updated via live ticks. |
| **`active_channels`**| `channel_id` (PK) | N/A | Maps broadcast channels authorized to accept ticker dumps. |
| **`trades`** | `trade_id` (PK Auto)| `sender_id`, `receiver_id`, `item_id`, `price` | Holds outstanding P2P buyout escrow agreements. |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js installed locally.
- A registered Slack App profile within your workspace configuration portal configured with **Socket Mode** enabled.
- App scopes required: `chat:write`, `commands`.

### Installation & Launch

1. **Clone and navigate to the project directory:**
   ```bash
   git clone [https://github.com/Octolord12/waddle-tcg-tycoon.git](https://github.com/Octolord12/waddle-tcg-tycoon.git)
   cd waddle-tcg-tycoon

2. Create a .env file in the project root directory
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_APP_TOKEN=xapp-your-app-token
   SLACK_APP_TOKEN=xapp-your-app-token

3. Install core dependencies
   npm install dotenv @slack/bolt sqlite3
   
4. Boot up the server
   node index.js


Commands
/play-waddle
    Bootstraps user profile registration or brings up the main action menu dashboard.
/waddle-library
    Displays complete index logs of the 52-card catalog with a percentage compilation tracker.
/waddle-inspect
    Pulls the public profile, store tier, and deep portfolio breakdown of any target peer.
/waddle-rename
    Updates configuration logs to modify your public retail brand name registry.
/waddle-tutorial
    Replays the onboarding manual documentation blocks.



# `DEVLOGS.md`

```markdown
# 🛠️ Waddle TCG Tycoon Development Logs

## [v1.0.0] - Core Economic Engine & Slack Bolt Integration
### Added
- **Slack Bolt Wrapper Foundations:** Initialized integration using `@slack/bolt` running on Socket Mode pipelines to bypass hardcoded external webhook requirements.
- **Persistent Database Infrastructure:** Structured an isolated SQLite3 schema engine (`cardshop.db`) supporting 5 baseline operational layers: `players`, `inventory`, `market_prices`, `active_channels`, and `trades`.
- **The 52-Card Penguin Meta:** Configured a static look-up dictionary holding 52 collectible assets split systematically into 5 core rarity tiers:
  - **Commons:** Base values $20 to $45 (e.g., *Little Blue Penguin*, *Waddle Hatchling*).
  - **Uncommons:** Base values $60 to $110 (e.g., *Rockhopper High-Jumper*, *Aurora Light-Weaver*).
  - **Rares:** Base values $250 to $400 (e.g., *Gentoo Rocket-Diver*, *Orca-Whispering Druid*).
  - **Ultra Rares:** Base values $1200 to $1800 (e.g., *Holographic Macaroni Superstar*, *Quantum-State Anomaly*).
  - **Mythics:** Base values $4500 to $6500 (e.g., *Abyssal Kraken Leviathan*, *Void Singularity*).

### Changed
- **Gacha Pack Distribution Matrix:** Refined RNG drop mechanics for the two default packaging engines:
  - `📦 Icy Tundra Pack` ($50): 65% Common | 25% Uncommon | 9% Rare | 1% Ultra Rare | 0% Mythic.
  - `🌊 Abyssal Deep Pack` ($150): 15% Common | 45% Uncommon | 30% Rare | 8% Ultra Rare | 2% Mythic.

---

## [v1.1.0] - Live Volatility Loops & Active/Passive Balancing
### Added
- **Waddle Squawk Exchange Ticker:** Built a live execution interval running a market tick cycle every 120 seconds. Prices dynamically shift from a **50% market crash** to a **200% bull-run boom** calculated against the card's original baseline value.
- **Passive Automation Yields:** Added a background ledger engine updating user cash reserves every 60 seconds based on current structural scale formulas: `(shop_tier * 5) + (passive_level * 15) / minute`.
- **Active Scavenging Shift Commands:** Wired the `clean_shop` interaction layer. Users execute active sweep actions yielding raw capital payouts equal to `Shop Tier × $20`. 
- **Loot Table Roll Overrides:** Added a rolling **10% chance wrapper** on active store sweeps to surface lost assets: an 8% chance to scavenge a cold $50 bill bonus, or a 2% chance to salvage a raw card straight into the vault.

---

## [v1.2.0] - Grading Labs, P2P Escrow, and Procurement Boards
### Added
- **The Grading Lab Appraisal Matrix:** Deployed a risk-reward card assessment machine. For a flat $100 processing fee, a card's "Raw" state is checked against a dynamic quality curve:
  - **10% Chance:** *PSA 10 Gem Mint* ➡️ **3.0x** Value Multiplier Stack.
  - **30% Chance:** *PSA 9 Mint* ➡️ **1.5x** Value Multiplier Stack.
  - **45% Chance:** *PSA 8 Near-Mint* ➡️ **1.1x** Value Multiplier Stack.
  - **15% Chance:** *PSA 5 Damaged* ➡️ **0.5x** Value Degradation Drop.
- **P2P Escrow Clearinghouse:** Created an absolute direct transaction module. Users choose peers via an interactive `users_select` Block Kit layout. Offers write directly to a `trades` matrix table, verifying funds and card ownership before completing asset transfers.
- **Dynamic Procurement Contracts:** Built a daily bounty tracking module using a time-stamped hash algorithm. The machine generates a workspace-wide daily contract demanding a specific volume of raw matching assets in exchange for a **1.6x premium valuation payout**.
- **High-Chaos Tournament Engine:** Implemented a high-stakes bracket system costing $200 to fund, rolling against a 4-tier risk table:
  - *Disaster Blizzard (15%):* Grid collapse; small payout return ($0–$30).
  - *Standard Turnout (50%):* Moderate attendance earnings ($40–$150).
  - *Hype Turnout (30%):* Live collection frenzy ($180–$250).
  - *Regional Championship (5%):* Broadcast blowout earnings ($450–$500).

### Fixed
- **DM Navigation Safety Patch:** Injected a sanitation command (`DELETE FROM active_channels WHERE channel_id LIKE 'D%'`) during database serialization to prevent global stock ticker loops from crashing when treating private Direct Messages as public broadcast channels.
- **Exploit Prevention Bounds:** Isolated initial onboarding gift configurations via specific payload tags, locking down user verification checks so players can't repeatedly loop through the handbook tutorial wizard to mine free starter items.
