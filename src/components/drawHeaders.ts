import icons from "../icons.js";
import type { IDrawTableHeader, ISelectOptions } from "./../interfaces/table.interface.js";

export const drawHeaders = (params : IDrawTableHeader) => {
    const thead = params.table.querySelector("thead") || document.createElement('thead');

    //If the element already exists, we only redraw the select options elements
    if(thead.innerHTML.length > 0) thead.innerHTML = "";

    const tr = document.createElement('tr');

    params.columns.forEach((column) => {
        const targetField = column.field;

        const th = document.createElement("th");

        const headerContainer = document.createElement('div');
        headerContainer.classList.add('tablelib-header');

        const spanHeader = document.createElement("span");
        spanHeader.innerText = column.header;

        headerContainer.appendChild(spanHeader);
        th.appendChild(headerContainer);

        if(targetField){
            //Creating the buttons for the sorting feature
            const buttonOrder = document.createElement("button");
            buttonOrder.type = "button";
            buttonOrder.title = "Sort elements";
            buttonOrder.classList.add("tablelib-button");
            buttonOrder.innerHTML = icons.sortDown;
            buttonOrder.dataset.target = targetField;

            headerContainer.appendChild(buttonOrder);
        };
        
        tr.appendChild(th);
    });

    thead.appendChild(tr);
    return thead;
};