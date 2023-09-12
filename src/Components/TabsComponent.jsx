import { Box, Tab, Tabs } from "@mui/material";
import { TableComponent } from "./TableComponent";

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

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
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
            <TabPanel value={selectedTab} index={0}>
                <TableComponent type="products" setAlert={setAlert} />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
                <TableComponent type="services" setAlert={setAlert} />
            </TabPanel>
        </Box>
    );
};