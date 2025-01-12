import { Autocomplete, Grid, Paper, TextField } from "@mui/material";
import { useContext, useMemo } from "react";
import { UsersContext } from "../../Context/AuthContext";
import { EvePricesContext } from "../../Context/EveDataContext";
import { useFirebase } from "../../Hooks/useFirebase";
import { useJobBuild } from "../../Hooks/useJobBuild";
import itemList from "../../RawData/searchIndex.json";

export function UpcomingChangesSearch({
  updateTranqItem,
  updateSisiItem,
  updateItemLoad,
  updateLoadComplete,
}) {
  const { users } = useContext(UsersContext);
  const { evePrices, updateEvePrices } = useContext(EvePricesContext);
  const { buildJob } = useJobBuild();
  const { getItemPrices } = useFirebase();
  const parentUser = useMemo(() => {
    return users.find((i) => i.ParentUser);
  }, [users]);
  return (
    <Paper
      square
      elevation={3}
      sx={{
        padding: "20px",
      }}
    >
      <Grid container>
        <Grid item xs={12} sm={4} lg={3} xl={2}>
          <Autocomplete
            disableClearable
            fullWidth
            id="Item Search"
            clearOnBlur
            blurOnSelect
            variant="standard"
            size="small"
            options={itemList}
            getOptionLabel={(option) => option.name}
            onChange={async (event, value) => {
              updateItemLoad(true);
              let newTranqJob = await buildJob({
                itemID: value.itemID,
                throwError: false,
              });
              let newSisiJob = await buildJob({
                itemID: value.itemID,
                sisiData: true,
                throwError: false,
              });
              let priceIDRequest = new Set();
              priceIDRequest.add(value.itemID);
              if (newTranqJob !== undefined) {
                newTranqJob.build.materials.forEach((mat) => {
                  priceIDRequest.add(mat.typeID);
                });
              }
              if (newSisiJob !== undefined) {
                newSisiJob.build.materials.forEach((mat) => {
                  priceIDRequest.add(mat.typeID);
                });
              }

              let newEvePrices = await getItemPrices(
                [...priceIDRequest],
                parentUser
              );
              updateEvePrices((prev) => {
                newEvePrices = newEvePrices.filter(
                  (n) => !prev.some((p) => p.typeID === n.typeID)
                );
                return prev.concat(newEvePrices);
              });
              if (newTranqJob === undefined) {
                updateTranqItem("missing");
              } else {
                updateTranqItem(newTranqJob);
              }
              if (newSisiJob === undefined) {
                updateSisiItem("missing");
              } else {
                updateSisiItem(newSisiJob);
              }
              updateItemLoad(false);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Search"
                nargin="none"
                variant="standard"
                InputProps={{ ...params.InputProps, type: "search" }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
