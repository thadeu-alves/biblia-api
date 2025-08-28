import { FastifyInstance } from "fastify";
import { DataService } from "../services/data.services";
import { handleVerseRange } from "../utils/verseRange";
import {
    allBooksloSchemas,
    bookSchema,
    chapterSchemas,
} from "../utils/schemas";

export async function dataRoutes(app: FastifyInstance) {
    const dataService = new DataService();

    app.get(
        "/livros",
        {
            schema: { ...allBooksloSchemas },
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
                const { id } = request.params as {
                    id: string;
                };
                const book = await dataService.getBook(
                    isNaN(Number(id)) ? id : Number(id) - 1
                );

                if (!book) {
                    throw new Error("Livro não encontrado");
                }

                return reply.status(200).send({
                    data: book,
                });
            } catch (err) {
                console.log(err);

                return reply.status(400).send({
                    error: "Livro não encontrado",
                });
            }
        }
    );

    app.get(
        "/livros/:id/:capituloId",
        {
            schema: { ...chapterSchemas },
        },
        async (request, reply) => {
            try {
                const { id, capituloId } =
                    request.params as {
                        id: string;
                        capituloId: string;
                    };

                const { verse, range } = request.query as {
                    verse?: string;
                    range?: string;
                };

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
                        "Conteudo encontrado ou não especificado"
                    );
                }

                return reply.status(200).send({
                    data,
                });
            } catch (err) {
                console.log(err);

                return reply.status(400).send({
                    error: "Conteúdo não encontrado",
                });
            }
        }
    );
}
