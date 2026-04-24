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

A chave é lida de `app.json` (campo `expo.extra.tmdbApiKey`). Para desenvolvimento local, pode-se sobrescrever via variável de ambiente definindo-a antes de rodar o Expo. Para produção, utilize mecanismos seguros (ex.: EAS Secrets) em vez de versionar a chave.

## Estrutura

```
src/
  services/tmdb.js        # chamadas à API TMDB
  screens/SearchScreen.js # tela de busca + lista
  screens/DetailsScreen.js# tela de detalhes do filme
App.js                    # navegação (stack)
```
