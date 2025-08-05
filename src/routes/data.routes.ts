import { FastifyInstance } from "fastify";
import { DataService } from "../services/data.services";
import { handleVerseRange } from "../utils/verseRange";

export async function dataRoutes(app: FastifyInstance) {
    const dataService = new DataService();

    app.get("/", async (_, reply) => {
        try {
            const data = await dataService.loadData();
            return reply.status(200).send({ data });
        } catch (err) {
            console.log(err);

            return reply.status(500).send({
                error: "Erro interno no servidor.",
            });
        }
    });

    app.get("/abrev", async (_, reply) => {
        try {
            const data = await dataService.getBooksAbrev();
            return reply.status(200).send({ data });
        } catch (err) {
            console.log(err);

            return reply.status(500).send({
                error: "Erro interno no servidor.",
            });
        }
    });

    app.get("/livro/:id", async (request, reply) => {
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
    });

    app.get(
        "/livro/:id/:capitulo",
        async (request, reply) => {
            try {
                const { id, capitulo } = request.params as {
                    id: string;
                    capitulo: string;
                };

                const { verse, range } = request.query as {
                    verse?: string;
                    range?: string;
                };

                const bookId = isNaN(Number(id))
                    ? id
                    : Number(id);
                const chapterIndex = Number(capitulo) - 1;

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
