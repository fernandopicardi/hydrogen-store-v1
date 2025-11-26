# Template Base Hydrogen Store

Este repositório serve como uma **base completa e reutilizável** para criar lojas personalizadas utilizando o [Shopify Hydrogen](https://shopify.dev/custom-storefronts/hydrogen) com React Router 7. Ele inclui todas as configurações, páginas, seções e componentes necessários para iniciar rapidamente o desenvolvimento de sua loja.

## 🎯 O que está incluído

### Componentes
- **Header** - Cabeçalho com menu de navegação e busca
- **Footer** - Rodapé com links e informações
- **Cart** - Sistema completo de carrinho de compras
  - `CartMain` - Visualização principal do carrinho
  - `CartLineItem` - Item individual do carrinho
  - `CartSummary` - Resumo e total do carrinho
  - `CartSubscriptionPromo` - Promoções de assinatura
- **Product** - Componentes de produto
  - `ProductItem` - Card de produto
  - `ProductImage` - Imagem do produto
  - `ProductPrice` - Preço do produto
  - `ProductForm` - Formulário de seleção de variantes
  - `AddToCartButton` - Botão de adicionar ao carrinho
- **Search** - Sistema de busca completo
  - `SearchForm` - Formulário de busca
  - `SearchFormPredictive` - Busca preditiva
  - `SearchPopup` - Popup de busca
  - `SearchResults` - Resultados de busca
  - `SearchResultsPredictive` - Resultados preditivos
- **Aside** - Painel lateral para busca, carrinho e menu mobile
- **PageLayout** - Layout base das páginas
- **PaginatedResourceSection** - Seção com paginação

### Sections (Seções da Homepage)
- **HeroSection** - Seção hero/banner principal
- **FeaturesSection** - Seção de características/destaques
- **FeaturedProductsSection** - Seção de produtos em destaque
- **CTASection** - Seção de call-to-action
- **TestimonialsSection** - Seção de depoimentos
- **FAQSection** - Seção de perguntas frequentes
- **SectionHeader** - Cabeçalho reutilizável para seções

### Rotas Completas
- **Produtos**: Visualização individual de produtos (`/products/$handle`)
- **Coleções**: Listagem e visualização de coleções (`/collections`)
- **Carrinho**: Gerenciamento completo do carrinho (`/cart`)
- **Conta do Cliente**: Área completa do cliente (`/account`)
  - Perfil, endereços, pedidos, autorização
- **Blogs**: Sistema de blog completo (`/blogs`)
  - Listagem de blogs, artigos individuais
- **Páginas**: Páginas estáticas (`/pages/$handle`)
- **Políticas**: Páginas de políticas (`/policies`)
- **Busca**: Página de resultados de busca (`/search`)
- **Descontos**: Aplicação de códigos de desconto (`/discount/$code`)
- **Sitemap**: Geração automática de sitemap
- **Robots.txt**: Configuração de robots

### Configurações e Tecnologias
- **React Router 7.9.2** - Framework de roteamento
- **Shopify Hydrogen 2025.7.0** - Stack de headless commerce
- **Tailwind CSS 4.1.6** - Framework CSS utility-first
- **TypeScript 5.9.2** - Tipagem estática
- **GraphQL Codegen** - Geração automática de tipos GraphQL
- **Vite 6.2.4** - Build tool moderna
- **ESLint + Prettier** - Linting e formatação de código
- **Shopify CLI** - Ferramentas de desenvolvimento

## 📋 Pré-requisitos

- **Node.js** versão 20.0.0 ou superior (see `engines` in `package.json`)
- **npm** ou outro gerenciador de pacotes
- **Conta Shopify** (apenas para Opção B - Connect to Your Store)

💡 **Windows Users:**

- If you are using NVM on Windows, make sure to use `nvm-windows`.
- Use PowerShell or Git Bash for the best experience with the Shopify CLI.
- Ensure your Node version matches the engine requirement in `package.json` (>=20.0.0).

## 🚀 Quick Start

Choose one of the following setup paths based on your needs:

### Option A: Demo Mode (Mock Shop)

Get up and running immediately with demo data from Shopify's Mock Shop. Perfect for exploring the template and testing functionality without connecting to a real store.

1. **Clone the repository**

```bash
git clone https://github.com/seu-usuario/hydrogen-store-v1.git
cd hydrogen-store-v1
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

The `.env.example` file contains pre-configured credentials for the Shopify Mock Shop, allowing you to start the development server immediately.

4. **Start the development server**

```bash
npm run dev
```

The development server will be available at `http://localhost:3000` (or another port if 3000 is occupied).

### Option B: Connect to Your Store (Real Data)

Connect to your own Shopify store to work with real products, collections, and customer data.

1. **Clone the repository**

```bash
git clone https://github.com/seu-usuario/hydrogen-store-v1.git
cd hydrogen-store-v1
```

2. **Install dependencies**

```bash
npm install
```

3. **Connect to your Shopify store**

```bash
npx shopify hydrogen link
```

This command will:
- Prompt you to log in to your Shopify account
- Allow you to select your store
- Automatically create and configure the `.env` file with all required environment variables from your store

4. **Generate TypeScript types**

```bash
npm run codegen
```

This updates the GraphQL types based on your store's actual schema, ensuring type safety when working with your store's data.

5. **Start the development server**

```bash
npm run dev
```

The development server will be available at `http://localhost:3000` (or another port if 3000 is occupied).

## 🔧 Como Funciona a Integração

O Shopify CLI gerencia automaticamente todas as variáveis de ambiente necessárias para conectar sua aplicação com a loja Shopify:

- **Variáveis configuradas automaticamente pelo Shopify CLI**:
  - `PUBLIC_STORE_DOMAIN` - Domínio da sua loja
  - `PUBLIC_STOREFRONT_API_TOKEN` - Token público da Storefront API
  - `PRIVATE_STOREFRONT_API_TOKEN` - Token privado da Storefront API
  - `PUBLIC_STOREFRONT_ID` - ID da storefront
  - `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID` - Client ID para Customer Account API
  - `PUBLIC_CUSTOMER_ACCOUNT_API_URL` - URL da Customer Account API
  - `PUBLIC_CHECKOUT_DOMAIN` - Domínio do checkout

**Importante sobre SESSION_SECRET**: 
- O `SESSION_SECRET` é necessário **antes** de conectar com Shopify e deve estar no arquivo `.env`
- Você deve copiar `.env.example` para `.env` após `npm install` (passo 3)
- O valor padrão `"foobar"` funciona para desenvolvimento local
- Para produção, gere uma string segura: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- O Shopify CLI **não** sobrescreve o `SESSION_SECRET` quando você executa `shopify hydrogen link` ou `shopify hydrogen env pull`

O arquivo `.env` é gerado/atualizado automaticamente pelo CLI e está no `.gitignore` para não ser versionado.

## 📁 Estrutura do Projeto

```
hydrogen-store-v1/
├── app/
│   ├── assets/           # Imagens e assets estáticos
│   ├── components/       # Componentes React reutilizáveis
│   │   └── sections/     # Seções da homepage
│   ├── graphql/         # Queries e fragments GraphQL
│   ├── hooks/           # Custom hooks React
│   ├── lib/             # Utilitários e helpers
│   ├── routes/          # Rotas da aplicação (file-based routing)
│   ├── styles/          # Estilos CSS e Tailwind
│   ├── entry.client.tsx # Entry point do cliente
│   ├── entry.server.tsx # Entry point do servidor
│   └── root.tsx         # Componente raiz da aplicação
├── public/              # Arquivos públicos estáticos
├── server.ts            # Handler do servidor (Oxygen)
├── react-router.config.ts # Configuração do React Router
├── vite.config.ts       # Configuração do Vite
├── package.json         # Dependências e scripts
└── tsconfig.json        # Configuração do TypeScript
```

## 📜 Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev
```

Inicia o servidor de desenvolvimento com hot-reload. O Shopify CLI gerencia automaticamente as variáveis de ambiente e a conexão com a loja.

### Build para Produção

```bash
npm run build
```

Cria um build otimizado para produção e executa o codegen do GraphQL para gerar os tipos TypeScript.

### Preview do Build

```bash
npm run preview
```

Executa um preview do build de produção localmente.

### Verificação de Código

```bash
npm run lint
```

Executa o ESLint para verificar problemas no código.

### Verificação de Tipos

```bash
npm run typecheck
```

Verifica os tipos TypeScript e gera os tipos do React Router.

### Codegen

```bash
npm run codegen
```

Gera os tipos TypeScript a partir dos schemas GraphQL do Shopify (Storefront API e Customer Account API).

## 🎨 Próximos Passos

Agora que você tem o projeto configurado, você pode:

1. **Personalizar Componentes e Sections**
   - Edite os componentes em `app/components/`
   - Customize as sections da homepage em `app/components/sections/`
   - Ajuste estilos usando Tailwind CSS

2. **Adicionar Conteúdo na Loja Shopify**
   - Acesse o Shopify Admin
   - Adicione produtos, coleções e conteúdo
   - Configure menus de navegação (header e footer)

3. **Customizar Estilos e Temas**
   - Modifique `app/styles/app.css` para estilos globais
   - Use classes Tailwind CSS nos componentes
   - Configure o tema no `tailwind.config` se necessário

4. **Adicionar Novas Rotas**
   - Crie novos arquivos em `app/routes/` seguindo o padrão file-based routing
   - O React Router detecta automaticamente novas rotas

5. **Configurar Menus no Shopify Admin**
   - Crie menus com handles `main-menu` (header) e `footer` (footer)
   - Os componentes Header e Footer já estão configurados para usar esses menus

6. **Personalizar i18n**
   - Ajuste a lógica de localização em `app/lib/i18n.ts`
   - Configure suporte para múltiplos idiomas e países

## 📚 Recursos e Documentação

### Documentação Oficial

- [Shopify Hydrogen Documentation](https://shopify.dev/custom-storefronts/hydrogen)
- [React Router Documentation](https://reactrouter.com)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Shopify Customer Account API](https://shopify.dev/docs/api/customer-account)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Guias do Projeto

- `guides/predictiveSearch/` - Guia de busca preditiva
- `guides/search/` - Guia de implementação de busca

### Suporte

Para dúvidas sobre o Shopify Hydrogen, consulte:
- [Shopify Community](https://community.shopify.com/)
- [Hydrogen GitHub](https://github.com/Shopify/hydrogen)

## 🔒 Segurança

- O arquivo `.env` contém credenciais sensíveis e está no `.gitignore`
- Nunca commite o arquivo `.env` no repositório
- O diretório `.shopify` também está ignorado e contém configurações do CLI

## 📝 Notas Importantes

- Este template usa **React Router 7**, não Remix. Todos os imports devem vir de `react-router`, não de `@remix-run/react`
- O projeto está configurado para deploy no **Shopify Oxygen**
- As variáveis de ambiente são gerenciadas automaticamente pelo Shopify CLI
- O GraphQL Codegen gera tipos TypeScript automaticamente a partir dos schemas do Shopify

---

**Desenvolvido com ❤️ usando Shopify Hydrogen e React Router**

Este template foi criado para facilitar o desenvolvimento de lojas headless personalizadas no Shopify, fornecendo uma base sólida e completa para seus projetos.
