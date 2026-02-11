export interface IColumn{
    header: string
    field?: string
    body? : (rowData? : Record<string, any>) => string | HTMLElement
};

export interface ITable {
    data : Data
    columns? : IColumn[]
    darkMode? : boolean,
    custom?: {
        sorting?: boolean,
        filters?: boolean,
        pagination?: boolean
    }
};

export interface ITableFilters{
    tableContainer : HTMLElement
    data : Data
    columns? : IColumn[]
    offset : number
    limit : number
    selectedValue : string
}

export interface IDrawTableBody{
    data : Data
    columns? : IColumn[]
    table : HTMLTableElement
    offset : number
    limit : number
};

export interface IDrawTableFooter{
    tableContainer : HTMLElement
    numPages : number
    currentPage : number
}

export interface IDrawTableHeader{
    columns? : IColumn[]
    data : Data
    offset : number
    limit : number
    table: HTMLTableElement
    selectedValue? : string,
    sorting: boolean
}

export interface IFilterOptions{
    data : Data
    targetField : string
    selectedValue? : string
}