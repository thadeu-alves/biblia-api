import path from "path";
import fs from "fs/promises";
import { Book } from "../types/data.types";

export async function readJsonFile<T>(
    filePath: string
): Promise<T> {
    try {
        const absolutePath = path.resolve(
            __dirname,
            "../.",
            filePath
        );
        const rawData = await fs.readFile(
            absolutePath,
            "utf8"
        );

        return JSON.parse(rawData) as T;
    } catch (error) {
        throw new Error(
            `Failed to read file ${filePath}: ${
                error instanceof Error
                    ? error.message
                    : String(error)
            }`
        );
    }
}

export async function readDataFile(): Promise<Book[]> {
    return readJsonFile<Book[]>("data/biblialivre.json");
}
