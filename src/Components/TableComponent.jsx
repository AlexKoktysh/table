import { useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { PaginationComponent } from "./PaginationComponent";
import { Box, Tooltip } from "@mui/material";
import { getProductData, getServiceData } from "../api";
import { InputComponent } from "./InputComponent";
import { CheckboxComponent } from "./CheckboxComponent";
import UserDialogComponent from "./UserDialogComponent";

export const TableComponent = ({ type, setAlert }) => {
    const [loading, setLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        page: 1,
        pageSize: 10,
        pageCount: Math.ceil(totalRecords / 10) || 0,
    });
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const onChangeField = (id, value, field) => {
        const storageItems = JSON.parse(sessionStorage.getItem("editFields"));
        const findItem = storageItems.find((el) => el.id === id);
    };
    const onCheckedField = () => {};

    const setFetchType = async (params) => {
        switch (type) {
            case "products":
                return await getProductData(params);
            case "services":
                return getServiceData(params);
            default:
                return;
        }
    };

    const setRenderRows = ({ columns, rows, totalRecords }) => {
        const custom_rows = rows?.map((row) => ({
            ...row,
            "rus_name": (
                <Tooltip title={row.rus_name}>
                    <span>{row.rus_name}</span>
                </Tooltip>
            ),
            "barcode": (
                <InputComponent
                    defaultValue={row.barcode}
                    onChangeField={onChangeField}
                    id={row.id}
                    label="Штрих-код"
                    field="barcode"
                />
            ),
            "package_w_b_extended_attr": (
                <InputComponent
                    defaultValue={row.package_w_b_extended_attr}
                    onChangeField={onChangeField}
                    id={row.id}
                    label="Артикул"
                    field="package_w_b_extended_attr"
                />
            ),
            "product_price": (
                <InputComponent
                    defaultValue={row.product_price}
                    onChangeField={onChangeField}
                    id={row.id}
                    label="Цена без НДС, BYN"
                    field="product_price"
                />
            ),
            "product_vat": (
                <InputComponent
                    defaultValue={row.product_vat}
                    onChangeField={onChangeField}
                    id={row.id}
                    label="НДС, %"
                    field="product_vat"
                />
            ),
            "description": (
                <UserDialogComponent
                    openDialogText={row.description}
                    defaultValue={row.description}
                    agreeActionFunc={onChangeField}
                    id={row.id}
                    field="description"
                    agreeActionText='Сохранить'
                    desAgreeActionText="Отмена"
                />
            ),
            "free_price": (
                <CheckboxComponent
                    id={row.id}
                    defaultValue={row.free_price !== "0"}
                    onCheckedField={onCheckedField}
                    field="free_price"
                />
            ),
            "fill_weight": (
                <CheckboxComponent
                    id={row.id}
                    defaultValue={row.fill_weight !== "0"}
                    onCheckedField={onCheckedField}
                    field="fill_weight"
                />
            ),
        }));
        setRows(custom_rows);
        setColumns(columns);
        setTotalRecords(totalRecords);
    };

    const fetchDate = async (params) => {
        setLoading(true);
        setRows([]);
        const data = await setFetchType(params);
        setLoading(false);
        if (data.error) return setAlert(data.error["ajax-errors"]);
        setRenderRows(data);
    };

    useEffect(() => {
        fetchDate({
          filters: columnFilters,
          sorting,
          take: pagination.pageSize,
          skip: pagination.pageSize * (pagination.page - 1),
          searchText: globalFilter,
        });
    }, [
        pagination.pageSize,
        pagination.page,
        sorting,
        columnFilters,
        globalFilter,
    ]);

    return (
        <Box style={{ height: 1200, width: "100%", overflowY: "auto" }}>
            <MaterialReactTable
                columns={columns}
                data={rows}
                initialState={{ density: "compact" }}
                state={{
                    pagination,
                    sorting,
                    columnFilters,
                    globalFilter,
                    showSkeletons: loading,
                }}
                onPaginationChange={setPagination}
                onSortingChange={setSorting}
                onColumnFiltersChange={setColumnFilters}
                onGlobalFilterChange={setGlobalFilter}
                rowCount={totalRecords}
                localization={MRT_Localization_RU}
                defaultColumn={{
                    minSize: 40,
                    maxSize: 300,
                    size: 250,
                }}
                muiTablePaginationProps={{
                    rowsPerPageOptions: [5, 10, 20],
                    width: "100%",
                    className: "pagination",
                    ActionsComponent: () => PaginationComponent({ setPagination, pagination, totalRecords })
                }}
            />
        </Box>
    );
};