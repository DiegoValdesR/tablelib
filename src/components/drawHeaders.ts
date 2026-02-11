import { getHeaders } from "../exports/exports.js";
import icons from "../icons.js";
import type { IDrawTableHeader } from "./../interfaces/table.interface.js";

export const drawHeaders = (params : IDrawTableHeader) => {
    const thead = params.table.querySelector("thead") || document.createElement('thead');

    //If the element already exists, we only redraw the select options elements
    if(thead.innerHTML.length > 0) thead.innerHTML = "";

    const tr = document.createElement('tr');

    const headers = getHeaders(params.data, params.columns);

    headers.forEach((column) => {
        const targetField = column.field;

        const th = document.createElement("th");

        const headerContainer = document.createElement('div');
        headerContainer.classList.add('tablelib-header');

        const spanHeader = document.createElement("span");
        spanHeader.innerText = column.header;

        if(targetField && params.sorting){
            //Creating the buttons for the sorting feature
            const sortingButton = createSortingButton(targetField);
            headerContainer.appendChild(sortingButton);
        };

        headerContainer.appendChild(spanHeader);
        th.appendChild(headerContainer);
        tr.appendChild(th);
    });

    thead.appendChild(tr);
    return thead;
};

const createSortingButton = (targetField : string) => {
    const sortingButton = document.createElement("button");
    sortingButton.type = "button";
    sortingButton.title = "Sort elements";
    sortingButton.classList.add("tablelib-button");
    sortingButton.innerHTML = icons.sortDown;
    sortingButton.dataset.target = targetField;

    return sortingButton;
}