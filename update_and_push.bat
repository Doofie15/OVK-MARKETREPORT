@echo off
echo Updating OVK Wool Market Report and pushing to GitHub...

echo.
echo Adding files to git...
git add .

echo.
echo Committing changes...
git commit -m "Real-Time Notification System: Complete notification system with push notifications, in-app notification center, toast messages, Supabase real-time integration, and enhanced PWA features"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo Done! All changes have been pushed to GitHub.
pause
