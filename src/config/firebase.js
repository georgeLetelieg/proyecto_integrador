const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.resolve('src/config/proyectointegrador-3cc91-firebase-adminsdk-fbsvc-712df6b8a0'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };