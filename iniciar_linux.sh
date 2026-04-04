#!/bin/bash
# Script de Inicialização Rápida - TriaJus (Linux/Mac)
# Este script levanta as dependências e starta o servidor node.

echo "======================================"
echo "    INICIANDO SISTEMA TRIAJUS 🚀"
echo "======================================"

# Verifica se a pasta node_modules existe, caso contrário roda npm install
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências..."
    npm install
fi

echo "Iniciando o Servidor Principal..."
# Roda o servidor
node server.js
