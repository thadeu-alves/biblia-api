# 📚 Bíblia API

Esta API fornece acesso a dados de livros, capítulos e versículos da bíblia.



<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)
![Fastify](https://img.shields.io/badge/Fastify-5.4+-lightgrey.svg)

</div>

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
