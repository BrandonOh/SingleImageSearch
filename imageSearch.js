// Select the form element from ImageSearch.html 
const form = document.getElementById("imgSearchForm");
// API key from your Pexel Account, free to make https://www.pexels.com/api/
const API_Key = "YOUR API KEY HERE";
// Endpoint URL for REST API
const endpoint ="https://api.pexels.com/v1/search?query="
textResp = document.getElementById("textResp");

// Function for random between a max and min value inclusive
function random(max){
    randomNum = Math.floor((Math.random() * (max - 1) + 1));
    return randomNum;
};

// Function for output to html page
function respond(src,alt,photographer){
    imgOutput.src = src;
    imgOutput.alt = `${alt} by ${photographer}`;
    textResp.innerHTML = `${alt} by ${photographer}`;
};

// EventListener for submit button to search for a single random image
form.addEventListener("submit",function(event){
    // Disable the refresh of pressing the submit button functionality
    event.preventDefault();

    imgInput = document.getElementById("imgInput").value + "&per_page=80";
    
    // Fetch for GET response of Pexel API
    fetch(endpoint+imgInput,{
        method: "GET",
        headers: {
            "Authorization": API_Key,
        }
    }).then(response => {
        // Parsing the response into a workable json
        return response.json();
    }).then(data=> {
        // See if there are more than 80 results
        if(data.total_results > 80){
            // Fetch a random page with 80 results per page
            fetch(endpoint+imgInput+ "&page=" + random(data.total_results / 80),{
                method: "GET",
                headers: {
                    "Authorization": API_Key,
                }
            }).then(response => {
                // Parsing the response into workable json
                return response.json();
            }).then(data=> {
                // Select a random image of the 80 choices
                imgSelect = data.photos[random(80) - 1];
                // Output to img object on html page
                respond(imgSelect.src.medium, imgSelect.alt, imgSelect.photographer);
            });
        // See if there are atleast 1 or more images
        }else if(data.total_results >= 1){
                // Select a random image of the maximum amount of choices
                imgSelect = data.photos[random(data.total_results) - 1];
                // Output to img object on html page
                respond(imgSelect.src.medium, imgSelect.alt, imgSelect.photographer);
        } else {
            // Return response text of no images found and clear the previous image
            imgOutput.src = "";
            imgOutput.alt = '';
            textResp.innerHTML = "No Photos Found For Search";
        }
    });
});


