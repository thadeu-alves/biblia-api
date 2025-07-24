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

            return reply
                .status(500)
                .send({
                    error: "Erro interno no servidor.",
                });
        }
    });
}
