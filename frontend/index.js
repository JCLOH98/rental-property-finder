
const malaysia_states = [
    "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", 
    "Melaka", "Negeri Sembilan", "Pahang", "Penang", "Perak", 
    "Perlis", "Putrajaya", "Sabah", "Sarawak", "Selangor", "Terengganu"
];

const malaysia_states_value = [
    "johor", "kedah", "kelantan", "kuala-lumpur", "labuan", 
    "melaka", "negeri-sembilan", "pahang", "penang", "perak", 
    "perlis", "putrajaya", "sabah", "sarawak", "selangor", "terengganu"
];

const malaysia_region_codes = [
    "2hh35", "x5i6n", "8j2mm", "58jok", "aef3q", 
    "5kmak", "r9fza", "9ycjt", "5qvq6", "zagd9", 
    "zop7y", "068mt", "cc02j", "dh4eg", "45nk1", "0eu1z"
];


// map implementation
let map = L.map('map-view').setView([3.051487, 101.5823339], 13);
let geocoder = new L.Control.Geocoder.Nominatim();
let markers = L.layerGroup().addTo(map);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
let geocontrol = L.Control.geocoder({
    geocoder: geocoder,
    defaultMarkGeocode: false
}).addTo(map);
geocontrol.on('markgeocode', function(e) {
    const geocode = e.geocode;
    console.log(geocode)
    L.marker(geocode.center).addTo(markers)
    .bindPopup(geocode.name)
    .openPopup();
});
let routingcontrol = "";


const generateState = () => {
    let states = document.getElementById("state");
    malaysia_states.sort();
    for (let state of malaysia_states) {
        const option = document.createElement("option");
        option.innerText = state;
        option.setAttribute("value",state.toLowerCase().replace(" ","-"));
        // option.setAttribute("value",state);
        if (state=="Kuala Lumpur") {
            option.setAttribute("selected",true);
        }
        states.appendChild(option);
    }
}

function formatPropertyDiv (idx,title,location,price,room_info,link) {
    let property_div = document.createElement("div");
    property_div.classList.add("property-div");

    // property_div.innerHTML += `<div>idx:${idx}</div>`;
    property_div.innerHTML += `<h6>${title}</h6>`;
    property_div.innerHTML += `<div>${location}</div>`;
    property_div.innerHTML += `<div>${price}</div>`;
    property_div.innerHTML += `<div>${room_info}</div>`;
    property_div.innerHTML += `<a href="${link}" target="blank">${link}</a>`;
    property_div.addEventListener("click",async ()=>{
        // will get the very 1st result on map if clicked
        await getLatLon(title);

        // will set the text at the "to location also"
        document.getElementById("to-location").value = title;
    })

    return property_div;

}

const searchLocation = async (search_term,direction) => {
    try {
        const result = await geocoder.geocode(search_term);
        const location_container = document.getElementById(direction+"-location-container");
        location_container.classList.add("relative");
        const location_input = document.getElementById(direction+"-location")
        const location_options = document.getElementById(direction+"-location-option");

        
        // add a close dialog button just in case user dont want to select
        const close_button = document.createElement("button");
        close_button.innerText = "CLOSE";
        close_button.addEventListener("click",()=> {
            //hide the options
            location_container.classList.remove("relative");
            location_options.innerHTML = "";
            location_options.classList.remove("flex");
            location_options.classList.remove("visible");
            location_options.classList.add("hidden");
            location_options.classList.add("invisible");
        })
        
        
        // document.getElementById("result").innerText = JSON.stringify(result);
        if (result.length > 0) {
            if (result.length > 1) { // more than 1 result, show as option
                // document.getElementById("result").innerText = JSON.stringify(result);
                result.forEach((res, index) => {
                    // Create an option element for each result
                    const option = document.createElement('button');
                    option.classList.add("location-option-button")
                    option.innerText = res.name;
                    option.addEventListener("click",()=> {
                        //hide the options
                        location_container.classList.remove("relative");
                        location_options.innerHTML = "";
                        location_options.classList.remove("flex");
                        location_options.classList.remove("visible");
                        location_options.classList.add("hidden");
                        location_options.classList.add("invisible");

                        //set the location
                        location_input.value = res.name;
                        map.setView(res.center,13);
                        L.marker(res.center).addTo(markers)
                        .bindPopup(res.name)
                        // .bindPopup(res.html)
                        .openPopup();
                    })
                    location_options.appendChild(option);
                });
                location_options.classList.remove("hidden");
                location_options.classList.remove("invisible");
                location_options.classList.add("flex");
                location_options.classList.add("visible");
                location_options.appendChild(close_button);

            }
            else { // only 1 result
                map.setView(result[0].center,13);
                L.marker(result[0].center).addTo(markers)
                .bindPopup(result[0].name)
                // .bindPopup(result[0].html)
                .openPopup();
            }
        }
        else { //no result
            location_options.innerText = "No result found";
            location_options.classList.remove("hidden");
            location_options.classList.remove("invisible");
            location_options.classList.add("flex");
            location_options.classList.add("visible");
            location_options.appendChild(close_button);
        }
    }
    catch(err) {
        document.getElementById("result").innerText = 'Error:'+err;
    }
}

const getLatLon = async (search_term) => {
    try {
        const result = await geocoder.geocode(search_term);
        if (result.length > 0) {
            map.setView(result[0].center,13);
            L.marker(result[0].center).addTo(markers)
            .bindPopup(result[0].name)
            .openPopup();
            return result[0].center;
        }
    }
    catch(err) {
        alert('Error:'+err);
    }
}

const getRentProperty = async (state,bedrooms,min_price,max_price,sort_by,search_term) => {

    // standardize data
    let region_code = malaysia_region_codes[malaysia_states_value.indexOf(state)];

    if (!document.getElementById("use-state").checked) {
        state="";
        region_code="";
    }

    // request url
    let url=`${process.env.BACKEND_URI}/get_rental?state=${state}&region_code=${region_code}&min_price=${min_price}&max_price=${max_price}&bedrooms=${bedrooms}&sort_by=${sort_by}&search_term=${search_term}`;

    // GET data
    try {
        document.getElementById("result").innerText = "Searching..."
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const response_json = await response.json();

        document.getElementById("result").innerText = "";
        for (const key in response_json) {
            if (response_json.hasOwnProperty(key)) {    
                const property_data = response_json[key];
                document.getElementById("result").appendChild(formatPropertyDiv(key,property_data.title,property_data.location,property_data.price,property_data.room_info,property_data.link));
                
            }
        }
        // document.getElementById("result").innerText = response_json;
    }
    catch (err){
        console.error('Error:', err);
        document.getElementById("result").innerText = 'Error:'+err;
    }

}

const scrapeData = () => {
    const country = document.getElementById("country").innerText;
    const state = document.getElementById("state").value;
    const bedrooms = document.getElementById("bedrooms").value;
    const min_price = document.getElementById("min-price").value;
    const max_price = document.getElementById("max-price").value;
    const sort_by = document.getElementById("sort-by").value;
    const search_term = document.getElementById("search-term").value;

    document.getElementById("result").innerText = "";
    
    if (country=="Malaysia") {
        getRentProperty(state,bedrooms,min_price,max_price,sort_by,search_term);
    }
}

// these are added here so webpack can run
generateState();
document.getElementById('search-button').addEventListener('click', scrapeData);
document.getElementById("from-location").addEventListener("keydown", (event)=> {
    if (event.key === 'Enter') {
        searchLocation(document.getElementById("from-location").value,"from");
    }
})

document.getElementById("to-location").addEventListener("keydown", (event)=> {
    if (event.key === 'Enter') {
        searchLocation(document.getElementById("to-location").value,"to");
    }
})
document.getElementById("get-route").addEventListener("click", async ()=> {
    markers.clearLayers(); //clear the markers
    if (routingcontrol) {
        map.removeControl(routingcontrol);
    }
    // get the from location
    const from_latlon = await(getLatLon(document.getElementById("from-location").value));
    // get the to location
    const to_latlon = await(getLatLon(document.getElementById("to-location").value));
    // form the route
    // console.log(from_latlon);
    // console.log(to_latlon);
    routingcontrol = L.Routing.control({
        waypoints: [
          L.latLng(from_latlon.lat, from_latlon.lng),
          L.latLng(to_latlon.lat, to_latlon.lng)
        ],
        router: L.Routing.osrmv1({
            profile: "car"
        }),
        lineOptions: {
            styles: [
                {
                    color: '#0066cc',
                    weight: 8,
                    opacity: 1,
                }
            ]
        }
    }).addTo(map);
})

document.getElementById("clear-map").addEventListener("click", async ()=> {
    markers.clearLayers(); //clear the marker
    if (routingcontrol) {
        map.removeControl(routingcontrol);
    }
})