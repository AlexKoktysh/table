import { TextareaAutosize } from "@mui/material";

export const TextareaComponent = ({ value, setValue }) => {
    return (
        <TextareaAutosize
            placeholder="Введите описание"
            minRows={10}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ minWidth: "200px" }}
        />
    );
};