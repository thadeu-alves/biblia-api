import { FastifyInstance } from "fastify";
import { DataService } from "../services/data.services";
import { handleVerseRange } from "../utils/verseRange";
import {
    allBooksloSchema,
    bookSchema,
    chapterSchema,
} from "../utils/schemas";
import z from "zod";
import { console } from "inspector";

export async function dataRoutes(app: FastifyInstance) {
    const dataService = new DataService();

    app.get(
        "/livros",
        {
            schema: { ...allBooksloSchema },
        },
        async (_, reply) => {
            try {
                const data = await dataService.loadData();
                return reply.status(200).send({ data });
            } catch (err) {
                console.log(err);

                return reply.status(500).send({
                    error: "Erro interno no servidor.",
                });
            }
        }
    );

    app.get(
        "/livros/:id",
        { schema: { ...bookSchema } },
        async (request, reply) => {
            try {
                const bookIdParams = z.object({
                    id: z
                        .string()
                        .min(
                            1,
                            "O ID do Livro é obrigatório."
                        ),
                });

                const { id } = bookIdParams.parse(
                    request.params
                );

                const bookId = isNaN(Number(id))
                    ? id
                    : Number(id);

                const book = await dataService.getBook(
                    bookId
                );

                if (!book) {
                    return reply.status(404).send({
                        error: "Livro não encontrado",
                    });
                }

                return reply.status(200).send({
                    data: book,
                });
            } catch (err) {
                console.log(err);

                if (err instanceof z.ZodError) {
                    return reply.status(400).send({
                        error: err.issues[0].message,
                        details: err.issues[0].code,
                    });
                }

                return reply.status(404).send({
                    error: "Livro não encontrado",
                });
            }
        }
    );

    app.get(
        "/livros/:id/:capituloId",
        {
            schema: { ...chapterSchema },
        },
        async (request, reply) => {
            console.log("Chegou");
            try {
                const chapterParams = z.object({
                    id: z
                        .string()
                        .min(
                            1,
                            "O ID do Livro é obrigatório."
                        ),
                    capituloId: z
                        .string()
                        .min(
                            1,
                            "O ID do Capítulo é obrigatório."
                        ),
                });

                const chapterQuery = z.object({
                    verse: z
                        .string()
                        .min(1, "Especifique um versículo.")
                        .optional(),
                    range: z
                        .string()
                        .min(1, "Especifique um intervalo.")
                        .optional(),
                });

                const { id, capituloId } =
                    chapterParams.parse(request.params);

                const { verse, range } = chapterQuery.parse(
                    request.query
                );

                const bookId = isNaN(Number(id))
                    ? id
                    : Number(id) - 1;
                const chapterIndex = Number(capituloId) - 1;

                const data = range
                    ? await handleVerseRange(
                          bookId,
                          chapterIndex,
                          range
                      )
                    : verse
                    ? await dataService.getSingleVerse(
                          bookId,
                          chapterIndex,
                          Number(verse) - 1
                      )
                    : await dataService.getBookChapter(
                          bookId,
                          chapterIndex
                      );

                if (
                    !data ||
                    (Array.isArray(data) &&
                        data.length === 0)
                ) {
                    throw new Error(
                        "Conteudo não encontrado"
                    );
                }

                return reply.status(200).send({
                    data,
                });
            } catch (err) {
                console.log(err);

                if (err instanceof z.ZodError) {
                    return reply.status(400).send({
                        error: err.issues[0].message,
                        details: err.issues[0].code,
                    });
                }

                return reply.status(404).send({
                    error: "Conteúdo não encontrado",
                });
            }
        }
    );
}
