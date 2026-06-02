# ⚙️ React Factory

> **Projeto Educacional** — Utilizado em sala de aula para introduzir a construção de interfaces e componentes React Native.

[![Educacional](https://img.shields.io/badge/uso-educacional-6366f1?style=flat-square)](.)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](.)
[![Expo](https://img.shields.io/badge/Expo-Ready-000000?style=flat-square&logo=expo)](.)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)](.)

---

## 📖 Sobre o Projeto

**React Factory** é um construtor visual de interfaces para **React Native / Expo**, desenvolvido com fins educacionais. A ferramenta permite que estudantes criem telas de aplicativos móveis de forma visual — arrastando e soltando componentes — e gerem o código React Native completo, pronto para rodar com Expo.

A metáfora industrial é proposital: o aluno monta um "produto" (seu app) em uma "linha de montagem", usando "peças" do "estoque" — tornando os conceitos de componentes e interfaces tangíveis e intuitivos.

---

## 🎯 Objetivos Pedagógicos

- Introduzir o conceito de **componentes de interface** de forma visual
- Demonstrar como **propriedades (props)** alteram o visual de um componente
- Ensinar sobre **hierarquia de telas** e **navegação** em apps mobile
- Apresentar **APIs externas** como recursos reais em aplicações
- Gerar **código React Native funcional** como ponte para a programação textual
- Estimular a criatividade na composição de interfaces

---

## ✨ Funcionalidades

### 🏗️ Construtor de Interfaces
- **Modo Normal** — Arraste componentes da paleta e empilhe-os na tela. Reordene arrastando.
- **Modo Avançado** — Posicionamento livre (absoluto) na tela, com handles de redimensionamento e arrastar preciso. Ideal para layouts mais complexos.
- **Zoom** de 40% a 200% no canvas
- **Frame de iPhone** realista com notch, botões e barra de status
- **Cor de fundo** da tela personalizável em tempo real

### 📦 Biblioteca de Componentes (45+ componentes)
Organizados por categoria:
- **Básico**: Texto, Botão
- **Layout & UI**: Container, Card, Header, Divisor, Botão Flutuante, Avatar, Badge, Barra de Progresso, Chip/Tag
- **Formulário**: Campo de Texto, Switch, Slider, Avaliação, Checkbox
- **Mídia**: Imagem, Ícone, Player de Som, Player de Vídeo
- **Câmera**: Câmera, Scanner QR, Câmera com Detecção de Face
- **Localização**: Mapa (GPS)
- **IA**: Chat GPT, Gemini AI, Tradutor de Texto
- **APIs Externas**: Clima, Cripto, PokéCard, País, Piada, Usuário Aleatório, GitHub Card, QR Generator, IP/Geo, Notícias, Filmes, Citação, Receita, Dog Photo, Fato Numérico, Avatar Gerado, Cat Image

### 🔧 Modo Avançado
- Arraste elementos livremente pela tela
- **8 handles de redimensionamento** (cantos e pontos médios)
- Controles numéricos precisos de posição (X, Y) e largura
- Compatível com todos os componentes

### 🎨 Sistema de Design
- Tema **Dark** e **Light** com alternância instantânea
- Presets de design: **Apple HIG** e **Material You**
- Paleta de 35 cores curadas

### 💾 Componentes Reutilizáveis
- Salve qualquer componente configurado como um template pessoal
- Componentes salvos aparecem na paleta como "Meus Componentes"
- Arraste para reusar em qualquer tela do projeto
- Persistência automática no navegador

### ⚡ Programação por Blocos
- Editor visual de lógica (Linha de Lógica)
- 7 tipos de eventos: `onPress`, `onLongPress`, `onMount`, `onChange`, etc.
- 17 tipos de ações: Navegar, Alerta, Estado, Mídia, Debug, Controle
- Condicionais visuais (if-equals, if-greater, if-truthy)

### 📱 Multi-telas
- Crie, renomeie e exclua telas
- Navegação entre telas gerada automaticamente
- Estatísticas do projeto em tempo real

### 🧩 Templates Prontos
6 templates de telas completas:
- Login, Chat IA, Home Feed, Perfil, Dashboard, Configurações

### 📤 Exportação de Código
- Gera código **React Native / Expo completo** por tela
- Download individual de arquivos `.jsx`
- Blueprint passo a passo (AppBuild): de pré-requisitos até publicação na Play Store
- Importação/Exportação de projetos como `.rfactory`

---

## 🚀 APIs Externas Incluídas

| Componente | Provider | Chave? | Descrição |
|---|---|---|---|
| Clima | Open-Meteo | ❌ GRÁTIS | Temperatura e condições climáticas |
| Cripto Preço | CoinGecko | ❌ GRÁTIS | Preços de criptomoedas em tempo real |
| PokéCard | PokéAPI | ❌ GRÁTIS | Dados de Pokémon |
| Info País | RestCountries | ❌ GRÁTIS | Informações de países |
| Piada | JokeAPI | ❌ GRÁTIS | Piadas aleatórias por categoria |
| Usuário Aleatório | RandomUser.me | ❌ GRÁTIS | Perfis de usuários fictícios |
| GitHub Card | GitHub REST | ❌ GRÁTIS | Perfil de usuário do GitHub |
| QR Generator | goqr.me | ❌ GRÁTIS | Gerador de QR codes |
| IP / Geo | ipapi.co | ❌ GRÁTIS | Informações de geolocalização por IP |
| Citação | Quotable.io | ❌ GRÁTIS | Citações famosas aleatórias |
| Receita | TheMealDB | ❌ GRÁTIS | Receitas culinárias |
| Dog Photo | Dog.ceo | ❌ GRÁTIS | Fotos aleatórias de cachorros |
| Fato Numérico | Numbers API | ❌ GRÁTIS | Fatos curiosos sobre números |
| Avatar Gerado | DiceBear | ❌ GRÁTIS | Avatares gerados algoritmicamente |
| Cat Image | TheCatAPI | ❌ GRÁTIS | Fotos aleatórias de gatos |
| Feed de Notícias | NewsAPI | ✅ CHAVE | Notícias em tempo real |
| Card de Filme | TMDB | ✅ CHAVE | Informações de filmes |
| Chat GPT | OpenAI | ✅ CHAVE | Interface de chat com IA |
| Gemini AI | Google AI | ✅ CHAVE | Interface de chat com IA Google |
| Tradutor | LibreTranslate | ❌ GRÁTIS | Tradução de textos |

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| [React](https://react.dev) | 19 | Framework principal |
| [Vite](https://vitejs.dev) | 5 | Build tool e dev server |
| [@dnd-kit](https://dndkit.com) | 6 | Drag and drop |
| [lucide-react](https://lucide.dev) | latest | Ícones |
| JavaScript ESM | — | Linguagem |

---

## 📚 Como Usar em Sala de Aula

### Atividade 1 — Exploração de Componentes
1. Abra o React Factory (`npm run dev`)
2. Arraste diferentes componentes para a tela
3. Explore as propriedades de cada um no painel direito
4. **Pergunta**: "O que muda quando você altera a cor de fundo de um botão?"

### Atividade 2 — Clone de App Famoso
1. Escolha um app (Instagram, WhatsApp, Spotify)
2. Identifique os componentes que formam a tela inicial
3. Reproduza a tela usando os componentes disponíveis
4. **Desafio**: Use apenas componentes que você conhece o código

### Atividade 3 — App com API
1. Adicione um componente de API (ex: WeatherWidget)
2. Customize as propriedades
3. Abra o AppBuild e leia o código gerado
4. **Pergunta**: "Como o componente busca os dados da internet?"

### Atividade 4 — Componente Reutilizável
1. Crie e configure um Card personalizado
2. Salve como componente (botão "Salvar como Componente" no painel direito)
3. Reutilize em diferentes telas
4. **Conceito**: "O que é um componente reutilizável?"

### Atividade 5 — Exportar e Rodar
1. Exporte o código de uma tela (AppBuild → Download .jsx)
2. Crie um projeto Expo (`npx create-expo-app`)
3. Cole o código na tela correspondente
4. Rode com `npx expo start`

---

## 💻 Instalação e Execução

```bash
# Clonar o repositório
git clone https://github.com/SEU_USUARIO/react-factory.git
cd react-factory

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

Acesse: `http://localhost:5173`

---

## 📁 Estrutura do Projeto

```
react-factory/
├── src/
│   ├── components/
│   │   ├── Header.jsx           ← Barra superior com controles
│   │   ├── ComponentPalette.jsx ← Estoque de peças (sidebar esquerda)
│   │   ├── Canvas.jsx           ← Linha de montagem (área central)
│   │   ├── PropertiesPanel.jsx  ← Painel de propriedades (sidebar direita)
│   │   ├── BlockEditor.jsx      ← Linha de lógica (programação por blocos)
│   │   ├── AppBuild.jsx         ← Blueprint — tutorial de exportação
│   │   └── TemplateGallery.jsx  ← Galeria de templates
│   ├── contexts/
│   │   └── AppContext.jsx       ← Estado global e definições de componentes
│   ├── utils/
│   │   └── codeGenerator.js    ← Gerador de código React Native
│   ├── App.jsx                 ← Componente raiz
│   └── App.css                 ← Design system completo
├── public/
├── package.json
└── README.md
```

---

## 🗺️ Terminologia Pedagógica

O projeto usa termos metafóricos intencionais para aproximar conceitos abstratos:

| Termo no App | Conceito Real |
|---|---|
| **Estoque de Peças** | Biblioteca de Componentes |
| **Linha de Montagem** | Canvas / Área de Design |
| **Linha de Lógica** | Editor de Lógica / Block Programming |
| **AppBuild** | Gerador de Código / Tutorial de Deploy |
| **Módulos** | Telas / Screens |
| **Peças** | Componentes React Native |

---

## 📄 Licença

Este projeto é de **uso educacional**, desenvolvido para fins de ensino de programação e desenvolvimento mobile em sala de aula.

---

## 👨‍🏫 Sobre

Desenvolvido como ferramenta de apoio pedagógico para introduzir estudantes ao mundo do desenvolvimento de interfaces móveis com React Native e Expo — sem precisar escrever uma linha de código para começar a explorar.

> *"Primeiro você vê, depois você entende, depois você escreve."*
