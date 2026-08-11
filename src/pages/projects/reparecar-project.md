---
layout: ../../layouts/markdownLayout.astro
title: "RepareCar"
keywords:
  [
    "gestão automotiva",
    "oficinas",
    "react",
    "typescript",
    "fastify",
    "postgresql",
    "kysely",
    "tanstack",
    "openapi",
    "monorepo",
    "pnpm",
    "turbo",
  ]
description: RepareCar é uma plataforma completa para gestão de oficinas automotivas, reunindo ordens de serviço, pátio, orçamentos, agenda e relacionamento com clientes.
---

# Projeto RepareCar - Gestão de Oficinas Automotivas

## Visão Geral do Projeto

O RepareCar é uma plataforma completa para digitalizar a operação de oficinas automotivas. O produto acompanha a jornada do veículo desde o atendimento e diagnóstico até o orçamento, execução dos serviços e entrega, reunindo gestão de pátio, clientes, veículos, estoque, agenda e indicadores financeiros.

Também existe um portal dedicado ao cliente, no qual é possível acompanhar o serviço, consultar evidências, visualizar relatórios e aprovar ou rejeitar orçamentos.

## Minha Participação

Atuo no RepareCar como **Engenheiro de Software Freelance**, com contribuição predominante no frontend e participação em funcionalidades de backend. Meu trabalho envolve transformar regras operacionais de oficinas em fluxos claros, responsivos e integrados às APIs da plataforma.

O histórico do projeto registra minhas contribuições desde 2025 em diferentes áreas do produto, incluindo arquitetura, desenvolvimento de funcionalidades, integrações, correções, responsividade e documentação técnica.

## Stack Tecnológico

### Frontend

- **React e TypeScript** - Construção das aplicações web e fluxos de negócio
- **TanStack Router** - Rotas tipadas, layouts e carregamento de dados
- **TanStack Query** - Cache, sincronização e estados assíncronos
- **React Hook Form e Zod** - Formulários e validação de dados
- **Tailwind CSS e Radix UI** - Interface responsiva e componentes acessíveis
- **dnd-kit** - Interações de drag-and-drop na gestão de pátio
- **Recharts** - Visualização de indicadores do dashboard
- **Vite e Vitest** - Build, ambiente de desenvolvimento e testes

### Backend e Dados

- **Node.js e Fastify** - API e regras de negócio
- **PostgreSQL** - Persistência dos dados da plataforma
- **Kysely e Prisma** - Consultas tipadas, schema e migrations
- **Better Auth** - Autenticação e gestão de acessos
- **OpenAPI e Orval** - Contratos e geração dos clientes HTTP
- **Cloudflare R2** - Armazenamento de imagens, vídeos e documentos

### Arquitetura e Qualidade

- **Monorepo com pnpm e Turbo** - Organização das aplicações e pacotes
- **Biome e Husky** - Padronização e validações antes dos commits
- **Documentação técnica** - Guias de frontend, backend e arquitetura

## Principais Entregas

### Estrutura e Arquitetura

- Estruturei a base como monorepo, separando frontend, backend e pacotes compartilhados
- Configurei pnpm workspaces, Turbo e scripts centralizados de desenvolvimento e build
- Documentei a arquitetura e o fluxo de desenvolvimento das aplicações
- Ajudei a manter contratos tipados entre frontend e backend com OpenAPI e Orval

### Gestão de Pátio e Ordens de Serviço

- Desenvolvi e evoluí o Kanban de gestão de pátio com drag-and-drop
- Implementei transições de status com atualização otimista e reversão em caso de erro
- Integrei acessos a checklist, orçamento e fluxo de entrega do veículo
- Desenvolvi telas e modais para criação, edição e histórico de ordens de serviço
- Implementei fluxos de diagnóstico, sintomas, serviços e acompanhamento da execução

### Agenda e Operação da Oficina

- Criei visualizações de próximos agendamentos, semana e mês
- Desenvolvi o fluxo de cadastro de agendamentos com busca de veículos e seleção de serviços
- Implementei a criação de ordens de serviço diretamente a partir da agenda
- Desenvolvi telas de clientes, veículos, mecânicos, estoque e configurações da oficina

### Experiência Mobile e Portal do Cliente

- Adaptei os principais fluxos operacionais para uma experiência mobile-first
- Criei navegação inferior e componentes específicos para telas menores
- Tornei orçamento, checklist, pátio, onboarding e criação de ordens responsivos
- Evoluí o portal do cliente com ações de aprovação e rejeição, relatórios e layouts mobile
- Implementei cuidados de acessibilidade, áreas seguras e preferência por movimento reduzido

### Integrações Full-stack

- Integrei o preenchimento automático de empresas por CNPJ usando BrasilAPI
- Implementei cache e proteção contra respostas assíncronas fora de ordem nessa consulta
- Participei do fluxo de mecânicos com acesso opcional ao sistema e permissões por papel
- Implementei exclusão segura de veículos considerando vínculos e ordens de serviço
- Evoluí o cálculo e a configuração do valor-hora da oficina
- Corrigi o carregamento e a edição de peças com imagens armazenadas no R2

### Onboarding e Qualidade

- Desenvolvi onboarding com vídeo, tour guiado e persistência por oficina
- Criei cache de autenticação para evitar chamadas repetidas provocadas pelo preload de rotas
- Padronizei o tratamento de mensagens de erro retornadas pelas APIs
- Adicionei validações para manter imagens do projeto no formato WebP
- Escrevi testes para integrações e regras de negócio específicas

## Desafios Técnicos

### Fluxos Operacionais Complexos

A operação de uma oficina conecta ordens de serviço, checklists, orçamentos, peças e diferentes etapas do pátio. Trabalhei na organização desses estados para que as transições fossem previsíveis, com feedback imediato na interface e recuperação segura em caso de erro.

### Responsividade sem Perder Funcionalidades

Telas densas como Kanban, orçamento e checklist precisavam funcionar em dispositivos móveis sem simplificar demais o processo. A solução envolveu navegação dedicada, ações fixas, componentes compactos e reorganização das informações por contexto.

### Consistência entre Frontend e Backend

Atuei em contratos OpenAPI, clientes gerados e regras no backend para manter os dados usados pelas interfaces consistentes. Isso incluiu identificadores de checklist e orçamento, permissões de usuários, imagens de peças e validações de domínio.

### Cache e Concorrência

Implementei estratégias para reduzir chamadas redundantes de autenticação e evitar condições de corrida em integrações externas, armazenando requisições em andamento, invalidando o cache nos momentos corretos e descartando respostas desatualizadas.

## Resultado

Minha contribuição ajudou a consolidar uma experiência operacional integrada para oficinas e clientes, com interfaces responsivas, fluxos de negócio conectados e uma base full-stack tipada. O trabalho foi realizado em colaboração com o restante da equipe, abrangendo desde decisões estruturais até funcionalidades usadas no dia a dia do produto.

Conheça o produto em [reparecar.com.br](https://www.reparecar.com.br/).
