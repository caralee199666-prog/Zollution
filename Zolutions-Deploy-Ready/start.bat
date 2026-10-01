@echo off
title Zolutions Digital Marketplace
echo =============================================================
echo   Starting Zolutions Server...
echo =============================================================
cd /d "%~dp0"
if exist "C:\Users\DELL\AppData\Roaming\Antigravity\bin\agy-node.cmd" (
    "C:\Users\DELL\AppData\Roaming\Antigravity\bin\agy-node.cmd" server.js
) else (
    node server.js
)
pause
