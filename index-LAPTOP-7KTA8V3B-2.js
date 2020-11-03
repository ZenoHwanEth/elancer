var name, email, address, contact, uid;
var user = firebase.auth().currentUser;
var db = firebase.firestore();
var available = [];

var currAddress;
var currContact;
var currEmail;
var currName;
var accType;

var currfAddress;
var currfContact;
var currfEmail;
var currfName;

var currBalance;
var payment;
var docID;
var freeID;
var freeBalance;

var dropdown = document.getElementsByClassName("dropdown-btn");
  var i;
  for (i = 0; i < dropdown.length; i++) {

    dropdown[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var dropdownContent = this.nextElementSibling;
      if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
        } else {
        dropdownContent.style.display = "block";
      }
    });
  }

function setPageSession_main(username, acctype)
{
    var page_session = {username: username, acctype: acctype}
    sessionStorage.setItem("page_session",JSON.stringify(page_session));
}

function getPageSession_main()
{
    var page_session= sessionStorage.getItem("page_session");
    if(page_session)
        page_session = JSON.parse(page_session);
   // console.log(page_session);
    return page_session;
}

/*====customerPage.html === after sign in, redirect to profile page, customise profile=============*/
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var firebaseRef = firebase.database().ref().child("User").child(user.uid);
    console.log(user.uid);
    //========================================================================================
    // User is signed in.
    if(window.location.href.includes('customerPage.html'))
    {
      if (user != null) {
        //uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
        //var firebaseRef = firebase.database().ref().child("User").child(uid);
        var docRef = db.collection("Customer").doc(firebase.auth().currentUser.uid);
        docRef.get().then(function(doc) {
            if (doc.exists) {
              var data = doc.data();
              currAddress = data.address;
              currContact = data.contact;
              currEmail = data.email;
              currName = data.username;
              money = data.balance;
              document.getElementById('username').innerHTML = currName;
              document.getElementById('username2').innerHTML = currName;
              document.getElementById('email').innerHTML = currEmail;
              document.getElementById('address').innerHTML = currAddress;
              document.getElementById('contact').innerHTML = currContact;
              document.getElementById('balance').innerHTML = "Balance : RM " + money.toFixed(2);
              printBooking("Done");
              printBooking("Accepted");
              printBooking("Pending");
              printBooking("Waiting for Payment");
              printBooking("Rejected");
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      }
    }
    else if(window.location.href.includes('main.html'))
    {
      if (user != null) {
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use

        var docRef = db.collection("Customer").doc(uid).get().then(function(doc){
          if(doc.exists){
            accType = "customer";
            currName = doc.data().username;
            document.getElementById("loginBtn").style.display = "none";
            document.getElementById("RegisterBtn").style.display = "none";
            document.getElementById('userLoggedIn').style.display = "block";
            document.getElementById('userLoggedIn').style.width = "300px";
            document.getElementById('userLoggedIn').innerHTML = "Welcome, "+ currName + " !";
        }
      });

        var docRef = db.collection("Freelancer").doc(uid).get().then(function(doc){
          if(doc.exists){
            accType = "freelancer";
            currName = doc.data().username;
            document.getElementById("loginBtn").style.display = "none";
            document.getElementById("RegisterBtn").style.display = "none";
            document.getElementById('userLoggedIn').style.display = "block";
            document.getElementById('userLoggedIn').style.width = "300px";
            document.getElementById('userLoggedIn').innerHTML = "Welcome, "+ currName + " !";
        }});

      }
    }
    else if(window.location.href.includes('freelancerPage.html'))
    {
      if (user != null) {
        var docRef = db.collection("Freelancer").doc(firebase.auth().currentUser.uid);
        docRef.get().then(function(doc) {
            if (doc.exists) {
              var data = doc.data();
              currAddress = data.address;
              currContact = data.contact;
              currEmail = data.email;
              currName = data.username;
              money = data.balance;
              document.getElementById('username').innerHTML = currName;
              document.getElementById('username2').innerHTML = currName;
              document.getElementById('email').innerHTML = currEmail;
              document.getElementById('address').innerHTML = currAddress;
              document.getElementById('contact').innerHTML = currContact;
              document.getElementById('balance').innerHTML = "Balance : RM " + money.toFixed(2);
              displayService();
	      displayReview();
	      displayJob("Pending");
              displayJob("Accepted");
              displayJob("Completed");

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      }
    }
    else if(window.location.href.includes('registerjob.html'))
    {
      if (user != null) {
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
        db.collection("Freelancer").doc(uid).get().then(function(doc){
          if(doc.exists){
            var data = doc.data();
            currAddress = data.address;
            currContact = data.contact;
            currEmail = data.email;
            currName = data.username;
          }else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
        });
      }
    }
    else if(window.location.href.includes('makePayment.html')) {
      var url_string = window.location.href; //window.location.href
      var url = new URL(url_string);
      docID = url.searchParams.get("docID");
      accType = "customer";
      var docRef = db.collection("Customer_booking").doc(docID).get();
      docRef.then(function(doc){
          var data = doc.data();
          document.getElementById("bookingTime").innerHTML = data.bookingDate.toDate();
          document.getElementById("serviceTime").innerHTML = data.serviceDate;
          document.getElementById("description").innerHTML = data.description;
          freeID = data.techID;
          db.collection("Freelancer").doc(data.techID).get().then(function(doc2){
            document.getElementById("freelancer").innerHTML = doc2.data().username;
            freeBalance = doc2.data().balance.toFixed(2);
          });
          db.collection("Customer").doc(data.userID).get().then(function(doc3){
            document.getElementById("customer").innerHTML = doc3.data().username;
            document.getElementById("balance").innerHTML =  "RM " + doc3.data().balance.toFixed(2);
            currBalance = doc3.data().balance.toFixed(2);
          });
          payment = data.fees.toFixed(2);
          document.getElementById("fees").innerHTML = "RM "+ data.fees.toFixed(2);
      });
    }
    else if(window.location.href.includes('freelancerProfile.html'))
    {
      if (user != null) {
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
        var docRef = db.collection("Customer").doc(uid).get();
        docRef.then(function(doc){
          if(doc.exists){
              var data = doc.data();
              accType = "customer";
              currName = data.username;
              document.getElementById('userLoggedIn').innerHTML = "Welcome, "+ currName + " !";
              //document.getElementById('userLoggedIn').onclick = goProfile("customer");
              document.getElementById('userLoggedIn').disabled = false;
          }
        });
        db.collection("Freelancer").doc(uid).get().then(function(doc){
          if(doc.exists){
              var data = doc.data();
              accType = "freelancer";
              currName = data.username;
              document.getElementById('userLoggedIn').innerHTML = "Welcome, "+ currName + " !";
              //document.getElementById('userLoggedIn').onclick = goProfile("freelancer");
              document.getElementById('userLoggedIn').disabled = false;
          }
        });

        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("RegisterBtn").style.display = "none";
        document.getElementById('userLoggedIn').style.display = "block";
        document.getElementById('userLoggedIn').style.width = "300px";
      }
    }
  } else {
    // No user is signed in.
  }
});

function viewFreelancerProfile(freelancerUID){
  localStorage.setItem("freelancerID",freelancerUID);
}

function profileClick()
{
  document.getElementById("profilePage").style.display = "block";
  document.getElementById("profile").style.background = "#95a0ad";
  document.getElementById("bookingPage_main").style.display = "none";
  document.getElementById("booking").style.background = "#e9effb";
  document.getElementById("historyPage").style.display = "none";
  document.getElementById("history").style.background = "#e9effb";
  document.getElementById("favoritePage").style.display = "none";
  document.getElementById("favorite").style.background = "#e9effb";
  document.getElementById("title").innerHTML = "My Profile";
}

function bookingClick()
{
  document.getElementById("profilePage").style.display = "none";
  document.getElementById("profile").style.background = "#e9effb";
  document.getElementById("bookingPage_main").style.display = "block";
  document.getElementById("booking").style.background = "#95a0ad";
  document.getElementById("historyPage").style.display = "none";
  document.getElementById("history").style.background = "#e9effb";
  document.getElementById("favoritePage").style.display = "none";
  document.getElementById("favorite").style.background = "#e9effb";
  document.getElementById("title").innerHTML = "My Booking";
}

function historyClick()
{
  document.getElementById("profilePage").style.display = "none";
  document.getElementById("profile").style.background = "#e9effb";
  document.getElementById("bookingPage_main").style.display = "none";
  document.getElementById("booking").style.background = "#e9effb";
  document.getElementById("historyPage").style.display = "block";
  document.getElementById("history").style.background = "#95a0ad";
  document.getElementById("favoritePage").style.display = "none";
  document.getElementById("favorite").style.background = "#e9effb";
  document.getElementById("title").innerHTML = "My History";
}

function favoriteClick()
{
  document.getElementById("profilePage").style.display = "none";
  document.getElementById("profile").style.background = "#e9effb";
  document.getElementById("bookingPage_main").style.display = "none";
  document.getElementById("booking").style.background = "#e9effb";
  document.getElementById("historyPage").style.display = "none";
  document.getElementById("history").style.background = "#e9effb";
  document.getElementById("favoritePage").style.display = "block";
  document.getElementById("favorite").style.background = "#95a0ad";
  document.getElementById("title").innerHTML = "My Ongoing Booking";
}

function homeClick()
{
  firebase.auth().onAuthStateChanged(function(user) {

    // User is signed in.
    window.location.href = "main.html";
    uid = firebase.auth().currentUser;

});

}
function searchClick()
{

  firebase.auth().onAuthStateChanged(function(user) {

      // User is signed in.
      window.location.href = "search.html";
      uid = firebase.auth().currentUser;

  });

}
function RegisterJobclick()
{

  firebase.auth().onAuthStateChanged(function(user) {

      // User is signed in.
      window.location.href = "registerjob.html";
      uid = firebase.auth().currentUser;

  });
}

/* ====freelancerPage.html=========================Freelancer Page=======================================*/

function editClick(){
  document.getElementById("editbtn").disabled = true;
  document.getElementById("savebtn").disabled = false;
  var editElement = document.getElementsByClassName("editfield");

  for(i=0;i<editElement.length;i++)
  {
    editElement[i].style.display = "block";
  }

  editElement[0].value = currAddress;
  editElement[1].value = currContact;
}

function saveClick(){
  document.getElementById("editbtn").disabled = false;
  document.getElementById("savebtn").disabled = true;
  var editElement = document.getElementsByClassName("editfield");

  var newAddress = editElement[0].value;
  var newContact = editElement[1].value;

  /*var ref = firebase.database().ref().child("User");
  var uid = firebase.auth().currentUser.uid;
  ref.child(uid).set({
    email: currfEmail,
    username: currfName,
    type: 'freelancer',
    contact: newContact,
    address: newAddress,
  });*/

   db.collection("Freelancer").doc(firebase.auth().currentUser.uid).update({
      contact: newContact,
      address: newAddress,
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

  for(i=0;i<editElement.length;i++)
  {
    editElement[i].style.display = "none";
  }
}

function saveDescription(descp)
{
  db.collection("Freelancer").doc(firebase.auth().currentUser.uid).update({
      description:descp,
    }).then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
}

function profClick()
{
  document.getElementById("profile").style.display = "block";
  document.getElementById("profilePage").style.background = "#AARRGGBB";
  document.getElementById("review").style.display = "none";
  document.getElementById("reviewPage").style.background = "#e9effb";
  document.getElementById("my_service").style.display = "none";
  document.getElementById("servicePage").style.background = "#e9effb";
  document.getElementById("time_available").style.display = "none";
  document.getElementById("bookPage").style.background = "#e9effb";
  document.getElementById("schedule").style.display = "none";
  document.getElementById("schedulePage").style.background = "#e9effb";
  document.getElementById("hist").style.display = "none";
  document.getElementById("histPage").style.background = "#e9effb";
  document.getElementById("main_title").innerHTML = "My Profile";
}

function bookClick()
{
  document.getElementById("profile").style.display = "none";
  document.getElementById("profilePage").style.background = "#e9effb";
  document.getElementById("review").style.display = "none";
  document.getElementById("reviewPage").style.background = "#e9effb";
  document.getElementById("my_service").style.display = "none";
  document.getElementById("servicePage").style.background = "#e9effb";
  document.getElementById("time_available").style.display = "block";
  document.getElementById("schedule").style.display = "none";
  document.getElementById("hist").style.display = "none";
  document.getElementById("main_title").innerHTML = "My Available Job";
}

function scheduleClick()
{
  document.getElementById("profile").style.display = "none";
  document.getElementById("profilePage").style.background = "#e9effb";
  document.getElementById("review").style.display = "none";
  document.getElementById("reviewPage").style.background = "#e9effb";
  document.getElementById("my_service").style.display = "none";
  document.getElementById("servicePage").style.background = "#e9effb";
  document.getElementById("schedule").style.display = "block";
  document.getElementById("time_available").style.display = "none";
  document.getElementById("hist").style.display = "none";
  document.getElementById("main_title").innerHTML = "My Schedule";
}

function histClick()
{
  document.getElementById("profile").style.display = "none";
  document.getElementById("profilePage").style.background = "#e9effb";
  document.getElementById("review").style.display = "none";
  document.getElementById("reviewPage").style.background = "#e9effb";
  document.getElementById("my_service").style.display = "none";
  document.getElementById("servicePage").style.background = "#e9effb";
  document.getElementById("schedule").style.display = "none";
  document.getElementById("hist").style.display = "block";
  document.getElementById("time_available").style.display = "none";
  document.getElementById("main_title").innerHTML = "My Job History";
}

function serviceClick()
{
  document.getElementById("profile").style.display = "none";
  document.getElementById("profilePage").style.background = "#e9effb";
  document.getElementById("review").style.display = "none";
  document.getElementById("reviewPage").style.background = "#e9effb";
  document.getElementById("my_service").style.display = "block";
  document.getElementById("servicePage").style.background = "#AARRGGBB";
  document.getElementById("time_available").style.display = "none";
  document.getElementById("bookPage").style.background = "#e9effb";
  document.getElementById("schedule").style.display = "none";
  document.getElementById("schedulePage").style.background = "#e9effb";
  document.getElementById("hist").style.display = "none";
  document.getElementById("histPage").style.background = "#e9effb";
  document.getElementById("main_title").innerHTML = "My Service";
}

function reviewClick()
{
  document.getElementById("profile").style.display = "none";
  document.getElementById("profilePage").style.background = "#e9effb";
  document.getElementById("review").style.display = "block";
  document.getElementById("reviewPage").style.background = "#AARRGGBB";
  document.getElementById("my_service").style.display = "none";
  document.getElementById("servicePage").style.background = "#e9effb";
  document.getElementById("time_available").style.display = "none";
  document.getElementById("bookPage").style.background = "#e9effb";
  document.getElementById("schedule").style.display = "none";
  document.getElementById("schedulePage").style.background = "#e9effb";
  document.getElementById("hist").style.display = "none";
  document.getElementById("histPage").style.background = "#e9effb";
  document.getElementById("main_title").innerHTML = "My Review";
}


function displayReview(){
  var reviewList = document.getElementById("review");

  db.collection("Customer_booking").where("techID", "==", techID).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var data = doc.data();

      var module = document.createElement("div");
      module.classList.add("container");

      var box = document.createElement("div");
      box.style.position = "static";

      var customer = document.createElement("p");
      db.collection("Customer").doc(data.userID).get().then(function(doc) {
        customer.innerHTML = doc.data().username;
        customer.style.fontWeight = "bold"
      });

      var detail = document.createElement("div");
      detail.style.width = "100%";
      box.appendChild(customer);
      module.appendChild(box);

      var line = document.createElement("HR");
      detail.appendChild(line);
      detail.style.display = "inline-block";

      var description = document.createElement("p")
      description.innerHTML = "Review : " + data.review;
      detail.appendChild(description);

      module.appendChild(detail);
      reviewList.appendChild(module);
    });
  });
}

function displayJob(status){
  var view_container;
  if(status == "Pending"){
    view_container = document.getElementById("time_available");

  }
  else if(status == "Accepted"){
      view_container = document.getElementById("schedule");
  }
  else if(status == "Completed"){
    view_container = document.getElementById("hist");
  }
  var sent= document.createElement("h3");
  //sent.innerHTML = "Schedule";

  db.collection("job_applied").where("JobOwner", "==", firebase.auth().currentUser.uid).where("status", "==", status).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) =>{
      var data = doc.data();
      var module = document.createElement("div");
      module.classList.add("container");
      var box = document.createElement("div");
      box.style.position = "static";
      var title = document.createElement("h3");
      title.style.display = "inline";
      var subtitle = document.createElement("h4");
      box.appendChild(title);
      box.appendChild(subtitle);
      db.collection("Service_listed").where(firebase.firestore.FieldPath.documentId(), '==', data.Jobid).get().then((querySnapshot) => {
        querySnapshot.forEach((Doc) => {
          var dataC = Doc.data();
          title.innerHTML = dataC.Categories;
          subtitle.innerHTML = dataC.Jobtitle;
        });
      });
      var detail = document.createElement("div");
      var button = document.createElement("BUTTON");
      //box.appendChild(button);
      button.innerHTML = "View Detail";
      button.classList.add("main_button");
      button.style.float = "right";

      if(data.status=="Pending"){
        var accept = document.createElement("BUTTON");
        var reject = document.createElement("BUTTON");
        accept.innerHTML = "Accept";
        reject.innerHTML = "Reject";
        accept.classList.add("main_button");
        reject.classList.add("main_button");
        accept.style.display = "none";
        reject.style.display = "none";
        accept.style.float = "right";
        reject.style.float = "right";
        button.onclick = function(){
          if(button.innerHTML == "View Detail"){
            detail.style.display = "block";
            accept.style.display = "block";
            reject.style.display = "block";
            accept.onclick = function(){
              db.collection("job_applied").doc(doc.id).update({status: "Accepted"});
              console.log(doc.id);
              db.collection("Customer_booking").where("jobApplyID", "==", doc.id).get().then((querySnapshot) => {
                querySnapshot.forEach((Doc) => {
                  var docID = Doc.id;
                  db.collection("Customer_booking").doc(docID).update({
                    status : "Accepted",
                  })
                  .catch(function(error) {
                    console.log("Error getting documents: ", error);
                  });
                })
              }).catch(function(error) {
                console.log("Error getting documents: ", error);
              });
              console.log("Status is updated!");
              accept.disabled = true;
              reject.disabled = true;
              alert("Job is accepted!!!");
            }
            reject.onclick = function(){
              db.collection("job_applied").doc(doc.id).update({status: "Rejected"});
              console.log("Status is updated!");
              accept.disabled = true;
              reject.disabled = true;
              alert("Job is rejected!!!");

              db.collection("Customer_booking").where("jobApplyID", "==", doc.id).get().then((querySnapshot) => {
                querySnapshot.forEach((Doc) => {
                  var docID = Doc.id;
                  db.collection("Customer_booking").doc(docID).update({
                    status : "Rejected",
                  })
                  .catch(function(error) {
                    console.log("Error getting documents: ", error);
                  });
                })
              }).catch(function(error) {
                console.log("Error getting documents: ", error);
              });
            }
            button.innerHTML = "Close";
          }
          else if(button.innerHTML == "Close"){
            detail.style.display = "none"
            accept.style.display = "none";
            reject.style.display = "none";
            button.innerHTML = "View Detail";
          }
        }
        box.appendChild(accept);
        box.appendChild(reject);
      }
      else if(data.status=="Accepted"){
        var done = document.createElement("BUTTON");
        done.innerHTML = "Done";
        done.classList.add("main_button");
        done.style.display = "none";
        done.style.float = "right";
        button.onclick = function(){
          if(button.innerHTML == "View Detail"){
            detail.style.display = "block";
            done.style.display = "block";
            done.onclick = function(){
            db.collection("job_applied").doc(doc.id).update({status: "Completed"});
            db.collection("Customer_booking").where("jobApplyID", "==", doc.id).get().then((querySnapshot) => {
              querySnapshot.forEach((Doc) => {
                var docID = Doc.id;
                if(Doc.data().paid == false){
                  db.collection("Customer_booking").doc(docID).update({
                    status : "Waiting for Payment",
                  })
                  .catch(function(error) {
                    console.log("Error getting documents: ", error);
                  });
                }
                else{
                  db.collection("Customer_booking").doc(docID).update({
                    status : "Done",
                  })
                  .catch(function(error) {
                    console.log("Error getting documents: ", error);
                  });
                }
              })
            }).catch(function(error) {
              console.log("Error getting documents: ", error);
            });
            console.log("Status is updated!");
            alert("Job is completed!!!");
            done.disabled = true;
            }
            button.innerHTML = "Close";
          }
          else if(button.innerHTML == "Close"){
            detail.style.display = "none"
            done.style.display = "none";
            button.innerHTML = "View Detail";
          }
        }
        box.appendChild(done);
      }
      else if(data.status == "Completed"){
        db.collection("job_applied").doc(doc.id).get().then(function(doc){
          var paid = document.createElement("p");
          if(doc.data().paid==false){
            paid.innerHTML = "Waiting for payment";
            paid.style.color = "red";
            paid.style.fontWeight = "bold";
          }else {
            paid.innerHTML = "Paid";
            paid.style.color = "blue";
            paid.style.fontWeight = "bold";
          }
          detail.appendChild(paid);
        })
        button.onclick = function(){
          if(button.innerHTML == "View Detail"){
            detail.style.display = "block";
            button.innerHTML = "Close";
          }
          else if(button.innerHTML == "Close"){
            detail.style.display = "none"
            button.innerHTML = "View Detail";
          }
        }
      }

      box.appendChild(button);
      module.appendChild(box);
      var line = document.createElement("HR");
      detail.appendChild(line);
      detail.style.display = "inline-block";
      var date1 = document.createElement("p");
      date1.style.display = "inline";
      date1.innerHTML = data.date + "\t";
      var time = document.createElement("p");
      time.style.display = "inline";
      time.innerHTML = data.time;
      var address = document.createElement("p");
      var name = document.createElement("p");
      db.collection("Customer").where(firebase.firestore.FieldPath.documentId(), '==', data.Applicant).get().then((querySnapshot) => {
        querySnapshot.forEach((Doc) => {
          var dataC = Doc.data();
          address.innerHTML = "Address: " + dataC.address;
          name.innerHTML = "Username: " + dataC.username;
        });
      });
      var fees = document.createElement("p");
      fees.innerHTML = "Service fee: " + data.fee;
      detail.appendChild(date1);
      detail.appendChild(time);
      detail.appendChild(name);
      detail.appendChild(address);
      detail.appendChild(fees);
      detail.style.display = "none";
      module.appendChild(detail);
      view_container.appendChild(module);
    });
  });
}

function displayService(){
  var view_container = document.getElementById("my_service");

  db.collection("Service_listed").where("Ownerid", "==", firebase.auth().currentUser.uid).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var data = doc.data();

      var module = document.createElement("div");
      module.classList.add("container");

      var box = document.createElement("div");
      box.style.position = "static";

      var cat = document.createElement("h3");
      cat.innerHTML = data.Categories;

      var job_title = document.createElement("h4");
      job_title.innerHTML = data.Jobtitle;

      var detail = document.createElement("div");

      var open = document.createElement("button");
      open.innerHTML = "View Detail";
      open.classList.add("main_button");
      open.style.float = "right";
      open.onclick = function(){
        if(open.innerHTML == "View Detail"){
          //windows.alert("click");
          detail.style.display = "block";
          open.innerHTML = "Close";
        }
        else if(open.innerHTML == "Close"){
          //windows.alert("click");
          detail.style.display = "none"
          open.innerHTML = "View Detail";
        }
      }
      box.appendChild(cat);
      box.appendChild(job_title);
      box.appendChild(open);
      module.appendChild(box);

      var line = document.createElement("HR");
      detail.appendChild(line);
      detail.style.display = "inline-block";

      var description = document.createElement("p")
      description.innerHTML = "Description : " + data.Description;
      detail.appendChild(description);

      var location = document.createElement("p");
      location.innerHTML = "Location : " + data.Location;
      detail.appendChild(location);

      var price = document.createElement("p");
      price.innerHTML = "Price : " + data.Price;
      detail.appendChild(price);

      detail.style.display = "none";
      module.appendChild(detail);
      view_container.appendChild(module);
    });
});
 }

/*== main.html ============== main page for user to register and login=========================*/
function customer()
{
  var cust= document.getElementById("Customer");
  var freelancer= document.getElementById("Freelancer");
  var custlogin= document.getElementById("customerLogin");
  if(cust.style.display == "none"){
    document.getElementById("Customer").style.display = "block";
  }
  else {
    document.getElementById("Customer").style.display = "none";
  }

  if(freelancer.style.display == "block"){
    document.getElementById("Freelancer").style.display = "none";
  }

}

function freelancer()
{
  var free = document.getElementById("Freelancer");
  var cust= document.getElementById("Customer");
  if(free.style.display == "none"){
    document.getElementById("Freelancer").style.display = "block";
  }
  else {
    document.getElementById("Freelancer").style.display = "none";
  }

  if(cust.style.display == "block"){
    document.getElementById("Customer").style.display = "none";
  }
}

function RegCust()
{
  window.location.href = "register.html";
}

function RegFree()
{
  window.location.href = "register2.html";
}

//return to main page
function cancelReg(){
  window.location.href = "main.html";
}

//login function======================================================================================
function cusLogin()
{
  var email = document.getElementById("exCusEmail").value;
  var password = document.getElementById("exCusPassword").value;

  var docRef = db.collection("Customer").where("email", "==", email).limit(1).get();

  docRef.then(function(doc){
    if(!doc.empty){
      docRef.then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            var data = doc.data();
            currName = data.username;
            accType = "customer";
          });
        });
      // Sign in with email and pass.
      // [START authwithemail]
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          // [END_EXCLUDE]
        });
      // [END authwithemail]
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function() {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return firebase.auth().signInWithEmailAndPassword(email, password);
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
      });

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          setPageSession_main(currName, accType);
          window.location.href = "customerPage.html";
          uid = firebase.auth().currentUser;
        } else {
          // No user is signed in.
        }
      });
    }
    else{
      window.alert("This email is not registered as Customer.");
    }
  });
}

function freeLogin()
{
  email = document.getElementById("fEmail").value;
  password = document.getElementById("fpassword").value;

  var docRef = db.collection("Freelancer").where("email", "==", email).limit(1).get();

  docRef.then(function(doc){
    if(!doc.empty){
      docRef.then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            var data = doc.data();
            currName = data.username;
            accType = "freelancer";
          });
        });
      // Sign in with email and pass.
      // [START authwithemail]
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {

          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          // [END_EXCLUDE]
        });
      // [END authwithemail]
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function() {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return firebase.auth().signInWithEmailAndPassword(email, password);
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
      });

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          setPageSession_main(currName, accType);
          window.location.href ="freelancerPage.html";
          uid = firebase.auth().currentUser;
        } else {
          // No user is signed in.
        }
      });
    }
    else {
      window.alert("This email is not registered as Freelancer.");
    }
  });

}

function logout(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    window.location.href ="main.html";
  }).catch(function(error) {
    // An error happened.
  });
}

//register function=======================================================================
function newCustomer()
{
  var email = document.getElementById("cusEmail").value;
  var username = document.getElementById("cusName").value;
  var password = document.getElementById("cusPassword").value;
  var contact = document.getElementById("contact").value;
  var address = document.getElementById("address").value;

  if(email==""||username==""||password==""||contact==""||address==""){
    window.alert("Please fill in all the fields!");
  }
  else{
    //new user
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
        var uid = firebase.auth().currentUser.uid;

        firebase.database().ref().child("User").child(uid).update({
          username: username,
          type: 'customer',
        });

        db.collection("Customer").doc(uid).set({
          email: email,
          username: username,
          contact: contact,
          address: address,
          balance: 0,
        });

    })
    .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode == 'auth/weak-password') {
              alert('The password is too weak.');
            }
            // [END_EXCLUDE]
    });

    if(firebase.auth().currentUser!=null){
      window.location.href ="customerPage.html";
    }
  }
}


function newFreelancer()
{
  var email = document.getElementById("fEmail").value;
  var username = document.getElementById("fName").value;
  var password = document.getElementById("fPassword").value;
  var contact = document.getElementById("fcontact").value;
  var _state = document.getElementById("state");
  var state = _state.options[_state.selectedIndex].text;//get state
  var address = document.getElementById("faddress").value;
  var description = document.getElementById("description").value;
  var startTime = document.getElementById("startTime").value;
  var endTime = document.getElementById("endTime").value;

  if(email==""||username==""||password==""||contact==""||state==""||address==""||description==""||startTime==""||endTime==""){
    window.alert("Please fill in all the fields!");
  }

  else{

    firebase.database().ref().child("User").child(uid).update({
      username: username,
      type: 'freelancer',
    });
    //new user
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
        var uid = firebase.auth().currentUser.uid;
        db.collection("Freelancer").doc(uid).set({
          email: email,
          username: username,
          contact: contact,
          address: address,
          balance: 0,
          state: state,
          description : description,
          startTime: startTime,
          endTime: endTime
        });
    })
    .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode == 'auth/weak-password') {
              alert('The password is too weak.');
            }
            // [END_EXCLUDE]
    });

    if(firebase.auth().currentUser!=null){
      window.location.href ="freelancerPage.html";
    }
  }
}


/*=== customerPage.html =================================================================================*/
function goProfile(){
  //accType = getPageSession_main().acctype;
  console.log(accType);
  if(accType=="customer"){
    window.location.href ="customerPage.html";
  }
  else if(accType=="freelancer"){
    window.location.href ="freelancerPage.html";
  }
}

function onEditClick(){
  document.getElementById("edit_btn").disabled = true;
  document.getElementById("save_btn").disabled = false;
  var editElement = document.getElementsByClassName("editing");

  for(i=0;i<editElement.length;i++)
  {
    editElement[i].style.display = "block";
  }

  editElement[0].value = currAddress;
  editElement[1].value = currContact;
}

function onSaveClick(){
  document.getElementById("edit_btn").disabled = false;
  document.getElementById("save_btn").disabled = true;
  var editElement = document.getElementsByClassName("editing");

  var newAddress = editElement[0].value;
  var newContact = editElement[1].value;

  var ref = firebase.database().ref().child("User");
  var uid = firebase.auth().currentUser.uid;
  /*ref.child(uid).set({
    email: currEmail,
    username: currName,
    type: 'customer',
    contact: newContact,
    address: newAddress,
  });*/


  db.collection("Customer").doc(uid).update({
       contact: newContact,
       address: newAddress,

  }).then(function() {
      console.log("Document successfully written!");
  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
  });

  for(i=0;i<editElement.length;i++)
  {
    editElement[i].style.display = "none";
  }
}

//print booking
function printBooking(status)
{
  var view_container;
  var detail;
  if(status == "Pending"){
    view_container = document.getElementById("bookingPage");
  }
  else if (status == "Accepted"||status == "Waiting for Payment") {
    view_container = document.getElementById("favoritePage");
  }
  else if(status == "Done"||status=="Rejected"){
      view_container = document.getElementById("historyPage");
  }


  db.collection("Customer_booking").where("userID", "==", firebase.auth().currentUser.uid).where("status", "==", status).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var data = doc.data();

        var module = document.createElement("div");
        module.classList.add("container");

        var box = document.createElement("div");
        box.style.position = "static";

        var title = document.createElement("h3");
        title.innerHTML = data.bookingDate.toDate();

        var detail = document.createElement("div");

        var reviewDiv = document.createElement("div");
        var review = document.createElement("textarea");
        review.style.width = "60%";
        review.classList.add("textarea");
        review.setAttribute("placeholder","Enter review here");
        var button_pay_review = document.createElement("BUTTON");

        var button = document.createElement("BUTTON");
        button.innerHTML = "View Detail";
        button.classList.add("main_button");
        button.style.float = "right";
        button.onclick = function(){
          if(button.innerHTML == "View Detail"){
            detail.style.display = "block";
            button.innerHTML = "Close";
          }
          else if(button.innerHTML == "Close"){
            detail.style.display = "none"
            button.innerHTML = "View Detail";
          }
        }

        box.appendChild(title);
        box.appendChild(button);

        //if status == pending add 2 button ->pay and review
        if(status=="Waiting for Payment"){
              button_pay_review.innerHTML = "Pay";
              button_pay_review.classList.add("main_button");
              button_pay_review.style.float = "right";
              button_pay_review.onclick = function(){
                window.location.href ="makePayment.html"+"?docID="+doc.id;
              }
          box.appendChild(button_pay_review);
        }

        if(status == "Pending"){
          button_pay_review.innerHTML = "Cancel Booking";
          button_pay_review.classList.add("main_button");
          button_pay_review.style.float = "right";
          button_pay_review.onclick = function(){
            console.log(doc.id);
            db.collection("Customer_booking").doc(doc.id).get().then(function(doc1){
              var applyID = doc1.data().jobApplyID;
              console.log(applyID);
              db.collection("job_applied").doc(applyID).delete().then(function() {
                    db.collection("Customer_booking").doc(doc.id).delete().then(function() {
                          console.log("Document successfully deleted!");
                      }).catch(function(error) {
                          console.error("Error removing document: ", error);
                      });

                    console.log("Document successfully deleted!");
                    window.alert("Booking successfully deleted!");
                    location.reload();
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
            })
          }
          box.appendChild(button_pay_review);
        }

        var reviewText = document.createElement("p");
        var rating = document.createElement("p");
        if(status=="Done"){
          console.log("ok");
          if(data.review==""){
            console.log("no review");
            button_pay_review.innerHTML = "Review";
            button_pay_review.classList.add("main_button");
            button_pay_review.style.float = "right";
            button_pay_review.onclick = function(){
              if(button_pay_review.innerHTML == "Review"){
                reviewDiv.style.display = "block";
                button_pay_review.innerHTML = "Cancel";
              }
              else{
                reviewDiv.style.display = "none";
                button_pay_review.innerHTML = "Review";

              }
            }



            box.appendChild(button_pay_review);

            var star1 = document.createElement("a");
            var star2 = document.createElement("a");
            var star3 = document.createElement("a");
            var star4 = document.createElement("a");
            var star5 = document.createElement("a");

            var ratingDiv = document.createElement("div");
            var star = document.createElement("img");
            star.src = "resourse/image/star.png";
            star.style.width = "20px";
            star.style.height = "20px";

            var star22 = document.createElement("img");
            star22.src = "resourse/image/star.png";
            star22.style.width = "20px";
            star22.style.height = "20px";

            var star33 = document.createElement("img");
            star33.src = "resourse/image/star.png";
            star33.style.width = "20px";
            star33.style.height = "20px";

            var star44 = document.createElement("img");
            star44.src = "resourse/image/star.png";
            star44.style.width = "20px";
            star44.style.height = "20px";

            var star55 = document.createElement("img");
            star55.src = "resourse/image/star.png";
            star55.style.width = "20px";
            star55.style.height = "20px";

            star1.appendChild(star);
            star2.appendChild(star22);
            star3.appendChild(star33);
            star4.appendChild(star44);
            star5.appendChild(star55);

            var ratingText = document.createElement("p");
            ratingText.style.display = "none";

            /*star1.onmouseover = function(){
              star.src = "resourse/image/star_fill.png";
            };
            star1.onmouseleave = function() {
              star.src = "resourse/image/star.png";
              star22.src = "resourse/image/star.png";
              star33.src = "resourse/image/star.png";
              star44.src = "resourse/image/star.png";
              star55.src = "resourse/image/star.png";
            }*/
            star1.onclick = function(){
              star.src = "resourse/image/star_fill.png";
              ratingDiv.style.display = "none";
              ratingText.style.display = "block";
              ratingText.innerHTML = "Rating: 1 star";
              console.log(ratingText.innerHTML);
              db.collection("Customer_booking").doc(doc.id).update({
                rating : 1,
              })
            }

            star2.onmouseover = function(){
              star.src = "resourse/image/star_fill.png";
              star22.src = "resourse/image/star_fill.png";
            };
            star2.onmouseleave = function() {
              star.src = "resourse/image/star.png";
              star22.src = "resourse/image/star.png";
              star33.src = "resourse/image/star.png";
              star44.src = "resourse/image/star.png";
              star55.src = "resourse/image/star.png";
            }

            star3.onmouseover = function(){
              star.src = "resourse/image/star_fill.png";
              star22.src = "resourse/image/star_fill.png";
              star33.src = "resourse/image/star_fill.png";
            };
            star3.onmouseleave = function() {
              star.src = "resourse/image/star.png";
              star22.src = "resourse/image/star.png";
              star33.src = "resourse/image/star.png";
              star44.src = "resourse/image/star.png";
              star55.src = "resourse/image/star.png";
            }

            star4.onmouseover = function(){
              star.src = "resourse/image/star_fill.png";
              star22.src = "resourse/image/star_fill.png";
              star33.src = "resourse/image/star_fill.png";
              star44.src = "resourse/image/star_fill.png";
            };
            star4.onmouseleave = function() {
              star.src = "resourse/image/star.png";
              star22.src = "resourse/image/star.png";
              star33.src = "resourse/image/star.png";
              star44.src = "resourse/image/star.png";
              star55.src = "resourse/image/star.png";
            }

            star5.onmouseover = function(){
              star.src = "resourse/image/star_fill.png";
              star22.src = "resourse/image/star_fill.png";
              star33.src = "resourse/image/star_fill.png";
              star44.src = "resourse/image/star_fill.png";
              star55.src = "resourse/image/star_fill.png";
            };
            star5.onmouseleave = function() {
              star.src = "resourse/image/star.png";
              star22.src = "resourse/image/star.png";
              star33.src = "resourse/image/star.png";
              star44.src = "resourse/image/star.png";
              star55.src = "resourse/image/star.png";
            }

            ratingDiv.appendChild(star1);
            ratingDiv.appendChild(star2);
            ratingDiv.appendChild(star3);
            ratingDiv.appendChild(star4);
            ratingDiv.appendChild(star5);
            ratigDiv.appendChild(ratingText);

            reviewDiv.appendChild(review);
            reviewDiv.appendChild(ratingDiv);

            var saveReview = document.createElement("BUTTON");
            saveReview.innerHTML = "Save";
            saveReview.classList.add("main_button");
            saveReview.style.float = "right";
            saveReview.onclick = function(){
              console.log(review.value);
              db.collection("Customer_booking").doc(doc.id).update({
                review: review.value,
              }).then(function() {
                  console.log("Document successfully written!");
                  location.reload();
              })
              .catch(function(error) {
                  console.error("Error writing document: ", error);
              });
            };
            reviewDiv.appendChild(saveReview);
          }else{
            var i;
            rating.innerHTML = "Rating: " + data.rating +" star";
            reviewText.innerHTML = "Review: " + data.review;
          }
        }

        module.appendChild(box);

        var line = document.createElement("HR");
        detail.appendChild(line);
        detail.style.display = "inline-block";

        var description = document.createElement("p")
        description.innerHTML = "Description : " + data.description;
        detail.appendChild(description);

        var fees = document.createElement("p");
        fees.innerHTML = "Fees : " + data.fees;
        detail.appendChild(fees);

        var bStatus = document.createElement("p");
        bStatus.innerHTML = "Status : " + data.status;
        detail.appendChild(bStatus);

        detail.appendChild(reviewText);

        reviewDiv.style.display = "none";
        detail.style.display = "none";
        module.appendChild(detail);
        module.appendChild(reviewDiv);

        view_container.appendChild(module);
      });
  });
}

//makePayment.html========================================
function makePayment(){
  if(currBalance-payment<0){
    window.alert("Insufficent balance!!! Please topup your wallet.");
    goProfile();
  }
  else{
    //update the booking status=====================
    console.log(docID);
    db.collection("Customer_booking").doc(docID).get().then(function(doc) {
      db.collection("job_applied").doc(doc.data().jobApplyID).update({
        paid: true,
      })
    })

    db.collection("Customer_booking").doc(docID).update({
      status: "Done",
      paid: true,
    })
    .then(function() {
        console.log("Document successfully written!");
        window.alert("Payment succeeded!")
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

    //deduct money from customer account==============
    db.collection("Customer").doc(firebase.auth().currentUser.uid).update({
      balance: currBalance-payment,
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

    //freelance get the money=======================
    var newBalance = parseFloat(freeBalance)+parseFloat(payment);
    console.log(newBalance);
    db.collection("Freelancer").doc(freeID).update({
      balance: newBalance,
    })
    .then(function() {
        console.log("Document successfully written!");
        goProfile();
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
  }
}

/*function viewBookingDetail(){
  var buttonType =  document.getElementById("detail_booking_btn");
  if(buttonType.innerHTML == "View Detail"){
    document.getElementById("detail_booking").style.display = "block";
    buttonType.innerHTML = "Close";
  }
  else if (buttonType.innerHTML == "Close"){
    document.getElementById("detail_booking").style.display = "none";
    buttonType.innerHTML = "View Detail";
  }
}

function viewHistoryDetail(){

  var buttonType =  document.getElementById("detail_history_btn");
  if(buttonType.innerHTML == "View Detail"){
    document.getElementById("detail_history").style.display = "block";
    buttonType.innerHTML = "Close";
  }
  else if (buttonType.innerHTML == "Close"){
    document.getElementById("detail_history").style.display = "none";
    buttonType.innerHTML = "View Detail";
  }

}

function viewFavoriteDetail(){

  var buttonType =  document.getElementById("detail_favorite_btn");
  if(buttonType.innerHTML == "View Detail"){
    document.getElementById("detail_favorite").style.display = "block";
    buttonType.innerHTML = "Close";
  }
  else if (buttonType.innerHTML == "Close"){
    document.getElementById("detail_favorite").style.display = "none";
    buttonType.innerHTML = "View Detail";
  }
}*/

/*-----------------------------------------------------------------------------------*/
