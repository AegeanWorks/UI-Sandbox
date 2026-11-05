@echo off
rem One-click run for UI Sandbox on Windows: double-click this file.
rem Installs dependencies on first run, starts the Vite dev server on
rem http://127.0.0.1:5199/ and opens the page once the server answers.
rem Do NOT double-click index.html: browsers cannot run the uncompiled
rem sources directly, so that only ever shows a blank page.
setlocal
node --version >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js 20+ from https://nodejs.org/,
  echo tick "Add to PATH" during install, then double-click run.cmd again.
  pause
  exit /b 1
)
if not exist "%~dp0node_modules" (
  echo First run: installing dependencies, this takes a minute...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo npm install failed - the output above should say why.
    pause
    exit /b 1
  )
)
set PORT=5199
start "UI Sandbox dev server" npm run dev -- --port %PORT% --strictPort
for /L %%i in (1,1,40) do (
  powershell -NoProfile -Command "try { Invoke-WebRequest -Uri 'http://127.0.0.1:%PORT%/' -UseBasicParsing -TimeoutSec 1 | Out-Null; exit 0 } catch { exit 1 }"
  if not errorlevel 1 goto open
  timeout /t 1 /nobreak >nul
)
echo The dev server did not answer on port %PORT% within 40 seconds.
echo The "UI Sandbox dev server" window should show why - fix that, then double-click again.
pause
exit /b 1
:open
start "" "http://127.0.0.1:%PORT%/"
