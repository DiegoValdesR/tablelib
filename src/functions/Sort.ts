interface ISortingParams{
    sortValue : sorting
    data : Data
    targetField : string
}

export const sortData = (params : ISortingParams) => {
    const unsortedData = [...params.data];
    const target = params.targetField;
    const sortValue = params.sortValue;
    let typeofValue = "";

    unsortedData.forEach((row) => {
        if(!row[target]) return;
        typeofValue = typeof row[target];
    });

    //Sorting depending of the type of the target value
    if(typeofValue.length === 0 || sortValue === "normal") return unsortedData;

    let sortedData : Data = [];
    
    switch (typeofValue) {
        case "number":
            sortedData = sortNumbers({
                data : unsortedData,
                targetField: target,
                sortValue: sortValue
            });
        break;

        case "string":
            sortedData = sortStrings({
                data : unsortedData,
                targetField: target,
                sortValue: sortValue
            });
        break;
                
        default:
            break;
    };

    console.log(unsortedData);
    console.log(sortedData);

    return sortedData
};

const sortStrings = ({data, targetField, sortValue} : ISortingParams) => {
    const sortedData = [...data].sort((a, b) => {
        const aVal = a[targetField];
        const bVal = b[targetField];

        const aEmpty = !aVal || (typeof aVal === "string" && aVal.trim() === "");
        const bEmpty = !bVal || (typeof bVal === "string" && bVal.trim() === "");

        if (aEmpty && !bEmpty) return 1;
        if (!aEmpty && bEmpty) return -1;
        if (aEmpty && bEmpty) return 0;

        return sortValue === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    return sortedData;
};

const sortNumbers = ({data, targetField, sortValue} : ISortingParams) => {
    const sortedData = data.sort((a, b) => {
        const aVal = a[targetField];
        const bVal = b[targetField];

        const aEmpty = aVal === null || aVal === undefined || isNaN(aVal);
        const bEmpty = bVal === null || bVal === undefined || isNaN(bVal);

        if (aEmpty && !bEmpty) return 1;
        if (!aEmpty && bEmpty) return -1;
        if (aEmpty && bEmpty) return 0;

        return sortValue === "asc" ? aVal - bVal : bVal - aVal;
    });

    return sortedData;
};