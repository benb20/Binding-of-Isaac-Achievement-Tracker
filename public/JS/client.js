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

let currentRatingFilter = null;

function toggleRatingFilter(rating) {
    if (currentRatingFilter === rating) {
        clearRatingFilter();
        return;
    }
    currentRatingFilter = rating;
    applyFilters();
}

function clearRatingFilter() {
    currentRatingFilter = null;
    applyFilters();
}

function applyFilters() {
    const allViews = ['all-view', 'character-view', 'greed-view'];
    allViews.forEach(viewId => {
        const view = document.getElementById(viewId);
        if (view) {
            const items = view.getElementsByClassName('flex-item');
            Array.from(items).forEach(item => {
                if (currentRatingFilter) {
                    // Get the rating from the data attribute
                    const rating = item.getAttribute('data-rating');
                    item.style.display = rating === currentRatingFilter ? 'block' : 'none';
                } else {
                    item.style.display = 'block';
                }
            });
        }
    });
}

function showAll() {
    document.getElementById('all-view').style.display = 'flex';
    document.getElementById('character-view').style.display = 'none';
    document.getElementById('greed-view').style.display = 'none';
    applyFilters();
}

function showCharacters() {
    document.getElementById('all-view').style.display = 'none';
    document.getElementById('character-view').style.display = 'block';
    document.getElementById('greed-view').style.display = 'none';
    applyFilters();
}

function showGreed() {
    document.getElementById('all-view').style.display = 'none';
    document.getElementById('character-view').style.display = 'none';
    document.getElementById('greed-view').style.display = 'block';
    applyFilters();
}

// Initialize tooltips
$(document).ready(function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
});


