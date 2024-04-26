---
layout: ../../layouts/markdownLayout.astro
title: "Sensoriamento"
keywords: [maps, mapbox, realtime]
description: Visualização de rotas em tempo real utilizando MapBox
---

# Aplicativo para configuração e coleta de dados de sensores de placas IoT

## Visão Geral

O projeto tinha como objetivo configurar placas **STM32** utilizando o celular. O aplicativo através da conexão
**Bluetooth** configurava as placas de uma determinada linha de produção, para que ela se conectasse ao **protocolo MQTT** e enviasse dados dos sensores de luminosidade, temperatura, ruído e umidade. Os dados era coletados pelo aplicativos e mostrados em **tempo real**. Também podemos falar da parte web que tinha como objetivo o monitoramento em tempo real de todas as linhas de produção com suas respectivas placas instaladas e configuradas.

### Tecniquês:

O aplicativo foi desenvolvido em **Flutter** utilizando **MobX**, **Provider** e outras tecnologias, a interface web foi desenvolvida em **Angular**.

Alguns dos plugins utilizados:

- `flutter_blue`: Integração Bluetooth para aplicativos Flutter.
- `wifi_iot`: Gerenciamento de redes Wi-Fi em Flutter.
- `provider`: Gerenciamento de estado simples e eficiente.
- `mobx`: Gerenciamento de estado reativo para Flutter.
- `flutter_mobx`: Extensão MobX para Flutter.
- `mqtt_client`: Comunicação MQTT para aplicativos Flutter.
- `socket_io_client`: Comunicação WebSocket em tempo real.
- `http`: Solicitações HTTP em aplicativos Flutter.
- `intl`: Internacionalização e formatação de dados em Flutter.
- `collection`: Estruturas de dados adicionais para Flutter.
- `device_info_plus`: Informações do dispositivo em Flutter.

## Desafios

Durante o desenvolvimento do aplicativo foi enfrentado diversos desafios técnicos, desde a integração complexa de comunicação Bluetooth e MQTT até a coleta em tempo real dos dados dos sensores. Além disso, a implementação de uma interface de usuário intuitiva representaram desafios adicionais. Ao decorrer do projeto, foi adquirido valiosos conhecimentos em Bluetooth, MQTT e gerenciamento de estado em Flutter, além de aprimorar habilidades de trabalho em equipe. A experiência também proporcionou uma compreensão mais profunda sobre a importância de testes abrangentes e depuração para garantir a qualidade e confiabilidade do aplicativo.
