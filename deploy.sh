#!/bin/bash

# Este script atualiza e reinicia a stack no servidor de produção.

echo "Trazendo atualizações do repositório..."
git pull origin main

echo "Reconstruindo a imagem da aplicação e subindo os containers..."
cd docker
docker compose up -d --build

echo "Limpando imagens antigas para economizar espaço..."
docker image prune -f

echo "Deploy concluído com sucesso!"
