import React, { useContext, useState } from "react"
import {
    Autocomplete, Grid, FormControl, FormHelperText, IconButton, TextField
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ActiveJobContext } from "../../../../../Context/JobContext";
import { SnackBarDataContext } from "../../../../../Context/LayoutContext";

export function AddMaterialCost({ material, setJobModified }) {
    const { activeJob, updateActiveJob } = useContext(ActiveJobContext);
    const [inputs, setInputs] = useState({ itemCost: 0, itemCount: 0 });
    const { setSnackbarData } = useContext(SnackBarDataContext);
    

    function handleAdd(material) {
        const materialIndex = activeJob.build.materials.findIndex(
          (x) => x.typeID === material.typeID
        );
        const newArray = activeJob.build.materials;
        let newTotal = 0;
        newArray[materialIndex].purchasing.push({
          id: Date.now(),
          itemCount: inputs.itemCount,
          itemCost: inputs.itemCost,
        });
        newArray[materialIndex].quantityPurchased += inputs.itemCount;
        newArray[materialIndex].purchasedCost += inputs.itemCount * inputs.itemCost;
        if (
          newArray[materialIndex].quantityPurchased >=
          newArray[materialIndex].quantity
        ) {
          newArray[materialIndex].purchaseComplete = true;
        }
    
        newArray.forEach((material) => {
          newTotal += material.purchasedCost;
        });
    
        updateActiveJob((prevObj) => ({
          ...prevObj,
          build: {
            ...prevObj.build,
            materials: newArray,
            products: {
              ...prevObj.build.products,
            },
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
    }
    

    return (
        <Grid container spacing={1}>
            <Grid item xs={6}>
            <FormControl fullWidth={true}>
                  <Autocomplete
                    autoSelect
                    freeSolo
                    size="small"
                    variant="standard"
                    options={[
                      {
                        value: material.quantity - material.quantityPurchased,
                        label: "All Remaining",
                      },
                    ]}
                    onChange={(e, v) => {
                      if (v === "All Remaining") {
                        setInputs((prevState) => ({
                          ...prevState,
                          itemCount: Number(
                            material.quantity - material.quantityPurchased
                          ),
                        }));
                      } else {
                        setInputs((prevState) => ({
                          ...prevState,
                          itemCount: Number(v),
                        }));
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" />
                    )}
                    />
                    <FormHelperText variant="standard">Quantity</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    size="small"
                    variant="standard"
                    type="number"
                    helperText="Item Price"
                    defaultValue="0"
                    onBlur={(e) => {
                      setInputs((prevState) => ({
                        ...prevState,
                        itemCost: Number(e.target.value),
                      }));
                    }}
                  />
                </Grid>
                <Grid item xs={1} align="center">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleAdd(material)}
                  >
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
    )
}