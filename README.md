# API TMDB

Aplicativo React Native (Expo) para pesquisa de filmes usando a API do [The Movie Database (TMDB)](https://developer.themoviedb.org/).

## Funcionalidades

- Tela de busca com campo de texto e botão
- Listagem dos filmes retornados (`FlatList`) com título, data e sinopse
- Tela de detalhes com poster, avaliação, duração, gêneros e descrição
- Indicador de carregamento e tratamento de erros
- Paginação incremental (scroll infinito)

## Rodando o projeto

```bash
npm install
npm start
```

Em seguida, abra o app no Expo Go (iOS/Android) ou pressione `w` para abrir no navegador.

## Configuração da API Key

**IMPORTANTE**: A chave da API agora deve ser configurada via arquivo `.env` para maior segurança.

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e adicione sua chave da API TMDB:
   ```
   TMDB_API_KEY=sua_chave_aqui
   ```

3. A chave é lida de `app.json` (campo `expo.extra.tmdbApiKey`). Para produção, utilize mecanismos seguros (ex.: EAS Secrets) em vez de versionar a chave.

**NUNCA** commite o arquivo `.env` no repositório. Ele já está incluído no `.gitignore`.

## Estrutura

```
src/
  services/tmdb.js        # chamadas à API TMDB
  screens/SearchScreen.js # tela de busca + lista
  screens/DetailsScreen.js# tela de detalhes do filme
  components/MovieListItem.js # componente de item da lista
App.js                    # navegação (stack) + error boundary
```

## Melhorias de Segurança Implementadas

- **API Key Security**: Chave da API movida para variável de ambiente (.env)
- **Error Boundary**: Tratamento global de erros no App.js
- **Network Timeout**: Timeout de 10s em todas as requisições
- **Input Validation**: Sanitização de queries de busca (limite de 200 caracteres, remoção de caracteres especiais)
- **Race Conditions**: AbortController implementado para cancelar requisições anteriores
- **API Key Validation**: Validação do formato da chave (32 caracteres hexadecimais)
- **Route Params Validation**: Validação de parâmetros de navegação no DetailsScreen
- **Memory Leaks**: Cleanup functions adicionadas em useEffect para cancelar requisições pendentes
- **Image Error Handling**: Handlers onError em todos os componentes Image
- **Accessibility**: Labels e roles adicionados a elementos interativos
- **JSON Parsing**: Tratamento de erros ao processar respostas JSON
- **Infinite Scroll**: Validação de edge cases (loading, página máxima)
