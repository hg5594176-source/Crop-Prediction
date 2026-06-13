@echo off
title AI Crop Dashboard Local Server
echo Starting local web server for AI Crop Dashboard...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
pause
