import Redis from "ioredis";
import { Book } from "../types/data.types";
import { readDataFile } from "../utils/fileReader";
import "dotenv/config";

export class DataService {
    private data: Book[] | null;
    private redis: Redis;

    constructor() {
        this.data = null;
        this.redis = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
        });
    }

    async loadData(): Promise<Book[]> {
        try {
            if (this.data) return this.data;

            const redisRaw = await this.redis.get("data");

            if (redisRaw) {
                const redisData = JSON.parse(
                    redisRaw
                ) as Book[];
                this.data = redisData;
                return this.data;
            }

            const rawData = await readDataFile();

            this.data = rawData.map((book) => {
                return {
                    ...book,
                    capitulos: book.capitulos.length,
                };
            });

            this.redis.set(
                "data",
                JSON.stringify(this.data)
            );

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
