---
layout: ../../layouts/markdownLayout.astro
title: "Rotas"
keywords: [aplicativo, transporte, microônibus]
description: Aplicativo para gerenciamento eficiente de rotas de transporte corporativo, com funcionalidades semelhantes ao aplicativo Uber, adaptadas para o contexto de transporte de colaboradores.
---

# Aplicativo de Transporte Corporativo

## Visão Geral

O app visa gerenciar rotas de transporte corporativo de forma eficiente, oferecendo uma experiência intuitiva e eficaz para motoristas, colaboradores e administradores. As principais funcionalidades incluem:

### Para Motoristas:

- **Login / Esqueceu a Senha:** Acesso seguro ao aplicativo e recuperação de senha, se necessário.
- **Visualização do Itinerário Designado:** Acesso ao itinerário específico designado, facilitando a navegação.
- **Navegação em Tempo Real:** Navegação em tempo real, ajustando a rota conforme necessário.
- **Atualização Contínua da Rota:** Rota dinamicamente atualizada à medida que os colaboradores são coletados.
- **Registro de Presença:** Registro de presença ou ausência dos colaboradores em cada parada.
- **Registro de Sinistros:** Registro de incidentes durante a rota.

### Para Colaboradores:

- **Login / Esqueceu a Senha:** Acesso seguro ao aplicativo e recuperação de senha, se necessário.
- **Acompanhamento em Tempo Real:** Visualização da localização atual da rota em tempo real.
- **Confirmação de Participação:** Confirmação da participação na rota para auxiliar no planejamento logístico.
- **Relato de Incidentes:** Relato de problemas durante a rota para análise posterior.
- **Notificações de Início de Rota:** Recebimento de notificações quando a rota é iniciada.

### Para Administradores:

- **Login / Esqueceu a Senha:** Acesso seguro ao sistema e recuperação de senha, se necessário.
- **Monitoramento de Rotas:** Acompanhamento do progresso de todas as rotas em tempo real.
- **Visualização Detalhada de Rotas:** Acesso a informações detalhadas sobre rotas específicas.
- **Registro e Acompanhamento de Incidentes:** Acesso a registros de incidentes relatados durante as rotas.

### Tecniquês:

O aplicativo foi desenvolvido em **Flutter** utilizando **MapBox**, **Modular** e outras tecnologias. A a parte web foi construída utilizando **React** + **TypeScript**. Diversos plugins foram essenciais para garantir funcionalidades avançadas e uma experiência de usuário fluida, são eles:

- `mapbox_gl`: Integração com Mapbox para recursos de mapas avançados.
- `shared_preferences`: Armazenamento local de dados simples.
- `location`: Acesso à localização do dispositivo.
- `flutter_map`: Integração de mapas.
- `flutter_map_location_marker`: Adição de marcadores de localização ao mapa.
- `socket_io_client`: Cliente para comunicação com servidores Socket.IO.
- `result_dart`: Facilitação do tratamento de resultados assíncronos.
- `flutter_compass`: Acesso à bússola do dispositivo.
- `internet_connection_checker`: Verificação da conexão de internet do dispositivo.

## Desafios

Durante o desenvolvimento do aplicativo, enfrentamos diversos desafios técnicos, desde a integração com **MabBox**, funcionalidades semelhantes ao aplicativo Uber até a garantia da eficiência na gestão de rotas. Além disso, a implementação de uma interface de usuário intuitiva representou um desafio significativo. Ao decorrer do projeto, foi adquirido valiosos conhecimentos em Flutter, gerenciamento de rotas, gerenciamento de estado em tempo real.
