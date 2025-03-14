import React from "react";
import FlatList from "../FlatList";

const TableBody = ({ section, viewTable, formData, headers, actions, getArrayColumnData }) => {
    if (!viewTable) return null;
    
    return (
        <FlatList
            headers={headers}
            data={getArrayColumnData(section.fields[0].id, formData)}
            actions={actions}
        />
    );
};

export default TableBody;
