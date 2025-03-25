// When the page loads, fetch and display inventory
window.onload = loadInventory;

const ITEMS_PER_PAGE = 5; // Number of items displayed at a time
const ADMIN_EMAIL_ID = "noteworthy_admin@gmail.com"; // Email ID of admin
let currentPage = 1;
let instrInventory = []; // Array to store all the inventory data

 
async function fetchInventoryInfo() {
    let response = await fetch('inventory.csv');
    if (!response.ok) {
        throw new Error('File not found');
    }
    return response.text();
}

// Load inventory from csv file
// needs to be async as await is used  
// without await code will not wait for fetch() to complete
// fetch is asynchronous
async function loadInventory() {
    try {
        console.log("Loading inventory...");
        let csvText = await fetchInventoryInfo();
        instrInventory = processInventoryInfo(csvText);
        displayInventory(instrInventory, currentPage);
    } catch (error) {
        console.error('Error loading CSV file:', error);
    }
}


// Read from csv file line by line and return array of instruments
function processInventoryInfo(csvText) {
    console.log("Reading inventory...");
    let invArray = [];
    let rows = csvText.split("\n");

    for (let i = 1; i < rows.length; i++) {  //skip the first line with header
        let columns = rows[i].split(",");
        if (columns.length === 4) {
            let instrument = {
                id_num: columns[0].trim(),
                name: columns[1].trim(),
                size: columns[2].trim(),
                quality: columns[3].trim()
            };
            invArray.push(instrument);
        }
    }
    return invArray;
}

// Display inventory with pagination
// A specified number of items only are displayed at a time
// defined above with ITEMS_PER_PAGE constant
// This function constructs an html table element for
// the specified page number from the given inventory
function displayInventory(inventory, page) {
    console.log("Displaying inventory...");
    let container = document.getElementById("inventoryTable");
    container.innerHTML = "";

    let table = document.createElement("table");
    table.classList.add("inventory-table");

    let thead = document.createElement("thead");
    let headerRow = document.createElement("tr");

    let headers = ["Id Number", "Instrument Name", "Size", "Quality"];
    headers.forEach(headerText => {
        let th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    let tbody = document.createElement("tbody");

    let start = (page - 1) * ITEMS_PER_PAGE;
    let end = start + ITEMS_PER_PAGE;
    let paginatedItems = inventory.slice(start, end);

    paginatedItems.forEach(item => {
        let row = document.createElement("tr");

        let id_num = document.createElement("td");
        id_num.textContent = item.id_num;
        row.appendChild(id_num);

        let instrumentName = document.createElement("td");
        instrumentName.textContent = item.name;
        row.appendChild(instrumentName);

        let size = document.createElement("td");
        size.textContent = item.size;
        row.appendChild(size);

        let quality = document.createElement("td");
        quality.textContent = item.quality;
        row.appendChild(quality);
/*
        let requestButton = document.createElement("td");
        let button = document.createElement("button");
        button.textContent = "Request";
        button.classList.add("request-btn");
        button.onclick = function () {
            submitRequest(item);
        };
        requestButton.appendChild(button);
        row.appendChild(requestButton);
*/
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    displayPageNum(inventory);
}

// Display pagination controls
function displayPageNum(inventory) {
    let paginationContainer = document.getElementById("paginationControls");
    paginationContainer.innerHTML = "";

    let totalPages = Math.ceil(inventory.length / ITEMS_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {
        let pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList.add("pagination-btn");
        if (i === currentPage) {
            pageButton.classList.add("active");
        }
        pageButton.onclick = function () {
            currentPage = i;
            displayInventory(inventory, currentPage);
        };
        paginationContainer.appendChild(pageButton);
    }
}

// Search function
function searchInventory() {
  let searchInput = document.getElementById("searchBox").value.toLowerCase();
  let filteredInv = []; // stores filtered inventory items

  for (let item of instrInventory) {
      if (
          item.name.toLowerCase().includes(searchInput) ||
          item.size.toLowerCase().includes(searchInput) ||
          item.quality.toLowerCase().includes(searchInput)
      ) {
          filteredInv.push(item);
      }
  }

  currentPage = 1;
  displayInventory(filteredInv, currentPage);
}
// Submit request
/*
function submitRequest(item) {
    console.log("Request submitted for:", item);
    alert(`Thank You for your interest in NoteWorthy! Your Request for '${item.name}' (Size: ${item.size}, Quality: ${item.quality}) has been sent.`);
}
*/

//When a request is submitted for an instrument, an email is sent out to the admin with specified email id (ADMIN_EMAIL_ID)
function handleFormSubmission(event) {
    event.preventDefault();
    
    let form = event.target;
    let formData = new FormData(form);
    let params = new URLSearchParams(formData).toString();

    let email = ADMIN_EMAIL_ID;
    let subject = encodeURIComponent("NoteWorthy Instrument Application Submission");
    let body = ([...formData.entries()].map(([key, value]) => `${key}: ${value}`).join("\n"));
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

    form.reset();
    alert(`Thank You for your interest in NoteWorthy! Your Request for has been sent.${body}`);
    //redirect back to home page
    window.location.href = "index.html";
    
}

document.getElementById("instrumentApplicationForm").addEventListener("submit", handleFormSubmission);



// Hover Function for Navigation Bar
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll(".navbar__menu a");
    
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener("mouseover", function() {
            links[i].classList.add("hovered");
        });

        links[i].addEventListener("mouseout", function() {
            links[i].classList.remove("hovered");
        });

        links[i].addEventListener("touchstart", function() {
            links[i].classList.add("hovered");
        });

        links[i].addEventListener("touchend", function() {
            links[i].classList.remove("hovered");
        });
    }
});

