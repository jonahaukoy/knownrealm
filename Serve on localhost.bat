@echo off
rem Serves the site at http://localhost:8000 (for IDE "run" buttons that expect a server).
rem Keep this window open while browsing; close it to stop the server.
cd /d "%~dp0"
start "" "http://localhost:8000"
python -m http.server 8000
