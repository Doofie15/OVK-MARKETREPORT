@echo off
echo Updating OVK Wool Market Report and pushing to GitHub...

echo.
echo Adding files to git...
git add .

echo.
echo Committing changes...
git commit -m "Mobile View Optimizations: Fixed card width consistency, improved headers, enhanced charts, and corrected data display"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo Done! All changes have been pushed to GitHub.
pause
