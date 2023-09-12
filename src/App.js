import { useState } from "react";
import { TabsComponent } from "./Components/TabsComponent";
import { Alert } from "@mui/material";

export const App = () => {
  const [alert, setAlert] = useState("");

  const [selectedTab, setSelectedTab] = useState(0);

  if (alert) {
    return <Alert severity="error">{alert}</Alert>;
  }

  return (
    <TabsComponent
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      setAlert={setAlert}
    />
  );
};