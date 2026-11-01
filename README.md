# CS DELAS — starter de implementação

Primeira base técnica do portal CS DELAS, com identidade visual inicial, página pública e formulário de solicitação de acesso ligado ao Supabase.

## O que está incluído

- Página inicial responsiva.
- Formulário com nome, nascimento, e-mail e telefone.
- Solicitação de acesso com status `pending`.
- Restrição inicial para maiores de 18 anos.
- Esquema SQL inicial para comunidade, comentários, materiais, eventos e oportunidades.
- Políticas iniciais de Row Level Security (RLS).

## Antes de começar

Você precisará de:
- Node.js LTS instalado.
- Uma conta Supabase.
- Um terminal (PowerShell no Windows funciona).
- Um editor como Visual Studio Code.

## 1. Instalar dependências

Abra a pasta do projeto no terminal e execute:

```bash
npm install
```

## 2. Criar o projeto Supabase

1. Crie um projeto no painel do Supabase.
2. Abra SQL Editor.
3. Copie e execute `supabase/schema.sql`.
4. Em Project Settings > API, copie a Project URL e a chave publicável/anon.

## 3. Configurar variáveis

Copie `.env.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA_ANON
```

Nunca coloque a chave `service_role` em variáveis `NEXT_PUBLIC_` ou no código do navegador.

## 4. Rodar localmente

```bash
npm run dev
```

Abra `http://localhost:3000`.

## 5. Testar o formulário

Envie uma solicitação de teste com dados fictícios de uma pessoa adulta. Confira a linha criada em `applications` no Supabase.

## Atenção antes de produção

Este starter é a fundação, não um portal pronto para lançamento. Ainda faltam:
- Login e recuperação de senha.
- Fluxo de aprovação que convide a participante após aprovação.
- Painel administrativo protegido e criação segura da primeira administradora.
- Regras de acesso por membro aprovado em posts/comentários.
- Moderação, denúncias e bloqueios.
- Validação de telefone/e-mail e proteção contra spam (rate limiting/CAPTCHA).
- Política de privacidade completa, canal de contato, retenção e exclusão de dados.
- Testes de segurança, acessibilidade e backups.

A função de aprovação precisa ser implementada no servidor com segredo administrativo protegido; nunca no navegador. A primeira conta administradora deve ser configurada manualmente e com autenticação forte.

## Domínio

O domínio pode ser comprado depois, quando o projeto estiver pronto para publicar. Não é necessário para desenvolver localmente.
