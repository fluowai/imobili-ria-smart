# Deploy self-hosted (Docker)

Stack: TanStack Start (Node) + Postgres 16 + Redis 7 + MinIO (S3) + Caddy (TLS).

## Subir localmente

```bash
cd docker
cp .env.example .env         # edite as senhas
docker compose up -d --build
```

- App: http://localhost (via Caddy) ou http://localhost:3000 direto
- MinIO console: http://localhost:9001
- Postgres: `localhost:5432` (user `app`, db `app`)

## Produção

1. Aponte seu domínio (A/AAAA) para o IP do servidor.
2. No `.env`, defina `DOMAIN=seu-dominio.com`.
3. `docker compose up -d --build` — Caddy emite o TLS via Let's Encrypt automaticamente.

## Fases

- **Fase 1 (atual):** infra Docker.
- **Fase 2:** schema Drizzle + auth JWT + tenancy.
- **Fase 3+:** domínio (imóveis, CRM, contratos…), IA, admin, integrações.

## Comandos úteis

```bash
docker compose logs -f app          # logs da aplicação
docker compose exec postgres psql -U app  # console SQL
docker compose down                 # parar (mantém volumes)
docker compose down -v              # parar e apagar dados
```
