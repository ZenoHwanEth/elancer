// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.UpdateRating = functions.firestore.document("Customer_booking/{docID}").onUpdate((change, context)=>{
  const newValue = change.after.data();
  const previousValue = change.before.data();

  const techID = newValue.techID;
  console.log(techID);

  var newrating = db.doc("Freelancer/"+techID)

  console.log(newrating);
  if(newValue.rating !== null && newValue.rating !== previousValue.rating){
    return db.doc("Freelancer/"+techID).get().then(doc=>{
                    const rating = doc.data().rating;
                    const newrating = (rating + newValue.rating)/2;

                    db.doc("Freelancer/"+techID).update({
                      rating: newrating,
                    })

                    return true;
                  }).catch(error=>{
                    console.error("Error writing document:", error);
                  })
  }
  return null;
})
