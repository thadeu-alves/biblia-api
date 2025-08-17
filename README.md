# 📚 Documentação

Esta API fornece acesso a dados de livros, capítulos e versículos da bíblia.

---

## 🔍 Rotas

### 1. **Obter todos os dados**

**GET** `/`

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
    ...
  ],
}
```

### 2. **Obter todas as abreviações**

**GET** `/abrev`

-   **Descrição:** Retorna todas as abreviações de cada livro.
-   **Resposta de sucesso (200):**

```json
{
  "data": [
    {
      "abrev": "gn",
      "id": "1",
      "nome": "Gênesis"
    },
    {
      "abrev": "êx",
      "id": "2",
      "nome": "Êxodo"
    },
    {
      "abrev": "lv",
      "id": "3",
      "nome": "Levítico"
    },
    ...
  ],
}
```

### 3. **Obter Livro**

**GET** `/livro/:id`

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

### 4. **Obter capítulo, versículo ou intervalo de versículos**

**GET** `/livro/:id/:capitulo`

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
