# NFC-e POC (Prova de Conceito)

Esta é uma **POC (Prova de Conceito)** para validar a leitura de QR Code de NFC-e, coleta dos dados da nota fiscal diretamente do site da SEFAZ e exibição dos itens em um aplicativo mobile.

O foco **não é produto final**, e sim validar:

- leitura do QR Code
- comunicação front ↔ backend
- extração real dos dados da NFC-e
- viabilidade técnica da ideia

---

## 🧱 Stack Utilizada

### Frontend (Mobile)

- Expo
- React Native
- TypeScript
- Expo Router
- Expo Camera

### Backend

- Node.js
- TypeScript
- Express
- Cheerio (parsing do HTML da NFC-e)

### Infra

- Cloudflare Tunnel (exposição do backend local)

---

## 🧠 Arquitetura Geral

```
[App Mobile - Expo]
        |
        | POST /nfce (URL da NFC-e)
        v
[Backend Node.js + TypeScript]
        |
        | HTTP GET (SEFAZ PR)
        v
[HTML da NFC-e]
        |
        | Parser (Cheerio)
        v
[JSON estruturado]
```

---

## 📁 Estrutura do Projeto

```
NFCE-POC/
│
├── poc-backend/
│   ├── src/
│   │   ├── fetchNfce.ts      # Faz o fetch da NFC-e usando a URL do QR Code
│   │   ├── parseNfce.ts      # Extrai estabelecimento e itens do HTML
│   │   └── server.ts        # API Express (POST /nfce)
│   ├── package.json
│   └── tsconfig.json
│
├── poc-frontend/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── index.tsx     # Tela de leitura do QR Code
│   │   │   └── result.tsx    # Tela de resultado (consome o backend)
│   ├── package.json
│   └── app.json
```

---

---

## ▶️ Como Rodar o Backend

```bash
cd poc-backend
npm install
npx ts-node src/server.ts
```

Servidor local:

```
http://localhost:3333
```

Endpoint disponível:

```
POST /nfce
```

Payload esperado:

```json
{
  "url": "http://www.fazenda.pr.gov.br/nfce/qrcode?p=..."
}
```

## 🌐 Expondo o Backend com Cloudflare Tunnel

Como o app roda no celular, ele **não consegue acessar localhost diretamente**.  
Para isso usamos **Cloudflare Tunnel**.

### Instalação

```bash
npm install -g cloudflared
```

### Rodar o tunnel

```bash
cloudflared tunnel --url http://localhost:3333
```

Você receberá algo como:

```
https://inc-module-cottages-laughing.trycloudflare.com
```

⚠️ **IMPORTANTE:**  
Esse endereço **muda toda vez que você reinicia o tunnel**.

---

## 🔧 Onde alterar a URL do Backend no Frontend

Antes de rodar o frontend, é necessário ajustar a URL da API.

Arquivo:

```
poc-frontend/app/(tabs)/result.tsx
```

Trecho do código:

```ts
const API_URL = "https://SEU-ENDERECO.trycloudflare.com/nfce";
```

Substitua `SEU-ENDERECO.trycloudflare.com` pela URL gerada pelo Cloudflare.

Exemplo:

```ts
const API_URL = "https://abcd-1234.trycloudflare.com/nfce";
```

Observações importantes:

- Não usar `localhost`
- Não usar `:3333`
- Não adicionar espaços na URL
- Manter `/nfce` no final

---

## 📱 Frontend (Expo)

### Instalação

```bash
cd poc-frontend
npm install
```

### Rodar o app

```bash
npm start
```

- Abra o **Expo Go** no celular
- Escaneie o QR Code exibido no terminal

---

## ✅ Fluxo da POC

1. Usuário abre o app
2. Clica em **Ler QR Code**
3. Escaneia o QR da NFC-e
4. App envia a URL para o backend
5. Backend acessa a SEFAZ PR
6. Backend faz o parser do HTML
7. Backend retorna JSON estruturado
8. App exibe estabelecimento e itens
