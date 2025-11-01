export interface RawBook {
    id: string;
    periodo: string;
    nome: string;
    abrev: string;
    capitulos: [string[]];
}

export interface Book {
    id: string;
    periodo: string;
    nome: string;
    abrev: string;
    capitulos: number;
}

export interface Chapter {
    verses: string[];
    hasNext: boolean;
    hasPrevious: boolean;
}
