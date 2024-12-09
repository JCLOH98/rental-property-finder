
const malaysia_states = [
    "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", 
    "Melaka", "Negeri Sembilan", "Pahang", "Penang", "Perak", 
    "Perlis", "Putrajaya", "Sabah", "Sarawak", "Selangor", "Terengganu"
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
        // option.setAttribute("value",state.toLowerCase().replace(" ","-"));
        option.setAttribute("value",state);
        if (state=="Kuala Lumpur") {
            option.setAttribute("selected",true);
        }
        states.appendChild(option);
    }
}

const scrapePropertyGuru = ()=>{

}

const scrapeIProperty = async (state,bedrooms,min_price,max_price,sort_by) => {

    // standardize data
    const region_code = malaysia_region_codes[malaysia_states.indexOf(state)];

    // request url
    let url=`${process.env.BACKEND_URI}/scrape_rental_source_1?region_code=${region_code}&min_price=${min_price}&max_price=${max_price}&bedrooms=${bedrooms}&sort_by=${sort_by}&search=true`;

    // GET data
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const html = await response.text();
        // console.log("html",html)
        
        // const parser = new DOMParser();
        // const doc = parser.parseFromString(html, 'text/html');

        // // You can also scrape other data from the page, such as:
        // const title = doc.querySelector('title').textContent;
        // console.log('Title of the page:' + title);
        document.getElementById("result").innerText = 'Title of the page:' + html;
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
    
    if (country=="Malaysia") {
        scrapeIProperty(state,bedrooms,min_price,max_price,sort_by);
    }
}


// these are added here so webpack can run
generateState();
document.getElementById('search-button').addEventListener('click', scrapeData);