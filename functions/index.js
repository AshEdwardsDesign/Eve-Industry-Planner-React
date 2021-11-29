const functions = require("firebase-functions");
const admin = require("firebase-admin");
const appCheckVerification =
  require("./Middleware/appCheck").appCheckVerification;
const verifyEveToken = require("./Middleware/eveTokenVerify").verifyEveToken;

admin.initializeApp();

const express = require("express");
const app = express();
const cors = require("cors");
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://eve-industry-planner-dev.firebaseapp.com",
    ],
    methods: "GET,PUT,POST",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());
app.use(appCheckVerification);

//Routes

//Generates JWT AuthToken
app.post("/auth/gentoken", verifyEveToken, async (req, res) => {
  if (req.body.CharacterHash != null) {
    try {
      const authToken = await admin
        .auth()
        .createCustomToken(req.body.CharacterHash);
      return res.status(200).send({
        access_token: authToken,
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  } else {
    return res.status(400);
  }
});

//Read Full Single Item
app.get("/item/:itemID", (req, res) => {
  (async () => {
    try {
      const document = db.collection("items").doc(req.params.itemID);
      let product = await document.get();
      let response = product.data();

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Export the api to Firebase Cloud Functions
exports.api = functions.https.onRequest(app);
exports.user = require("./Triggered Functions/Users");
exports.firestore = require("./Triggered Functions/Firestore");
