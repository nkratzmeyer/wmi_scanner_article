const wmi = require("node-wmi");

//Dom elements
const scannedList = document.getElementById("scanned");
const btnScan = document.getElementById("scan");
const inputHost = document.getElementById("host-name");

//Handle clicking the scan button
btnScan.addEventListener("click", e => {
  //Grab the hostname from input
  const hostName = inputHost.value;

  //Create an options object to be passed to wmi.Query
  const queryOptions = {
    class: "Win32_BIOS",
    host: hostName,
    //Only get these properties
    properties: ["Manufacturer", "SerialNumber"]
  };

  //Execute the query and use a callback to get results
  wmi.Query(queryOptions, (err, data) => {
    if (err) {
      return console.log(err);
    }
    console.log(data);

    //Get only the first item in the array
    const biosItem = data[0];

    //Create a <div> to put our data in
    const newDomElement = document.createElement("div");

    //Add a class so we can style the div
    newDomElement.classList.add("scanned-pc");

    //Put in our data
    newDomElement.innerHTML = `<p>${hostName} -- ${biosItem.SerialNumber}</p>
                               <p>Manufacturer -- ${biosItem.Manufacturer}</p>`;

    //Add our div to the DOM
    scannedList.appendChild(newDomElement);
  });
});
