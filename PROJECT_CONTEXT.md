# Contexto do Projeto

Este documento resume o que já está implementado no projeto `casamento-cris-e-doug-` e serve como base de referência para futuras alterações.

## Visão geral

O projeto é uma página única de casamento, construída com React + Vite + Tailwind, com foco em experiência visual elegante e navegação por seções.

A aplicação apresenta:

- hero principal com contagem regressiva
- mensagens rotativas de orientação para convidados
- história do casal
- galeria de fotos do casal
- detalhes da cerimônia e festa
- manual do convidado
- recomendações de hotéis
- álbum compartilhado de fotos
- playlist colaborativa no Spotify
- mural de recados
- lista de presentes com reserva
- formulário de RSVP

## Stack

- React 19
- Vite
- Tailwind CSS
- lucide-react para ícones
- Supabase via REST API

## Estrutura principal

- `src/main.jsx`: ponto de entrada da aplicação
- `src/App.jsx`: página inteira e toda a lógica de interface e integração
- `src/ModalReserva.jsx`: modal de reserva de presente com opção de Pix ou compra
- `src/index.css`: inclusão do Tailwind
- `src/App.css`: arquivo legado do template, sem uso relevante no layout atual

## Fluxo da aplicação

A página é renderizada como uma experiência única, dividida em seções ancoradas. A navegação superior aponta para:

- `#historia`
- `#galeria`
- `#detalhes`
- `#manual`
- `#hoteis`
- `#fotos`
- `#recados`
- `#presentes`
- `#rsvp`

Também existe menu mobile com comportamento de abrir/fechar.

## Identidade visual

O visual usa uma paleta clara e romântica, com tons como:

- fundo principal: `#fdfbfb`
- destaque principal: `#8A3343`
- rosa secundário: `#CBA1A6`
- texto escuro: `#301B1E`
- texto auxiliar: `#4A4243`

O estilo é construído quase todo com classes utilitárias do Tailwind no próprio JSX.

## Conteúdo e seções

### Hero

Mostra:

- nome do casal: `Cris & Doug`
- data: `09 de janeiro de 2027`
- local: `Três Lagoas, MS`
- contagem regressiva até o casamento
- imagem de fundo externa via Unsplash

### Mensagens rotativas

Existe um carrossel simples com mensagens do tipo manual do evento. As mensagens atuais são:

- “Divirta-se muito!”
- “Aguarde o momento certo para os doces”
- “Deixe a decoração no local”
- “Cuidado com as fotos”

### História

Seção textual com dois blocos:

- “Como tudo começou”
- “O pedido”

### Galeria

Carrossel com 3 imagens locais:

- `public/image_b486b8.jpeg`
- `public/image_b489a0.jpeg`
- `public/image_b489e2.jpeg`

### O Casamento

Apresenta:

- local: `Recanto Sonho Meu Eventos`
- cerimônia: `16:00`
- chegada a partir de: `15:00`
- festa: `19:00`
- link para rota no Google Maps

### Manual do Convidado

Lista de orientações como:

- pontualidade
- participação na cerimônia
- código de vestimenta
- evitar branco
- convidado não convida
- confirmação de presença

### Hotéis

Lista de opções em Três Lagoas com links para mapa e site:

- Taj Hotel
- Druds Express
- Vila Romana Park
- Hotel OT
- Mura Hotel
- Tokyos Hotel

### Fotos

Seção com link para álbum compartilhado no Google Photos.

### Playlist

Embed de playlist do Spotify e link para colaboração.

### Recados

Mural com:

- listagem dos últimos recados
- formulário para enviar novo recado

Campos:

- nome
- mensagem

### Presentes

Lista de presentes com:

- contagem total
- quantidade reservada
- quantidade disponível
- card com imagem, descrição e preço estimado
- botão para reservar item

Ao clicar em reservar, abre o modal `ModalReserva` (`src/ModalReserva.jsx`), onde o convidado:

- informa o nome (só para controle dos noivos, não aparece no site)
- escolhe entre “Mandar Pix” ou “Vou comprar”
- no Pix, vê o favorecido e a chave, com botão para copiar (com alternativa para navegadores embutidos, como WhatsApp e Instagram)

A chave Pix vem de `VITE_PIX_KEY` e o favorecido de `VITE_PIX_RECEIVER`; sem essas variáveis no build, o componente usa os valores padrão definidos no próprio arquivo. A escolha entre Pix e compra não é gravada no banco.

A reserva só é gravada se o presente ainda estiver livre (filtro `reservado=not.is.true`); se outra pessoa reservou antes, o modal mostra um aviso e a lista é recarregada.

Quando um presente é reservado, o card mostra apenas “Presente já reservado”. O nome de quem reservou fica gravado em `reservado_por`, mas não é buscado nem exibido no site.

### RSVP

Formulário de confirmação de presença com:

- nome completo
- presença: sim ou não
- número de adultos
- restrições alimentares ou mensagem

Após envio, a interface mostra confirmação de recebimento.

## Integração com Supabase

A aplicação usa Supabase REST diretamente no frontend.

### Configuração atual

- URL Supabase definida em `src/App.jsx`
- chave anônima definida em `src/App.jsx`

### Funções auxiliares

- `sbGet(table, params)`: busca registros
- `sbInsert(table, data)`: insere registros
- `sbUpdate(table, id, data, filters)`: atualiza registro por `id`, com filtros extras opcionais; lança erro se a requisição falhar

### Tabelas usadas

- `recados`
- `presentes`
- `rsvp`

## Estados principais

### Navegação e UI

- `isMenuOpen`
- `isScrolled`
- `currentSlide`
- `currentMessageSlide`

### Recados

- `recados`
- `novoNome`
- `novoMsg`
- `sendingRecado`

### Presentes

- `presentes`
- `loadingPresentes`
- `presenteModal`

### RSVP

- `rsvpStatus`
- `rsvpNome`
- `rsvpPresenca`
- `rsvpAdultos`
- `rsvpObs`

### Contagem regressiva

- `timeLeft`

## Comportamentos automáticos

- contador regressivo atualiza a cada segundo
- mensagens principais trocam automaticamente a cada 6 segundos
- navbar muda de aparência ao rolar a página
- modal de presente fecha ao clicar fora ou com a tecla Esc

## Observações importantes

- O projeto está em português.
- O foco atual é um site de casamento, não um sistema genérico.
- O arquivo `src/App.css` parece ser sobra do template inicial e não representa o layout atual.
- O conteúdo e a data do casamento já estão codificados no frontend.
- A integração com Supabase é feita diretamente no cliente, então mudanças em estrutura de dados devem ser feitas com cuidado.
- Todo código precisa estar no GitHub antes de ir para produção: em 16/11/2026 um deploy feito pelo git substituiu uma versão com Pix que tinha sido publicada por fora do repositório.
- Deploys na Vercel (projeto `crisedoug`) a partir de commits da conta GitHub `CaioLFreitas98` estão sendo bloqueados (“Deployment was blocked”) e precisam ser liberados manualmente no painel até essa conta ser conectada à conta da Vercel.

## Para continuar evoluindo

Se eu for alterar este projeto daqui para frente, este é o contexto que devo assumir:

- manter a proposta visual romântica e elegante
- preservar as seções existentes e a navegação por âncoras
- respeitar as integrações com Supabase
- não quebrar o fluxo de recados, presentes e RSVP
