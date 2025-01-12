import { useEffect, useState } from "react";
import {
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { structureOptions } from "../../Context/defaultValues";

import { makeStyles } from "@mui/styles";
import { useBlueprintCalc } from "../../Hooks/useBlueprintCalc";

const useStyles = makeStyles((theme) => ({
  TextField: {
    "& .MuiFormHelperText-root": {
      color: theme.palette.secondary.main,
    },
    "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
      {
        display: "none",
      },
  },
}));

export function ReactionOptionsUpcomingChanges({
  tranqItem,
  updateTranqItem,
  sisiItem,
  updateSisiItem,
  itemLoad,
}) {
  const { CalculateResources, CalculateTime } = useBlueprintCalc();
  const [runValue, updateRunValue] = useState(1);
  const [jobValue, updateJobValue] = useState(1);
  const [structValue, updateStructValue] = useState("Medium");
  const [structType, updateStructType] = useState(0);
  const [rigsValue, updateRigsValue] = useState(0);
  const [systemValue, updateSystemValue] = useState(1);

  const classes = useStyles();

  useEffect(() => {
    function updateDefaultValues() {
      if (tranqItem !== null && sisiItem !== null) {
        if (tranqItem === null && sisiItem !== null) {
          updateRunValue(sisiItem.runCount);
          updateJobValue(sisiItem.jobCount);
          updateStructValue(sisiItem.structureTypeDisplay);
          updateStructType(sisiItem.structureType);
          updateRigsValue(sisiItem.rigType);
          updateSystemValue(sisiItem.systemType);
        } else {
          updateRunValue(tranqItem.runCount);
          updateJobValue(tranqItem.jobCount);
          updateStructValue(tranqItem.structureTypeDisplay);
          updateStructType(tranqItem.structureType);
          updateRigsValue(tranqItem.rigType);
          updateSystemValue(tranqItem.systemType);
        }
      }
    }
    updateDefaultValues();
  }, [itemLoad]);

  useEffect(() => {
    updateTranqItem((prev) => ({
      ...prev,
      runCount: runValue,
      jobCount: jobValue,
      structureType: structType,
      structureTypeDisplay: structValue,
      rigType: rigsValue,
      systemType: systemValue,
      build: {
        ...prev.build,
        materials: CalculateResources({
          jobType: prev.jobType,
          rawMaterials: prev.rawData.materials,
          outputMaterials: prev.build.materials,
          runCount: runValue,
          jobCount: jobValue,
          bpME: 0,
          structureType: structType,
          rigType: rigsValue,
          systemType: systemValue,
        }),
        products: {
          ...prev.build.products,
          totalQuantity:
            prev.rawData.products[0].quantity * runValue * jobValue,
          quantityPerJob: prev.rawData.products[0].quantity * jobValue,
        },
        time: CalculateTime({
          jobType: prev.jobType,
          CharacterHash: prev.build.buildChar,
          structureTypeDisplay: structValue,
          runCount: runValue,
          bpTE: 0,
          rawTime: prev.rawData.time,
          skills: prev.skills,
        }),
      },
    }));
    updateSisiItem((prev) => ({
      ...prev,
      runCount: runValue,
      jobCount: jobValue,
      structureType: structType,
      structureTypeDisplay: structValue,
      rigType: rigsValue,
      systemType: systemValue,
      build: {
        ...prev.build,
        materials: CalculateResources({
          jobType: prev.jobType,
          rawMaterials: prev.rawData.materials,
          outputMaterials: prev.build.materials,
          runCount: runValue,
          jobCount: jobValue,
          bpME: 0,
          structureType: structType,
          rigType: rigsValue,
          systemType: systemValue,
        }),
        products: {
          ...prev.build.products,
          totalQuantity:
            prev.rawData.products[0].quantity * runValue * jobValue,
          quantityPerJob: prev.rawData.products[0].quantity * jobValue,
        },
        time: CalculateTime({
          jobType: prev.jobType,
          CharacterHash: prev.build.buildChar,
          structureTypeDisplay: structValue,
          runCount: runValue,
          bpTE: 0,
          rawTime: prev.rawData.time,
          skills: prev.skills,
        }),
      },
    }));
  }, [runValue, jobValue, structType, structValue, rigsValue, systemValue]);

  return (
    <Paper
      square
      elevation={3}
      sx={{
        padding: "20px",
      }}
    >
      <Grid container>
        <Grid item xs={6}>
          <TextField
            fullWidth
            className={classes.TextField}
            defaultValue={runValue}
            size="small"
            variant="standard"
            helperText="Blueprint Runs"
            type="number"
            onBlur={(e) => {
              updateRunValue(Number(e.target.value));
            }}
            sx={{ paddingLeft: "5px", paddingRight: "5px" }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            defaultValue={jobValue}
            className={classes.TextField}
            size="small"
            variant="standard"
            helperText="Job Slots"
            type="number"
            onBlur={(e) => {
              updateJobValue(Number(e.target.value));
            }}
            sx={{ paddingLeft: "5px", paddingRight: "5px" }}
          />
        </Grid>
        <Grid item xs={4}>
          <Tooltip
            title={
              <span>
                <p>Medium: Astrahus, Athanor, Raitaru</p>
                <p>Large: Azbel, Fortizar, Tatara</p>
              </span>
            }
            arrow
            placement="top"
          >
            <FormControl
              className={classes.TextField}
              fullWidth
              sx={{ paddingLeft: "5px", paddingRight: "5px" }}
            >
              <Select
                variant="standard"
                size="small"
                value={structValue}
                onChange={(e) => {
                  updateStructType(e.target.value === "Station" ? 0 : 1);
                  updateStructValue(e.target.value);
                }}
              >
                {structureOptions.reactionStructure.map((entry) => {
                  return (
                    <MenuItem key={entry.label} value={entry.value}>
                      {entry.label}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText variant="standard">Structure Type</FormHelperText>
            </FormControl>
          </Tooltip>
        </Grid>
        <Grid item xs={4}>
          <FormControl
            className={classes.TextField}
            fullWidth
            sx={{ paddingLeft: "5px", paddingRight: "5px" }}
          >
            <Select
              variant="standard"
              size="small"
              value={rigsValue}
              onChange={(e) => {
                updateRigsValue(e.target.value);
              }}
            >
              {structureOptions.reactionRigs.map((entry) => {
                return (
                  <MenuItem key={entry.label} value={entry.value}>
                    {entry.label}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText variant="standard">Rig Type</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl
            className={classes.TextField}
            fullWidth
            sx={{ paddingLeft: "5px", paddingRight: "5px" }}
          >
            <Select
              variant="standard"
              size="small"
              value={systemValue}
              onChange={(e) => {
                updateSystemValue(e.target.value);
              }}
            >
              {structureOptions.reactionSystem.map((entry) => {
                return (
                  <MenuItem key={entry.label} value={entry.value}>
                    {entry.label}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText variant="standard">System Type</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
}
