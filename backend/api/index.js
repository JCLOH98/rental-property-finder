

const express=require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const axios = require('axios');

const app=express();

app.use((req, res, next) => {
    // console.log(req.query);
    next(); // Proceed to the next middleware or route
  });

app.use(cors());

const minMaxPriceChecker = (min,max) => {
    let buf = 0;
    if (min > max) {
        buf = min;
        min = max;
        max = buf;
    }
    return { min, max };
}


function getClosestPricing(min_price, max_price) {
    const pricings = [
        200, 400, 600, 800, 1000, 1500, 2000, 2500, 3000, 3500,
        4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000, 20000, 40000, 60000, 80000, 100000
    ];

    // Find the closest higher price for min_price
    let closest_higher_min = pricings.filter(price => price >= min_price).sort((a, b) => a - b)[0];

    // Find the closest lower price for max_price
    let closest_lower_max = pricings.filter(price => price <= max_price).sort((a, b) => b - a)[0];

    return {closest_higher_min, closest_lower_max};
}

const scrapeIProperty = async (req,listing_idx) => {
    // data from frontend
    let { state, region_code, min_price, max_price, bedrooms, sort_by, search_term } = req.query;
    const { min, max } = minMaxPriceChecker(min_price, max_price);
    // console.log(sorted_min, sorted_max);
    const { closest_higher_min, closest_lower_max} = getClosestPricing(min, max); //for iPropertyOnly
    // console.log(closest_min, closest_max);
    let sort_by_string = "";
    if (sort_by === "lowest-price") {
        sort_by_string = "sortBy=price-asc";
    }

    let state_string = `/${state}-${region_code}`;
    let url=`https://www.iproperty.com.my/rent${state===""?"":state_string}/all-residential/?bedroom=${bedrooms}&minPrice=${closest_higher_min}&maxPrice=${closest_lower_max}&${sort_by_string}&q=${encodeURIComponent(search_term)}&l1`;

    console.log(url);
    let listing = {};
    let listings = {};
    try {
        const browser = await puppeteer.launch({ headless: true })
        
        const page = await browser.newPage()

        // set user agent and viewport to simulate browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });

        // GET the page
        await page.goto(url);
        page.setDefaultTimeout(10000);

        // GET the property data
        
        // await page.waitForSelector('.listing-list');
        // const properties = await page.$$('.listing-list');

        await page.waitForSelector(".ListingsListstyle__ListingListItemWrapper-hjHtwj");
        const properties = await page.$$('.ListingsListstyle__ListingListItemWrapper-hjHtwj');
        // console.log('Number of listing items:', properties.length);

        for (const property of properties) {
            let title = await property.$eval("h2",element => element.textContent)
            
            let location = ""
            try { //basic styling
                location = await property.$eval(".BasicCardstyle__AddressWrapper-jUpzVZ", element => element.textContent)
            }
            catch(err) {
                try { //featured styling
                    location = await property.$eval(".FeaturedCardstyle__AddressWrapper-hTnZXH", element => element.textContent);
                }
                catch (err) { //premium styling
                    location = await property.$eval(".PremiumCardstyle__AddressWrapper-dFhRxY", element => element.textContent)
                }
            }
            let price = await property.$eval(".ListingPricestyle__ItemWrapper-etxdML", element => element.textContent)
            price = parseInt(price.replace(",","").replace("RM",""))
            let room_info = await property.$eval(".attributes-facilities-wrapper", element => {
                let info = [];
                // element.textContent
                if (element.querySelector('.bedroom-facility')) {
                    info.push(element.querySelector('.bedroom-facility').textContent+" bedrooms");
                }
                if (element.querySelector('.bathroom-facility')) {
                    info.push(element.querySelector('.bedroom-facility').textContent+" bathrooms");
                }
                if (element.querySelector('.carPark-facility')) {
                    info.push(element.querySelector('.bedroom-facility').textContent+" carparks");
                }
                return info;

            })
            let link = await property.$eval("a", element => element.href);

            // console.log(title)
            // console.log(location)
            // console.log(price)
            // console.log(room_info)
            // console.log(link)
            // console.log("=====")

            //format to JSON and return to front end
            listing = {
                "title": title,
                "location": location,
                "price": price,
                "room_info": room_info,
                "link": link
            }

            listings[listing_idx] = listing;
            listing_idx ++;
        }

        browser.close();

    }
    catch (err){
        console.log(err);
    }

    return listings;


}

const scrapePropertyGuru = async (req) => {
    // data from frontend
    let { state, region_code, min_price, max_price, bedrooms, sort_by, search_term} = req.query;
    const { min, max } = minMaxPriceChecker(min_price, max_price);
    
    // standardize data
    let bedrooms_string = "";
    if (bedrooms > 1) {
        bedrooms_string += `beds[]=${bedrooms}`;
        for (let i=bedrooms; i<=5; i++) {
            bedrooms_string += `&beds[]=${i}`;
        }
    }
    else {
        bedrooms_string += `beds[]=0&beds[]=1`;
    }
    let sort_by_string = "";
    if (sort_by === "lowest-price") {
        sort_by_string = "sort=price&order=asc";
    }

    // GET the data
    let state_string = `&region_code=${region_code}`;
    let url=`https://www.propertyguru.com.my/property-for-rent/?market=residential${state===""?"":state_string}&minprice=${min}&maxprice=${max}&${bedrooms_string}&${sort_by_string}&freetext=${encodeURIComponent(search_term)}&search=true`;

    console.log(url)
    let listing = {};
    let listings = {};
    let listing_idx = 0;
    try {
        const browser = await puppeteer.launch({ headless: true })
        
        const page = await browser.newPage()

        // set user agent and viewport to simulate browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });

        // GET the page
        await page.goto(url);

        // GET the property data
        await page.waitForSelector('.listing-card');
        const properties = await page.$$('.listing-card');

        for (const property of properties) {
            let title = await property.$eval("h3",element => element.textContent)
            let location = await property.$eval(".listing-location", element => element.textContent)
            let price = await property.$eval(".list-price", element => {
                //element.textContent
                return parseInt(element.querySelector('.price').textContent.replace(",",""));
            })
            let room_info = await property.$eval(".listing-rooms", element => {
                let titles = Array.from(element.children).map(child => child.getAttribute('title'));
                return titles;
            })

            let link = await property.$eval(".listing-card-img-footer", element => element.href);
            // console.log(title)
            // console.log(location)
            // console.log(price)
            // console.log(room_info)
            // console.log(link)
            // console.log("=====")

            //format to JSON and return to front end
            listing = {
                "title": title,
                "location": location,
                "price": price,
                "room_info": room_info,
                "link": link
            }

            listings[listing_idx] = listing;
            listing_idx ++;
        }

        browser.close();

    }
    catch (err){
        console.log(err);
    }

    // console.log(listings);
    return listings;

}
app.get("/get_rental", async (req,res) => {
    let listings1 = await scrapePropertyGuru(req);
    let listings2 = await scrapeIProperty(req,Object.keys(listings1).length);
    // console.log(Object.keys(listings1).length);
    // console.log(Object.keys(listings2).length);

    let Obj = {...listings1, ...listings2}
    // console.log(Obj)
    // console.log(Object.keys(Obj).length);
    console.log("Done /get_rental")
    res.json(Obj);

});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});