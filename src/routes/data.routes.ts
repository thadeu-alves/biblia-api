import { FastifyInstance } from "fastify";
import { DataService } from "../services/data.services";

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

                const data =
                    await dataService.getBookChapter(
                        isNaN(Number(id)) ? id : Number(id),
                        Number(capitulo) - 1
                    );

                if (data.length === 0) {
                    throw new Error(
                        "Id não encontrado ou não especificado"
                    );
                }

                return reply.status(200).send({
                    data,
                });
            } catch (err) {
                console.log(err);

                return reply.status(400).send({
                    error: "Capitulo não encontrado",
                });
            }
        }
    );
}
