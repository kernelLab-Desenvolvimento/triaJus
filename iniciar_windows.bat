@echo off
title Sistema TriaJus - Iniciar
echo ======================================
echo     INICIANDO SISTEMA TRIAJUS 🚀
echo ======================================

IF NOT EXIST "node_modules\" (
    echo Instalando dependencias do Node...
    npm install
)

echo Iniciando o Servidor Principal...
node server.js
pause
