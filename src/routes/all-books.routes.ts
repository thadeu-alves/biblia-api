import { FastifyInstance } from "fastify";
import { DataService } from "../services/data.services";
import { allBooksloSchema } from "../utils/schemas";

export async function allBooksRoute(app: FastifyInstance) {
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
}
