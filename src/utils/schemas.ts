export const allBooksloSchema = {
    summary: "Obter todos os livros",
    tags: ["Livros"],
    response: {
        200: {
            type: "object",
            properties: {
                data: {
                    oneOf: [
                        {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    periodo: {
                                        type: "string",
                                    },
                                    nome: {
                                        type: "string",
                                    },
                                    abrev: {
                                        type: "string",
                                    },
                                    capitulos: {
                                        type: "number",
                                    },
                                },
                            },
                        },
                    ],
                },
            },
        },
        400: {
            type: "object",
            properties: {
                error: { type: "string" },
            },
        },
    },
};

export const bookSchema = {
    summary: "Obter livro especificado",
    tags: ["Livros"],
    params: {
        type: "object",
        properties: {
            id: { type: "string" },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        periodo: {
                            type: "string",
                        },
                        nome: {
                            type: "string",
                        },
                        abrev: {
                            type: "string",
                        },
                        capitulos: {
                            type: "number",
                        },
                    },
                },
            },
        },
        400: {
            type: "object",
            properties: {
                error: { type: "string" },
                details: { type: "string" },
            },
        },
        404: {
            type: "object",
            properties: {
                error: { type: "string" },
            },
        },
    },
};

export const chapterSchema = {
    summary: "Obter capítulo ou versículos específicos",
    tags: ["Capítulos"],
    params: {
        type: "object",
        properties: {
            id: { type: "string" },
            capituloId: { type: "string" },
        },
    },
    querystring: {
        type: "object",
        properties: {
            verse: { type: "string" },
            range: { type: "string" },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                data: {
                    oneOf: [
                        {
                            type: "array",
                            items: { type: "string" },
                        },
                        {
                            type: "string",
                        },
                    ],
                },
            },
        },
        400: {
            type: "object",
            properties: {
                error: { type: "string" },
                details: { type: "string" },
            },
        },
        404: {
            type: "object",
            properties: {
                error: { type: "string" },
            },
        },
    },
};
