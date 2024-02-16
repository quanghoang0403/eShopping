@echo off
setlocal enabledelayedexpansion
for /f "usebackq tokens=*" %%a in (`jq -r ".storeName" "../store.config.json"`) do (
  set "storeName=%%a"
)
echo The store name is: %storeName%
set "filePath=..\index.html"
for /f "usebackq delims=" %%a in ("%filePath%") do (
    set "line=%%a"
    setlocal enabledelayedexpansion
    set "line=!line:{{STORE_NAME}}=%storeName%!"
    echo !line! >> "%filePath%.tmp"
    endlocal
)
move /y "%filePath%.tmp" "%filePath%"
