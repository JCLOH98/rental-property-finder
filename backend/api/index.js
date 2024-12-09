

const express=require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app=express();

app.use((req, res, next) => {
    // console.log(req.query);
    next(); // Proceed to the next middleware or route
  });

app.use(cors());

app.get("/scrape_rental_source_1", async (req,res) => {

    // data from frontend
    const { region_code, min_price, max_price, bedrooms, sort_by } = req.query;
    
    // standardize data
    let bedrooms_string = "";
    for (let i=0; i<bedrooms; i++) {
        if (i===0) {
            bedrooms_string += `beds[]=${bedrooms}`;
        }
        else {
            bedrooms_string += `&beds[]=${bedrooms}`;
        }
    }
    let sort_by_string = "";
    if (sort_by === "lowest-price") {
        sort_by_string = "sort=price&order=asc";
    }

    // GET the data
    let url=`https://www.propertyguru.com.my/property-for-rent/?market=residential&region_code=${region_code}&minprice=${min_price}&maxprice=${max_price}&${bedrooms_string}&${sort_by_string}&search=true`;

    console.log(url)
    
    try {
        const browser = await puppeteer.launch({ headless: true })
        
        const page = await browser.newPage()

        // set user agent and viewport to simulate browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });

        // GET the page
        await page.goto(url);

        // // [testing] GET the data
        // let element = await page.waitForSelector("title")
        // let text = await page.evaluate(
        //     element => element.textContent, element)
        // console.log(text)
        // res.send(text)

        // GET the property data
        await page.waitForSelector('.listing-card');
        const properties = await page.$$('.listing-card');

        for (const property of properties) {
            let title = await property.$eval("h3",element => element.textContent)
            let location = await property.$eval(".listing-location", element => element.textContent)
            let price = await property.$eval(".list-price", element => element.textContent)
            let bed = await property.$eval(".bed", element => element.title)
            let bath = await property.$eval(".bath", element => element.title)
            console.log(title)
            console.log(location)
            console.log(price)
            console.log(bed)
            console.log(bath)
            console.log("=====")
        }




        browser.close()


    }
    catch (err){
        console.log(err);
    }

});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});