const fs = require("fs");

const TOKEN = process.env.COC_TOKEN;

if (!TOKEN) {
  console.error("Missing COC_TOKEN secret");
  process.exit(1);
}

async function updateTopClans() {
  try {
    console.log("Fetching top clans...");

    const response = await fetch(
      "https://api.clashofclans.com/v1/locations/global/rankings/clans?limit=200",
      {
        headers: {
          Authorization: "Bearer " + TOKEN
        }
      }
    );

    console.log("API status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(errorText);
      throw new Error("API Error " + response.status);
    }

    const data = await response.json();

    if (!data.items || !data.items.length) {
      throw new Error("No clan data returned");
    }

    fs.writeFileSync(
      "top_clans.json",
      JSON.stringify({
        updatedAt: new Date().toISOString(),
        clans: data.items
      }, null, 2),
      "utf8"
    );

    console.log("Saved clans:", data.items.length);
    console.log("Done!");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateTopClans();
