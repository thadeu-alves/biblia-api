import { Book, RawBook } from "../types/data.types";
import { readDataFile } from "../utils/fileReader";

export class DataService {
    private data: Book[] | null = null;

    async loadData(): Promise<Book[]> {
        try {
            if (this.data) return this.data;

            const rawData = await readDataFile();
            this.data = rawData.map((book) => {
                return {
                    ...book,
                    capitulos: book.capitulos.length,
                };
            });

            return this.data;
        } catch (err) {
            console.error(err);

            throw new Error("Failed to load data");
        }
    }

    async getBook(
        id: string | number
    ): Promise<Book | undefined> {
        try {
            this.data = await this.loadData();

            if (typeof id === "number") {
                return this.data[id];
            }

            return this.data.find(
                (book) => book.abrev === id
            );
        } catch (err) {
            console.error(err);

            throw new Error("Erro ao procurar livro");
        }
    }

    async getBookChapter(
        id: number | string,
        chapterId: number
    ): Promise<string[]> {
        try {
            const rawData = await readDataFile();
            const chapter =
                typeof id === "number"
                    ? rawData[id]
                    : rawData.find(
                          (book) => book.abrev === id
                      );
            return chapter?.capitulos[chapterId] || [];
        } catch (err) {
            console.error(err);

            throw new Error("Erro ao retornar capitulos");
        }
    }

    async getSingleVerse(
        id: number | string,
        chapter: number,
        verse: number
    ): Promise<string> {
        try {
            const chap = await this.getBookChapter(
                id,
                chapter
            );
            return chap[verse];
        } catch (err) {
            console.error(err);

            throw new Error("Erro ao retornar versiculo");
        }
    }

    async getVersesRange(
        id: string | number,
        chapter: number,
        start: number,
        end: number
    ): Promise<string[]> {
        try {
            const chap = await this.getBookChapter(
                id,
                chapter
            );

            return chap.slice(start, end);
        } catch (err) {
            console.error(err);

            throw new Error("Erro ao retornar versiculos");
        }
    }
}
