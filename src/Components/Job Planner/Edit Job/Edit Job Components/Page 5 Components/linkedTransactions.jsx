import { useContext, useState } from "react";
import {
  ActiveJobContext,
  LinkedIDsContext,
} from "../../../../../Context/JobContext";
import {
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { SnackBarDataContext } from "../../../../../Context/LayoutContext";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AddTransactionDialog } from "./addTransaction";

export function LinkedTransactions({ setJobModified, activeOrder }) {
  const { activeJob, updateActiveJob } = useContext(ActiveJobContext);
  const { setSnackbarData } = useContext(SnackBarDataContext);
  const { linkedTransIDs, updateLinkedTransIDs } = useContext(LinkedIDsContext);
  const [newTransactionTrigger, updateNewTransactionTrigger] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Paper
        sx={{
          padding: "20px",
          position: "relative",
        }}
        elevation={3}
        square={true}
      >
        <Grid container direction="row">
          <Grid container item xs={12} sx={{ marginBottom: "20px" }}>
            <Grid item xs={12}>
              <Typography variant="h5" color="primary" align="center">
                Linked Transactions
              </Typography>
            </Grid>

            <IconButton
              id="linkedTransactions_menu_button"
              onClick={handleMenuClick}
              aria-controls={
                Boolean(anchorEl) ? "linkedTransactions_menu" : undefined
              }
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? "true" : undefined}
              sx={{ position: "absolute", top: "10px", right: "10px" }}
            >
              <MoreVertIcon size="small" color="Secondary" />
            </IconButton>
            <Menu
              id="linkedTransactions_menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": "linkedTransactions_menu_button",
              }}
            >
              <MenuItem
                onClick={() => {
                  updateNewTransactionTrigger(true);
                  setAnchorEl(null);
                }}
              >
                Add Manual Transaction
              </MenuItem>
            </Menu>
          </Grid>
          <Grid
            container
            item
            xs={12}
            sx={{
              overflowY: "auto",
              maxHeight: {
                xs: "350px",
                sm: "260px",
                md: "240px",
                lg: "240px",
                xl: "480px",
              },
            }}
          >
            {activeJob.build.sale.transactions.length !== 0 ? (
              activeJob.build.sale.transactions.map((tData, index) => {
                if (!activeOrder.some((t) => t !== tData.location_id)) {
                  return (
                    <Grid
                      key={tData.transaction_id}
                      container
                      sx={{ marginBottom: "10px" }}
                    >
                      <Grid
                        item
                        xs={4}
                        md={1}
                        align="center"
                        sx={{ marginBottom: { xs: "10px", sm: "0px" } }}
                      >
                        <Typography
                          sx={{ typography: { xs: "caption", sm: "body2" } }}
                        >
                          {new Date(tData.date).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={2} align="center">
                        <Typography
                          sx={{ typography: { xs: "caption", sm: "body2" } }}
                        >
                          {tData.description}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={2}
                        align="center"
                        sx={{ marginBottom: { xs: "10px", sm: "0px" } }}
                      >
                        <Typography
                          sx={{ typography: { xs: "caption", sm: "body2" } }}
                        >
                          {tData.quantity.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}{" "}
                          @{" "}
                          {tData.unit_price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          ISK Each
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={2} align="center">
                        <Typography
                          sx={{ typography: { xs: "caption", sm: "body2" } }}
                        >
                          {tData.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={2} align="center">
                        <Typography
                          sx={{ typography: { xs: "caption", sm: "body2" } }}
                        >
                          -
                          {tData.tax.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          Tax Paid
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={1} align="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            let newTransArray = [
                              ...activeJob.build.sale.transactions,
                            ];
                            let newApiTransactions = new Set(
                              activeJob.apiTransactions
                            );
                            let newLinkedTransIDs = new Set(linkedTransIDs);

                            newTransArray.splice(index, 1);
                            newLinkedTransIDs.delete(tData.transaction_id);
                            newApiTransactions.delete(tData.transaction_id);

                            updateLinkedTransIDs([...newLinkedTransIDs]);
                            updateActiveJob((prev) => ({
                              ...prev,
                              apiTransactions: newApiTransactions,
                              build: {
                                ...prev.build,
                                sale: {
                                  ...prev.build.sale,
                                  transactions: newTransArray,
                                },
                              },
                            }));

                            setSnackbarData((prev) => ({
                              ...prev,
                              open: true,
                              message: "Unlinked",
                              severity: "error",
                              autoHideDuration: 1000,
                            }));

                            setJobModified(true);
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  );
                } else return null;
              })
            ) : (
              <Grid item xs={12} align="center">
                <Typography sx={{ typography: { xs: "caption", md: "body1" } }}>
                  There are currently no transactions linked to this market
                  order.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Paper>
      <AddTransactionDialog
        setJobModified={setJobModified}
        newTransactionTrigger={newTransactionTrigger}
        updateNewTransactionTrigger={updateNewTransactionTrigger}
      />
    </>
  );
}
