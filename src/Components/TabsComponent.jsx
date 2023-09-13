import { Box, Tab, Tabs, Button } from "@mui/material";
import { TableComponent } from "./TableComponent";
import { generateProductData, generateServiceData } from "../api";
import { useEffect, useState } from "react";

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
};

export const TabsComponent = (props) => {
    const { selectedTab, setSelectedTab, setAlert } = props;

    const [params, setParams] = useState([]);

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const setFetchType = async () => {
        console.log("click", params)
        // switch (selectedTab) {
        //     case 0:
        //         return await generateProductData(params);
        //     case 1:
        //         return generateServiceData(params);
        //     default:
        //         return;
        // }
    };

    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <Tabs
                value={selectedTab}
                onChange={handleChange}
            >
                <Tab label="ПЕРЕЧЕНЬ ТОВАРОВ"></Tab>
                <Tab label="ПЕРЕЧЕНЬ УСЛУГ"></Tab>
            </Tabs>
            <Button variant="contained" sx={{ width: "300px", margin: "10px 0" }} onClick={setFetchType}>Экспортировать файл</Button>
            <TabPanel value={selectedTab} index={0}>
                <TableComponent type="products" setAlert={setAlert} setParams={setParams} />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
                <TableComponent type="services" setAlert={setAlert} setParams={setParams} />
            </TabPanel>
        </Box>
    );
};