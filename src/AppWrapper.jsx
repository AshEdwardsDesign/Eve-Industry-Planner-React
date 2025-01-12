import {
  JobStatus,
  JobArray,
  ActiveJob,
  ApiJobs,
  ArchivedJobs,
  LinkedIDs,
} from "./Context/JobContext";
import {
  FirebaseListeners,
  IsLoggedIn,
  UserJobSnapshot,
  Users,
  UserWatchlist,
} from "./Context/AuthContext";
import {
  CorpEsiData,
  EveESIStatus,
  EveIDs,
  EvePrices,
  PersonalEsiData,
  SisiDataFiles,
} from "./Context/EveDataContext";
import {
  DataExchange,
  DialogData,
  SnackbarData,
  PageLoad,
  LoadingText,
  MultiSelectJobPlanner,
  RefreshState,
  PriceEntryList,
  MassBuildDisplay,
  JobPlannerPageTrigger,
} from "./Context/LayoutContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import App from "./App";

export function AppWrapper() {
  return (
    <FirebaseListeners>
      <SnackbarData>
        <DialogData>
          <PageLoad>
            <LoadingText>
              <RefreshState>
                <IsLoggedIn>
                  <Users>
                    <PersonalEsiData>
                      <CorpEsiData>
                        <LinkedIDs>
                          <UserJobSnapshot>
                            <UserWatchlist>
                              <DataExchange>
                                <JobPlannerPageTrigger>
                                  <ActiveJob>
                                    <JobArray>
                                      <JobStatus>
                                        <ApiJobs>
                                          <EveIDs>
                                            <EveESIStatus>
                                              <EvePrices>
                                                <MultiSelectJobPlanner>
                                                  <PriceEntryList>
                                                    <SisiDataFiles>
                                                      <MassBuildDisplay>
                                                        <ArchivedJobs>
                                                          <LocalizationProvider
                                                            dateAdapter={
                                                              AdapterDateFns
                                                            }
                                                          >
                                                            <App />
                                                          </LocalizationProvider>
                                                        </ArchivedJobs>
                                                      </MassBuildDisplay>
                                                    </SisiDataFiles>
                                                  </PriceEntryList>
                                                </MultiSelectJobPlanner>
                                              </EvePrices>
                                            </EveESIStatus>
                                          </EveIDs>
                                        </ApiJobs>
                                      </JobStatus>
                                    </JobArray>
                                  </ActiveJob>
                                </JobPlannerPageTrigger>
                              </DataExchange>
                            </UserWatchlist>
                          </UserJobSnapshot>
                        </LinkedIDs>
                      </CorpEsiData>
                    </PersonalEsiData>
                  </Users>
                </IsLoggedIn>
              </RefreshState>
            </LoadingText>
          </PageLoad>
        </DialogData>
      </SnackbarData>
    </FirebaseListeners>
  );
}
