import { useState } from "react";
import { Checkbox } from "@mui/material";

export const CheckboxComponent = ({ id, defaultValue, onCheckedField, fields }) => {
    const [checked, setChecked] = useState(defaultValue);

    const handleChange = (event) => {
        setChecked(event.target.checked);
        onCheckedField(id, event.target.checked, fields);
    };

    return (
        <Checkbox checked={checked} onChange={handleChange} />
    );
};