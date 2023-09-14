import { useState } from "react";
import { TextField } from "@mui/material";

export const InputComponent = ({ defaultValue, onChangeField, id, label, field }) => {
    const [value, setValue] = useState(defaultValue);

    const replaceComma = (value) => {
        return value.replace(/,/, ".");
    };
    const roundingInteger = (value) => {
        return String(Number(replaceComma(value)).toFixed(0)) || value;
    };

    const onChange = (value) => {
        let newValue = value;
        if (field === "product_price" || field === "product_vat") {
            newValue = replaceComma(value);
        }
        if (field === "product_vat") {
            newValue = roundingInteger(value);
        }
        setValue(newValue);
        onChangeField(id, newValue, field)
    };

    return (
        <TextField
            sx={{ marginY: "20px", width: "100%" }}
            label={label}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            size="small"
        />
    );
};