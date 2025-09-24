import {
    vi,
    describe,
    beforeEach,
    it,
    expect,
    Mocked,
    MockedFunction,
    Mock,
} from "vitest";
import { readDataFile } from "../utils/fileReader";
import { DataService, IDataService } from "./data.services";
import Redis from "ioredis";
import { Book, RawBook } from "../types/data.types";

type RedisMock = Mocked<Redis> & {
    get: MockedFunction<Redis["get"]>;
    set: MockedFunction<Redis["set"]>;
};

vi.mock("../utils/fileReader", () => ({
    readDataFile: vi.fn(),
}));

vi.mock("ioredis", () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            get: vi.fn(),
            set: vi.fn(),
        })),
    };
});

describe("Data Services Testes", () => {
    let dataService: IDataService;
    let redisMock: RedisMock;
    const fakeBooks = new Map<string | number, RawBook>();

    beforeEach(() => {
        redisMock = {
            get: vi.fn(),
            set: vi.fn(),
        } as unknown as RedisMock;

        dataService = new DataService();

        (Redis as unknown as Mock).mockImplementation(
            () => redisMock
        );

        vi.clearAllMocks();

        fakeBooks.set(1, {
            id: "1",
            periodo: "Antigo Testamento - AT",
            nome: "Gênesis",
            abrev: "gn",
            capitulos: [
                [
                    "No princípio criou Deus os céus e a terra.",
                    "E a terra estava desordenada e vazia, e as trevas estavam sobre a face do abismo, e o Espírito de Deus se movia sobre a face das águas.",
                    "E disse Deus: Haja luz; e houve luz.",
                ],
            ],
        });
        fakeBooks.set("gn", {
            id: "1",
            periodo: "Antigo Testamento - AT",
            nome: "Gênesis",
            abrev: "gn",
            capitulos: [
                [
                    "No princípio criou Deus os céus e a terra.",
                    "E a terra estava desordenada e vazia, e as trevas estavam sobre a face do abismo, e o Espírito de Deus se movia sobre a face das águas.",
                    "E disse Deus: Haja luz; e houve luz.",
                ],
            ],
        });

        dataService.setData(fakeBooks);
        vi.spyOn(dataService, "loadData");
    });

    it("Retorno direto do this.data", async () => {
        // const fakeBooks: Book[] = [
        //     {
        //         id: "1",
        //         abrev: "gn",
        //         nome: "Genesis",
        //         capitulos: 50,
        //         periodo: "AT",
        //     },
        // ];

        const result = await dataService.loadData();

        expect(result).toEqual(fakeBooks);
        expect(redisMock.get).not.toHaveBeenCalled();
        expect(readDataFile).not.toHaveBeenCalled();
    });

    it("Retorno de um Livro especifico", async () => {
        const result = await dataService.getBook(1);

        const expected = fakeBooks.get(1) as RawBook;

        expect(result).toEqual({
            ...expected,
            capitulos: expected.capitulos.length,
        });
        expect(dataService.loadData).not.toHaveBeenCalled();
        expect(readDataFile).not.toHaveBeenCalled();
    });

    it("Retorno de um Livro especifico com diferentes tipos de id", async () => {
        const result = await dataService.getBook(1);
        const result2 = await dataService.getBook("gn");

        const expected = {
            id: "1",
            periodo: "Antigo Testamento - AT",
            nome: "Gênesis",
            abrev: "gn",
            capitulos: [
                [
                    "No princípio criou Deus os céus e a terra.",
                    "E a terra estava desordenada e vazia, e as trevas estavam sobre a face do abismo, e o Espírito de Deus se movia sobre a face das águas.",
                    "E disse Deus: Haja luz; e houve luz.",
                ],
            ],
        };

        expect(result).toEqual({
            ...expected,
            capitulos: expected.capitulos.length,
        });
        expect(result2).toEqual({
            ...expected,
            capitulos: expected.capitulos.length,
        });
        expect(result).toEqual(result2);
        expect(dataService.loadData).not.toHaveBeenCalled();
        expect(readDataFile).not.toHaveBeenCalled();
    });

    it("Retorno de um Capítulo especifico", async () => {
        const result = await dataService.getBookChapter(
            1,
            0
        );

        expect(result[0]).toBeTypeOf("string");
        expect(dataService.loadData).not.toHaveBeenCalled();
    });

    it("Retorno de um Versiculo especifico", async () => {
        const result = await dataService.getSingleVerse(
            "gn",
            0,
            0
        );

        expect(result).toBeTypeOf("string");
        expect(result).toEqual(
            "No princípio criou Deus os céus e a terra."
        );
        expect(dataService.loadData).not.toHaveBeenCalled();
    });

    // it("Carregamento do Redis", async () => {
    //     redisMock.get.mockResolvedValueOnce(
    //         JSON.stringify(fakeBooks)
    //     );

    //     const result = await dataService.loadData();

    //     expect(result).toEqual(fakeBooks);
    //     expect(redisMock.get).toBeCalledWith("data");
    //     expect(readDataFile).not.toHaveBeenCalled();
    // });

    // it("Sem cache", async () => {
    //     const rawFakeBooks: RawBook[] = [
    //         {
    //             id: "1",
    //             abrev: "gn",
    //             nome: "Genesis",
    //             capitulos: [[""]],
    //             periodo: "AT",
    //         },
    //     ];

    //     const fakeBooks: Book[] = [
    //         {
    //             id: "1",
    //             abrev: "gn",
    //             nome: "Genesis",
    //             capitulos: 1,
    //             periodo: "AT",
    //         },
    //     ];

    //     (readDataFile as any).mockResolvedValueOnce(
    //         rawFakeBooks
    //     );
    //     redisMock.get.mockResolvedValueOnce(null);

    //     const result = await dataService.loadData();

    //     expect(result).toEqual(fakeBooks);
    //     expect(readDataFile).toHaveBeenCalled();
    //     expect(redisMock.set).toBeCalledWith(
    //         "data",
    //         JSON.stringify(fakeBooks)
    //     );
    // });
});
