import { FastifyInstance } from "fastify";
import { DataService } from "../services/data.services";
import { allBooksSchema } from "../utils/schemas";

export async function allBooksRoute(app: FastifyInstance) {
    const dataService = new DataService();

    app.get(
        "/livros",
        {
            schema: { ...allBooksSchema },
        },
        async (_, reply) => {
            try {
                const data = await dataService.loadData();

                return reply.status(200).send({
                    data: Array.from(data.values()),
                });
            } catch (err) {
                console.log(err);

                return reply.status(500).send({
                    error: "Erro interno no servidor.",
                });
            }
        }
    );
}
