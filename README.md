# Teste de Deploy

Este repositório é utilizado para testes de deploy na plataforma de hospedagem [Render](https://render.com/). Ele contém uma API com WebSocket que permite o gerenciamento de transmissões ao vivo de câmeras, criando salas específicas para cada transmissão e permitindo que espectadores assistam a essas transmissões em tempo real.

## Sobre a API

A API utiliza **Node.js** e os pacotes **Express** e **WebSocket** para gerenciar conexões em tempo real. Sua funcionalidade principal inclui:

1. **Recepção de Transmissões ao Vivo**:
   - Permite que dispositivos de captura (como câmeras ou softwares de transmissão) enviem vídeos ao vivo para uma sala específica.

2. **Gerenciamento de Salas**:
   - Cada transmissão é vinculada a uma sala identificada por um nome único.
   - As salas podem ter múltiplos espectadores que recebem os dados da transmissão em tempo real.

3. **Encerramento Automático de Salas**:
   - Quando o último dispositivo de captura se desconecta, a API encerra automaticamente a sala e notifica os espectadores que a transmissão foi finalizada.

4. **Rotas Principais**:
   - `/connect`: Página para configurar uma conexão de transmissão.
   - `/watch`: Página para assistir a uma transmissão ao vivo.

5. **WebSocket Endpoints**:
   - `/capture`: Endpoint para dispositivos de captura iniciarem transmissões em uma sala.
   - `/live-stream`: Endpoint para espectadores se conectarem a uma sala e assistirem à transmissão.

## Estrutura do Projeto

- **`server.js`**: Arquivo principal que configura o servidor HTTP e gerencia as conexões WebSocket.
- **`public`**: Diretório que contém os arquivos estáticos, como as páginas HTML para configuração e visualização das transmissões.
- **Dependências**:
  - `express`: Para servir páginas estáticas e lidar com rotas HTTP.
  - `ws`: Para suporte a WebSocket e conexões em tempo real.

## Como Usar

### Requisitos
- Node.js instalado na máquina.

### Passos para Executar Localmente
1. Clone este repositório:
   ```bash
   git clone https://github.com/PedroGarcia1227/api-node-websocket
   cd seu-repositorio
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```
4. Acesse no navegador:
   - Configuração de transmissão: [http://localhost:3000/connect](http://localhost:3000/connect)
   - Assistir transmissão: [http://localhost:3000/watch](http://localhost:3000/watch)

### Deploy na Render
Para fazer o deploy nesta aplicação na Render, configure o repositório na plataforma e use os seguintes comandos:
- **Build Command**: `npm install`
- **Start Command**: `npm start`

Certifique-se de que o repositório inclui:
- O arquivo `server.js`.
- O diretório `public`.
- Os arquivos `package.json` e `package-lock.json`.
