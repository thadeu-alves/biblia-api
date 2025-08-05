import { DataService } from "../services/data.services";

export async function handleVerseRange(
    bookId: string | number,
    chapterIndex: number,
    range: string
) {
    const dataService = new DataService();

    const [start, end] = range.split("-").map(Number);
    return await dataService.getVersesRange(
        bookId,
        chapterIndex,
        start - 1,
        end
    );
}
