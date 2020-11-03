// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};

// Get the navbar
var navbar = document.getElementById("nav-bar");

// Get the offset position of the navbar
var sticky = 450;//navbar.offset;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= sticky) {
    //navbar.style.position = "fixed";
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
}

var db = firebase.firestore();
var accType;
var currName;

var url_string = window.location.href; //window.location.href
var url = new URL(url_string);
techID = url.searchParams.get("techID");
console.log(techID);

/*firebase.auth().onAuthStateChanged(function(user) {


});*/

displayDetail();
displayService();
displayReview();
displayAbout();

function displayService(){
  var serviceList = document.getElementById("serviceList");

  db.collection("Service_listed").where("Ownerid", "==", techID).get().then((querySnapshot) => {
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

      var apply = document.createElement("button");
      apply.innerHTML = "Apply";
      apply.classList.add("main_button");
      apply.style.float = "right";
      apply.onclick = function(){
        setjobpage(doc.id);
      }

      box.appendChild(cat);
      box.appendChild(job_title);
      box.appendChild(open);
      box.appendChild(apply);
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
      serviceList.appendChild(module);
    });
  });
}

function displayDetail(){

  db.collection("Freelancer").doc(techID).get().then(function(doc){
    var data = doc.data();

    document.getElementById("username").innerHTML = data.username;
    document.getElementById("ratingText").innerHTML = "Rating: " + data.rating.toFixed(2);
    var rating = data.rating.toFixed(2);
    console.log(rating);
    if(rating >=1 && rating<2){
      document.getElementById("star2").src = "resourse/image/star.png";
      document.getElementById("star3").src = "resourse/image/star.png";
      document.getElementById("star4").src = "resourse/image/star.png";
      document.getElementById("star5").src = "resourse/image/star.png";
    }
    else if (rating >= 2 && rating<3) {
      document.getElementById("star3").src = "resourse/image/star.png";
      document.getElementById("star4").src = "resourse/image/star.png";
      document.getElementById("star5").src = "resourse/image/star.png";
    }
    else if (rating >= 3 && rating<4){
      document.getElementById("star4").src = "resourse/image/star.png";
      document.getElementById("star5").src = "resourse/image/star.png";
    }
    else if (rating >=4 && rating<5) {
      document.getElementById("star5").src = "resourse/image/star.png";
    }
  });
}

function displayReview(){
  var reviewList = document.getElementById("reviewList");

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

function displayAbout(){
  var description = document.getElementById("description");
  var contact = document.getElementById("contact");

  db.collection("Freelancer").doc(techID).get().then(function(doc){
      var data = doc.data();

      var des = document.createElement("p");
      des.innerHTML = "Description: " + data.description;

      description.appendChild(des);

      var email = document.createElement("p");
      var address = document.createElement("p");
      var phone = document.createElement("p");

      email.innerHTML = "Email :" + data.email;
      address.innerHTML = "Address :" + data.address;
      phone.innerHTML = "Contact :" + data.contact;

      contact.appendChild(email);
      contact.appendChild(address);
      contact.appendChild(phone);
    });
}


function setjobpage(jobid)
{
  var job;
  var contact;
  var email;
  var ownerid;
  console.log(jobid);

  db.collection("Service_listed").doc(jobid).get().then(function(doc){
    job=doc.data();
  }).then(function(){
    ownerid=job.Ownerid;
    db.collection("Freelancer").doc(ownerid).get().then(function(doc){
      var data = doc.data();
      contact = data.contact;
      email = data.email;

      var jobsession = {id:jobid,jobdata:job,owner_contact:contact,owner_email:email};
      //console.log(jobsession);
      sessionStorage.setItem("jobsession",JSON.stringify(jobsession));
      window.location.href = "jobpage.html";
      uid = firebase.auth().currentUser;
    });
  });

}

function displayServiceClick() {
  document.getElementById("serviceList").style.display = "block";
  document.getElementById("reviewList").style.display = "none";
  document.getElementById("about").style.display = "none";
}

function displayReviewClick(){
  document.getElementById("serviceList").style.display = "none";
  document.getElementById("reviewList").style.display = "block";
  document.getElementById("about").style.display = "none";
}

function displayAboutClick(){
  document.getElementById("serviceList").style.display = "none";
  document.getElementById("reviewList").style.display = "none";
  document.getElementById("about").style.display = "block";
}
