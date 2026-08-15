# Zeen Hardware

Dashboard de comparação e histórico de preços de componentes de PC no mercado brasileiro. A aplicação consome a API pública do [PC Build Wizard](https://www.pcbuildwizard.com/) e apresenta os dados em tabelas filtráveis, páginas de produto e gráficos de tendência de preço.

## Funcionalidades

- **Catálogo por categoria** — placas de vídeo, processadores, placas-mãe, memória RAM, fontes, armazenamento (SSD) e gabinetes, cada um com listagem em tabela e filtros (loja, fabricante, cor, etc.) sincronizados com a URL.
- **Página de produto** — melhor preço à vista e parcelado, avaliação, selos (Novo, Desconto, Frete grátis, Pré-venda), cupons de desconto, botão de atualizar preço em tempo real e lista de ofertas alternativas por loja.
- **Painel de preços** — gráficos de histórico de preço por categoria (mediana, 1º quartil ou menor preço), com seleção de período (6 meses a 3 anos) e granularidade (dia/semana/mês/trimestre), além de comparação entre produtos, preços atuais e produtos em alta.
- **Navegação lateral responsiva** com categorias e indicação de seções "Em breve".

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) — **atenção:** este projeto usa uma versão customizada do Next.js com mudanças de comportamento em relação ao padrão. Antes de mexer em convenções do framework, veja `node_modules/next/dist/docs/` e o aviso em [AGENTS.md](AGENTS.md).
- React 19 + TypeScript
- Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com) (estilo `base-nova`, base [Base UI](https://base-ui.com))
- [TanStack Table](https://tanstack.com/table) para as tabelas de produtos
- [Recharts](https://recharts.org) para os gráficos
- [nuqs](https://nuqs.47ng.com) para estado de filtros na URL
- [SWR](https://swr.vercel.app) para atualização de preço no cliente

Não há banco de dados nem autenticação — a aplicação é um front-end somente leitura sobre a API do PC Build Wizard (`lib/pcbuildwizard/`).

## Como rodar

Requer [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

Outros scripts:

```bash
pnpm build   # build de produção
pnpm start   # roda o build de produção
pnpm lint    # eslint
```

## Estrutura

```text
app/                    Rotas (App Router)
  page.tsx              Dashboard inicial (histórico de preço de GPUs)
  products/<categoria>/ Listagem + página de detalhe por categoria
components/
  ui/                    Primitivos shadcn/ui
  dashboard/             Gráficos de preço
  data-table/             Wrapper genérico de tabela (TanStack)
  products/               Componentes específicos de produto (badges, filtros, imagem)
lib/pcbuildwizard/        Cliente tipado da API do PC Build Wizard
constants/                Metadados de categorias
```

## Créditos

Dados fornecidos por [PC Build Wizard](https://www.pcbuildwizard.com/).
