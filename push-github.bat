@echo off
title AKL - GitHub push
cd /d C:\Users\chath\Downloads\AKL_Website
set GCM_GITHUB_USE_DEVICE_FLOW=true
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
echo ============================================================
echo  If a browser opened or a code was shown above, complete
echo  the GitHub sign-in there. This push finishes by itself.
echo ============================================================
pause
