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

    app.get("/:abrev", async (request, reply) => {
        try {
            const { abrev } = request.params as {
                abrev: string;
            };
            const book = await dataService.getBook(abrev);

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
}
