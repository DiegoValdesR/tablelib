import { filterData } from "./functions/Filter.js";
import { components } from "./components/index.js";
import { events } from "./events/index.js";
import type { ITable } from "./interfaces/table.interface.js";
import type { ICustomEvent } from "./interfaces/events.interface.js";
import './table.css';

class TableLib{
    private recordsPerPage : number = 10;
    private numPages : number = 0; 
    private recordsCount : number = 0;
    private currentPage : number = 1;
    private offset = 0;
    private limit = this.recordsPerPage;
    private config : ITable;
    private mutatedData : Data = [];
    private tableContainer = document.createElement('div');
    private table = document.createElement('table');
    private numberOfClicks : numberOfClicks = 1;
    private selectedValue : string = "";
    
    constructor(params : ITable){
        this.config = {
            data: params.data,
            columns: params.columns,
            darkMode: params.darkMode ?? false,
            custom: {
                sorting: params.custom?.sorting ?? true,
                filters: params.custom?.filters ?? true,
                pagination: params.custom?.pagination ?? true
            }
        };

        this.tableContainer.classList.add("tablelib-cont");
        this.table.classList.add('tablelib');

        if(this.config.darkMode) this.tableContainer.classList.add("dark-mode");
    };

    public createTable(){
        try {
            const tableResponsive = document.createElement('div');
            tableResponsive.classList.add('tablelib-responsive');

            const tableTop = this.drawTop();
            const tableHead = this.drawHeaders();
            const tableBody = this.drawBody();
            
            this.table.appendChild(tableHead);
            this.table.appendChild(tableBody);
            tableResponsive.appendChild(this.table);

            this.tableContainer.appendChild(tableTop);

            if(this.config.custom?.filters){
                const tableFilters = this.drawFilters();
                this.tableContainer.appendChild(tableFilters);
            };
            
            this.tableContainer.appendChild(tableResponsive);
            
            if(this.config.custom?.pagination){
                const tableFooter = this.drawFooter();
                this.tableContainer.appendChild(tableFooter);
            };
            

        } catch (error : any) {
            console.error(error.message);
        };

        return this.tableContainer;
    };

    public redrawTable(data? : Data){
        if(data) this.mutatedData = data;
        this.currentPage = 1;
        this.drawBody();
    };

    /**
     * Allows the table to have custom events.
     * @param params
     */
    public customEvent(params: ICustomEvent){
        try {
            if (!this.tableContainer) throw new Error("Table container not found!");
            const data = this.getCurrentData();
            this.tableContainer.addEventListener(params.eventName, (e: Event) => {
                const target = e.target as HTMLElement;
                if(target.closest(params.selector)) params.event(e, data);
            });

        } catch (error : any) {
            console.error(error.message);
        };
    };

    /**
     * Creating the top of the table that includes a select with values to change the number of records per page and an input for searching by characters
     */
    private drawTop(){
        const datatableTop = components.drawTop(this.recordsPerPage);

        //Custom event for changing the maximum number of records for each page 
        datatableTop.querySelector('select')?.addEventListener('change',({target}) => {
            const option = target as HTMLOptionElement;
            this.recordsPerPage = parseInt(option.value);
            this.currentPage = 1;
            this.drawBody();
        });

        //Custom event for the searchbar
        datatableTop.querySelector('input')?.addEventListener('input',({target}) => {
            const input = target as HTMLInputElement;
            this.currentPage = 1;
            this.mutatedData = filterData({
                searchValue: input.value,
                action: "contains",
                data : this.config.data
            });
            this.drawBody();
        });

        //Event for clearing current active filters by click a button
        datatableTop.querySelector('button')?.addEventListener('click', () => {
            this.mutatedData = [];
            this.selectedValue = "";
            this.drawBody();
        });

        return datatableTop;
    };

    private drawFilters(){
        const filters = components.drawFilters({
            tableContainer: this.tableContainer,
            data: this.getCurrentData(),
            columns: this.config.columns,
            limit: this.limit,
            offset: this.offset,
            selectedValue: this.selectedValue
        });

        //Event for the select filter
        filters.addEventListener('change',({target}) => {
            const option = target as HTMLOptionElement;
            const currentData = this.getCurrentData();

            this.mutatedData = filterData({
                searchValue: option.value,
                action: "equals",
                data: currentData
            });
            
            this.selectedValue = option.value;
            this.currentPage = 1;
            this.drawBody();
        });

        return filters;
    };

    /**
     * The table head section of the table
     */
    private drawHeaders(){
        let currentData = this.getCurrentData();
        let thead = this.table.querySelector('thead');
        
        const newTableHeader = components.drawHeaders({
            columns: this.config.columns,
            data : currentData,
            offset: this.offset,
            limit : this.limit,
            table : this.table,
            selectedValue: this.selectedValue,
            sorting: this.config.custom?.sorting ?? true
        });

        if(!newTableHeader) throw new Error("The table headers couldn't be created because of data not being found");

        thead = newTableHeader;

        //Sorting event
        if(this.config.custom?.sorting){
            const headers = thead.querySelectorAll('th');

            headers.forEach((th) => {
                th.addEventListener('click',({target}) => {
                    if(!target) return;

                    currentData = this.getCurrentData();
                
                    const sortedData = events.sortingEvent({
                        target : target,
                        data: this.config.data,
                        mutadedData: currentData,
                        numberOfClicks : this.numberOfClicks
                    });

                    if(!sortedData) return;

                    this.mutatedData = sortedData;
                    this.drawBody();

                    if(this.numberOfClicks < 3) this.numberOfClicks ++;
                    else this.numberOfClicks = 1;
                });
            });

        };
        
        return thead;
    };

    private drawBody(){
        const columns = this.config.columns;
        const data = this.getCurrentData();

        if(data.length === 0) throw new Error("No data was sent");

        this.offset = (this.currentPage - 1) * this.recordsPerPage;
        this.limit = Math.min(data.length, this.offset + this.recordsPerPage);
        this.recordsCount = data.length;
        this.numPages = Math.ceil(this.recordsCount / this.recordsPerPage);

        const tbody = components.drawBody({
            data: data,
            columns: columns,
            table: this.table,
            offset: this.offset,
            limit: this.limit
        });

        this.drawFilters();
        this.drawFooter();

        return tbody;
    };

    private drawFooter(){
        const footerContainer = components.drawFooter({
            currentPage: this.currentPage,
            numPages: this.numPages,
            tableContainer: this.tableContainer
        });

        //Pagination event
        footerContainer.querySelectorAll('button')?.forEach((button : HTMLButtonElement) => {
            button.addEventListener("click", ({target}) => {
                const htmlElement = target as HTMLElement;
                const button = htmlElement.closest('button');
                if(!button) return;

                this.currentPage = events.paginationEvent({
                    currentPage: this.currentPage,
                    numPages: this.numPages,
                    button: button
                });
                    
                this.drawBody();
            });
        });
        
        return footerContainer;
    };

    private getCurrentData(){
        return this.mutatedData.length >= 1 ? this.mutatedData : this.config.data;
    };
};

export default TableLib;