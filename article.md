In this article, I'm going to do a quick walk-through of how to create a very simple WMI (Windows Management Instrumentation) scanner for Windows, using ElectronJS. The intention of this article is to show one of the types of apps that you can create with ElectronJS as well as to demonstrate the very basic architecture of such an app. A familiarity with Javascript, NodeJS, npm, HTML, and CSS would be best to get the most out of this article. I won't be going in-depth at all but will be happy to explain any of my code should questions arise. Let's get started!

To start us off, we're going to clone the ElectronJS quick start repo. Fire up a terminal, change to an appropriate directory and run the following commands:

```
git clone https://github.com/electron/electron-quick-start
cd electron-quick-start
npm install
npm start
```

Now you have a barebones ElectronJS app running! Now fire up your favorite code editor and clean up the project by removing **LICENSE.md**, **preload.js**, and **README.md**. Clean up **index.html** by removing everything from the body except the script tag for **renderer.js**. In **main.js**, remove the path import. Also, change

```javascript
 preload: path.join(__dirname, 'preload.js');
```

to

```javascript
nodeIntegration: true;
```

This will give our renderer code access to node environment. Now uncomment the line to show devtools in the main window.
```javascript
mainWindow.webContents.openDevTools();
```

 Now we are pretty much done with **main.js**. Everything else will be done in **renderer.js**. 

Now let's prep our **index.html** file. Add the following code to the body tag

```html
<div id="scanned">
</div>
<hr>
<input type="text" name="host" id="host-name">
<button id="scan">Scan</button>
```
Now we have our basic HTML structure, let's add some styling so it doesn't look terrible. Create a **main.css** file and reference it inside **index.html**. In **main.css**, add the following:
```css
body{
    font-family: Arial, Helvetica, sans-serif;
    background: #eee;
}

#scanned{
    background: white;
    padding: 10px;
    border: 1px solid gray;
    height: 400px;
}

input{
    font-size: 20px;
    border : 1px solid lightgrey;
}

button {
    font-size: 20px;
    border : 1px solid lightgrey;
    background: dodgerblue;
    color: white;
}
```

Our next step is to install the [module](https://github.com/jpgrusling/node-wmi) that will help us do our WMI queries. Do this by running
```
npm install node-wmi
```
in your project directory. Now let's require that module in **renderer.js** and write code for our scan. Do so with the following code.
```javascript
//renderer.js

const wmi = require("node-wmi");

//Dom elements
const scannedList = document.getElementById('scanned');
const btnScan = document.getElementById("scan");
const inputHost = document.getElementById("host-name");

//Handle clicking the scan button
btnScan.addEventListener("click", e => {
    //Grab the hostname from input
  const hostName = inputHost.value;

  //Create an options object to be passed to wmi.Query
  const queryOptions = {
    class: "Win32_BIOS",
    host: hostName
  };

  //Execute the query and use a callback to get results
  wmi.Query( queryOptions , (err, data) => {
    if (err) {
      return console.log(err);
    }
    console.log(data);
  });
});
```
If everything is correct, you should be able to run the app with **npm start**, enter "localhost" as the host name, click Scan and see a BIOS object output in the console. You will need admin rights on your machine for this to work properly. If you are on a LAN and have admin rights to other machines, you can enter their host names to see results from remote Windows PCs. 
Notice that the BIOS object we got back has a lot of properties that we don't care about. Also notice that we are getting back an **array**. Let's only ask for the properties we want and only use the first item of the array. Also, we'll output our data to the app instead of the console. Modify the **click** event listener as shown below. 
```javascript
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
```
Awesome! Now we have our info showing in the app instead of the console. The last thing we will do is to style our div item so it looks a little better. In **main.css**, add this:
```css
.scanned-pc{
    box-shadow: 2px 2px 2px rgba(1, 1, 1, .75);
    background: lightgray;
    padding: 2px 5px;
    margin-bottom: 4px;
}
```
Now you can view our app in all of its grayscale glory. To augment the app, try using a different WMI class such as Win32_ComputerSystem or even doing multiple queries with different classes to get lots of info about a PC. And obviously the app could use some help in the style department. :blush: You can also deploy the app with help of **electron-builder** or a similar packaging system. See [the docs](https://electronjs.org/docs/tutorial/application-distribution) for more info. 
As you can see, Electron is a pretty cool technology which gives you the power of NodeJS, HTML, and CSS to create desktop apps. I hope this post was informative and at least got you excited to play around with ElectronJS for your next desktop app. 
