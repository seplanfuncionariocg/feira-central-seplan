# Ideias de Design - Dashboard Feira Central

## Contexto
Dashboard interativo para visualização de dados da pesquisa com comerciantes da Feira Central de Campina Grande, com foco em análise demográfica, econômica e infraestrutura dos estabelecimentos.

---

<response>
<probability>0.08</probability>

### Ideia 1: Brutalismo de Dados (Data Brutalism)

**Design Movement**: Brutalismo Digital com influências de Swiss Design

**Core Principles**:
- Tipografia monumental e hierarquia extrema
- Grids assimétricos e quebrados intencionalmente
- Exposição crua dos dados sem ornamentação
- Contraste máximo entre elementos

**Color Philosophy**: 
Paleta monocromática de alto contraste com acentos vibrantes de amarelo ácido (#FFE500) e laranja queimado (#FF6B35) sobre fundo preto profundo (#0A0A0A) e branco puro (#FFFFFF). A intenção é criar tensão visual e direcionar o olhar para os dados críticos através de blocos de cor saturada.

**Layout Paradigm**: 
Grid quebrado com blocos de dados em tamanhos desproporcionais, criando hierarquia através do peso visual. Cards flutuam em diferentes níveis Z com sombras duras e bordas grossas. Nenhum elemento centralizado - tudo empurrado para as extremidades.

**Signature Elements**:
- Bordas grossas (4-8px) em preto sólido
- Números gigantes (120px+) para métricas principais
- Blocos de cor sólida sem gradientes
- Tipografia condensada para títulos

**Interaction Philosophy**: 
Interações abruptas e diretas. Sem transições suaves - mudanças instantâneas de estado. Hover revela dados adicionais através de overlays de cor sólida. Cliques produzem feedback visual agressivo.

**Animation**: 
Animações mecânicas e lineares (ease-in-out proibido). Elementos entram com slides rápidos de 150ms. Números contam de forma instantânea sem easing. Gráficos aparecem com wipe effects horizontais.

**Typography System**:
- Display: Space Grotesk Bold (900) para números e títulos principais
- Headings: Archivo Black para categorias
- Body: IBM Plex Mono para labels e dados secundários
- Hierarquia através de escala extrema (14px → 120px)

</response>

---

<response>
<probability>0.07</probability>

### Ideia 2: Nordeste Contemporâneo (Contemporary Northeast)

**Design Movement**: Regionalismo Crítico com elementos de Arte Popular Brasileira

**Core Principles**:
- Celebração da identidade cultural nordestina
- Padrões geométricos inspirados em cerâmica e xilogravura
- Calor e acolhimento através de cores terrosas
- Dados humanizados com storytelling visual

**Color Philosophy**:
Paleta inspirada no sertão e na feira: terracota (#D4704A), azul cerâmico (#2B5F75), amarelo sol (#F4A259), verde cacto (#6B8E23) sobre fundo areia clara (#F5EFE6). A intenção emocional é criar familiaridade e pertencimento, conectando os dados à cultura local através de tons naturais e acolhedores.

**Layout Paradigm**:
Layout em mosaico inspirado nas barracas da feira - cards organizados como boxes de mercadoria. Seções divididas por faixas decorativas com padrões geométricos. Uso de diagonais sutis para criar movimento, como as lonas das barracas ao vento.

**Signature Elements**:
- Padrões geométricos de xilogravura como backgrounds sutis
- Ícones customizados inspirados em elementos da feira
- Divisores decorativos com motivos regionais
- Texturas de papel kraft em overlays

**Interaction Philosophy**:
Interações orgânicas e acolhedoras. Elementos respondem com suavidade, como se fossem físicos. Hover revela contexto cultural dos dados. Tooltips contam micro-histórias dos comerciantes.

**Animation**:
Animações fluidas e orgânicas com ease-out suave (cubic-bezier). Elementos entram com fade + slight scale (0.95 → 1) em 400ms. Gráficos crescem como plantas, de baixo para cima. Transições entre seções com crossfade de 300ms.

**Typography System**:
- Display: Epilogue ExtraBold para números principais
- Headings: Sora SemiBold para títulos de seção
- Body: Inter Regular para texto corrido
- Accent: Caveat para anotações e destaques humanizados
- Hierarquia através de peso e cor, não apenas tamanho

</response>

---

<response>
<probability>0.06</probability>

### Ideia 3: Minimalismo Analítico (Analytical Minimalism)

**Design Movement**: Minimalismo Suíço encontra Data Visualization Moderna

**Core Principles**:
- Clareza absoluta na apresentação de dados
- Redução ao essencial - cada pixel tem propósito
- Hierarquia através de espaçamento, não decoração
- Precisão matemática em grids e alinhamentos

**Color Philosophy**:
Paleta monocromática de cinzas frios (#F8F9FA, #E9ECEF, #495057, #212529) com um único acento de azul elétrico (#0066FF) para destacar dados críticos. A intenção é eliminar ruído visual e permitir que os dados falem por si, usando cor apenas para direcionar atenção.

**Layout Paradigm**:
Grid matemático de 12 colunas com espaçamento consistente de 24px. Tudo alinhado a uma baseline vertical de 8px. Cards com proporções áureas (1:1.618). Assimetria controlada através de pesos de coluna (4-8, 3-9, etc).

**Signature Elements**:
- Linhas finas (1px) em cinza médio para separação
- Espaçamento generoso (mínimo 32px entre seções)
- Gráficos com eixos mínimos e sem grid
- Números em tabular figures para alinhamento perfeito

**Interaction Philosophy**:
Interações discretas e precisas. Hover muda apenas opacity (0.7). Focus rings finos e precisos. Estados de loading com spinners minimalistas. Feedback visual sutil mas imediato.

**Animation**:
Animações quase imperceptíveis. Transições de 200ms com ease-out. Elementos entram com fade puro (sem movement). Gráficos animam com stagger de 50ms entre elementos. Números contam com easing suave.

**Typography System**:
- Display: Inter Tight SemiBold para números grandes
- Headings: Inter Medium para títulos
- Body: Inter Regular para texto
- Monospace: JetBrains Mono para valores numéricos tabulares
- Hierarquia através de peso (400, 500, 600) e tamanho preciso (14, 16, 20, 32, 48px)

</response>
