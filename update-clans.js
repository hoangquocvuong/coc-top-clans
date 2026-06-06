const fs = require("fs");

const TOKEN = process.env.COC_TOKEN;

if (!TOKEN) {
  console.error("Missing COC_TOKEN secret");
  process.exit(1);
}

const API_BASE = "https://api.clashofclans.com/v1";

const JOBS = [
  {
    name: "Top Global Clans",
    url: `${API_BASE}/locations/global/rankings/clans?limit=200`,
    file: "top_clans.json",
    key: "clans",
    normalize: normalizeClan
  },
  {
    name: "Top Global Players",
    url: `${API_BASE}/locations/global/rankings/players?limit=200`,
    file: "top_players.json",
    key: "players",
    normalize: normalizePlayer
  },
  {
  name: "Top Builder Players",
  url: `${API_BASE}/locations/global/rankings/players-builder-base?limit=200`,
  file: "top_builder_players.json",
  key: "players",
  normalize: normalizeBuilderPlayer
},
{
  name: "Top Builder Clans",
  url: `${API_BASE}/locations/global/rankings/clans-builder-base?limit=200`,
  file: "top_builder_clans.json",
  key: "clans",
  normalize: normalizeBuilderClan
},
  {
    name: "Top Clan Capital Clans",
    url: `${API_BASE}/locations/global/rankings/capitals?limit=200`,
    file: "top_capital_clans.json",
    key: "clans",
    normalize: normalizeCapitalClan
  }
];

function normalizeBuilderPlayer(p) {
  return {
    rank: p.rank || 0,
    previousRank: p.previousRank || 0,
    tag: p.tag || "",
    name: p.name || "",
    expLevel: p.expLevel || 0,
    builderBaseTrophies: p.builderBaseTrophies || p.versusTrophies || 0,
    trophies: p.builderBaseTrophies || p.versusTrophies || 0,
    clan: p.clan
      ? {
          tag: p.clan.tag || "",
          name: p.clan.name || "",
          badgeUrls: {
            small: p.clan.badgeUrls?.small || "",
            medium: p.clan.badgeUrls?.medium || "",
            large: p.clan.badgeUrls?.large || ""
          }
        }
      : null
  };
}

function normalizeBuilderClan(c) {
  return {
    rank: c.rank || 0,
    previousRank: c.previousRank || 0,
    tag: c.tag || "",
    name: c.name || "",
    clanLevel: c.clanLevel || 0,
    members: c.members || 0,
    clanBuilderBasePoints: c.clanBuilderBasePoints || c.clanVersusPoints || 0,
    clanVersusPoints: c.clanBuilderBasePoints || c.clanVersusPoints || 0,
    badgeUrls: {
      small: c.badgeUrls?.small || "",
      medium: c.badgeUrls?.medium || "",
      large: c.badgeUrls?.large || ""
    }
  };
}

function normalizeClan(c) {
  return {
    rank: c.rank || 0,
    previousRank: c.previousRank || 0,
    tag: c.tag || "",
    name: c.name || "",
    clanLevel: c.clanLevel || 0,
    members: c.members || 0,
    clanPoints: c.clanPoints || 0,
    clanVersusPoints: c.clanVersusPoints || 0,
    location: c.location
      ? {
          id: c.location.id || 0,
          name: c.location.name || "",
          isCountry: !!c.location.isCountry,
          countryCode: c.location.countryCode || ""
        }
      : null,
    badgeUrls: {
      small: c.badgeUrls?.small || "",
      medium: c.badgeUrls?.medium || "",
      large: c.badgeUrls?.large || ""
    }
  };
}

function normalizePlayer(p) {
  return {
    rank: p.rank || 0,
    previousRank: p.previousRank || 0,
    tag: p.tag || "",
    name: p.name || "",
    expLevel: p.expLevel || 0,
    trophies: p.trophies || 0,
    attackWins: p.attackWins || 0,
    defenseWins: p.defenseWins || 0,
    clan: p.clan
      ? {
          tag: p.clan.tag || "",
          name: p.clan.name || "",
          badgeUrls: {
            small: p.clan.badgeUrls?.small || "",
            medium: p.clan.badgeUrls?.medium || "",
            large: p.clan.badgeUrls?.large || ""
          }
        }
      : null,
    league: p.league
      ? {
          id: p.league.id || 0,
          name: p.league.name || "",
          iconUrls: {
            small: p.league.iconUrls?.small || "",
            medium: p.league.iconUrls?.medium || "",
            tiny: p.league.iconUrls?.tiny || ""
          }
        }
      : null
  };
}

function normalizeCapitalClan(c) {
  return {
    rank: c.rank || 0,
    previousRank: c.previousRank || 0,
    tag: c.tag || "",
    name: c.name || "",
    clanLevel: c.clanLevel || 0,
    members: c.members || 0,
    clanCapitalPoints: c.clanCapitalPoints || c.capitalPoints || 0,
	capitalPoints: c.clanCapitalPoints || c.capitalPoints || 0,
    location: c.location
      ? {
          id: c.location.id || 0,
          name: c.location.name || "",
          isCountry: !!c.location.isCountry,
          countryCode: c.location.countryCode || ""
        }
      : null,
    badgeUrls: {
      small: c.badgeUrls?.small || "",
      medium: c.badgeUrls?.medium || "",
      large: c.badgeUrls?.large || ""
    }
  };
}

function readOldItems(file, key) {
  try {
    if (!fs.existsSync(file)) return null;

    const oldData = JSON.parse(fs.readFileSync(file, "utf8"));

    return Array.isArray(oldData[key])
      ? oldData[key]
      : null;

  } catch (e) {
    console.warn(`Could not read ${file}, will rewrite.`);
    return null;
  }
}

function itemsAreSame(oldItems, newItems) {
  if (!oldItems || !Array.isArray(oldItems)) return false;
  return JSON.stringify(oldItems) === JSON.stringify(newItems);
}

async function fetchRanking(job) {
  console.log(`Fetching ${job.name}...`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const response = await fetch(job.url, {
    headers: {
      Authorization: "Bearer " + TOKEN,
      "User-Agent": "cocbasepro-rankings/1.0"
    },
    signal: controller.signal
  });

  clearTimeout(timeout);

  console.log(`${job.name} API status:`, response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(errorText);
    throw new Error(`${job.name} API Error ${response.status}`);
  }

  const data = await response.json();

  if (!data.items || !data.items.length) {
    throw new Error(`${job.name}: No data returned`);
  }

  const items = data.items.map(job.normalize);

  const oldItems = readOldItems(job.file, job.key);

  if (itemsAreSame(oldItems, items)) {
    console.log(`${job.name}: No changes.`);
    return false;
  }

  const output = {
    updatedAt: new Date().toISOString(),
    total: items.length,
    source: "Clash of Clans API",
    [job.key]: items
  };

  fs.writeFileSync(
    job.file,
    JSON.stringify(output, null, 2) + "\n",
    "utf8"
  );

  console.log(`${job.name}: Saved ${items.length} items to ${job.file}`);
  return true;
}

async function main() {
  let changed = false;

  try {
    for (const job of JOBS) {
      const jobChanged = await fetchRanking(job);
      if (jobChanged) changed = true;
    }

    if (!changed) {
      console.log("No ranking changes.");
      process.exit(0);
    }

    console.log("Rankings updated.");
    process.exit(0);

  } catch (err) {
    if (err.name === "AbortError") {
      console.error("Request timeout.");
    } else {
      console.error(err);
    }

    process.exit(1);
  }
}

main();
