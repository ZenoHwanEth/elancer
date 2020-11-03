var jobApplyRef = db.collection("job_applied");
function getjobpag()
{
    var page_session= sessionStorage.getItem("jobsession");
    if(page_session)
        page_session = JSON.parse(page_session);
   // console.log(page_session);
    return page_session;
}
function applyClick()
{
  var total_service=0;
firebase.auth().onAuthStateChanged(function(user) {
  if(user!=null){
    var serviceHour = document.getElementById("service_hour").value;
    var service_date=document.getElementById("service_date").value;
    console.log(service_date)
    if(service_date!=""){
      var loading=document.getElementById("loading");
      var layer=document.getElementById("layer");
      loading.style.visibility="visible";
      loading.style.zIndex=2;
      layer.style.visibility="visible";
      layer.style.zIndex=1;
      console.log(service_date);
      jobApplyRef.get().then(snapshot =>{
        total_service=snapshot.size;

        var today = new Date();
        var date = String(today.getDate()) +String((today.getMonth()+1))+String(today.getFullYear());
        var time = String(today.getHours())+ String(today.getMinutes())+ String(today.getSeconds());
        var _date =String(today.getDate())+"-"+String((today.getMonth()+1))+"-"+String(today.getFullYear());
        var _time =String(today.getHours())+":"+String(today.getMinutes())+":"+String(today.getSeconds());
        db.collection("job_applied").doc("JA"+date+time).set({
          Applicant:uid,
          Jobid:getjobpag().id,
          JobOwner:getjobpag().jobdata.Ownerid,
          fee:getjobpag().jobdata.Price*serviceHour,
          date:_date,
          time:_time,
          status:'Pending',
          service_date:service_date,
          id:total_service+1,
          serviceHour: serviceHour,
          paid: false,
        })
        .then(function() {
          console.log("Document successfully written!");
          alert("Job has submitted!!!");
          searchClick();
         })

         db.collection("Service_listed").doc(getjobpag().id).get().then(function(doc){
           if(doc.exists){
             console.log(getjobpag().id);
             var des = doc.data().Description;
             db.collection("Customer_booking").add({
                bookingDate: firebase.firestore.FieldValue.serverTimestamp(),
                description: des,
                fees:serviceHour * getjobpag().jobdata.Price,
                review:" ",
                serviceDate: service_date,
                status:'Pending',
                techID: getjobpag().jobdata.Ownerid,
                userID: uid,
                jobApplyID: "JA"+date+time,
                paid: false,
            }).then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
           }
         });
       });
    }
    else{
      alert("Please fill in the service date!!");
    }

  }else{
    alert("Please sign in before applying any service")
  }
});
}



firebase.auth().onAuthStateChanged(function(user) {

    if(window.location.href.includes('jobpage.html'))
    {
        document.getElementById("jobtitle").innerHTML="Job title : " +getjobpag().jobdata.Jobtitle;
        document.getElementById("categories").innerHTML="Category : "+getjobpag().jobdata.Categories;
        document.getElementById("location").innerHTML="Location : "+getjobpag().jobdata.Location;
        document.getElementById("owner").innerHTML="Freelancer Name : "+getjobpag().jobdata.Owner;
        document.getElementById("email").innerHTML="Email : "+getjobpag().owner_email;
        document.getElementById("contact").innerHTML="Contact Number : "+getjobpag().owner_contact;
        document.getElementById("description").innerHTML="Description : "+getjobpag().jobdata.Description;
        document.getElementById("price").innerHTML="Price : RM"+getjobpag().jobdata.Price + "/hr";
      if (user != null) {
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use

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

        /*var firebaseRef = firebase.database().ref().child("User").child(uid);
          firebaseRef.on('value',function(datasnapshot){
            currName = datasnapshot.child('username').val();
            accType = datasnapshot.child('type').val();
          document.getElementById("loginBtn").style.display = "none";
          document.getElementById("RegisterBtn").style.display = "none";
          document.getElementById('userLoggedIn').style.display = "block";
          document.getElementById('userLoggedIn').style.width = "300px";
          document.getElementById('userLoggedIn').innerHTML = "Welcome, "+ currName + " !";
        });*/
      }
      else{


      }
    }
    else{
    }
}
);
