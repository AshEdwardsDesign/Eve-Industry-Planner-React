import { Grid, Icon, Tooltip, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useEffect, useState } from "react";
import { ChildJobPopover } from "./childJobPopOver";
import { jobTypes } from "../../../../../Context/defaultValues";

export function ItemCostRow({
  material,
  marketSelect,
  listingSelect,
  materialPrice,
  jobModified,
  setJobModified,
  materialIndex,
}) {
  const [displayPopover, updateDisplayPopover] = useState(null);
  const [currentPurchasePrice, updateCurrentPurchasePrice] = useState(
    materialPrice[marketSelect][listingSelect]
  );
  const [currentBuildPrice, updateCurrentBuildPrice] = useState(null);

  useEffect(() => {
    updateCurrentPurchasePrice(materialPrice[marketSelect][listingSelect]);
  }, [marketSelect, listingSelect, currentBuildPrice]);
  return (
    <Grid
      container
      item
      xs={12}
      sx={{
        padding: { xs: "7px 0px", sm: "10px 0px" },
        backgroundColor: displayPopover !== null ? "lightGrey" : "none",
      }}
    >
      <Grid
        justifyContent="center"
        item
        xs={2}
        sm={1}
        sx={{
          display: { xs: "flex", md: "flex" },
          paddingRight: "5px",
        }}
      >
        <img
          src={`https://images.evetech.net/types/${material.typeID}/icon?size=32`}
          alt=""
        />
      </Grid>
      <Grid container item xs={10} md={4} align="left">
        <Grid item xs={11} alignItems="center" sx={{ display: "flex" }}>
          <Typography sx={{ typography: { xs: "caption", sm: "body1" } }}>
            {material.name}
          </Typography>
        </Grid>
        <Grid
          item
          xs={1}
          alignItems="center"
          justifyContent="center"
          sx={{ display: "flex" }}
        >
          {material.jobType === jobTypes.manufacturing ||
          material.jobType === jobTypes.reaction ? (
            <>
              <Tooltip
                title="Click To Compare Material Build Cost"
                arrow
                placement="bottom"
              >
                <Icon
                  aria-haspopup="true"
                  color="primary"
                  onClick={(event) => {
                    updateDisplayPopover(event.currentTarget);
                  }}
                >
                  <InfoIcon fontSize="small" />
                </Icon>
              </Tooltip>
              <ChildJobPopover
                displayPopover={displayPopover}
                updateDisplayPopover={updateDisplayPopover}
                material={material}
                marketSelect={marketSelect}
                listingSelect={listingSelect}
                jobModified={jobModified}
                setJobModified={setJobModified}
                currentBuildPrice={currentBuildPrice}
                updateCurrentBuildPrice={updateCurrentBuildPrice}
                currentPurchasePrice={currentPurchasePrice}
                materialIndex={materialIndex}
              />
            </>
          ) : null}
        </Grid>
      </Grid>
      <Grid
        alignItems="center"
        justifyContent="center"
        item
        xs={6}
        md={3}
        align="center"
        sx={{
          marginTop: { xs: "10px", md: "0px" },
          display: "flex",
        }}
      >
        <Typography
          sx={{ typography: { xs: "caption", sm: "body2" } }}
          color={
            currentBuildPrice !== null
              ? currentPurchasePrice >= currentBuildPrice
                ? "error.main"
                : "success.main"
              : null
          }
        >
          {materialPrice[marketSelect][listingSelect].toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}{" "}
        </Typography>
      </Grid>
      <Grid
        alignItems="center"
        justifyContent="center"
        item
        xs={6}
        md={4}
        align="center"
        sx={{ marginTop: { xs: "10px", md: "0px" }, display: "flex" }}
      >
        <Typography
          sx={{ typography: { xs: "caption", sm: "body2" } }}
          color={
            currentBuildPrice !== null
              ? currentPurchasePrice >= currentBuildPrice
                ? "error.main"
                : "success.main"
              : null
          }
        >
          {(
            materialPrice[marketSelect][listingSelect] * material.quantity
          ).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      </Grid>
    </Grid>
  );
}
