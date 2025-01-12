import { useContext } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { ActiveJobContext } from "../../../../../Context/JobContext";

export function ProductionStats() {
  const { activeJob } = useContext(ActiveJobContext);

  function timeDisplay() {
    let returnArray = [];
    let d = Math.floor(activeJob.build.time / (3600 * 24));
    let h = Math.floor((activeJob.build.time % (3600 * 24)) / 3600);
    let m = Math.floor((activeJob.build.time % 3600) / 60);
    let s = Math.floor(activeJob.build.time % 60);

    if (d > 0) {
      returnArray.push(`${d}D`);
    }
    if (h > 0) {
      returnArray.push(`${h}H`);
    }
    if (m > 0) {
      returnArray.push(`${m}M`);
    }
    if (s > 0) {
      returnArray.push(`${s}S`);
    }

    return returnArray.join(" ");
  }

  let timeDisplayFigure = timeDisplay();

  return (
    <Paper
      elevation={3}
      sx={{
        minWidth: "100%",
        padding: "20px",
      }}
      square={true}
    >
      <Grid container direction="column" sx={{}}>
        <Grid container direction="row" item>
          <Grid container item xs={12} sx={{ marginBottom: "5px" }}>
            <Grid item xs={10}>
              <Typography sx={{ typography: { xs: "caption", sm: "body2" } }}>
                Items Produced Per Blueprint Run
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography
                sx={{ typography: { xs: "caption", sm: "body2" } }}
                align="right"
              >
                {Number(
                  activeJob.rawData.products[0].quantity
                ).toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12} sx={{ marginBottom: "5px" }}>
            <Grid item xs={10}>
              <Typography sx={{ typography: { xs: "caption", sm: "body2" } }}>
                Total Items Per Job Slot
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography
                sx={{ typography: { xs: "caption", sm: "body2" } }}
                align="right"
              >
                {activeJob.build.products.quantityPerJob.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={10}>
              <Typography sx={{ typography: { xs: "caption", sm: "body2" } }}>
                Total Items Being Produced
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography
                sx={{ typography: { xs: "caption", sm: "body2" } }}
                align="right"
              >
                {activeJob.build.products.totalQuantity.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={12} sx={{ marginTop: "20px" }}>
              <Typography
                align="center"
                sx={{ typography: { xs: "caption", sm: "body2" } }}
              >
                Time Per Job Slot
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography
                sx={{ typography: { xs: "caption", sm: "body2" } }}
                align="center"
              >
                {timeDisplayFigure}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
