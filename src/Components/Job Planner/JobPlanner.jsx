import {
  lazy,
  useContext,
  useEffect,
  useState,
  Suspense,
  useMemo,
} from "react";
import { IsLoggedInContext, UsersContext } from "../../Context/AuthContext";
import { PlannerAccordion } from "./Planner Components/accordion";
import { useRefreshUser } from "../../Hooks/useRefreshUser";
import { PageLoadContext } from "../../Context/LayoutContext";
import { LoadingPage } from "../loadingPage";
import { SearchBar } from "./Planner Components/searchbar";
import { Grid } from "@mui/material";
import { TutorialPlanner } from "./Planner Components/tutorialPlanner";
import { ShoppingListDialog } from "./Dialogues/ShoppingList/ShoppingList";
import { PriceEntryDialog } from "./Dialogues/PriceEntry/PriceEntryList";
import { MassBuildFeedback } from "./Planner Components/massBuildInfo";

const EditJob = lazy(() => import("./Edit Job/EditJob"));

export let blueprintVariables = {
  me: [
    { value: 0, label: "0" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
  ],
  te: [
    { value: 0, label: "0" },
    { value: 1, label: "2" },
    { value: 2, label: "4" },
    { value: 3, label: "6" },
    { value: 4, label: "8" },
    { value: 5, label: "10" },
    { value: 6, label: "12" },
    { value: 7, label: "14" },
    { value: 8, label: "16" },
    { value: 9, label: "18" },
    { value: 10, label: "20" },
  ],
  manStructure: [
    { value: "Station", label: "Station", time: 0 },
    { value: "Medium", label: "Medium", time: 0.15 },
    { value: "Large", label: "Large", time:0.20 },
    { value: "X-Large", label: "X-Large", time:0.30 },
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
    { value: "Medium", label: "Medium", time: 0 },
    { value: "Large", label: "Large", time: 0.25 },
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
  const [jobSettingsTrigger, updateJobSettingsTrigger] = useState(false);
  const { isLoggedIn } = useContext(IsLoggedInContext);
  const { users, updateUsers } = useContext(UsersContext);
  const { RefreshUserAToken, reloadMainUser } = useRefreshUser();
  const { pageLoad, updatePageLoad } = useContext(PageLoadContext);

  let parentUser = useMemo(() => {
    return users.find((u) => u.ParentUser);
  }, [users, isLoggedIn]);

  useEffect(async () => {
    if (isLoggedIn) {
      if (parentUser.aTokenEXP <= Math.floor(Date.now() / 1000)) {
        let newUsersArray = users;
        const index = newUsersArray.findIndex((i) => i.ParentUser === true);
        let newParentUser = await RefreshUserAToken(parentUser);
        newUsersArray[index] = newParentUser;
        updateUsers(newUsersArray);
      }
      updatePageLoad(false);
    } else {
      if (localStorage.getItem("Auth") == null) {
        updatePageLoad(false);
      } else {
        reloadMainUser(localStorage.getItem("Auth"));
      }
    }
  }, []);

  if (pageLoad) {
    return <LoadingPage />;
  } else {
    if (jobSettingsTrigger) {
      return (
        <Suspense fallback={<LoadingPage />}>
          <ShoppingListDialog />
          <MassBuildFeedback />
          <EditJob updateJobSettingsTrigger={updateJobSettingsTrigger} />
        </Suspense>
      );
    } else {
      return (
        <Grid container sx={{ marginTop: "5px" }} spacing={2}>
          <ShoppingListDialog />

          <MassBuildFeedback />
          <PriceEntryDialog />
          {!parentUser.settings.layout.hideTutorials && (
            <Grid item xs={12}>
              <TutorialPlanner />
            </Grid>
          )}
          <Grid item xs={12}>
            <SearchBar />
          </Grid>
          <Grid item xs={12}>
            <PlannerAccordion
              updateJobSettingsTrigger={updateJobSettingsTrigger}
            />
          </Grid>
        </Grid>
      );
    }
  }
}
