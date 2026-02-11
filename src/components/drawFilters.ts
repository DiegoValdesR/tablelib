import { getHeaders } from "../exports/exports.js";
import type { ITableFilters, IFilterOptions } from "../interfaces/table.interface.js";

export const drawFilters = (params : ITableFilters) => {
    const tfilters = params.tableContainer.querySelector(".tablelib-filters") || document.createElement('div');

    if(tfilters.innerHTML.length > 0) tfilters.innerHTML = "";
    else tfilters.classList.add('tablelib-filters');

    const currentData = params.data.slice(params.offset, params.limit);

    const filtersContainer = document.createElement('div');
    filtersContainer.classList.add('filters-container');

    const headers = getHeaders(params.data, params.columns);

    headers.forEach(column => {
        if(column.body || !column.field) return;

        const filterContainer = document.createElement('div');
        filterContainer.classList.add('filter');

        const selectLabel = document.createElement('label');
        selectLabel.classList.add('filter-label');
        selectLabel.innerText = column.header;
        
        const selectFilter = document.createElement('select');
        const options = drawOptions({
            data: currentData,
            targetField: column.field,
            selectedValue: params.selectedValue
        });

        options.forEach(option => selectFilter.appendChild(option));

        filterContainer.appendChild(selectLabel);
        filterContainer.appendChild(selectFilter);
        filtersContainer.appendChild(filterContainer);
    }); 
    
    tfilters.appendChild(filtersContainer)

    return tfilters;
};

const drawOptions = (params : IFilterOptions) => {
    const options : HTMLOptionElement[] = [];
    const values : string[] = [];

    const defaultOption = document.createElement("option");
    defaultOption.innerText = "Select an option";
    defaultOption.value = "";
    options.push(defaultOption);

    params.data.forEach(obj => {
        const keyValue = obj[params.targetField] ? obj[params.targetField].toString() : undefined;
        if(!keyValue) return;

        if(!values.some(value => value === keyValue)){
            const option = document.createElement("option");
            option.innerText = keyValue.toUpperCase();
            option.value = keyValue;

            if(params.selectedValue && params.selectedValue === keyValue) option.selected = true;
            if(option.innerHTML.length > 30) option.innerHTML = option.innerHTML.slice(0, 30) + "...";

            options.push(option);
            values.push(keyValue);
        };
    });

    return options;
};