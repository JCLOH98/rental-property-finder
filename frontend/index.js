
const malaysia_states = [
    "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", 
    "Melaka", "Negeri Sembilan", "Pahang", "Penang", "Perak", 
    "Perlis", "Putrajaya", "Sabah", "Sarawak", "Selangor", "Terengganu"
];

const malaysia_states_value = [
    "johor", "kedah", "kelantan", "kuala-lumpur", "labuan", 
    "melaka", "negeri-sembilan", "pahang", "penang", "perak", 
    "perlis", "putrajay", "sabah", "sarawak", "selangor", "terengganu"
];

const malaysia_region_codes = [
    "2hh35", "x5i6n", "8j2mm", "58jok", "aef3q", 
    "5kmak", "r9fza", "9ycjt", "5qvq6", "zagd9", 
    "zop7y", "068mt", "cc02j", "dh4eg", "45nk1", "0eu1z"
];
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

    return property_div;
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
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const response_json = await response.json();

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