# Segurança do KineinSite

Este repositório contém só o site público, um conjunto de arquivos estáticos servidos pelo GitHub Pages. Vulnerabilidades da IDE devem ser relatadas no [repositório da Kinein Vectis](https://github.com/ViktorWalde/KineinVectis).

## Como relatar

Não descreva a falha numa issue pública. Use o relato privado de vulnerabilidade do GitHub, na aba **Security** do repositório, se estiver disponível. Se não estiver, abra uma issue curta, sem detalhes de exploração, pedindo um canal privado ao mantenedor.

Inclua a página afetada, o navegador, os passos para reproduzir e o impacto observado. Não envie dados pessoais de terceiros.

## O que o site garante e o que ele não controla

As garantias, os limites e as verificações que as sustentam estão em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#segurança). Em resumo: não há servidor, banco nem formulário. Cada página carrega uma política de conteúdo (CSP) que só aceita scripts e estilos gerados pelo build, e o build reprova se essa política sumir ou for afrouxada. Proteção contra negação de serviço e registro de acesso ficam com a hospedagem, o GitHub Pages.
