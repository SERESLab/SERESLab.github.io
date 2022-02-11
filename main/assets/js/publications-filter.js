
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

var tags = [
  { 'id': 1, 'name': 'cars' },
  { 'id': 2, 'name': 'fruit' },
  { 'id': 3, 'name': 'pets' },
];
const elementsContainer = document.getElementById("fillable");
createClickables();

function createClickables() {
  for (let i = 0; i < tags.length; i++) {
    let button = document.createElement("button");
    button.innerText = tags[i].name;
    button.id = tags[i].name;
    button.onclick = function () { filterOnClick(button.id) }
    elementsContainer.appendChild(button);
  }
}

// this function filters publications by the tags after clicking
function filterOnClick(className) {

  // retrieve all the filterable objects, the active button, and
  // the button clicked
  let filterables = document.getElementsByClassName('filterable'); // this is an array
  let currentActive = document.getElementsByClassName('active'); // this is an array
  let button = document.getElementById(className); // this is NOT an array

  // case 1: no other filters are active
  // add the clicked button to active and show just that class
  if (currentActive.length == 0) {
    button.classList.add('active');
    for (let i = 0; i < filterables.length; i++) {
      if (filterables[i].classList.contains(className)) {
        filterables[i].classList.add('show');
      } else {
        filterables[i].classList.remove('show');
      }
    }
    
    // case 2: clicking an active button
    // remove that button from active, show everything
  } else if (button.classList.contains('active')) {
    button.classList.remove('active');
    for (let i = 0; i < filterables.length; i++) {
      filterables[i].classList.add('show');
    }

    // case 3: there is another filter active
    // remove that button from active, hide the other class, show the
    // respective class
  } else {
    currentActive[0].classList.remove('active');
    button.classList.add('active');
    for (let i = 0; i < filterables.length; i++) {
      if (filterables[i].classList.contains(className)) {
        filterables[i].classList.add('show');
      } else {
        filterables[i].classList.remove('show');
      }
    }
  }

}
// each publication has x amount of tags,
// need to figure out how to assign those tags if they're going
// to be generated from a JSON file

// assuming that the tags are only going to be pulled from JSON
// for the clickable filters, assuming I can hardcode the tag names
// on everything else
