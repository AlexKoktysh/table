import Pagination from "@mui/material/Pagination";

export const PaginationComponent = (props) => {
    const { setPagination, pagination, totalRecords } = props;
    const change = (value) => {
        setPagination((prev) => {
            return {...prev, pageIndex: value - 1, page: value};
        });
    };

    return (
        <Pagination
            count={Math.ceil(totalRecords / pagination.pageSize)}
            color="primary"
            onChange={(event, value) => change(value)}
            page={pagination.page}
        />
    );
};