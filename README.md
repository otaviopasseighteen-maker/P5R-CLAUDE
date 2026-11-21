# Persona 5 Royal Fan Site

> Um site imersivo e completo para fãs de Persona 5 Royal, construído com tecnologias web modernas e design fiel à estética do jogo.

![Persona 5 Royal](https://img.shields.io/badge/Persona_5_Royal-Fan_Site-c70000?style=for-the-badge&logo=playstation&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_AA-0099CC?style=for-the-badge)

## ✨ Características

### 🎮 Conteúdo Completo
- **9 Phantom Thieves** - Perfis detalhados, stats, Personas, confidantes
- **22 Confidantes** - Rankings, habilidades, locais, prazos, prioridades
- **8+ Palácios** - Mapas, Will Seeds, estratégias de chefes, Mementos
- **Mecânicas Profundas** - Combate, fusão, Social Stats, gestão de tempo
- **110+ Faixas OST** - Player integrado, destaque para faixas icônicas
- **Novidades Royal** - Kasumi, Maruki, 3º Semestre, Thieves Den, Showtime

### 🎨 Design Imersivo
- Paleta de cores oficial (Vermelho #c70000, Preto, Dourado #ffd700)
- Tipografia inspirada no jogo (Oswald + Inter)
- Animações suaves (reveal, parallax, particle system)
- Cursor trail effect temático
- Loading screen com animação "TAKE YOUR HEART"

### ♿ Acessibilidade (WCAG 2.1 AA)
- Semântica HTML5 correta
- ARIA labels e roles
- Navegação por teclado completa
- Focus visible states
- Suporte a `prefers-reduced-motion`
- Contraste de cores validado
- Skip links

### ⚡ Performance
- Service Worker para cache offline
- Lazy loading de imagens
- CSS/JS minificados (produção)
- Critical CSS inlined
- Font display swap

### 📱 Responsivo
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px, 1200px
- Touch-friendly interactions
- Hamburger menu acessível

## 🚀 Início Rápido

### Pré-requisitos
- Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Servidor local (para Service Worker e fetch)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/p5r-fan-site.git
cd p5r-fan-site

# Inicie servidor local (Python)
python -m http.server 8000

# Ou com Node.js (serve)
npx serve .

# Ou com PHP
php -S localhost:8000
```

Acesse `http://localhost:8000`

### Deploy

#### GitHub Pages
```bash
# Build (se usando build tools)
npm run build

# Deploy para gh-pages branch
git subtree push --prefix . origin gh-pages
```

#### Netlify/Vercel
- Conecte o repositório
- Build command: `none` (site estático)
- Publish directory: `.` (raiz)

## 📁 Estrutura do Projeto

```
p5r-fan-site/
├── index.html              # Página inicial
├── sw.js                   # Service Worker
├── README.md
├── .gitignore
├── css/
│   ├── main.css           # Estilos principais + design tokens
│   ├── components.css     # Componentes reutilizáveis
│   └── animations.css     # Animações e keyframes
├── js/
│   ├── main.js           # App principal (tema, nav, loading)
│   ├── components.js     # Componentes UI (Modal, Tooltip, Tabs)
│   ├── animations.js     # Particle system, scroll effects
│   └── pages/            # Scripts específicos por página
│       ├── characters.js
│       ├── confidants.js
│       ├── palaces.js
│       ├── mechanics.js
│       ├── ost.js
│       └── royal.js
├── data/
│   └── game-data.json    # Todos os dados do jogo
├── pages/
│   ├── characters.html
│   ├── confidants.html
│   ├── palaces.html
│   ├── mechanics.html
│   ├── ost.html
│   └── royal.html
└── assets/
    ├── images/           # Imagens (personagens, palácios, etc.)
    ├── icons/
    │   └── favicon.svg
    └── fonts/            # Fontes locais (opcional)
```

## 🎯 Design System (CSS Custom Properties)

### Cores Principais
```css
--color-accent-primary: #c70000;    /* Vermelho P5 */
--color-accent-secondary: #e50914;  /* Vermelho hover */
--color-accent-gold: #ffd700;       /* Dourado Royal */
--color-bg-primary: #0a0a0a;        /* Preto fundo */
--color-fg-primary: #ffffff;        /* Branco texto */
```

### Tipografia
```css
--font-display: 'Oswald', sans-serif;  /* Títulos */
--font-primary: 'Inter', sans-serif;   /* Corpo */
--font-mono: 'JetBrains Mono', monospace; /* Código */
```

### Espaçamento (Escala 4px)
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

## 📊 Dados do Jogo (`data/game-data.json`)

Estrutura principal:
```json
{
  "characters": [...],      // 9 Phantom Thieves
  "confidants": [...],      // 22 Confidantes
  "palaces": [...],         // 8 Palácios + Mementos + Maruki
  "mechanics": [...],       // 6 Sistemas principais
  "ost": [...],             // 10+ Faixas destacadas
  "quotes": [...],          // 12 Frases marcantes
  "updates": [...]          // 5 Atualizações recentes
}
```

## 🔧 Personalização

### Tema Claro/Escuro
```javascript
// Alternar programaticamente
document.documentElement.setAttribute('data-theme', 'light');
// ou 'dark'
```

### Adicionar Nova Página
1. Crie `pages/nova-pagina.html`
2. Crie `js/pages/nova-pagina.js`
3. Adicione link no `nav-menu` do `index.html`
4. Importe dados do `game-data.json`

### Novos Componentes
Estenda `js/components.js` seguindo o padrão:
```javascript
const NovoComponente = {
  init: function() { ... },
  // métodos...
};
```

## 🌐 Navegadores Suportados

| Navegador | Versão Mínima |
|-----------|---------------|
| Chrome    | 90+           |
| Firefox   | 88+           |
| Safari    | 14+           |
| Edge      | 90+           |
| Opera     | 76+           |

*Requer suporte a: CSS Custom Properties, IntersectionObserver, Fetch API, Service Workers*

## 📝 Licença

Este é um **projeto de fã não oficial**. 

- **Código**: MIT License - livre para uso, modificação e distribuição
- **Assets do Persona 5 Royal**: Propriedade da ATLUS/SEGA
- **Dados do jogo**: Compilados de fontes públicas e wikis da comunidade

> **Disclaimer**: Este site não é afiliado, endossado ou patrocinado pela ATLUS, SEGA ou quaisquer detentores de direitos de Persona 5 Royal.

## 🤝 Contribuindo

Contribuições são bem-vindas! 

1. Fork o projeto
2. Crie branch (`git checkout -b feature/nova-feature`)
3. Commit (`git commit -m 'Add: nova feature'`)
4. Push (`git push origin feature/nova-feature`)
5. Abra Pull Request

### Ideias para Contribuição
- [ ] Tradução para Inglês/Japonês
- [ ] Mais imagens/assets visuais
- [ ] Calculadora de fusão interativa
- [ ] Guia de speedrun detalhado
- [ ] Modo "Spoiler-free" para novos jogadores
- [ ] PWA manifest para instalação
- [ ] Testes automatizados (Playwright/Cypress)

## 🙏 Créditos

- **ATLUS / SEGA** - Persona 5 Royal (jogo original)
- **Shoji Meguro** - Compositor da trilha sonora icônica
- **Lyn Inaizumi** - Vocalista principal
- **Comunidade P5R** - Wikis, guias, dados (Persona 5 Wiki, Reddit r/Persona5)
- **Fontes**: Google Fonts (Inter, Oswald)
- **Ícones**: Heroicons, Feather Icons (referência)

## 📞 Contato

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/p5r-fan-site/issues)
- **Discussões**: [GitHub Discussions](https://github.com/seu-usuario/p5r-fan-site/discussions)

---

<div align="center">
  <p><strong>Feito com ❤️ para a comunidade Phantom Thieves</strong></p>
  <p>"A rebelião começa no coração."</p>
  <p>— Joker, Persona 5 Royal</p>
</div>