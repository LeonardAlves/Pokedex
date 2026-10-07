# Pokédex Full Stack

API REST de uma Pokédex, feita como projeto de estudo de desenvolvimento Full Stack. Os dados vêm da [PokeAPI](https://pokeapi.co) e são importados para o MongoDB por um workflow do n8n. O frontend (em desenvolvimento) consome apenas esta API.

```text
Frontend → API Node/Express → MongoDB
                  ↑
         n8n ← PokeAPI (importação)
```

## Tecnologias

- Node.js + Express
- MongoDB + Mongoose
- n8n (importação dos dados)
- Docker Compose

## Como executar

Pré-requisito: Docker instalado.

1. Crie o arquivo `backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb://admin:123456@pokedex-db:27017/pokedex?authSource=admin
```

> As credenciais acima são apenas para ambiente local de estudo. Não use em produção.

2. Na raiz do projeto, suba os serviços:

```bash
docker compose up -d
```

| Serviço | Endereço no seu computador | Endereço dentro da rede Docker |
|---|---|---|
| API | http://localhost:3000 | http://backend:3000 |
| n8n | http://localhost:5679 | - |
| MongoDB | localhost:27017 | pokedex-db:27017 |

3. Abra o n8n e execute o workflow de importação para carregar os 151 Pokémon.

## Modelo de dados

```json
{
  "_id": "6abd7d9c916525d3711408ee",
  "number": 1,
  "name": "bulbasaur",
  "types": ["grass", "poison"],
  "image": "https://...",
  "height": 7,
  "weight": 69,
  "favorite": false,
  "createdAt": "2026-09-30T21:22:36.064Z",
  "updatedAt": "2026-09-30T21:22:36.064Z"
}
```

| Campo | Tipo | Regras |
|---|---|---|
| number | Number | obrigatório, único, mínimo 1 |
| name | String | obrigatório |
| types | Array de String | apenas os 18 tipos oficiais (normal, fire, water, electric, grass, ice, fighting, poison, ground, flying, psychic, bug, rock, ghost, dragon, dark, steel, fairy) |
| image | String | opcional |
| height | Number | mínimo 0 |
| weight | Number | mínimo 0 |
| favorite | Boolean | padrão `false` |

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/pokemon` | Lista com busca, filtros e paginação |
| GET | `/pokemon/:id` | Busca um Pokémon pelo `_id` |
| POST | `/pokemon` | Cria um Pokémon |
| PUT | `/pokemon/:id` | Atualiza um Pokémon |
| PATCH | `/pokemon/:id/favorite` | Favorita/desfavorita (inverte o valor atual) |
| DELETE | `/pokemon/:id` | Remove um Pokémon |
| POST | `/pokemon/import` | Importação em lote (usada pelo n8n) |

### GET /pokemon

Parâmetros opcionais (combináveis):

| Parâmetro | Exemplo | Descrição |
|---|---|---|
| search | `?search=pika` | Busca parcial no nome, sem diferenciar maiúsculas |
| type | `?type=fire` | Filtra por tipo |
| favorite | `?favorite=true` | `true` só favoritos, `false` só não favoritos |
| page | `?page=2` | Página (padrão 1) |
| limit | `?limit=10` | Itens por página (padrão 20, máximo 100) |

Exemplo: `GET /pokemon?type=fire&page=1&limit=5`

Resposta (200):

```json
{
  "data": [ { "number": 4, "name": "charmander", "...": "..." } ],
  "page": 1,
  "limit": 5,
  "total": 12,
  "totalPages": 3
}
```

### GET /pokemon/:id

Resposta (200): o objeto do Pokémon.

### POST /pokemon

Body:

```json
{
  "number": 152,
  "name": "chikorita",
  "types": ["grass"],
  "height": 9,
  "weight": 64
}
```

Resposta (201): o Pokémon criado.

### PUT /pokemon/:id

Body com os campos a alterar (as mesmas regras do modelo valem):

```json
{ "name": "novo-nome" }
```

Resposta (200): o Pokémon atualizado.

### PATCH /pokemon/:id/favorite

Sem body. Inverte o valor de `favorite`. Resposta (200): o Pokémon atualizado.

### DELETE /pokemon/:id

Resposta (200):

```json
{ "message": "Pokemon deleted successfully" }
```

### POST /pokemon/import

Body: uma lista não vazia de Pokémon. Cria os que não existem (identificados por `number`) e atualiza os existentes. O campo `favorite` só é definido na criação, então reimportar **não apaga favoritos**.

Resposta (201):

```json
{
  "message": "Pokemons imported successfully",
  "created": 0,
  "updated": 0
}
```

## Erros

Todos os erros seguem o mesmo formato:

```json
{ "error": "Pokemon not found" }
```

| Status | Quando acontece |
|---|---|
| 400 | Id inválido, dados inválidos (tipo inexistente, valor negativo, campo obrigatório ausente), JSON malformado, body do import inválido |
| 404 | Pokémon ou rota não encontrados |
| 409 | Já existe um Pokémon com esse `number` |
| 500 | Erro inesperado no servidor |

## Importação com n8n

O workflow executa:

```text
Manual Trigger → HTTP Request (lista) → Split Out → HTTP Request (detalhes)
→ Edit Fields → Aggregate → HTTP Request POST http://backend:3000/pokemon/import
```

Dentro do Docker o n8n acessa a API por `backend:3000`, e não por `localhost`.

## Estrutura

```text
backend/src/
├── controllers/   lógica de cada rota
├── errors/        AppError (erros com status)
├── middlewares/   errorHandler (respostas de erro padronizadas)
├── models/        schema do Pokémon
├── routes/        definição das rotas
├── app.js
└── server.js
```