import React, { useContext, useEffect, useState } from "react";
import {
  JobArrayContext,
  JobStatusContext,
} from "../../Context/JobContext";
import {
  IsLoggedInContext,
  MainUserContext,
  UsersContext,
} from "../../Context/AuthContext";
import { EditJob } from "./Edit Job/EditJob";
import { PlannerAccordion } from "./Planner Components/accordion";
import { CircularProgress, Typography } from "@material-ui/core";
import { RefreshTokens } from "../Auth/RefreshToken";
import { firebaseAuth } from "../Auth/firebaseAuth";
import { useEveApi } from "../../Hooks/useEveApi";
import { useFirebase } from "../../Hooks/useFirebase";

export let blueprintVariables = {
  me: [
    { value: 0, label: 0 },
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
    { value: 6, label: 6 },
    { value: 7, label: 7 },
    { value: 8, label: 8 },
    { value: 9, label: 9 },
    { value: 10, label: 10 },
  ],
  te: [
    { value: 0, label: 0 },
    { value: 1, label: 2 },
    { value: 2, label: 4 },
    { value: 3, label: 6 },
    { value: 4, label: 8 },
    { value: 5, label: 10 },
    { value: 6, label: 12 },
    { value: 7, label: 14 },
    { value: 8, label: 16 },
    { value: 9, label: 18 },
    { value: 10, label: 20 },
  ],
  manStructure: [
    { value: "Medium", label: "Medium" },
    { value: "Large", label: "Large" },
    { value: "X-Large", label: "X-Large" },
  ],
  manRigs: [
    { value: 0, label: "None" },
    { value: 2.0, label: "Tech 1" },
    { value: 2.4, label: "Tech 2" },
  ],
  manSystem: [
    { value: 1, label: "High Sec" },
    { value: 1.9, label: "Low Sec" },
    { value: 2.1, label: "Null Sec / WH" },
  ],
  reactionSystem: [
    { value: 1, label: "Low Sec" },
    { value: 1.1, label: "Null Sec / WH" },
  ],
  reactionStructure: [
    { value: "Medium", label: "Medium" },
    { value: "Large", label: "Large" },
  ],
  reactionRigs: [
    { value: 0, label: "None" },
    { value: 2.0, label: "Tech 1" },
    { value: 2.4, label: "Tech 2" },
  ],
};

export let jobTypes = {
  baseMaterial: 0,
  manufacturing: 1,
  reaction: 2,
  pi: 3,
};

export function JobPlanner() {
  const [ jobSettingsTrigger, updateJobSettingsTrigger  ] = useState(false);
  const { updateJobArray } = useContext(JobArrayContext);
  const { setJobStatus } = useContext(JobStatusContext);
  const { updateUsers } = useContext(UsersContext);
  const { updateIsLoggedIn } = useContext(IsLoggedInContext);
  const { mainUser, updateMainUser } = useContext(MainUserContext);
  const { CharacterSkills, IndustryJobs, MarketOrders } = useEveApi();
  const { downloadCharacterData, downloadCharacterJobs } = useFirebase();
  const [pageload, updatePageload] = useState(true);
  const [loadingText, setLoadingText] = useState("");

  useEffect(async () => {
    const rToken = localStorage.getItem("Auth");
    if (
      mainUser.aTokenEXP <= Math.floor(Date.now() / 1000) ||
      mainUser.aTokenEXP == null
    ) {
      if (rToken != null) {
        setLoadingText("Logging Into Eve SSO");
        const refreshedUser = await RefreshTokens(rToken);
        refreshedUser.fbToken = await firebaseAuth(refreshedUser);
        setLoadingText("Loading API Data");
        refreshedUser.apiSkills = await CharacterSkills(refreshedUser);
        refreshedUser.apiJobs = await IndustryJobs(refreshedUser);
        refreshedUser.apiOrders = await MarketOrders(refreshedUser);
        refreshedUser.ParentUser = true;
        setLoadingText("Building Character Object");
        const charSettings = await downloadCharacterData(refreshedUser);
        refreshedUser.accountID = charSettings.accountID;
        const charJobs = await downloadCharacterJobs(refreshedUser);

        setJobStatus(charSettings.jobStatusArray);
        updateJobArray(charJobs);
        const newUsersArray = [];
        newUsersArray.push(refreshedUser);
        updateUsers(newUsersArray);
        updateIsLoggedIn(true);
        updateMainUser(refreshedUser);
        updatePageload(false);
      } else {
        updateIsLoggedIn(false);
        updatePageload(false);
      }
    } else {
      updatePageload(false);
    }
  }, []);

  if (pageload) {
    return (
      <>
        {pageload && <CircularProgress color="primary" />}
        <Typography variant="body2">{loadingText}</Typography>
      </>
    );
  } else {
    if (jobSettingsTrigger) {
      return <EditJob updateJobSettingsTrigger={updateJobSettingsTrigger} />;
    } else {
      return <PlannerAccordion updateJobSettingsTrigger={updateJobSettingsTrigger}  />;
    }
  }
}
