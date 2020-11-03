var name, email, address, contact, uid;
var user = firebase.auth().currentUser;
var db = firebase.firestore();
var available = [];

var currAddress;
var currContact;
var currEmail;
var currName;
var accType;

const MsgElem = document.createElement("div");
const TokenElem = document.createElement("div");
const NotisElem = document.getElementById("notis");
const ErrElem = document.getElementById("err");
const messaging = firebase.messaging();
messaging.usePublicVapidKey("BGIJ6RI6F1d8WsNFKn91Dcudi_OgiRXVSw0EwgYhokJwzuj6mJgQpJ18k6XxJv7mc1Js2TgWMeyNeznaL0xBVcY");

// IDs of divs that display Instance ID token UI or request permission UI.
const tokenDivId = 'token_div';
const permissionDivId = 'permission_div';

// [START refresh_token]
messaging.onTokenRefresh(() => {
  messaging.getToken().then((refreshedToken) => {
    console.log('Token refreshed.');
    setTokenSentToServer(false);
    sendTokenToServer(refreshedToken);
    resetUI();
  }).catch((err) => {
    console.log('Unable to retrieve refreshed token ', err);
    showToken('Unable to retrieve refreshed token ', err);
  });
});

// [START receive_message]
messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
  appendMessage(payload);
});

function resetUI() {
  clearMessages();
  showToken('loading...');
  messaging.getToken().then((currentToken) => {
    if (currentToken) {
      sendTokenToServer(currentToken);
      updateUIForPushEnabled(currentToken);
    } else {
      console.log('No Instance ID token available. Request permission to generate one.');
      updateUIForPushPermissionRequired();
      setTokenSentToServer(false);
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    showToken('Error retrieving Instance ID token. ', err);
    setTokenSentToServer(false);
  });

}
function showToken(currentToken) {
  // Show token in console and UI.
  const tokenElement = document.querySelector('#token');
  tokenElement.textContent = currentToken;
}

// Send the Instance ID token your application server
function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
    console.log('Sending token to server...');
    setTokenSentToServer(true);
  } else {
    console.log('Token already sent to server so won\'t send it again ' +
        'unless it changes');
  }
}

function isTokenSentToServer() {
  return window.localStorage.getItem('sentToServer') === '1';
}

function setTokenSentToServer(sent) {
  window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}

function showHideDiv(divId, show) {
  const div = document.querySelector('#' + divId);
  if (show) {
    div.style = 'display: visible';
  } else {
    div.style = 'display: none';
  }
}

// [START request_permission]
function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      resetUI();
    } else {
      console.log('Unable to get permission to notify.');
    }
  });
}

// [START delete_token]
function deleteToken() {
  messaging.getToken().then((currentToken) => {
    messaging.deleteToken(currentToken).then(() => {
      console.log('Token deleted.');
      setTokenSentToServer(false);
      resetUI();
    }).catch((err) => {
      console.log('Unable to delete token. ', err);
    });
  }).catch((err) => {
    console.log('Error retrieving Instance ID token. ', err);
    showToken('Error retrieving Instance ID token. ', err);
  });
}

// Add a message to the messages element.
function appendMessage(payload) {
  const messagesElement = document.querySelector('#messages');
  const dataHeaderELement = document.createElement('h5');
  const dataElement = document.createElement('pre');
  dataElement.style = 'overflow-x:hidden;';
  dataHeaderELement.textContent = 'Received message:';
  dataElement.textContent = JSON.stringify(payload, null, 2);
  messagesElement.appendChild(dataHeaderELement);
  messagesElement.appendChild(dataElement);
}

//Clear the messages element of all children.
function clearMessages() {
  /*const messagesElement = document.querySelector('#messages');
  while (messagesElement.hasChildNodes()) {
    messagesElement.removeChild(messagesElement.lastChild);
  }*/
}

function updateUIForPushEnabled(currentToken) {
  showHideDiv(TokenElem, true);
  showHideDiv(NotisElem, false);
  showToken(currentToken);
}

function updateUIForPushPermissionRequired() {
  showHideDiv(TokenElem, false);
  showHideDiv(NotisElem, true);
}

resetUI();





/*====customerPage.html === after sign in, redirect to profile page, customise profile=============*/
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    if(window.location.href.includes('customerPage.html'))
    {
      if (user != null) {
      requestPermission();
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
        var firebaseRef = firebase.database().ref().child("User").child(uid);
          firebaseRef.on('value',function(datasnapshot){
            currAddress = datasnapshot.child('address').val();
            currContact = datasnapshot.child('contact').val();
            currEmail = datasnapshot.child('email').val();
            currName = datasnapshot.child('username').val();
            document.getElementById('username').innerHTML = datasnapshot.child('username').val();
            document.getElementById('username2').innerHTML = datasnapshot.child('username').val();
            document.getElementById('email').innerHTML = datasnapshot.child('email').val();
            document.getElementById('address').innerHTML = datasnapshot.child('address').val();
            document.getElementById('contact').innerHTML = datasnapshot.child('contact').val();
            printBooking("Done");
            printBooking("Pending");
        });
      }
    }
    else if(window.location.href.includes('main.html'))
    {
      if (user != null) {
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
        var firebaseRef = firebase.database().ref().child("User").child(uid);
          firebaseRef.on('value',function(datasnapshot){
            currAddress = datasnapshot.child('address').val();
            currContact = datasnapshot.child('contact').val();
            currEmail = datasnapshot.child('email').val();
            currName = datasnapshot.child('username').val();
            accType = datasnapshot.child('type').val();
            document.getElementById("loginBtn").style.display = "none";
            document.getElementById("RegisterBtn").style.display = "none";
            document.getElementById('userLoggedIn').style.display = "block";
            document.getElementById('userLoggedIn').style.width = "300px";
            document.getElementById('userLoggedIn').innerHTML = "Welcome, "+ currName + " !";
        });

      }
    }
    else if(window.location.href.includes('freelancerPage.html'))
    {
      if (user != null) {
	requestPermission();
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
        var firebaseRef = firebase.database().ref().child("User").child(uid);
          firebaseRef.on('value',function(datasnapshot){
            document.getElementById('username').innerHTML = datasnapshot.child('username').val();
            document.getElementById('username2').innerHTML = datasnapshot.child('username').val();
            document.getElementById('email').innerHTML = datasnapshot.child('email').val();
            document.getElementById('address').innerHTML = datasnapshot.child('address').val();
            document.getElementById('contact').innerHTML = datasnapshot.child('contact').val();
	    document.getElementById('description').innerHTML = datasnapshot.child('description').val();
            displayService();
	    displayBooking();
        });

      }
    }
    else if(window.location.href.includes('registerjob.html'))
    {
      if (user != null) {
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
        var firebaseRef = firebase.database().ref().child("User").child(uid);
          firebaseRef.on('value',function(datasnapshot){
            currAddress = datasnapshot.child('address').val();
            currContact = datasnapshot.child('contact').val();
            currEmail = datasnapshot.child('email').val();
            currName = datasnapshot.child('username').val();
        });
      }
      else{
      }
    }
    /*else if(window.location.href.includes(freelancerProfile.html')) {
      if (user != null) {
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
        var firebaseRef = firebase.database().ref().child("User").child(uid);
          firebaseRef.on('value',function(datasnapshot){
            currAddress = datasnapshot.child('address').val();
            currContact = datasnapshot.child('contact').val();
            currEmail = datasnapshot.child('email').val();
            currName = datasnapshot.child('username').val();
        });
      }
      else{
      }
    }*/


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
  document.getElementById("title").innerHTML = "My Favorite";
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

function saveClick()
{
  var username= document.getElementById("fusername2").value;
  var email = document.getElementById("femail").value;
  var address= document.getElementById("faddress").value;
  var contact = document.getElementById("fcontact").value;
  //var ref = firebase.database().ref().child("User");
  firebase.database().ref().child("User").child(uid).update({
    username: username,
    email: email,
    address: address,
    contact : contact
  });
}

function saveDescription(descp)
{
  var user = firebase.auth().currentUser;
  //var root = firebase.database().ref();
  description = document.getElementById(descp).value;
  firebase.database().ref().child("User").child(uid).update({
    description: description
  });
}

function show(param_div_id) {
    document.getElementById("right_fg").innerHTML = document.getElementById(param_div_id).innerHTML;
    if(param_div_id=="my_service"){
      displayService();
    }
 }

function displayBooking(){
  var view_container = document.getElementById("showBooking");

  db.collection("Customer_booking").where("techID", "==", firebase.auth().currentUser.uid).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var data = doc.data();

        var module = document.createElement("div");
        module.classList.add("container");

        var box = document.createElement("div");
        box.style.position = "static";

        var title = document.createElement("h3");
        title.innerHTML = data.serviceDate.toDate();

        var detail = document.createElement("div");

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
        module.appendChild(box);

        var line = document.createElement("HR");
        detail.appendChild(line);
        detail.style.display = "inline-block";

	var address = document.createElement("p");
        address.innerHTML = Address: " + data.serviceAddress;
        detail.appendChild(address);

        var description = document.createElement("p")
        description.innerHTML = "Description : " + data.description;
        detail.appendChild(description);

        var fees = document.createElement("p");
        fees.innerHTML = "Fees : " + data.fees;
        detail.appendChild(fees);

        var bStatus = document.createElement("p");
        bStatus.innerHTML = "Status : " + data.status;
        detail.appendChild(bStatus);

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
      //module.classList.add("freecontainer");

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
          //detail.style.display = "block";
          open.innerHTML = "Close";
        }
        else if(open.innerHTML == "Close"){
          //windows.alert("click");
          //detail.style.display = "none"
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

      detail.style.display = "block";
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
      window.location.href = "customerPage.html";
      uid = firebase.auth().currentUser;
    } else {
      // No user is signed in.
    }
  });

}

function freeLogin()
{
  email = document.getElementById("fEmail").value;
  password = document.getElementById("fpassword").value;
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
      window.location.href ="freelancerPage.html";
      uid = firebase.auth().currentUser;
    } else {
      // No user is signed in.
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
  //new user
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
      var ref = firebase.database().ref().child("User");
      var uid = firebase.auth().currentUser.uid;
      ref.child(uid).update({
          email: email,
          username: username,
          contact: contact,
          address: address,
          type: 'customer',

      });
      ref.child(user.uid).update(data).then(function(ref) {//use 'child' and 'set' combination to save data in your own generated key
          console.log("Saved");
      }, function(error) {
          console.log(error);
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


function newFreelancer()
{
  var email = document.getElementById("fEmail").value;
  var username = document.getElementById("fName").value;
  var password = document.getElementById("fPassword").value;
  var contact = document.getElementById("fcontact").value;
  var address = document.getElementById("faddress").value;

  //new user
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
      var ref = firebase.database().ref().child("User");
      var uid = firebase.auth().currentUser.uid;
      ref.child(uid).update({
          email: email,
          username: username,
          contact: contact,
          address: address,
          type: 'freelancer',

      });
      ref.child(user.uid).update(data).then(function(ref) {//use 'child' and 'set' combination to save data in your own generated key
          console.log("Saved");
      }, function(error) {
          console.log(error);
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


/*=== customerPage.html =================================================================================*/
function goProfile(){
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
  ref.child(uid).set({
    email: currEmail,
    username: currName,
    type: 'customer',
    contact: newContact,
    address: newAddress,
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
  else if(status == "Done"){
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

        detail.style.display = "none";
        module.appendChild(detail);
        view_container.appendChild(module);
      });
  });
}

function openRequestForm (){
  uid = firebase.auth().currentUser;
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
