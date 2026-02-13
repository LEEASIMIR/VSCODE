@echo off
chcp 65001 >nul
setlocal

REM ============================================================
REM  Tomcat 인스턴스 등록 스크립트
REM  - 현재 디렉토리를 프로젝트 경로로 사용
REM  - CATALINA_HOME 공유, CATALINA_BASE 분리
REM  - 개별 시작/종료 가능
REM ============================================================
REM
REM  사용법:
REM    프로젝트 폴더에서 실행:
REM    init-tomcat-instance.bat [톰캣경로] [인스턴스명] [포트] [docBase폴더명] [JPDA포트]
REM
REM  예시:
REM    cd D:\Project\speed\AzureDevOpsRepo\speedmate_admin
REM    init-tomcat-instance.bat C:\apache-tomcat-9.0.112 Admin 8083 web 10083
REM
REM    cd D:\Project\speed\AzureDevOpsRepo\speedmate_user
REM    init-tomcat-instance.bat C:\apache-tomcat-9.0.112 User 8080 web 10080
REM

REM === 파라미터 검증 ===
if "%~4"=="" (
    echo.
    echo  [사용법] 프로젝트 폴더에서 실행
    echo    %~nx0 [톰캣경로] [인스턴스명] [포트] [docBase폴더명] [JPDA포트]
    echo.
    echo  [예시]
    echo    cd D:\Project\speedmate_admin
    echo    %~nx0 C:\apache-tomcat-9.0.112 Admin 8083 web 10083
    echo.
    echo  [파라미터]
    echo    톰캣경로      : Tomcat 설치 루트 ^(CATALINA_HOME^)
    echo    인스턴스명    : 인스턴스 이름 ^(중복 불가, 영문^)
    echo    포트          : HTTP 포트 번호
    echo    docBase폴더명 : JSP/정적파일 폴더 ^(예: web, src/main/webapp^)
    echo    JPDA포트      : 디버그 포트 ^(선택, 미지정시 HTTP포트+2000^)
    echo.
    exit /b 1
)

set "TOMCAT_HOME=%~1"
set "INSTANCE_NAME=%~2"
set "PORT=%~3"
set "DOCBASE_DIR=%~4"
set "PROJECT_PATH=%CD%"

REM === 인스턴스 베이스 경로 ===
set "INSTANCES_ROOT=%TOMCAT_HOME%\instances"
set "INSTANCE_BASE=%INSTANCES_ROOT%\%INSTANCE_NAME%"

REM === 경로 슬래시 통일 ===
set "PROJECT_PATH_FWD=%PROJECT_PATH:\=/%"

REM === Shutdown 포트 자동 계산 (HTTP 포트 + 1000) ===
set /a "SHUTDOWN_PORT=%PORT% + 1000"

REM === JPDA 포트 (5번째 파라미터 또는 HTTP 포트 + 2000) ===
if not "%~5"=="" (
    set "JPDA_PORT=%~5"
) else (
    set /a "JPDA_PORT=%PORT% + 2000"
)

REM === 경로 검증 ===
if not exist "%TOMCAT_HOME%\conf\server.xml" (
    echo [오류] Tomcat 경로가 올바르지 않습니다: %TOMCAT_HOME%
    exit /b 1
)
if not exist "%PROJECT_PATH%\%DOCBASE_DIR%" (
    echo [오류] docBase 폴더가 존재하지 않습니다: %PROJECT_PATH%\%DOCBASE_DIR%
    exit /b 1
)
if exist "%INSTANCE_BASE%" (
    echo [정보] 기존 인스턴스 삭제 중: %INSTANCE_BASE%
    rmdir /s /q "%INSTANCE_BASE%"
    echo [완료] 기존 인스턴스 삭제
)
if not exist "%PROJECT_PATH%\target\classes" (
    echo [경고] target/classes 폴더가 없습니다. mvn compile 먼저 실행하세요.
)

REM === 1. 인스턴스 폴더 구조 생성 ===
mkdir "%INSTANCE_BASE%\conf\Catalina\localhost"
mkdir "%INSTANCE_BASE%\logs"
mkdir "%INSTANCE_BASE%\temp"
mkdir "%INSTANCE_BASE%\webapps"
mkdir "%INSTANCE_BASE%\work"
echo [완료] 인스턴스 폴더 생성: %INSTANCE_BASE%

REM === 2. server.xml 생성 ===
(
    echo ^<?xml version="1.0" encoding="UTF-8"?^>
    echo ^<Server port="%SHUTDOWN_PORT%" shutdown="SHUTDOWN"^>
    echo   ^<Listener className="org.apache.catalina.startup.VersionLoggerListener" /^>
    echo   ^<Listener className="org.apache.catalina.core.AprLifecycleListener" SSLEngine="on" /^>
    echo   ^<Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener" /^>
    echo   ^<Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener" /^>
    echo   ^<Listener className="org.apache.catalina.core.ThreadLocalLeakPreventionListener" /^>
    echo.
    echo   ^<Service name="%INSTANCE_NAME%"^>
    echo     ^<Connector port="%PORT%" protocol="HTTP/1.1"
    echo                connectionTimeout="20000" redirectPort="8443" /^>
    echo     ^<Engine name="Catalina" defaultHost="localhost"^>
    echo       ^<Host name="localhost" appBase="webapps"
    echo             unpackWARs="true" autoDeploy="true" /^>
    echo     ^</Engine^>
    echo   ^</Service^>
    echo ^</Server^>
) > "%INSTANCE_BASE%\conf\server.xml"
echo [완료] server.xml 생성 ^(HTTP:%PORT%, Shutdown:%SHUTDOWN_PORT%^)

REM === 3. web.xml 복사 ===
copy /y "%TOMCAT_HOME%\conf\web.xml" "%INSTANCE_BASE%\conf\web.xml" >nul
echo [완료] web.xml 복사

REM === 4. catalina.properties 복사 ===
if exist "%TOMCAT_HOME%\conf\catalina.properties" (
    copy /y "%TOMCAT_HOME%\conf\catalina.properties" "%INSTANCE_BASE%\conf\catalina.properties" >nul
    echo [완료] catalina.properties 복사
)

REM === 5. logging.properties 복사 ===
if exist "%TOMCAT_HOME%\conf\logging.properties" (
    copy /y "%TOMCAT_HOME%\conf\logging.properties" "%INSTANCE_BASE%\conf\logging.properties" >nul
    echo [완료] logging.properties 복사
)

REM === 6. Context XML 생성 ===
(
    echo ^<?xml version="1.0" encoding="UTF-8"?^>
    echo ^<Context docBase="%PROJECT_PATH_FWD%/%DOCBASE_DIR%" reloadable="true"^>
    echo     ^<Resources^>
    echo         ^<PreResources className="org.apache.catalina.webresources.DirResourceSet"
    echo             base="%PROJECT_PATH_FWD%/target/classes"
    echo             webAppMount="/WEB-INF/classes" /^>
    echo         ^<PreResources className="org.apache.catalina.webresources.DirResourceSet"
    echo             base="%PROJECT_PATH_FWD%/target/dependency"
    echo             webAppMount="/WEB-INF/lib" /^>
    echo     ^</Resources^>
    echo ^</Context^>
) > "%INSTANCE_BASE%\conf\Catalina\localhost\ROOT.xml"
echo [완료] Context XML 생성

REM === 7. 시작 스크립트 생성 ===
(
    echo @echo off
    echo chcp 65001 ^>nul
    echo set "CATALINA_HOME=%TOMCAT_HOME%"
    echo set "CATALINA_BASE=%INSTANCE_BASE%"
    echo title %INSTANCE_NAME% ^(port:%PORT%^)
    echo echo ============================================================
    echo echo   %INSTANCE_NAME% 시작 ^(port:%PORT%^)
    echo echo   CATALINA_HOME: %TOMCAT_HOME%
    echo echo   CATALINA_BASE: %INSTANCE_BASE%
    echo echo ============================================================
    echo call "%%CATALINA_HOME%%\bin\catalina.bat" run
) > "%INSTANCE_BASE%\start.bat"
echo [완료] start.bat 생성

REM === 8. 디버그 시작 스크립트 생성 ===
(
    echo @echo off
    echo chcp 65001 ^>nul
    echo set "CATALINA_HOME=%TOMCAT_HOME%"
    echo set "CATALINA_BASE=%INSTANCE_BASE%"
    echo set "JPDA_ADDRESS=localhost:%JPDA_PORT%"
    echo set "JPDA_TRANSPORT=dt_socket"
    echo title %INSTANCE_NAME% DEBUG ^(port:%PORT%, jpda:%JPDA_PORT%^)
    echo echo ============================================================
    echo echo   %INSTANCE_NAME% 디버그 시작 ^(HTTP:%PORT%, JPDA:%JPDA_PORT%^)
    echo echo   CATALINA_HOME: %TOMCAT_HOME%
    echo echo   CATALINA_BASE: %INSTANCE_BASE%
    echo echo ============================================================
    echo call "%%CATALINA_HOME%%\bin\catalina.bat" jpda run
) > "%INSTANCE_BASE%\debug.bat"
echo [완료] debug.bat 생성 ^(JPDA 포트: %JPDA_PORT%^)

REM === 9. 종료 스크립트 생성 ===
(
    echo @echo off
    echo chcp 65001 ^>nul
    echo set "CATALINA_HOME=%TOMCAT_HOME%"
    echo set "CATALINA_BASE=%INSTANCE_BASE%"
    echo echo %INSTANCE_NAME% 종료 중...
    echo call "%%CATALINA_HOME%%\bin\shutdown.bat"
    echo echo %INSTANCE_NAME% 종료 완료
) > "%INSTANCE_BASE%\stop.bat"
echo [완료] stop.bat 생성

REM === 10. tomcat-instance 폴더 생성 (설정 + 래퍼 스크립트) ===
set "LOCAL_INSTANCE=%PROJECT_PATH%\tomcat-instance"
if not exist "%LOCAL_INSTANCE%" mkdir "%LOCAL_INSTANCE%"

REM --- 설정 파일 ---
(
    echo TOMCAT_HOME=%TOMCAT_HOME%
    echo INSTANCE_NAME=%INSTANCE_NAME%
    echo INSTANCE_BASE=%INSTANCE_BASE%
    echo PORT=%PORT%
    echo SHUTDOWN_PORT=%SHUTDOWN_PORT%
    echo JPDA_PORT=%JPDA_PORT%
) > "%LOCAL_INSTANCE%\.tomcat-instance"
echo [완료] tomcat-instance\.tomcat-instance 설정 파일 저장

REM --- tomcat-start.bat ---
(
    echo @echo off
    echo chcp 65001 ^>nul
    echo setlocal
    echo set "CONFIG_FILE=%%~dp0.tomcat-instance"
    echo if not exist "%%CONFIG_FILE%%" ^(
    echo     echo  [오류] .tomcat-instance 설정 파일이 없습니다.
    echo     echo         먼저 init-tomcat-instance.bat 을 실행하세요.
    echo     pause
    echo     exit /b 1
    echo ^)
    echo for /f "tokens=1,* delims==" %%%%a in ^(%%CONFIG_FILE%%^) do set "%%%%a=%%%%b"
    echo echo  %%INSTANCE_NAME%% 시작 ^(port:%%PORT%%^)
    echo call "%%INSTANCE_BASE%%\start.bat"
    echo endlocal
) > "%LOCAL_INSTANCE%\tomcat-start.bat"
echo [완료] tomcat-instance\tomcat-start.bat 생성

REM --- tomcat-debug.bat ---
(
    echo @echo off
    echo chcp 65001 ^>nul
    echo setlocal
    echo set "CONFIG_FILE=%%~dp0.tomcat-instance"
    echo if not exist "%%CONFIG_FILE%%" ^(
    echo     echo  [오류] .tomcat-instance 설정 파일이 없습니다.
    echo     echo         먼저 init-tomcat-instance.bat 을 실행하세요.
    echo     pause
    echo     exit /b 1
    echo ^)
    echo for /f "tokens=1,* delims==" %%%%a in ^(%%CONFIG_FILE%%^) do set "%%%%a=%%%%b"
    echo echo  %%INSTANCE_NAME%% 디버그 시작 ^(HTTP:%%PORT%%, JPDA:%%JPDA_PORT%%^)
    echo call "%%INSTANCE_BASE%%\debug.bat"
    echo endlocal
) > "%LOCAL_INSTANCE%\tomcat-debug.bat"
echo [완료] tomcat-instance\tomcat-debug.bat 생성

REM --- tomcat-stop.bat ---
(
    echo @echo off
    echo chcp 65001 ^>nul
    echo setlocal
    echo set "CONFIG_FILE=%%~dp0.tomcat-instance"
    echo if not exist "%%CONFIG_FILE%%" ^(
    echo     echo  [오류] .tomcat-instance 설정 파일이 없습니다.
    echo     echo         먼저 init-tomcat-instance.bat 을 실행하세요.
    echo     pause
    echo     exit /b 1
    echo ^)
    echo for /f "tokens=1,* delims==" %%%%a in ^(%%CONFIG_FILE%%^) do set "%%%%a=%%%%b"
    echo echo  %%INSTANCE_NAME%% 종료 중...
    echo call "%%INSTANCE_BASE%%\stop.bat"
    echo endlocal
) > "%LOCAL_INSTANCE%\tomcat-stop.bat"
echo [완료] tomcat-instance\tomcat-stop.bat 생성

REM === 11. .vscode/launch.json 생성 ===
if not exist "%PROJECT_PATH%\.vscode" mkdir "%PROJECT_PATH%\.vscode"
(
    echo {
    echo   "version": "0.2.0",
    echo   "configurations": [
    echo     {
    echo       "type": "java",
    echo       "name": "Attach to %INSTANCE_NAME%",
    echo       "request": "attach",
    echo       "hostName": "localhost",
    echo       "port": %JPDA_PORT%
    echo     }
    echo   ]
    echo }
) > "%PROJECT_PATH%\.vscode\launch.json"
echo [완료] .vscode\launch.json 생성 ^(JPDA:%JPDA_PORT%^)

REM === 완료 ===
echo.
echo  ============================================================
echo   인스턴스 등록 완료
echo  ============================================================
echo   인스턴스명  : %INSTANCE_NAME%
echo   HTTP 포트   : %PORT%
echo   Shutdown    : %SHUTDOWN_PORT%
echo   JPDA 디버그 : %JPDA_PORT%
echo   프로젝트    : %PROJECT_PATH%
echo   docBase     : %DOCBASE_DIR%
echo   인스턴스    : %INSTANCE_BASE%
echo  ============================================================
echo   시작  : tomcat-instance\tomcat-start.bat
echo   디버그: tomcat-instance\tomcat-debug.bat
echo   종료  : tomcat-instance\tomcat-stop.bat
echo   접속  : http://localhost:%PORT%/
echo  ============================================================
echo.

endlocal
exit /b 0