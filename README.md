# Imersão CEO — Landing Page Demonstrativa

> Projeto fictício criado para portfólio. A marca, os números, os depoimentos, os dados comerciais e os fluxos de inscrição são exemplos demonstrativos; não representam um evento real nem coletam informações para uma empresa.

Landing page responsiva para uma imersão executiva fictícia, criada para demonstrar design de interface, arquitetura de conteúdo e interações em HTML, CSS e JavaScript puro.

## Demonstração

Após a publicação no GitHub Pages, a versão ao vivo ficará disponível em:

`https://alessandrocandido-oss.github.io/imersao-empresarial-lovable/`

## Funcionalidades

- Landing page responsiva com modo claro/escuro persistente.
- Navegação por seções e páginas complementares.
- Programa, logística, cases, FAQ, contato, termos e privacidade.
- Formulário demonstrativo com validação nativa e redirecionamento de confirmação.
- FAQ em acordeão, contador regressivo e animações de rolagem.
- Avisos explícitos de conteúdo fictício e fluxo sem envio de dados.

## Tecnologias

- HTML5
- CSS3 com variáveis de tema e layout responsivo
- JavaScript sem dependências de build
- Font Awesome e AOS carregados por CDN

## Estrutura

```text
.
├── index.html
├── programa.html
├── local-e-logistica.html
├── cases.html
├── faq.html
├── contato.html
├── obrigado.html
├── politica-de-privacidade.html
├── termos-de-inscricao.html
├── css/
│   ├── style.css
│   └── pages.css
└── js/
    ├── script.js
    └── page.js
```

## Execução local

Como o projeto é estático, basta abrir `index.html` no navegador. Para uma prévia com servidor local:

```bash
python -m http.server 8000
```

Depois, acesse `http://localhost:8000`.

## Nota de segurança

O formulário demonstra uma experiência de aplicação, mas não envia dados a um servidor. As informações preenchidas ficam apenas no armazenamento local do navegador durante a demonstração.
