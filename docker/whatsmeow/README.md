# whatsmeow-svc

Microserviço Go real que gera QR Codes verdadeiros do WhatsApp Web (biblioteca whatsmeow).
Sessões persistidas no mesmo Postgres do Supabase, no schema `whatsmeow`.

## Variáveis obrigatórias

- `DATABASE_URL` — connection string do Postgres (mesmo do Supabase).
  Ex.: `postgres://postgres:<PASS>@db.<ref>.supabase.co:5432/postgres`
- `SUPABASE_JWT_SECRET` — secret HS256 do projeto Supabase (Settings → API → JWT Secret).
  Usado para validar o access token do usuário logado.

## Endpoints

- `POST   /instances`             body `{ "nome": "Atendimento" }`
- `GET    /instances`             lista instâncias do tenant
- `DELETE /instances/:id`         logout + remove
- `GET    /instances/:id/qr`      **SSE** com QR real (event `qr`, `paired`, `timeout`, `error`)
- `GET    /instances/:id/status`
- `POST   /instances/:id/send`    body `{ "to": "5565999999999", "text": "..." }`

Autenticação: `Authorization: Bearer <supabase access token>` (ou `?token=` para EventSource).
Tenant é derivado de `public.memberships.imobiliaria_id` do `sub` do JWT.
