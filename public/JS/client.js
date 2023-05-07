function clickBlue() {
    $("#all").toggle();
  }

/*$(document).ready(function(){
    $("#testform").on("submit",function(event){
        var steamid = $('#steamid').val();
        console.log(steamid)
        //console.log("HELLO???????",user.displayName);
        $.ajax({
            url: "http://localhost:3000/achievements", //your url
            method: "GET",
            data: steamid,
            success: function(data){
                console.log(data);
            },
            error: function(){
                alert("error");
            }
        });
        event.preventDefault();
    });
});*/


