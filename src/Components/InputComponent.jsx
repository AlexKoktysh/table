import { useState } from "react";
import { TextField } from "@mui/material";

export const InputComponent = ({ defaultValue, onChangeField, id, label, field }) => {
    const [value, setValue] = useState(defaultValue);
    const onChange = (value) => {
        setValue(value);
        onChangeField(id, value, field)
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