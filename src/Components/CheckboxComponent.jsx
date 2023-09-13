import { useState } from "react";
import { Checkbox } from "@mui/material";

export const CheckboxComponent = ({ id, defaultValue, onChangeField, field }) => {
    const [checked, setChecked] = useState(defaultValue);

    const handleChange = (event) => {
        setChecked(event.target.checked);
        const value = event.target.checked ? "1" : "0";
        onChangeField(id, value, field);
    };

    return (
        <Checkbox checked={checked} onChange={handleChange} />
    );
};