const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.createUserData = functions
  .region("europe-west1")
  .https.onCall((data, context) => {
    if (context.app == undefined) {
      functions.logger.warn("Unverified function Call");
      functions.logger.warn(context);
      throw new functions.https.HttpsError(
        "Unable to verify",
        "The function must be called from a verified app."
      );
    }
    try {
      const setupData = {
        accountID: context.auth.uid,
        jobStatusArray: [
          {
            id: 0,
            name: "Planning",
            sortOrder: 0,
            expanded: true,
            openAPIJobs: false,
            completeAPIJobs: false,
          },
          {
            id: 1,
            name: "Purchasing",
            sortOrder: 1,
            expanded: true,
            openAPIJobs: false,
            completeAPIJobs: false,
          },
          {
            id: 2,
            name: "Building",
            sortOrder: 2,
            expanded: true,
            openAPIJobs: true,
            completeAPIJobs: false,
          },
          {
            id: 3,
            name: "Complete",
            sortOrder: 3,
            expanded: true,
            openAPIJobs: false,
            completeAPIJobs: true,
          },
          {
            id: 4,
            name: "For Sale",
            sortOrder: 4,
            expanded: true,
            openAPIJobs: false,
            completeAPIJobs: false,
          },
        ],
        deleted: null,
        linkedJobs: [],
        linkedTrans: [],
        linkedOrders: [],
        settings: {
          account: {
            cloudAccounts: false,
          },
          layout: {
            hideTutorials: false,
            localMarketDisplay: null,
            localOrderDisplay: null,
            esiJobTab: null,
          },
          editJob: {
            defaultMarket: "jita",
            defaultOrders: "sell",
            hideCompleteMaterials: false,
            defaultAssetLocation: 60003760,
            citadelBrokersFee: 1,
          },
          structures: {
            manufacturing: [],
            reaction: [],
          },
        },
        refreshTokens: [],
      };

      admin
        .firestore()
        .collection("Users")
        .doc(context.auth.uid)
        .set(setupData);
      admin
        .firestore()
        .doc(`Users/${context.auth.uid}/ProfileInfo/Watchlist`)
        .set({
          groups: [],
          items: [],
        });
      admin
        .firestore()
        .doc(`Users/${context.auth.uid}/ProfileInfo/JobSnapshot`)
        .set({
          snapshot: [],
        });
      admin
        .firestore()
        .doc(`Users/${context.auth.uid}/ProfileInfo/GroupData`)
        .set({
          groupData: [],
        });
      functions.logger.log(
        `Account ${context.auth.uid} document created successfully`
      );
      return setupData;
    } catch (err) {
      functions.logger.error(
        `Error When Creating User Account ${context.auth.uid}`
      );
      functions.logger.error(err);
      throw new functions.https.HttpsError(
        "Unable to setup account, please try again"
      );
    }
  });
