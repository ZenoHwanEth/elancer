/** search html*/
var serviceRef = db.collection("Service_listed");
var total_service=null;


function SeacrhService(){

  var search_container=document.getElementById("search_container");

if(getPageSession_search().select==false)
{
  serviceRef.get().then(snapshot =>{  //getting total services
    total_service=snapshot.size;
    generate_number_section(total_service);//generate nummber of page per 10 service
    document.getElementById("number_service").innerHTML="1 - " + parseInt(total_service/10+1) + " of "+total_service +" jobs"
    document.getElementById("number_service1").innerHTML="1 - " + parseInt(total_service/10+1) + " of "+total_service +" jobs"
  })
}
else if(getPageSession_search().select==true){
  serviceRef
  .where("Jobtitle","==",getPageSession_search().title)
  .where("Location","==",getPageSession_search().state)
  .where("Categories","==",getPageSession_search().categories)
  .get()
  .then(snapshot =>{  //getting total services
    total_service=snapshot.size;
    generate_number_section(total_service);//generate nummber of page per 10 service
    document.getElementById("number_service").innerHTML="1 - " + parseInt(total_service/10+1) + " of "+total_service +" jobs"
    document.getElementById("number_service1").innerHTML="1 - " + parseInt(total_service/10+1) + " of "+total_service +" jobs"
  })
}



  if(getPageSession_search().number==1&&getPageSession_search().select==false){
  serviceRef.limit(10).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      var module = document.createElement("div");
      module.classList.add("module");
      var title = document.createElement("h1");
      title.innerHTML = data.Jobtitle;
      title.setAttribute("id",doc.id)
      title.classList.add("module_title")
      title.addEventListener("click",function(){
        setjobpage(this.id);
        console.log(this.id);
      })
      module.appendChild(title);

      var company = document.createElement("a")
      company.innerHTML = "Owner/Company : " + data.Owner;
      company.classList.add("module_company");
      company.style.cursor = "pointer";
      company.onclick = function(){
        window.location.href ="freelancerProfile.html"+"?techID="+data.Ownerid;
      };

      module.appendChild(company);

      var location = document.createElement("p");
      location.innerHTML = "<img src='resourse/layout/location-icon-png-4240.png' style='height:15px;width:15px'>"+"Location : " + data.Location;
      location.classList.add("module_location")
      module.appendChild(location);

      var price = document.createElement("p");
      price.innerHTML = "<img src='resourse/layout/price-icon.png' style='height:25px;width:25px'>"+"Price : RM" + data.Price;
      price.classList.add("module_price");
      module.appendChild(price);

      var description = document.createElement("p");
      description.innerHTML = "Description: " + data.Description;
      description.classList.add("module_description");
      module.appendChild(description);

      search_container.appendChild(module);

    });
});
}else if(getPageSession_search().number>1&&getPageSession_search().select==false){
    serviceRef.orderBy("id").startAt(parseInt(getPageSession_search().number-1)*10+1).limit(10).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var data = doc.data();
      var module = document.createElement("div");
      module.classList.add("module");
      var title = document.createElement("h1");
      title.innerHTML = data.Jobtitle;
      title.setAttribute("id",doc.id)
      title.classList.add("module_title")
      title.addEventListener("click",function(){
        setjobpage(this.id);
      })
      module.appendChild(title);

      var company = document.createElement("p")
      company.innerHTML = "Owner/Company : " + data.Owner;
      company.classList.add("module_company")
      company.onclick = function(){
        window.location.href ="freelancerProfile.html"+"?techID="+data.Ownerid;
      };
      module.appendChild(company);

      var location = document.createElement("p");
      location.innerHTML = "<img src='resourse/layout/location-icon-png-4240.png' style='height:15px;width:15px'>"+"Location : " + data.Location;
      location.classList.add("module_location")
      module.appendChild(location);

      var price = document.createElement("p");
      price.innerHTML = "<img src='resourse/layout/price-icon.png' style='height:25px;width:25px'>"+"Price : RM" + data.Price;
      price.classList.add("module_price");
      module.appendChild(price);

      var description = document.createElement("p");
      description.innerHTML = "Description: " + data.Description;
      description.classList.add("module_description");
      module.appendChild(description);

      search_container.appendChild(module);

      });
});
}else if(getPageSession_search().number==1&&getPageSession_search().select==true){

  serviceRef
    .where("Jobtitle","==",getPageSession_search().title)
    .where("Location","==",getPageSession_search().state)
    .where("Categories","==",getPageSession_search().categories)
    .limit(10).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      var module = document.createElement("div");
      module.classList.add("module");

      var title = document.createElement("h1");
      title.innerHTML = data.Jobtitle;
      title.setAttribute("id",doc.id)
      title.classList.add("module_title")
      title.addEventListener("click",function(){
        setjobpage(this.id);
      })
      module.appendChild(title);

      var company = document.createElement("p")
      company.innerHTML = "Owner/Company : " + data.Owner;
      company.classList.add("module_company")
      module.appendChild(company);

      var location = document.createElement("p");
      location.innerHTML = "<img src='resourse/layout/location-icon-png-4240.png' style='height:15px;width:15px'>"+"Location : " + data.Location;
      location.classList.add("module_location")
      module.appendChild(location);

      var price = document.createElement("p");
      price.innerHTML = "<img src='resourse/layout/price-icon.png' style='height:25px;width:25px'>"+"Price : RM" + data.Price;
      price.classList.add("module_price");
      module.appendChild(price);

      var description = document.createElement("p");
      description.innerHTML = "Description: " + data.Description;
      description.classList.add("module_description");
      module.appendChild(description);

      search_container.appendChild(module);

    });
});
}else if(getPageSession_search().number>1&&getPageSession_search().select==true){
  console.log("2")
  serviceRef
  .where("Jobtitle","==",getPageSession_search().title)
  .where("Location","==",getPageSession_search().state)
  .where("Categories","==",getPageSession_search().categories)
  .where("id",">=",parseInt(getPageSession_search().number-1)*10+1)
  .limit(10).get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    var data = doc.data();
    var module = document.createElement("div");
    module.classList.add("module");

    var title = document.createElement("h1");
    title.innerHTML = data.Jobtitle;
    title.setAttribute("id",doc.id)
    title.classList.add("module_title")
    title.addEventListener("click",function(){
      setjobpage(this.id);
    })
    module.appendChild(title);

    var company = document.createElement("p")
    company.innerHTML = "Owner/Company : " + data.Owner;
    company.classList.add("module_company")
    module.appendChild(company);

    var location = document.createElement("p");
    location.innerHTML = "<img src='resourse/layout/location-icon-png-4240.png' style='height:15px;width:15px'>"+"Location : " + data.Location;
    location.classList.add("module_location")
    module.appendChild(location);

    var price = document.createElement("p");
    price.innerHTML = "<img src='resourse/layout/price-icon.png' style='height:25px;width:25px'>"+"Price : RM" + data.Price;
    price.classList.add("module_price");
    module.appendChild(price);

    var description = document.createElement("p");
    description.innerHTML = "Description: " + data.Description;
    description.classList.add("module_description");
    module.appendChild(description);

    search_container.appendChild(module);
  });
});
}
}//end SearchService()

firebase.auth().onAuthStateChanged(function(user) {

    if(window.location.href.includes('search.html'))
    {
      if(getPageSession_search()==null)
      {
        setPageSession_search(1,false,null,null,null)
      }
      SeacrhService();
      if(getPageSession_search().select==true){
        //console.log("jw")
        document.getElementById("showSearch").innerHTML="<p style='margin:0% 5%; color:gray; font-family:sans-serif; font-size:15px'>"+"Searched Title: <b>"+getPageSession_search().title+  "</b>  <br> Selected State: <b>"+ getPageSession_search().state+ "</b>  <br>Selected Categories: <b>" + getPageSession_search().categories+"</b></p>"
      }
      if (user != null) {
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
        console.log(uid);
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
      setPageSession_search(1,false,null,null,null)
    }
}
);

function generate_number_section(total_item)
{
    var container = document.getElementById("get_page");
    var total_count=total_item/10;
    var start=0;
    if(getPageSession_search().number/10>=1)
    {
        start = getPageSession_search().number-5;
    }
    var limit=0;
    for(var i =0 + parseInt(start); i < total_count; i++)
    {
    if(limit<10){
        var button = document.createElement("button");
        button.classList.add("page_button");
        button.innerHTML=i+1;
        button.setAttribute("id",i+1);
        button.addEventListener("click",function(){
          var temp = getPageSession_search()
            setPageSession_search(this.innerHTML,temp.select,temp.title,temp.state,temp.categories);
            searchClick();
        }
        );
        container.appendChild(button);
        limit++;
    }else{
        break;
    }
    }
    document.getElementById(getPageSession_search().number).setAttribute("style","background-color:rgba(70, 100, 198)")
}

function selectChoiceclick()
{
  var title = document.getElementById("title").value;//get title

  var _state = document.getElementById("state");
  var state = _state.options[_state.selectedIndex].text;//get state

  var _categories = document.getElementById("categories");
  var categories = _categories.options[_categories.selectedIndex].text;//get categories

if(title!=null&&state!="Select State"&&categories!="Select Categories"){
  setPageSession_search(1,true,title,state,categories);

  searchClick();
}else{
  alert("Please fill in all categories and testarea...");
}

}

function _homeClick()
{
  firebase.auth().onAuthStateChanged(function(user) {

    // User is signed in.
    setPageSession_search(1,false,null,null,null)
    window.location.href = "main.html";
    uid = firebase.auth().currentUser;

});
}

function setjobpage(jobid)
{
  var job;
  var contact;
  var email;
  var ownerid;
  console.log(jobid);
  serviceRef.doc(jobid).get().then(function(doc){
  job=doc.data();
  }).then(function(){
    ownerid=job.Ownerid;
    var db = firebase.firestore();
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

function setPageSession_search(pageNum,BoolSelect,_title,_state,_categories)
{
    var page_session = {number:pageNum,select:BoolSelect,title:_title,state:_state,categories:_categories}
    sessionStorage.setItem("search_page_session",JSON.stringify(page_session));
}

function getPageSession_search()
{
    var page_session= sessionStorage.getItem("search_page_session");
    if(page_session)
        page_session = JSON.parse(page_session);
   // console.log(page_session);
    return page_session;
}
