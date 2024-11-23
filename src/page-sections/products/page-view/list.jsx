import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // MUI
import Grid from "@mui/material/Grid2";
import ProductView from "../product-view";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import styled from "@mui/material/styles/styled"; // CUSTOM ICON COMPONENT

import Add from "@/icons/Add"; // CUSTOM COMPONENTS

import Scrollbar from "@/components/scrollbar";
import { TableDataNotFound, TableToolbar } from "@/components/table"; // CUSTOM DEFINED HOOK

import useMuiTable, { getComparator, stableSort } from "@/hooks/useMuiTable"; // CUSTOM PAGE SECTION COMPONENTS

import ProductTableRow from "../ProductTableRow";
import ProductTableHead from "../ProductTableHead";
import ProductTableActions from "../ProductTableActions"; // CUSTOM DUMMY DATA

import { PRODUCTS } from "@/__fakeData__/products"; //  STYLED COMPONENTS
import { getCallList } from "../../../api/axiosApis/get";

const ListWrapper = styled("div")(({ theme }) => ({
  gap: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  [theme.breakpoints.down(440)]: {
    flexDirection: "column",
    ".MuiButton-root": {
      width: "100%",
    },
  },
}));
export default function ProductListPageView() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productFilter, setProductFilter] = useState({
    stock: "",
    search: "",
    publish: "",
  });

  const handleChangeFilter = (key, value) => {
    setProductFilter((state) => ({ ...state, [key]: value }));
  };

  const {
    page,
    order,
    orderBy,
    selected,
    isSelected,
    rowsPerPage,
    handleSelectRow,
    handleChangePage,
    handleRequestSort,
    handleSelectAllRows,
    handleChangeRowsPerPage,
  } = useMuiTable({
    defaultOrderBy: "name",
  });

  const fetchCallList = () => {
    getCallList().then((data) => {
      setProducts(data?.data);
    });
  };
  useEffect(() => {
    fetchCallList();
  }, []);

  // const getUserData = () => {
  //   fetchUserData(page + 1, rowsPerPage, debounceSearch).then((resp) => {
  //     setUsers(resp?.data);
  //     setUsersCount(resp?.count);
  //   });
  // };
  // useEffect(() => {
  //   getUserData();
  // }, [rowsPerPage, page, debounceSearch]);

  const filteredProducts = stableSort(
    products,
    getComparator(order, orderBy)
  ).filter((item) => {
    if (productFilter.stock === "stock") return item.stock > 0;
    else if (productFilter.stock === "out-of-stock") return item.stock === 0;
    else if (productFilter.publish === "published")
      return item.published === true;
    else if (productFilter.publish === "draft") return item.published === false;
    else if (productFilter.search)
      return item.name
        .toLowerCase()
        .includes(productFilter.search.toLowerCase());
    else return true;
  });

  const handleDeleteProduct = (id) => {
    setProducts((state) => state.filter((item) => item.id !== id));
  };

  const handleAllProductDelete = () => {
    setProducts((state) => state.filter((item) => !selected.includes(item.id)));
    handleSelectAllRows([])();
  };

  const [details, setDetails] = useState(null);
  const handleButtonClick = (details12) => {
    console.log(`details12details12details12`, details12);
    setDetails(details12);
  };
  return (
    <div className="pt-2 pb-4">
      {details === null ? (
        <>
          <ListWrapper>
            <Tabs
              value={productFilter.stock}
              onChange={(_, value) => handleChangeFilter("stock", value)}
            >
              {/* <Tab disableRipple label="All" value="" />
          <Tab disableRipple label="In Stock" value="stock" />
          <Tab disableRipple label="Out of Stock" value="out-of-stock" /> */}
            </Tabs>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/dashboard/schedule-call")}
            >
              Schedule call
            </Button>
          </ListWrapper>

          <Card
            sx={{
              mt: 4,
            }}
          >
            {/* SEARCH AND PUBLISH FILTER SECTION */}
            {/* <ProductTableActions
          filter={productFilter}
          handleChangeFilter={handleChangeFilter}
        /> */}

            {/* TABLE ROW SELECTION HEADER  */}
            {selected.length > 0 && (
              <TableToolbar
                selected={selected.length}
                handleDeleteRows={handleAllProductDelete}
              />
            )}

            {/* TABLE HEAD AND ROW SECTION */}
            <TableContainer>
              <Scrollbar>
                <Table
                  sx={{
                    minWidth: 820,
                  }}
                >
                  <ProductTableHead
                    order={order}
                    orderBy={orderBy}
                    numSelected={selected.length}
                    rowCount={filteredProducts.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllRows={handleSelectAllRows(
                      filteredProducts.map((row) => row.id)
                    )}
                  />

                  <TableBody>
                    {filteredProducts
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((product) => (
                        <ProductTableRow
                          key={product.id}
                          product={product}
                          handleSelectRow={handleSelectRow}
                          handleButtonClick={handleButtonClick}
                          isSelected={isSelected(product.id)}
                          handleDeleteProduct={handleDeleteProduct}
                        />
                      ))}

                    {filteredProducts.length === 0 && <TableDataNotFound />}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            {/* PAGINATION SECTION */}
            <TablePagination
              page={page}
              component="div"
              rowsPerPage={rowsPerPage}
              count={filteredProducts.length}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </>
      ) : (
        <Grid container spacing={3}>
          <Grid size={12}>
            <ProductView details={details} setDetails={setDetails} />
          </Grid>
        </Grid>
      )}
    </div>
  );
}
