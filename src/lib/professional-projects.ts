export interface ProfessionalProject {
  title: string;
  company: string;
  period: string;
  description: string;
  contribution: string;
  href: string;
  website?: string;
  flow: 'clickmax' | 'reparecar' | 'routes' | 'iot' | 'automation';
  featured?: boolean;
  current?: boolean;
}

export const professionalProjects: ProfessionalProject[] = [
  {
    title: 'Clickmax', company: 'Bilhon', period: '2024 — agora',
    description: 'Plataforma all-in-one de marketing, vendas e IA, com páginas, checkouts, CRM, automações, afiliados e o assistente Max.',
    contribution: 'Fullstack com IA aplicada: tools MCP e motor de sugestões do Max, páginas geradas por IA, editor de e-mail e Mercado de afiliação.',
    href: '/projects/clickmax-project', website: 'https://clickmax.io/',
    flow: 'clickmax', featured: true, current: true,
  },
  {
    title: 'RepareCar', company: 'Freelance', period: '2025 · 2026',
    description: 'Plataforma completa para gerenciar oficinas, do atendimento e orçamento à entrega do veículo.',
    contribution: 'Interfaces e evoluções fullstack para os fluxos de operação de oficinas.',
    href: '/projects/reparecar-project', website: 'https://www.reparecar.com.br/',
    flow: 'reparecar', featured: true,
  },
  {
    title: 'Sistema de Rotas', company: 'Grupo ICTS', period: '2021 — 2023',
    description: 'Aplicações mobile e web para acompanhar transporte corporativo, itinerários e ocorrências em tempo real.',
    contribution: 'Aplicativo com rastreamento em tempo real e painel administrativo web.',
    href: '/projects/routes-project', flow: 'routes',
  },
  {
    title: 'Sensoriamento IoT', company: 'Grupo ICTS', period: '2021 — 2023',
    description: 'Configuração de placas industriais e monitoramento de luminosidade, temperatura, ruído e umidade.',
    contribution: 'Aplicativo de configuração de dispositivos e painel de monitoramento.',
    href: '/projects/nimrod-project', flow: 'iot',
  },
  {
    title: 'Automação e qualidade', company: 'Sidia', period: '2019 — 2021',
    description: 'Automação de testes e desenvolvimento de ferramentas internas para reduzir etapas manuais e o tempo de submissão.',
    contribution: 'Testes automatizados e ferramentas internas para equipes de QA.',
    href: '/projects/sidia-automation-project', flow: 'automation',
  },
];
