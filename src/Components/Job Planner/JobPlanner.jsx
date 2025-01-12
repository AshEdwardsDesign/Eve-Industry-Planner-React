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
import {
  JobPlannerPageTriggerContext,
  PageLoadContext,
} from "../../Context/LayoutContext";
import { LoadingPage } from "../loadingPage";
import { SearchBar } from "./Planner Components/searchbar";
import { Grid } from "@mui/material";
import { TutorialPlanner } from "./Planner Components/tutorialPlanner";
import { ShoppingListDialog } from "./Dialogues/ShoppingList/ShoppingList";
import { PriceEntryDialog } from "./Dialogues/PriceEntry/PriceEntryList";
import { MassBuildFeedback } from "./Planner Components/massBuildInfo";
import { ESIOffline } from "../offlineNotification";
import {
  defaultEsiAssets,
  defaultEsiBlueprints,
  defaultEsiHistOrders,
  defaultEsiJobs,
  defaultEsiJournal,
  defaultEsiOrders,
  defaultEsiSkills,
  defaultEsiStandings,
  defaultEsiTransactions,
} from "../../Context/defaultValues";

const EditJob = lazy(() => import("./Edit Job/EditJob"));
const EditGroup = lazy(() => import("./Groups/GroupPage"));

export function JobPlanner() {
  const {
    editJobTrigger,
    editGroupTrigger,
    updateEditJobTrigger,
    updateEditGroupTrigger,
  } = useContext(JobPlannerPageTriggerContext);
  const { isLoggedIn } = useContext(IsLoggedInContext);
  const [shoppingListTrigger, updateShoppingListTrigger] = useState(false);
  const [shoppingListData, updateShoppingListData] = useState([]);
  const { users } = useContext(UsersContext);
  const { checkUserState } = useRefreshUser();
  const { pageLoad } = useContext(PageLoadContext);

  let parentUser = useMemo(() => {
    return users.find((u) => u.ParentUser);
  }, [users]);

  useEffect(() => {
    checkUserState();
  }, []);

  if (pageLoad) {
    return <LoadingPage />;
  } else {
    if (editJobTrigger) {
      return (
        <Suspense fallback={<LoadingPage />}>
          <ShoppingListDialog
            shoppingListTrigger={shoppingListTrigger}
            updateShoppingListTrigger={updateShoppingListTrigger}
            shoppingListData={shoppingListData}
            updateShoppingListData={updateShoppingListData}
          />
          <MassBuildFeedback />
          <EditJob
            updateEditJobTrigger={updateEditJobTrigger}
            updateShoppingListTrigger={updateShoppingListTrigger}
            updateShoppingListData={updateShoppingListData}
          />
        </Suspense>
      );
    }
    if (!editJobTrigger && editGroupTrigger) {
      return (
        <Suspense fallback={<LoadingPage />}>
          <EditGroup updateEditGroupTrigger={updateEditGroupTrigger} />
        </Suspense>
      );
    }
    if (!editJobTrigger && !editGroupTrigger) {
      return (
        <Grid container sx={{ marginTop: "5px" }} spacing={2}>
          <ShoppingListDialog
            shoppingListTrigger={shoppingListTrigger}
            updateShoppingListTrigger={updateShoppingListTrigger}
            shoppingListData={shoppingListData}
            updateShoppingListData={updateShoppingListData}
          />

          <MassBuildFeedback />
          <PriceEntryDialog />

          <ESIOffline />
          <TutorialPlanner />
          <Grid item xs={12}>
            <SearchBar
              updateShoppingListTrigger={updateShoppingListTrigger}
              updateShoppingListData={updateShoppingListData}
            />
          </Grid>
          <Grid item xs={12}>
            <PlannerAccordion updateEditJobTrigger={updateEditJobTrigger} />
          </Grid>
        </Grid>
      );
    }
  }
}
