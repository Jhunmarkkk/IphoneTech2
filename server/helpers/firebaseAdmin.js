const admin = require("firebase-admin");

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

module.exports = admin;
