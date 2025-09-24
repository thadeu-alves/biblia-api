<p align="center">
  <img src="https://bibliapage.vercel.app/favicon.svg" width="140px" />
</p>

<h1 align="center">Bíblia API</h1>
<p align="center">Uma API que fornece acesso a dados de livros, capítulos e versículos da bíblia.</p>
<p align="center">https://bibliaapi.vercel.app</p>

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)
![Fastify](https://img.shields.io/badge/Fastify-5.4+-lightgrey.svg)
![Redis](https://img.shields.io/badge/Redis-5.7+-red.svg)
![Vitest](https://img.shields.io/badge/Vitest-3.2+-yellow.svg)

</div>


# Instalação e Scripts

- [Demo](https://bibliapage.vercel.app)

Antes de começar, tenha certeza que você tem o [Git](https://git-scm.com) e o [Node](https://nodejs.org/en/) instalado no seu sistema.

```bash
# Clone o repositório na sua máquina
$ git clone https://github.com/thadeu-alves/biblia-api

# Entre na pasta
$ cd biblia-api

# Instale as depedências
$ npm install

# Inicie o servidor
$ npm run dev

# O servidor será inicializado na porta padrão <http://localhost:3000>
```
- `dev`: inicia a aplicação em `localhost:3000`;
- `build`: cria a build de produção otimizada;
- `start`: inicia a aplicação em modo de produção em localhost:3000 (rode a build primeiro);
- `test`: roda os testes;


## 🔍 Rotas

### 1. **Obter todos os Livros**

**GET** `/livros`

-   **Descrição:** Retorna todo o conteúdo estruturado.
-   **Resposta de sucesso (200):**

```json
{
  "data": [
    {
      "id": "1",
      "periodo": "Antigo Testamento - AT",
      "nome": "Gênesis",
      "abrev": "gn",
      "capitulos": 50,
    },
    {
      "id": "2",
      "periodo": "Antigo Testamento - AT",
      "nome": "Êxodo",
      "abrev": "êx",
      "capitulos": 40,
    },
    ...
  ],
}
```

### 2. **Obter Livro específico**

**GET** `/livros/:id`

-   **Parâmetros de rota:**
    -   **id** (string | number) → Pode ser abreviação (ex: **Gn**) ou número (ex: **1**).
-   **Descrição:** Retorna o livro espeficiado através de seu id ou da sua abreviação.
-   **Resposta de sucesso (200):**

```json
{
    "data": {
        "id": "1",
        "periodo": "Antigo Testamento - AT",
        "nome": "Gênesis",
        "abrev": "gn",
        "capitulos": 50
    }
}
```

### 3. **Obter capítulo, versículo ou intervalo de versículos**

**GET** `/livros/:id/:capitulo`

-   **Parâmetros de rota:**
    -   **id** (string | number) → Abreviação ou número do livro.
    -   **capitulo** (number) → Número do capítulo (inicia em 1).
-   **Query params (opcionais):**
    -   **verse** (number) → Número do versículo específico.
    -   **range** (string) → Intervalo de versículos (ex: 1-5).
-   **Descrição:**
    -   Se **range** for informado, retorna o intervalo de versículos.
    -   Se **verse** for informado, retorna um versículo específico.
    -   Se nenhum for informado, retorna o capítulo completo.
-   **Resposta de sucesso (200):**

```json
{
  "data": [
    "No princípio criou Deus os céus e a terra.",
    "E a terra estava desordenada e vazia, e as trevas estavam sobre a face do abismo, e o Espírito de Deus se movia sobre a face das águas.",
    "E disse Deus: Haja luz; e houve luz.",
    ...
  ]
}
```

# Autor

👤 **Thadeu Alves**

- Github: [@thadeu-alves](https://github.com/thadeu-alves)
- LinkedIn: [@thadeualves](https://linkedin.com/in/thadeualves)

## Apoie

Deixe uma ⭐️ se esse projeto te ajudou!
