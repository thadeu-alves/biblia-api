import { FastifyInstance } from "fastify";
import { DataService } from "../services/data.services";
import { bookSchema } from "../utils/schemas";
import z from "zod";

export async function bookRoute(app: FastifyInstance) {
    const dataService = new DataService();

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
}
