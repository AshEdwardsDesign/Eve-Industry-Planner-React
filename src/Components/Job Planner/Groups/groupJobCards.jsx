import { useContext, useMemo } from "react";
import {
  Button,
  Checkbox,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { grey } from "@mui/material/colors";
import { jobTypes } from "../../../Context/defaultValues";
import {
  JobPlannerPageTriggerContext,
  MultiSelectJobPlannerContext,
} from "../../../Context/LayoutContext";
import { useJobManagement } from "../../../Hooks/useJobManagement";
import Step1JobCard from "../Job Cards/Job Cards/step1";
import { makeStyles } from "@mui/styles";
import GroupStep2JobCard from "./jobCards/groupStep2";
import GroupStep3JobCard from "./jobCards/GroupStep3";
import GroupStep4JobCard from "./jobCards/groupStep4";
import GroupStep5JobCard from "./jobCards/groupStep5";

const useStyles = makeStyles((theme) => ({
  Checkbox: {
    color:
      theme.palette.type === "dark"
        ? theme.palette.primary.main
        : theme.palette.secondary.main,
  },
  DeleteIcon: {
    color:
      theme.palette.type === "dark"
        ? theme.palette.primary.main
        : theme.palette.secondary.main,
  },
}));

function DisplaySwitch({ job }) {
  switch (job.jobStatus) {
    case 0:
      return <Step1JobCard job={job} />;
    case 1:
      return <GroupStep2JobCard job={job} />;
    case 2:
      return <GroupStep3JobCard job={job} />;
    case 3:
      return <GroupStep4JobCard job={job} />;
    case 4:
      return <GroupStep5JobCard job={job} />;
    default:
      return <Step1JobCard job={job} />;
  }
}

export function GroupJobCardFrame({ job }) {
  const { multiSelectJobPlanner, updateMultiSelectJobPlanner } = useContext(
    MultiSelectJobPlannerContext
  );
  const { updateEditJobTrigger } = useContext(JobPlannerPageTriggerContext);
  const { deleteJobProcess, openEditJob } = useJobManagement();
  const classes = useStyles();

  let jobCardChecked = useMemo(() => {
    return multiSelectJobPlanner.some((i) => i === job.jobID);
  }, [multiSelectJobPlanner]);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Paper
        elevation={3}
        square={true}
        sx={{
          padding: "10px",
          height: "100%",
          backgroundColor: (theme) =>
            jobCardChecked
              ? theme.palette.type !== "dark"
                ? grey[300]
                : grey[900]
              : "none",
        }}
      >
        <Grid container item xs={12}>
          <Grid container item xs={12}>
            <Grid item xs={1}>
              <Checkbox
                disabled={job.isLocked}
                className={classes.Checkbox}
                checked={jobCardChecked}
                onChange={(event) => {
                  if (event.target.checked) {
                    if (!multiSelectJobPlanner.includes(job.jobID)) {
                      updateMultiSelectJobPlanner((prev) =>
                        prev.concat(job.jobID)
                      );
                    }
                  } else {
                    updateMultiSelectJobPlanner((prev) =>
                      prev.filter((i) => i !== job.jobID)
                    );
                  }
                }}
              />
            </Grid>
            <Grid item xs={9} />
            <Grid item align="center" xs={2}>
              <IconButton
                disabled={job.isLocked}
                className={classes.DeleteIcon}
                onClick={() => deleteJobProcess(job)}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ marginBottom: { xs: "5px", sm: "10px" } }}>
            <Typography
              color="secondary"
              align="center"
              sx={{
                minHeight: { xs: "2rem", sm: "3rem", md: "3rem", lg: "4rem" },
                typography: { xs: "body1", lg: "h6" },
              }}
            >
              {job.name}
            </Typography>
          </Grid>
          <Grid
            container
            item
            xs={12}
            sx={{
              marginLeft: { xs: "10px", md: "0px" },
              marginRight: { xs: "20px", md: "30px" },
            }}
          >
            <Grid
              container
              item
              xs={2}
              sm={3}
              justifyContent="center"
              alignItems="center"
            >
              <picture>
                <source
                  media="(max-width:700px)"
                  srcSet={`https://images.evetech.net/types/${job.itemID}/icon?size=32`}
                />
                <img
                  src={`https://images.evetech.net/types/${job.itemID}/icon?size=64`}
                  alt=""
                />
              </picture>
            </Grid>
            <DisplaySwitch job={job} />
          </Grid>
          <Grid
            item
            xs={12}
            align="center"
            sx={{ marginTop: { xs: "5px", sm: "5px" } }}
          >
            <Button
              variant="outlined"
              color="primary"
              disabled={job.isLocked}
              onClick={() => {
                openEditJob(job.jobID);
                updateEditJobTrigger((prev) => !prev);
              }}
              sx={{ height: "25px", width: "100px" }}
            >
              {job.isLocked ? "Locked" : "Edit"}
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor:
                job.jobType === jobTypes.manufacturing
                  ? "manufacturing.main"
                  : "reaction.main",
              marginTop: "10px",
            }}
          >
            <Typography align="center" variant="body2" color="black">
              {job.jobType === jobTypes.manufacturing ? (
                <b>Manufacturing Job</b>
              ) : (
                <b>Reaction Job</b>
              )}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
