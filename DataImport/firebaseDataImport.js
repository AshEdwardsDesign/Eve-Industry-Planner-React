const data = require("./firebaseUpload.json");

var admin = require("firebase-admin");

var serviceAccount = require("./cred.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://eve-industry-planner-dev-default-rtdb.europe-west1.firebasedatabase.app"
});

admin.firestore().settings({
  ignoreUndefinedProperties: true,
})

console.log(`Uploading ${data.length} items`)

data.forEach((item) => {
  admin.firestore().doc(`Items/${item.itemID}`).set({
    basePrice: item.basePrice || 0,
    groupID: item.groupID,
    name: item.name,
    portionSize: item.portionSize,
    published: item.published,
    volume: item.volume,
    activities: item.activities || null,
    blueprintTypeID: item.blueprintTypeID,
    maxProductionLimit: item.maxProductionLimit,
    itemID: item.itemID,
    jobType: item.jobType,
  });
});

console.log("Complete")