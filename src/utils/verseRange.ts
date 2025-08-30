import z from "zod";
import { DataService } from "../services/data.services";

const verseRangeSchema = z.object({
    range: z
        .string()
        .min(3, "O intervalo é obrigatório.")
        .regex(
            /^\d+-\d+$/,
            "O intervalo deve estar no formato 'start-end' (ex: '1-5')"
        )
        .refine(
            (value) => {
                const [start, end] = value
                    .split("-")
                    .map(Number);
                return (
                    !isNaN(start) &&
                    !isNaN(end) &&
                    start > 0 &&
                    end >= start
                );
            },
            {
                message:
                    "O intervalo deve conter números válidos com início menor ou igual ao fim",
            }
        ),
});

export async function handleVerseRange(
    bookId: string | number,
    chapterIndex: number,
    range: string
) {
    const dataService = new DataService();

    const validatedInput = verseRangeSchema.safeParse({
        range,
    });

    if (!validatedInput.success) {
        throw new z.ZodError(validatedInput.error.issues);
    }

    const [start, end] = range.split("-").map(Number);

    return await dataService.getVersesRange(
        bookId,
        chapterIndex,
        start - 1,
        end
    );
}
