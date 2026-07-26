# 🍉 Frutas Mix — Delivery de Frutas & Copos Tropicais

<p align="center">
  <img src="https://raw.githubusercontent.com/AlonsoNeto01/Cardapio_online/main/public/favicon.ico" width="80" alt="Frutas Mix Logo" />
</p>

<p align="center">
  <b>Uma experiência premium de e-commerce e delivery de frutas frescas, sucos naturais e saladas de fruta tropicais.</b>
</p>

<p align="center">
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-design-system">Design System</a> •
  <a href="#-como-executar">Como Executar</a> •
  <a href="#-estrutura-do-projeto">Estrutura</a>
</p>

---

## 🍍 Sobre o Projeto

O **Frutas Mix** é uma plataforma moderna de atendimento e cardápio digital voltada para o mercado de delivery de frutas de qualidade premium. O sistema foi desenvolvido focado na experiência do usuário (UX/UI), entregando agilidade no processo de escolha e checkout, além de interface responsiva de alto padrão para dispositivos móveis e desktop.

---

## 🚀 Funcionalidades

### 🛍️ Área do Cliente (Loja Online)
- **Hero & Banner Imersivo**: Apresentação visual atraente com foto de capa, logo da loja, indicador em tempo real de status da loja (Aberto/Fechado) e horários de funcionamento.
- **Busca em Tempo Real (Client-Side)**: Filtragem instantânea de produtos por nome e descrição sem recarregar a página.
- **Categorias Interativas**: Navegação fluida por pílulas/chips e navegação rápida ancorada.
- **Cards de Produto de Alta Conversão**: Exibição de imagens em destaque, badges de *Destaque* e *Frete Grátis*, além de preços destacados.
- **Modal de Produto Completo**: Seleção de opcionais/adicionais obrigatórios e opcionais com cálculo automático do valor final.
- **Carrinho Drawer Responsivo**: Acesso rápido aos itens selecionados, controle dinâmico de quantidades e subtotal.
- **Checkout Guiado**:
  - Resumo detalhado dos itens e adicionais.
  - Seleção de bairro com cálculo automático de taxa de entrega.
  - Escolha da forma de pagamento (Pix, Cartão de Crédito/Débito, Dinheiro com cálculo de troco).
  - Envio e integração automática com o **WhatsApp do estabelecimento**.
- **Acompanhamento de Pedido em Tempo Real**: Tela de tracking com atualização via Supabase Realtime (Status: *Novo* 📝 ➔ *Preparando* 👨‍🍳 ➔ *Saiu para Entrega* 🛵 ➔ *Concluído* ✅).
- **Suporte a Dark Mode / Light Mode**: Alternância simples de tema visual com contraste adequado e transição suave.

### 🛡️ Painel Administrativo
- **Kanban de Pedidos**: Gerenciamento visual dos pedidos em andamento em colunas dinâmicas.
- **Gestão de Produtos e Categorias**: Cadastro, edição, alteração de destaques e ativação/desativação.
- **Configuração de Adicionais**: Criação de grupos de opcionais (mínimo/máximo de escolhas e preços).
- **Horário de Funcionamento & Taxas de Bairro**: Controle de abertura/fechamento automático e tabelas de frete por bairro.

---

## 🛠️ Tecnologias

A aplicação utiliza as tecnologias mais modernas do ecossistema JavaScript/TypeScript:

- **Frontend**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) + Design System com CSS Variables nativas
- **Banco de Dados & Backend**: [Supabase](https://supabase.com/) (PostgreSQL, Realtime Subscriptions & Storage)
- **Deploy & Serverless**: [Cloudflare Workers](https://workers.cloudflare.com/) via OpenNext (`@opennextjs/cloudflare`)
- **Fontes & Ícones**: Google Fonts (Inter) + Ícones em SVG inline otimizados

---

## 🎨 Design System

O visual do aplicativo foi estruturado com base em uma paleta vibrante inspirada em frutas tropicais e frescas:

- 🟢 **Verde Primário (`#16A34A` / `#4ADE80`)**: Remete a frescor, saúde e botões de ação (CTAs).
- 🍊 **Laranja Manga (`#EA580C` / `#FB923C`)**: Destaques, atenção e botões secundários.
- 🟡 **Amarelo Abacaxi (`#CA8A04` / `#FACC15`)**: Badges de destaque e avaliações.
- 🔴 **Vermelho Morango (`#DC2626` / `#F87171`)**: Alertas e remoções.

> ✨ **Acessibilidade**: Todas as cores possuem variantes dedicadas para o modo escuro (`.dark`) e respeitam a preferencia de movimento reduzido (`prefers-reduced-motion: reduce`).

---

## 💻 Como Executar o Projeto

### Pré-requisitos
- Node.js 20+ instalado
- Conta no Supabase (para variáveis de ambiente)

### 1. Clonar o Repositório
```bash
git clone https://github.com/AlonsoNeto01/Cardapio_online.git
cd Cardapio_online
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto com as seguintes credenciais:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

### 4. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### 5. Compilar para Produção (Build Test)
```bash
npm run build
```

---

## 📂 Estrutura do Projeto

```text
├── src/
│   ├── app/                 # Rotas do Next.js App Router (Home, Checkout, Admin, Order)
│   ├── components/          # Componentes visuais (Header, ProductCard, Cart, ProductModal)
│   │   ├── admin/           # Componentes do painel administrativo
│   │   └── ui/              # Componentes base (Button, Modal, Input, Badge, Tabs)
│   ├── contexts/            # Contextos do React (CartContext, ThemeContext, StoreContext)
│   ├── lib/                 # Server Actions, cliente Supabase, utilitários e tipos
│   └── middleware.ts        # Proteção de rotas administrativas
├── public/                  # Assets estáticos e favicon
├── supabase/                # Schemas e migrações do banco de dados
├── open-next.config.ts      # Configurações de deploy para Cloudflare
└── wrangler.jsonc           # Configuração do Cloudflare Workers
```

---

<p align="center">
  Desenvolvido com 💚 por <a href="https://twodevssolutions.com.br/" target="_blank">TwoDevs Solutions</a>
</p>
