@echo off
REM Serves the built Plan of Action Hub and opens it in the default browser.
REM The hub fetches its plan JSON at runtime, so file:// does not work — it needs a server.
cd /d "%~dp0docs"
start "" http://localhost:8043/
python -m http.server 8043
