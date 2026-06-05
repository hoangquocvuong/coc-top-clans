

@echo off
setlocal

cd /d E:\coc-top-clans

set COC_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjY2MWNiZjQ1LWQ3M2EtNDI1Ny04YzRjLTRiNzhkNzU5NTQ5MiIsImlhdCI6MTc4MDYyNDEwMiwic3ViIjoiZGV2ZWxvcGVyLzJkZmRkZDViLTVlMTgtNTZhMi1hZWE4LWM2MTBjYjg1NTc3YSIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjEuNTQuNjIuMTQzIl0sInR5cGUiOiJjbGllbnQifV19.Rhy5ynVM7_jfPH0gsu1Kxfj1OpRbm6NVefPUO2f4ZtvoJY_m8YWO0rwIgPYYX-WswY8z725egDk7xDHyCcOjpQ

echo ============================== >> update.log
echo START %date% %time% >> update.log

git pull origin main >> update.log 2>&1

node update-clans.js >> update.log 2>&1
if errorlevel 1 (
  echo ERROR UPDATE %date% %time% >> update.log
  exit /b 1
)

git add top_clans.json top_players.json top_capital_clans.json top_builder_players.json top_builder_clans.json

git diff --cached --quiet
if errorlevel 1 (
  git commit -m "Auto update COC rankings" >> update.log 2>&1
  git push origin main >> update.log 2>&1
  echo PUSHED %date% %time% >> update.log
) else (
  echo NO CHANGES %date% %time% >> update.log
)

echo DONE %date% %time% >> update.log

endlocal
exit /b 0







