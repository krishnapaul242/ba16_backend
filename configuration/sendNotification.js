const admin = require('firebase-admin');

var serviceAccount = require('./ana-ca1c7-firebase-adminsdk-cr3bz-d1052010c0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.notification = async ({title, body}) => await admin.messaging().send({
  data: { title, body },
  notification: {},
  android: {
    priority: 'high',
  },
  topic: 'admin',
  
}).then(function(response) {
  console.log("Successfully sent message:", response);
}).catch(function(error) {
  console.log("Error sending message:", error);
});

exports.notificationTo = async ({title, body, token}) => await admin.messaging().send({
  data: { title, body },
  notification: {},
  android: {
    priority: 'high',
  },
  token: token
}).then(function(response) {
console.log("Successfully sent message:", response);
}).catch(function(error) {
console.log("Error sending message:", error);
});