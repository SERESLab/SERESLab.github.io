
// const jsonData = new Promise((resolve, reject) => {
//     fetch('../data/tags.json')
//         .then(response => response.json())
//         .then(data => console.log(data))
//         .catch(error => console.log(error));
// })

// let data = require('../../data/tags.js')
// fetch("../data/tags.json").then(
//     (response) => {
//         console.log(response)
//         response.json()
//     }).then(
//         (data) => {
//             console.log(data)
//         }
//     )
// import data from '../../data/tags.json';
// console.log((data.length));

let data = [
      {
        "id": 1,
        "name": "susan smith",
      },
      {
        "id": 2,
        "name": "anna johnson",
      },
      {
        "id": 3,
        "name": "peter jones",
      },
      {
        "id": 4,
        "name": "bill anderson",
      }
    ];

  console.log(data.length)
for (let i = 0; i < data.length; i++) {
    console.log(`${i} id:${data[i].id}, name:${data[i].name}`)
  }
  

// code from https://www.w3schools.com/howto/howto_js_filter_elements.asp
// code from https://www.w3schools.com/js/js_json_html.as

// each publication has x amount of tags,
// need to figure out how to assign those tags if they're going
// to be generated from a JSON file

// assuming that the tags are only going to be pulled from JSON
// for the clickable filters, assuming I can hardcode the tag names
// on everything else
