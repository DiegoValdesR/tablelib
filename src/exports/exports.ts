import type { IColumn } from "../interfaces/table.interface.js";

export const getHeaders = (data : Data, columns? : IColumn[]) => {
    let headers : IColumn[] = [];

    if(columns) headers = columns;
    else{
        let row : object = {};

        data.forEach((obj, index) => {
            if(index > 0) return;
            row = obj;
        });

        const keys = Object.keys(row);

        keys.forEach(key => {
            const newObj = {
                header: key.toUpperCase(),
                field: key
            }

            headers.push(newObj);
        });
    }

    return headers;
};