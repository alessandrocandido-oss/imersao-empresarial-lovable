# Arquitetura de migração — Imersão CEO

Este documento descreve como reconstruir a landing page atual no Lovable usando **Vite + React + TypeScript + Tailwind CSS** e conectar o formulário ao Supabase. Preserve o texto, a hierarquia, o comportamento e a identidade visual premium da página HTML existente.

## Objetivo do app

Criar uma landing page responsiva para a **Imersão CEO**, evento presencial em São Paulo para empresários e CEOs. A página deve manter:

- tema premium em azul-marinho, dourado e tons neutros;
- tipografia editorial nos títulos e sans-serif no restante;
- modo claro/escuro persistente;
- animações discretas de entrada ao rolar;
- contador regressivo;
- FAQ em acordeão;
- formulário de aplicação com modal de confirmação;
- persistência de leads no Supabase, não mais em `localStorage`.

## Stack e dependências

- Vite + React + TypeScript;
- Tailwind CSS;
- `@supabase/supabase-js` para o banco;
- `lucide-react` para ícones (substitui Font Awesome);
- `framer-motion` para animações de scroll/modal, ou classes Tailwind com `transition` quando suficiente;
- Google Fonts: **Playfair Display** (600 e 700) e **DM Sans** (400, 500, 600 e 700).

Instalar:

```bash
npm install @supabase/supabase-js lucide-react framer-motion
```

## Estrutura de componentes React

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── lib/
│   └── supabase.ts
├── hooks/
│   ├── useTheme.ts
│   └── useCountdown.ts
├── types/
│   └── lead.ts
└── components/
    ├── Navbar.tsx
    ├── HeroSection.tsx
    ├── PainPointsSection.tsx
    ├── OutcomeSection.tsx
    ├── ProgramTimeline.tsx
    ├── AuthoritySection.tsx
    ├── TestimonialsSection.tsx
    ├── UrgencySection.tsx
    ├── CountdownTimer.tsx
    ├── RegistrationSection.tsx
    ├── RegistrationForm.tsx
    ├── AccordionFAQ.tsx
    ├── SuccessModal.tsx
    └── Footer.tsx
```

### `App.tsx`

Orquestra a ordem abaixo e controla o estado global mínimo:

1. `Navbar`
2. `HeroSection`
3. `PainPointsSection`
4. `OutcomeSection`
5. `ProgramTimeline`
6. `AuthoritySection`
7. `TestimonialsSection`
8. `UrgencySection` (inclui `CountdownTimer`)
9. `RegistrationSection` (inclui `RegistrationForm`)
10. `AccordionFAQ`
11. `SuccessModal`
12. `Footer`

Mantenha os anchors `#inicio`, `#programa`, `#inscricao` e `#faq`. Use `scroll-smooth` no elemento raiz.

### `Navbar.tsx`

- Marca em duas linhas: `IMERSÃO` em dourado pequeno e `CEO` em branco.
- CTA para `#inscricao`: “Garantir minha vaga” com ícone `ArrowRight`.
- Botão circular de tema, com `Moon`/`Sun`.
- Usa `useTheme` para adicionar/remover a classe `dark` no elemento `html` e salvar a preferência em `localStorage` com a chave `imersao-theme`.
- Sem valor salvo, respeite `prefers-color-scheme`.

### `HeroSection.tsx`

- Fundo com gradiente azul-marinho e glow radial azul.
- Eyebrow: “Evento presencial e exclusivo · São Paulo”.
- H1: “O próximo salto da sua empresa não será obra do acaso.”
- Texto de apoio, CTA primário para `#inscricao` e CTA secundário para `#programa`.
- Três provas: `36 vagas por turma`, `2 dias de execução profunda` e `100% foco em negócios reais`.

### `PainPointsSection.tsx`

Três cards em grid: operação consome você, receita sem previsibilidade e time sem direção. Cada card tem ícone, título e parágrafo.

### `OutcomeSection.tsx`

Seção azul-marinho com duas colunas: texto sobre o resultado e lista de quatro benefícios com `Check` dourado.

### `ProgramTimeline.tsx`

Lista com bordas horizontais e três itens: Dia 01, Dia 02 e Bônus. Em desktop, label da data à esquerda e conteúdo à direita; em mobile, uma coluna.

### `AuthoritySection.tsx`

Fundo neutro e três métricas: `R$ 1,8 bi+`, `12 anos` e `4,9/5`.

### `TestimonialsSection.tsx`

Três depoimentos em cards, com avatar circular de iniciais, nome e cargo/empresa.

### `UrgencySection.tsx` e `CountdownTimer.tsx`

- Faixa dourada em duas colunas: texto e contador.
- `useCountdown` calcula dias, horas, minutos e segundos até uma data configurável do próximo evento.
- O contador deve exibir `00` quando a data expirar.
- Diferentemente do HTML atual, não recalcule 10 dias a cada refresh: centralize a data em uma constante/configuração do evento.

### `RegistrationSection.tsx` e `RegistrationForm.tsx`

- Coluna de contexto e coluna de formulário.
- Campos obrigatórios: `nome`, `email` e `empresa`. O seletor visual de faturamento pode continuar na interface, mas **não deve ser enviado** à tabela solicitada sem uma migração adicional.
- Validar no cliente: textos não vazios e e-mail válido.
- Ao enviar, chamar `supabase.from('leads_imersao').insert({ nome, email, empresa })`.
- Enquanto envia, desabilitar o botão e mostrar “Enviando aplicação…”.
- Se o e-mail já existir (violação da constraint única), mostrar uma mensagem amigável: “Este e-mail já possui uma aplicação registrada.”
- Em sucesso, limpar o formulário e abrir `SuccessModal`; em erro inesperado, manter os dados preenchidos e mostrar erro no formulário.

### `AccordionFAQ.tsx`

- Renderize as quatro perguntas existentes a partir de um array tipado `{ question, answer }`.
- Controle `openIndex` com `useState<number | null>`; apenas uma resposta aberta por vez.
- Cada trigger é um `<button>` com `aria-expanded` e `aria-controls`; o painel tem `role="region"` e `aria-labelledby`.
- Use `ChevronDown`, rotacionando 180 graus no item aberto.

Perguntas: certificado, adequação a empresas de serviços, parcelamento e participação de sócio/diretor. Preserve o conteúdo atual das respostas.

### `SuccessModal.tsx`

Modal acessível, aberto após inserção bem-sucedida. Deve fechar por botão, clique no backdrop e tecla Escape; deve devolver o foco ao botão que submeteu o formulário. Exibir primeiro nome e e-mail do lead confirmado.

## Tokens e configuração Tailwind

No `tailwind.config.ts`, estenda cores, fontes, sombras e breakpoints com os tokens abaixo. Eles traduzem diretamente a identidade visual atual.

```ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#071A31',
        'navy-2': '#0D2D50',
        ink: '#162131',
        slate: '#5F6B7A',
        amber: '#D99A26',
        gold: '#F5C55C',
        paper: '#F7F8FA',
        line: '#DFE5EB',
        success: '#237A51',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 20px 50px rgba(7, 26, 49, 0.08)',
        modal: '0 40px 90px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at 78% 18%, #1B5A8A 0, transparent 28%), linear-gradient(120deg, #061326 0%, #0A2847 54%, #071A31 100%)',
        urgency: 'linear-gradient(110deg, #B87D14, #E1A832)',
      },
    },
  },
  plugins: [],
} satisfies Config
```

## Mapa de classes Tailwind exatas

Use estas combinações como base visual. Ajustes pontuais responsivos devem preservar os mesmos tokens.

| Elemento | Classes Tailwind |
|---|---|
| Container | `mx-auto w-[min(1120px,calc(100%-40px))] max-[520px]:w-[min(1120px,calc(100%-30px))]` |
| Página | `bg-white font-sans leading-relaxed text-ink transition-colors duration-300 dark:bg-[#060F1D] dark:text-[#E8EEF5]` |
| Hero | `relative min-h-[750px] overflow-hidden bg-hero text-white max-md:min-h-0` |
| Navbar | `relative z-10 flex h-[88px] items-center justify-between max-[520px]:h-[70px]` |
| Eyebrow | `mb-[17px] text-xs font-bold uppercase tracking-[0.1em] text-gold` |
| Título principal | `max-w-[880px] font-serif text-[clamp(2.7rem,5.4vw,5rem)] leading-[1.14] tracking-[-0.04em]` |
| Título de seção | `font-serif text-[clamp(2.1rem,3.8vw,3.35rem)] leading-[1.14] tracking-[-0.035em]` |
| CTA primário | `inline-flex items-center justify-center gap-[11px] bg-gold px-[22px] py-4 text-[0.95rem] font-bold text-[#172235] shadow-[0_10px_25px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:bg-[#FFE094] max-[520px]:w-full` |
| CTA secundário | `inline-flex items-center justify-center gap-[11px] border border-white/55 px-[22px] py-4 text-[0.95rem] font-bold text-white transition hover:border-gold hover:text-gold max-[520px]:w-full` |
| Card claro | `border border-line bg-white p-7 transition hover:-translate-y-1 hover:shadow-premium dark:border-white/10 dark:bg-[#0B182B]` |
| Grid de três cards | `mt-[46px] grid grid-cols-3 gap-[22px] max-md:grid-cols-1` |
| Seção escura | `bg-navy py-[110px] text-white dark:bg-[#03091A] max-md:py-20` |
| Duas colunas | `grid grid-cols-[1.05fr_.95fr] items-center gap-[85px] max-md:grid-cols-1 max-md:gap-[45px]` |
| Linha da timeline | `grid grid-cols-[145px_1fr] gap-6 border-b border-line px-2 py-[29px] max-md:grid-cols-1 max-md:gap-[5px] dark:border-white/10` |
| Métrica | `font-serif text-[2.7rem] text-navy dark:text-gold` |
| Depoimento | `border border-line bg-paper p-[30px_26px] text-base leading-[1.7] dark:border-white/10 dark:bg-[#0E1D33]` |
| Faixa de urgência | `bg-urgency py-[60px] text-white max-md:py-[52px]` |
| Formulário | `grid grid-cols-2 gap-[17px] border border-line bg-paper p-[35px] dark:border-white/10 dark:bg-[#0E1D33] max-[520px]:grid-cols-1 max-[520px]:p-[24px_18px]` |
| Input/Select | `w-full border border-[#D9E0E7] bg-white px-3 py-[13px] text-[0.92rem] text-ink outline-none transition focus:border-amber focus:ring-4 focus:ring-amber/15 dark:border-white/15 dark:bg-[#081426] dark:text-[#E8EEF5]` |
| Acordeão trigger | `flex w-full items-center justify-between gap-5 bg-transparent px-[6px] py-6 text-left text-[1.08rem] font-semibold text-ink transition hover:text-amber aria-expanded:text-amber dark:text-[#E8EEF5]` |
| Painel do acordeão | `overflow-hidden text-slate transition-[grid-template-rows] duration-[400ms] ease-in-out dark:text-[#9FB0C3]` |
| Modal backdrop | `fixed inset-0 z-50 grid place-items-center bg-[#03091A]/72 p-5 backdrop-blur-[6px]` |
| Card do modal | `w-full max-w-[480px] border border-line bg-white p-[46px_38px_38px] text-center text-ink shadow-modal dark:border-white/10 dark:bg-[#0B182B] dark:text-[#E8EEF5]` |

### Responsividade obrigatória

- Em até `800px` (`max-md`): grids de três colunas viram uma coluna; layouts de duas colunas viram uma coluna; seções caem para `py-20` ou `py-[75px]` conforme o bloco.
- Em até `520px`: container usa margem lateral de 15px; botões ocupam 100%; formulário vira uma coluna; navbar tem 70px; título Hero tem `text-[2.65rem]`.

## Tema claro/escuro

Use a estratégia `darkMode: 'class'` do Tailwind. O hook deve atualizar `document.documentElement.classList` e o `localStorage`:

```ts
const STORAGE_KEY = 'imersao-theme'
type Theme = 'light' | 'dark'

export function setTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem(STORAGE_KEY, theme)
}
```

No `main.tsx`, aplique o tema salvo antes de renderizar o React para evitar flash de cor. Caso não exista preferência, use `window.matchMedia('(prefers-color-scheme: dark)')`.

## Supabase

### Variáveis de ambiente

Crie `.env.local` (não versionado):

```dotenv
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA
```

Crie também `.env.example`, sem segredos:

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Cliente Supabase — `src/lib/supabase.ts`

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## SQL exato — tabela e RLS

Execute o script abaixo no **SQL Editor** do Supabase. Ele cria somente a tabela solicitada, gera UUID automaticamente, exige dados essenciais, garante e-mail único, ativa RLS e permite ao cliente público **somente inserir** aplicações válidas. Nenhuma política de leitura, atualização ou exclusão é criada para `anon`/`authenticated`.

```sql
create extension if not exists pgcrypto;

create table if not exists public.leads_imersao (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome text not null check (char_length(trim(nome)) > 0),
  email text not null unique check (char_length(trim(email)) > 0),
  empresa text not null check (char_length(trim(empresa)) > 0),
  status text not null default 'pendente'
    check (status in ('pendente', 'contatado', 'qualificado', 'recusado'))
);

alter table public.leads_imersao enable row level security;

revoke all on table public.leads_imersao from anon, authenticated;

grant insert on table public.leads_imersao to anon, authenticated;

create policy "Permitir inserção pública de leads"
on public.leads_imersao
for insert
to anon, authenticated
with check (
  char_length(trim(nome)) > 0
  and char_length(trim(email)) > 0
  and char_length(trim(empresa)) > 0
  and status = 'pendente'
);
```

### Regras de segurança e operação

- A chave `anon` pode ficar no frontend; **nunca** exponha `service_role` no Lovable ou no repositório.
- Com o RLS acima, visitantes enviam leads, mas não conseguem listar, editar ou apagar leads pela API pública.
- Faça a triagem em painel administrativo autenticado, Edge Function ou backend seguro com chave `service_role` exclusivamente no servidor.
- O campo `email` é único. Trate o erro de duplicidade no formulário.
- Para adicionar `faturamento` futuramente, crie uma migração separada com coluna e validação, atualize o tipo TypeScript e somente então envie o campo no `insert`.

## Checklist de validação no Lovable

1. Confirme que todos os anchors fazem scroll suave para as seções corretas.
2. Confirme persistência de tema após recarregar.
3. Teste navegação por teclado e atributos ARIA do acordeão e modal.
4. Teste o contador com data futura e expirada.
5. Envie um lead válido; confirme linha na tabela `leads_imersao` com `status = 'pendente'`.
6. Reenvie o mesmo e-mail e confirme mensagem de duplicidade.
7. Confirme que `anon` não consegue executar `select`, `update` ou `delete` em `leads_imersao`.
8. Valide visualmente desktop e mobile, incluindo os breakpoints de 800px e 520px.
