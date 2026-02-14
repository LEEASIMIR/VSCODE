@echo off
chcp 65001 >nul

echo.
echo ========================================
echo  VS Code 확장 프로그램 일괄 설치
echo ========================================
echo.

for %%f in ("%~dp0*.vsix") do (
    echo %%~nxf 설치 중...
    code --install-extension "%%f"
)

echo.
echo ========================================
echo  설치 완료
echo ========================================
echo.
pause
