var serviceRef = db.collection("Service_listed");
function rj_RegisterJobclick()
{
    var title = document.getElementById("rj_title").value;// get value of title
    var _state = document.getElementById("rj_state");
    var state = _state.options[_state.selectedIndex].text;  // get value of state
    var _categories = document.getElementById("rj_categories");
    var categories = _categories.options[_categories.selectedIndex].text;  // get value of state
    var price = document.getElementById("rj_price").value;
    var description = document.getElementById("rj_description").value;
    var today = new Date();
    var date = String(today.getDate()) +String((today.getMonth()+1))+String(today.getFullYear());
    var time = String(today.getHours())+ String(today.getMinutes())+ String(today.getSeconds());
    var total_service=0;
    serviceRef.get().then(snapshot =>{
        total_service=snapshot.size;
        console.log(total_service);
        if(title!=null&&state!="Select State"&&categories!="Select Categories"&&price!=null&&description!=null)
        {
            console.log(title+ " "+state + " " + categories + " " + price + " "+description + " " + uid +" "+ currName + " " + date + " " + time);//test
            db.collection("Service_listed").doc("SL"+date+time).set({
                Description: description,
                Jobtitle: title.toLowerCase(),
                Location: state,
                Owner:currName,
                Price:price,
                Categories:categories,
                Ownerid:uid,
                Date_created:date,
                Time_created:time,
                id:total_service+1
            })
            .then(function() {
                console.log("Document successfully written!");
                alert("Job has submitted!!!");
                homeClick();
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
    
        }
      })
   
    
}
