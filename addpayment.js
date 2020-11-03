var db = firebase.firestore();
var money=0;
firebase.auth().onAuthStateChanged(function(user) {

    if(window.location.href.includes('addPayment.html'))
    {
      if (user != null) {
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
        console.log(uid)
        /*var db = firebase.database().ref().child("User").child(uid);
          firebaseRef.on('value',function(datasnapshot){
            currName = datasnapshot.child('username').val();
            accType = datasnapshot.child('type').val();
            money =datasnapshot.child('wallet_money').val();
        });*/
        var docRef = db.collection("Freelancer").doc(uid).get();
        docRef.then(function(doc){
          if(doc.exists){
              var data = doc.data();
              currName = data.username;
              accType = "Freelancer";
              money = data.balance;

              document.getElementById("loginBtn").style.display = "none";
              document.getElementById("RegisterBtn").style.display = "none";
              document.getElementById('userLoggedIn').style.display = "block";
              document.getElementById('userLoggedIn').style.width = "300px";
              document.getElementById('userLoggedIn').innerHTML = "Welcome, "+ currName + " !";
            }
        });

        var docRef = db.collection("Customer").doc(uid).get();
        docRef.then(function(doc){
          if(doc.exists){
              var data = doc.data();
              currName = data.username;
              accType = "Customer";
              money = data.balance;

              document.getElementById("loginBtn").style.display = "none";
              document.getElementById("RegisterBtn").style.display = "none";
              document.getElementById('userLoggedIn').style.display = "block";
              document.getElementById('userLoggedIn').style.width = "300px";
              document.getElementById('userLoggedIn').innerHTML = "Welcome, "+ currName + " !";
          }
        });
      }
      else{

      }
    }
    else{
    }
});


function confirmClick(){
    var card_number = document.getElementById("card-number").value;
    var name = document.getElementById("name").value;
    var expiration = document.getElementById("expiration").value;
    var cvv = document.getElementById("cvv").value;
    var amount = document.getElementById("amount").value;

    var today = new Date();
    var date = String(today.getDate()) +String((today.getMonth()+1))+String(today.getFullYear());
    var time = String(today.getHours())+ String(today.getMinutes())+ String(today.getSeconds());
    var _date =String(today.getDate())+"-"+String((today.getMonth()+1))+"-"+String(today.getFullYear());
    var _time =String(today.getHours())+":"+String(today.getMinutes())+":"+String(today.getSeconds());


    firebase.auth().onAuthStateChanged(function(user) {

      if(card_number==""||name==""||expiration==""||cvv==""||amount==""){
        alert("Please fill in the form")
      }
      else{
        if (user != null) {
          uid = user.uid;
          console.log(uid)
          console.log(card_number)
          db.collection("wallet_transaction").doc("WT"+date+time).set({
            Card_number:card_number,
            Name:name,
            Expiration:expiration,
            Cvv:cvv,
            Amount:amount,
            Userid:uid,
            Date:_date,
            Time:_time
          }).then(function(){
            console.log(_date + _time)
            alert("Money bankined!");
          }).then(function(){
            window.location.href = "customerPage.html";
          })
          var ref = firebase.database().ref().child("User");
          var uid = firebase.auth().currentUser.uid;
          db.collection(accType).doc(uid).update({
            balance : parseInt(money)+parseInt(amount),
          });

        }
        else{
          alert("Please log in as user!!!");
        }
      }

  });


}
