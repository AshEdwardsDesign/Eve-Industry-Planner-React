import React, { useContext, useEffect, useState } from "react";
import { Grid, IconButton, TextField, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ActiveJobContext } from "../../../../../Context/JobContext";
import { SnackBarDataContext } from "../../../../../Context/LayoutContext";
import { makeStyles } from "@mui/styles";
import { EvePricesContext } from "../../../../../Context/EveDataContext";

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

function AddMaterialCost({
  materialIndex,
  material,
  setJobModified,
  marketDisplay,
  orderDisplay,
}) {
  const { activeJob, updateActiveJob } = useContext(ActiveJobContext);
  const { evePrices } = useContext(EvePricesContext);
  const materialPrice = evePrices.find((i) => i.typeID === material.typeID);
  const [inputs, setInputs] = useState({
    itemCost: materialPrice[marketDisplay][orderDisplay].toFixed(2),
    itemCount: Number(material.quantity - material.quantityPurchased),
  });
  const { setSnackbarData } = useContext(SnackBarDataContext);
  const classes = useStyles();

  useEffect(() => {
    setInputs((prev) => ({
      ...prev,
      itemCost: Number(materialPrice[marketDisplay][orderDisplay]).toFixed(2),
    }));
  }, [marketDisplay, orderDisplay]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputs.itemCount > 0) {
      let newArray = [...activeJob.build.materials];
      let newTotal = activeJob.build.costs.totalPurchaseCost;

      if (
        isNaN(newArray[materialIndex].quantityPurchased) ||
        newArray[materialIndex].quantityPurchased < 0 ||
        isNaN(newArray[materialIndex].purchasedCost) ||
        newArray[materialIndex].purchasedCost < 0
      ) {
        let newQuantity = 0;
        let newPurchaseCost = 0;
        newArray[materialIndex].purchasing.forEach((entry) => {
          newQuantity += entry.itemCount;
          newPurchaseCost += entry.itemCount * entry.itemCost;
        });
        newArray[materialIndex].quantityPurchased = newQuantity;
        newArray[materialIndex].purchasedCost = newPurchaseCost;
      }
      if (
        isNaN(activeJob.build.costs.totalPurchaseCost) ||
        activeJob.build.costs.totalPurchaseCost < 0
      ) {
        newTotal = 0;
        newArray.forEach((i) => {
          newTotal += i.purchasedCost;
        });
      }

      newArray[materialIndex].purchasing.push({
        id: Date.now(),
        childID: null,
        childJobImport: false,
        itemCount: inputs.itemCount,
        itemCost: Number(inputs.itemCost),
      });

      newArray[materialIndex].quantityPurchased += inputs.itemCount;
      newArray[materialIndex].purchasedCost +=
        inputs.itemCount * inputs.itemCost;
      newTotal += inputs.itemCount * inputs.itemCost;
      if (
        newArray[materialIndex].quantityPurchased >=
        newArray[materialIndex].quantity
      ) {
        newArray[materialIndex].purchaseComplete = true;
      }

      updateActiveJob((prevObj) => ({
        ...prevObj,
        build: {
          ...prevObj.build,
          materials: newArray,
          costs: {
            ...prevObj.build.costs,
            totalPurchaseCost: newTotal,
          },
        },
      }));
      setSnackbarData((prev) => ({
        ...prev,
        open: true,
        message: `Added`,
        severity: "success",
        autoHideDuration: 1000,
      }));
      setInputs({ itemCost: 0, itemCount: 0 });
      setJobModified(true);
    } else {
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            className={classes.TextField}
            required={true}
            size="small"
            variant="standard"
            type="number"
            helperText="Item Quantity"
            defaultValue={inputs.itemCount}
            inputProps={{ step: "1" }}
            onChange={(e) => {
              setInputs((prevState) => ({
                ...prevState,
                itemCount: Number(e.target.value),
              }));
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Tooltip
            title={Number(inputs.itemCost).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
            arrow
            placement="top"
          >
            <TextField
              className={classes.TextField}
              required={true}
              size="small"
              variant="standard"
              type="number"
              helperText="Item Price"
              value={inputs.itemCost}
              inputProps={{
                step: "0.01",
              }}
              onChange={(e) => {
                setInputs((prevState) => ({
                  ...prevState,
                  itemCost: Number(e.target.value),
                }));
              }}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={1} align="center">
          <IconButton size="small" color="primary" type="submit">
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
    </form>
  );
}
export default AddMaterialCost;
