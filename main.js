//Google maps autocomplete code for location begin.
var input = document.getElementById('eventLocation');
var eventLocation = new google.maps.places.Autocomplete(input, { types: ['(cities)'] });
google.maps.event.addListener(eventLocation, 'place_changed', function () {
    var place = eventLocation.getPlace();
})
//Google maps autocomplete code for location end.


//anon oauth token
var token = 'GGAQ2BUKIRGJMZMU55YZ';
//org id

var results = $(".js-search-results");

function getDataFromApi(query) {
    console.log('getDataFromAPi was run')
    let location = `${query.location}`,
        events = `${query.event}`,
        distance = `${query.distance}`,
        date = `${query.date}`
    let resultHeader = "<p><h2> Here are your results for " + events + " in " + location.replace(', USA', '') + " for " + date.replace('_', ' ') + "</h2></p>";
    results.html("<i>Loading events, please stand by...</i>");
    $.get('https://www.eventbriteapi.com/v3/events/search/?token=' + token + '&q=' + events + '&location.address=' + location +
        '&start_date.keyword=' + date + '&location.within=' + distance + '&sort_by=date' + '&expand=venue', function (res) {
            if (res.events.length) {

                var s = "";
                for (var i = 0; i < res.events.length; i++) {
                    var event = res.events[i];
                    var desc = event.description.text;
                    let d;
                    if (desc) { d = desc.substring(0, 250) }
                    else { d = "no description available" };
                    var eventTime = moment(event.start.local).format('M/D/YYYY h:mm A');
                    console.dir(event);
                    s += "<div class='eventList'>";
                    s += "<h2><a href='" + event.url + "' target='_blank'>" + event.name.text + "</a></h2>";
                    s += "<p><b>Location: " + event.venue.address.address_1 + "</b><br/>";
                    s += "<b>Date/Time: " + eventTime + "</b></p>";
                    s += "<p>" + d + "...</p>";
                    s += "<p>" + "<a href='" + event.url + "' target='_blank'>" + "<b>click here for more info</b>" + "</p>";
                    /*s += "<p>" + event.description.text + "</p>";*/
                    s += "</div>";
                }
                results.html(resultHeader);
                results.append(s);
            } else {
                results.html("<p>Sorry, there are no upcoming events.</p>");
            }
        });
};


function watchSubmit() {
    $('.js-search-form').submit(event => {
        event.preventDefault();
        console.log('submit button test');

        let query = {};
        console.log('query is' + `${query}`);
        //get value from location field
        const queryLocation = $(event.currentTarget).find('.eventLocation');
        query.location = queryLocation.val();
        console.log('function watchSubmit ran, query location =' + `${query.location}`);
        queryLocation.val("");

        //get value from event field
        const queryEvent = $(event.currentTarget).find('.eventName');
        query.event = queryEvent.val();
        console.log('function watchSubmit ran, query event =' + `${query.event}`);
        queryEvent.val("");

        //get value from search radius field
        const queryDistance = $(event.currentTarget).find('.eventDistance');
        query.distance = queryDistance.val();
        console.log('function watchSubmit ran, query distance =' + `${query.distance}`);
        queryDistance.val("");

        //get value from dates field
        const queryDate = $(event.currentTarget).find('.eventDate');
        query.date = queryDate.val();
        console.log('function watchSubmit ran, query date =' + `${query.date}`);
        queryDate.val("");
        console.log('function watchSubmit ran');

        getDataFromApi(query);
    });
}

function watchIntroSubmit() {
    startIntro();
}

function startIntro() {
    $('.intro').on('click', '.getStarted', function (event) {
        $('.intro').remove();
        $('.form').css('display', 'block');
        $(watchSubmit);
    });
}

$(watchIntroSubmit);

