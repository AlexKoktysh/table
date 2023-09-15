import { useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { PaginationComponent } from "./PaginationComponent";
import { Box, Tooltip } from "@mui/material";
import { getProductData, getServiceData } from "../api";
import { InputComponent } from "./InputComponent";
import { CheckboxComponent } from "./CheckboxComponent";
import UserDialogComponent from "./UserDialogComponent";

export const TableComponent = ({ type, setAlert, setParams }) => {
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

    const [edited_rows, setEdited_rows] = useState([]);

    const [greenRows, setGreenRows] = useState([]);
    const [items, setItems] = useState([]);

    const handlerChangeProductPrice = (item) => {
        return Number(item["product_price"]) * Number(item["product_vat"]) / (100 + Number(item["product_vat"]));
    };
    const handlerChangeProductVat = (item) => {
        const product_price = Number(item.clean_price) * (1 + Number(item.product_vat) / 100);
        const vat_sum = (Number(item["product_price"]) * Number(item["product_vat"])) / (100 + Number(item["product_vat"]));
        return { product_price, vat_sum };
    };

    const onChangeField = (id, value, field) => {
        const storageItems = JSON.parse(sessionStorage.getItem("editFields"));
        const newItems = storageItems.map((el) => {
            if (el.edit === id) {
                const item = el;
                item[field] = value;
                if (field === "product_price") {
                    setRows((prev) => {
                        const newRows = prev.map((row) => {
                            if (row.edit === id) {
                                return {
                                    ...row,
                                    "vat_sum": String(handlerChangeProductPrice(item).toFixed(2)),
                                };
                            }
                            return row;
                        });
                        return newRows;
                    });
                }
                if (field === "product_vat") {
                    const { product_price, vat_sum } = handlerChangeProductVat(item);
                    setRows((prev) => {
                        const newRows = prev.map((row) => {
                            if (row.edit === id) {
                                return {
                                    ...row,
                                    product_price: {
                                        ...row.product_price,
                                        props: {
                                            ...row.product_price.props,
                                            defaultValue: product_price.toFixed(2),
                                        },
                                    },
                                    vat_sum: String(vat_sum.toFixed(2)),
                                };
                            }
                            return row;
                        });
                        return newRows;
                    });
                }
                return item;
            }
            return el;
        });
        setEdited_rows([...newItems]);
        setParams({
            filters: columnFilters,
            sorting,
            take: pagination.pageSize,
            skip: pagination.pageSize * (pagination.page - 1),
            searchText: globalFilter,
            edited_rows: [...newItems],
        });
        sessionStorage.setItem("editFields", JSON.stringify([...newItems]));
    };

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

    const renderNameField = (renderedCellValue) => {
        return (
            <Tooltip title={renderedCellValue}>
                <span>{renderedCellValue}</span>
            </Tooltip>
        );
    };

    const setRenderRows = ({ columns, rows, totalRecords }) => {
        const green = rows.map((row) => {
            if (row.already_export) {
                return row.id;
            }
        });
        setEdited_rows([...rows])
        sessionStorage.setItem("editFields", JSON.stringify([...rows]));
        const custom_rows = rows?.map((row) => ({
            ...row,
            "barcode": (
                <InputComponent
                    defaultValue={row.barcode}
                    onChangeField={onChangeField}
                    id={row.edit}
                    label="Штрих-код"
                    field="barcode"
                />
            ),
            "package_w_b_extended_attr": (
                <InputComponent
                    defaultValue={row.package_w_b_extended_attr}
                    onChangeField={onChangeField}
                    id={row.edit}
                    label="Артикул"
                    field="package_w_b_extended_attr"
                />
            ),
            "product_price": (
                <InputComponent
                    defaultValue={row.product_price}
                    onChangeField={onChangeField}
                    id={row.edit}
                    label="Цена с НДС, BYN"
                    field="product_price"
                />
            ),
            "product_vat": (
                <InputComponent
                    defaultValue={row.product_vat}
                    onChangeField={onChangeField}
                    id={row.edit}
                    label="НДС, %"
                    field="product_vat"
                />
            ),
            "description": (
                <UserDialogComponent
                    openDialogText={row.description}
                    defaultValue={row.description}
                    agreeActionFunc={onChangeField}
                    id={row.edit}
                    field="description"
                    agreeActionText='Сохранить'
                    desAgreeActionText="Отмена"
                />
            ),
            "free_price": (
                <CheckboxComponent
                    id={row.edit}
                    defaultValue={row.free_price !== "0"}
                    onChangeField={onChangeField}
                    field="free_price"
                />
            ),
            "fill_weight": (
                <CheckboxComponent
                    id={row.edit}
                    defaultValue={row.fill_weight !== "0"}
                    onChangeField={onChangeField}
                    field="fill_weight"
                />
            ),
        }));
        setRows(custom_rows);
        setGreenRows(green);
        const custom_columns = columns.map((column) => {
            if (column.accessorKey === "rus_name") {
                return {
                    ...column,
                    Cell: ({ renderedCellValue }) => renderNameField(renderedCellValue),
                };
            }
            return column;
        });
        setColumns(custom_columns);
        setTotalRecords(totalRecords);
    };

    const fetchDate = async (params) => {
        setItems([]);
        setParams({
            ...params,
            edited_rows: [],
        });
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
          edited_rows: edited_rows,
        });
    }, [
        pagination.pageSize,
        pagination.page,
        sorting,
        columnFilters,
        globalFilter,
    ]);
    useEffect(() => {
        if (!loading)
            setTimeout(() => {
                const tr = document.getElementsByTagName("tr");
                setItems(tr);
            }, 1000);
    }, [loading]);
    useEffect(() => {
        greenRows.forEach((el) => {
            if (items[el]) {
                items[el].style.backgroundColor = "green";
            }
        });
    }, [items, greenRows]);

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