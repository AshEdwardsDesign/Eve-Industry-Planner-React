import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { useContext, useState } from "react";
import { UsersContext } from "../../Context/AuthContext";
import { jobTypes } from "../../Context/defaultValues";
import { ApiJobsContext } from "../../Context/JobContext";
import itemList from "../../RawData/searchIndex.json";
import { makeStyles } from "@mui/styles";
import { PersonalESIDataContext } from "../../Context/EveDataContext";

const useStyles = makeStyles((theme) => ({
  Select: {
    "& .MuiFormHelperText-root": {
      color: theme.palette.secondary.main,
    },
    "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
      {
        display: "none",
      },
  },
}));

export function LibrarySearch({
  updateBlueprintData,
  pagination,
  setPagination,
}) {
  const [displayAll, changeDisplayAll] = useState(true);
  const [displayActive, changeDisplayActive] = useState(false);
  const [displayManufacturing, changeDisplayManufacturing] = useState(false);
  const [displayReactions, changeDisplayReactions] = useState(false);
  const [displayBPO, changeDisplayBPO] = useState(false);
  const [displayBPC, changeDisplayBPC] = useState(false);
  const { apiJobs } = useContext(ApiJobsContext);
  const { users } = useContext(UsersContext);
  const { esiBlueprints } = useContext(PersonalESIDataContext);
  const classes = useStyles();
  return (
    <Paper
      square={true}
      elevation={2}
      sx={{
        padding: "20px",
      }}
    >
      <Grid container>
        <Grid item xs={12} sm={5} md={4} xl={2}>
          <Autocomplete
            disableClearable
            fullWidth
            id="Blueprint Search"
            clearOnBlur
            blurOnSelect
            variant="standard"
            size="small"
            options={itemList}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => {
              let tempArray = [];
              let idArray = new Set();

              for (let entry of esiBlueprints) {
                entry.blueprints.forEach((bp) => {
                  bp.owner = entry.user;
                  tempArray.push(bp);
                });
              }

              tempArray = tempArray.filter(
                (i) => i.type_id === value.blueprintID
              );
              tempArray.forEach((bp) => {
                idArray.add(bp.type_id);
              });
              idArray.add(value.blueprintID);
              updateBlueprintData({
                ids: [...idArray],
                blueprints: tempArray,
              });
              if (displayAll) {
                changeDisplayAll((prev) => !prev);
              }
              if (displayActive) {
                changeDisplayActive((prev) => !prev);
              }
              if (displayManufacturing) {
                changeDisplayManufacturing((prev) => !prev);
              }
              if (displayReactions) {
                changeDisplayReactions((prev) => !prev);
              }
              if (displayBPO) {
                changeDisplayBPO((prev) => !prev);
              }
              if (displayBPC) {
                changeDisplayBPC((prev) => !prev);
              }
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
        <Grid
          item
          xs={12}
          sm={6}
          md={7}
          xl={9}
          align="center"
          sx={{
            marginTop: { xs: "10px", sm: "0px" },
            paddingLeft: { xs: "0px", sm: "40px", md: "40px", lg: "0px" },
          }}
        >
          <FormControl>
            <RadioGroup row>
              <FormControlLabel
                control={
                  <Radio
                    sx={{
                      "&, &.MuiButtonBase-root.MuiRadio-root": {
                        color: "secondary.main",
                      },
                    }}
                    checked={displayAll}
                    onChange={() => {
                      let tempArray = [];
                      let idArray = new Set();
                      if (displayActive) {
                        changeDisplayActive((prev) => !prev);
                      }
                      if (displayManufacturing) {
                        changeDisplayManufacturing((prev) => !prev);
                      }
                      if (displayReactions) {
                        changeDisplayReactions((prev) => !prev);
                      }
                      if (displayBPO) {
                        changeDisplayBPO((prev) => !prev);
                      }
                      if (displayBPC) {
                        changeDisplayBPC((prev) => !prev);
                      }
                      for (let entry of esiBlueprints) {
                        entry.blueprints.forEach((bp) => {
                          bp.owner = entry.user;
                          tempArray.push(bp);
                        });
                      }
                      tempArray.forEach((bp) => {
                        idArray.add(bp.type_id);
                      });

                      updateBlueprintData({
                        ids: [...idArray],
                        blueprints: tempArray,
                      });
                      setPagination({
                        ...pagination,
                        from: 0,
                        to: pagination.pageSize,
                      });
                      changeDisplayAll((prev) => !prev);
                    }}
                  />
                }
                label="All"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={displayActive}
                    onChange={() => {
                      let tempArray = [];
                      let idArray = new Set();
                      if (displayAll) {
                        changeDisplayAll((prev) => !prev);
                      }
                      if (displayManufacturing) {
                        changeDisplayManufacturing((prev) => !prev);
                      }
                      if (displayReactions) {
                        changeDisplayReactions((prev) => !prev);
                      }
                      if (displayBPO) {
                        changeDisplayBPO((prev) => !prev);
                      }
                      if (displayBPC) {
                        changeDisplayBPC((prev) => !prev);
                      }
                      for (let entry of esiBlueprints) {
                        entry.blueprints.forEach((bp) => {
                          bp.owner = entry.user;
                          tempArray.push(bp);
                        });
                      }

                      tempArray = tempArray.filter((blueprint) =>
                        apiJobs.some(
                          (job) =>
                            job.blueprint_id === blueprint.item_id &&
                            job.status === "active"
                        )
                      );
                      tempArray.forEach((bp) => {
                        idArray.add(bp.type_id);
                      });

                      updateBlueprintData({
                        ids: [...idArray],
                        blueprints: tempArray,
                      });
                      setPagination({
                        ...pagination,
                        from: 0,
                        to: pagination.pageSize,
                      });
                      changeDisplayActive((prev) => !prev);
                    }}
                  />
                }
                label="Active"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={displayManufacturing}
                    onChange={() => {
                      let tempArray = [];
                      let idArray = new Set();
                      if (displayAll) {
                        changeDisplayAll((prev) => !prev);
                      }
                      if (displayActive) {
                        changeDisplayActive((prev) => !prev);
                      }
                      if (displayReactions) {
                        changeDisplayReactions((prev) => !prev);
                      }
                      if (displayBPO) {
                        changeDisplayBPO((prev) => !prev);
                      }
                      if (displayBPC) {
                        changeDisplayBPC((prev) => !prev);
                      }
                      for (let entry of esiBlueprints) {
                        entry.blueprints.forEach((bp) => {
                          bp.owner = entry.user;
                          tempArray.push(bp);
                        });
                      }

                      tempArray = tempArray.filter((blueprint) =>
                        itemList.some(
                          (item) =>
                            item.blueprintID === blueprint.type_id &&
                            item.jobType === jobTypes.manufacturing
                        )
                      );
                      tempArray.forEach((bp) => {
                        idArray.add(bp.type_id);
                      });

                      updateBlueprintData({
                        ids: [...idArray],
                        blueprints: tempArray,
                      });
                      setPagination({
                        ...pagination,
                        from: 0,
                        to: pagination.pageSize,
                      });
                      changeDisplayManufacturing((prev) => !prev);
                    }}
                  />
                }
                label="Manufacturing"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={displayReactions}
                    onChange={() => {
                      let tempArray = [];
                      let idArray = new Set();
                      if (displayAll) {
                        changeDisplayAll((prev) => !prev);
                      }
                      if (displayActive) {
                        changeDisplayActive((prev) => !prev);
                      }
                      if (displayManufacturing) {
                        changeDisplayManufacturing((prev) => !prev);
                      }
                      if (displayBPO) {
                        changeDisplayBPO((prev) => !prev);
                      }
                      if (displayBPC) {
                        changeDisplayBPC((prev) => !prev);
                      }
                      for (let entry of esiBlueprints) {
                        entry.blueprints.forEach((bp) => {
                          bp.owner = entry.user;
                          tempArray.push(bp);
                        });
                      }

                      tempArray = tempArray.filter((blueprint) =>
                        itemList.some(
                          (item) =>
                            item.blueprintID === blueprint.type_id &&
                            item.jobType === jobTypes.reaction
                        )
                      );
                      tempArray.forEach((bp) => {
                        idArray.add(bp.type_id);
                      });

                      updateBlueprintData({
                        ids: [...idArray],
                        blueprints: tempArray,
                      });
                      setPagination({
                        ...pagination,
                        from: 0,
                        to: pagination.pageSize,
                      });
                      changeDisplayReactions((prev) => !prev);
                    }}
                  />
                }
                label="Reactions"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={displayBPO}
                    onChange={() => {
                      let tempArray = [];
                      let idArray = new Set();
                      if (displayAll) {
                        changeDisplayAll((prev) => !prev);
                      }
                      if (displayActive) {
                        changeDisplayActive((prev) => !prev);
                      }
                      if (displayManufacturing) {
                        changeDisplayManufacturing((prev) => !prev);
                      }
                      if (displayReactions) {
                        changeDisplayReactions((prev) => !prev);
                      }
                      if (displayBPC) {
                        changeDisplayBPC((prev) => !prev);
                      }
                      for (let entry of esiBlueprints) {
                        entry.blueprints.forEach((bp) => {
                          bp.owner = entry.user;
                          tempArray.push(bp);
                        });
                      }

                      tempArray = tempArray.filter(
                        (blueprint) =>
                          blueprint.runs === -1 &&
                          itemList.some(
                            (item) =>
                              item.blueprintID === blueprint.type_id &&
                              item.jobType === jobTypes.manufacturing
                          )
                      );
                      tempArray.forEach((bp) => {
                        idArray.add(bp.type_id);
                      });

                      updateBlueprintData({
                        ids: [...idArray],
                        blueprints: tempArray,
                      });
                      setPagination({
                        ...pagination,
                        from: 0,
                        to: pagination.pageSize,
                      });
                      changeDisplayBPO((prev) => !prev);
                    }}
                  />
                }
                label="BP Originals"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={displayBPC}
                    onChange={() => {
                      let tempArray = [];
                      let idArray = new Set();
                      if (displayAll) {
                        changeDisplayAll((prev) => !prev);
                      }
                      if (displayActive) {
                        changeDisplayActive((prev) => !prev);
                      }
                      if (displayManufacturing) {
                        changeDisplayManufacturing((prev) => !prev);
                      }
                      if (displayReactions) {
                        changeDisplayReactions((prev) => !prev);
                      }
                      if (displayBPO) {
                        changeDisplayBPO((prev) => !prev);
                      }
                      for (let entry of esiBlueprints) {
                        entry.blueprints.forEach((bp) => {
                          bp.owner = entry.user;
                          tempArray.push(bp);
                        });
                      }

                      tempArray = tempArray.filter(
                        (blueprint) =>
                          blueprint.quantity === -2 &&
                          itemList.some(
                            (item) =>
                              item.blueprintID === blueprint.type_id &&
                              item.jobType === jobTypes.manufacturing
                          )
                      );
                      tempArray.forEach((bp) => {
                        idArray.add(bp.type_id);
                      });

                      updateBlueprintData({
                        ids: [...idArray],
                        blueprints: tempArray,
                      });
                      setPagination({
                        ...pagination,
                        from: 0,
                        to: pagination.pageSize,
                      });
                      changeDisplayBPC((prev) => !prev);
                    }}
                  />
                }
                label="BP Copies"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={1} align="center">
          <FormControl className={classes.Select} fullWidth={true}>
            <Select
              variant="standard"
              value={pagination.pageSize}
              size="small"
              onChange={(e) => {
                setPagination({
                  ...pagination,
                  to: e.target.value,
                  pageSize: e.target.value,
                });
              }}
            >
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={16}>16</MenuItem>
              <MenuItem value={32}>32</MenuItem>
              <MenuItem value={64}>64</MenuItem>
            </Select>
            <FormHelperText variant="standard">Items Per Page</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
}
