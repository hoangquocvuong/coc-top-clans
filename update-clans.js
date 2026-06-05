const fs = require("fs");

const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjI0YzI3YWE5LTc2YzEtNGIwZi04NjYwLWIwNTQyMTU3NDM4MCIsImlhdCI6MTc4MDU3OTcyNywic3ViIjoiZGV2ZWxvcGVyLzJkZmRkZDViLTVlMTgtNTZhMi1hZWE4LWM2MTBjYjg1NTc3YSIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjEuNTQuNjIuMTQzIl0sInR5cGUiOiJjbGllbnQifV19.tXZzrU4dH7SlFgDxs8WNjcDoqoZ-meqZEzkJ3ElbiE2m7SsMCYp0AlPToT83WmseHjBb86xvPxKRtnW5p44G7A";

async function updateTopClans() {
try {

console.log("Fetching top clans...");

const response = await fetch(
  "https://api.clashofclans.com/v1/locations/global/rankings/clans",
  {
    headers: {
      Authorization: "Bearer " + TOKEN
    }
  }
);

if (!response.ok) {
  throw new Error("API Error " + response.status);
}

const data = await response.json();

fs.writeFileSync(
  "top_clans.json",
  JSON.stringify(data, null, 2),
  "utf8"
);

console.log("Done!");


}
catch (err) {
console.error(err);
}
}

updateTopClans();
