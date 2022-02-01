// there have been troubles reading local JSON files through client-side
// opted towards creating a JSON variable
var tags = [
    { 'id': 1, 'name': 'cars' },
    { 'id': 2, 'name': 'fruit' },
    { 'id': 3, 'name': 'pets' },
];
let elementsContainer = document.getElementById("fillable");
createClickables();

function createClickables() {
    for (let i = 0; i < tags.length; i++) {
        let button = document.createElement("button");
        button.innerText = tags[i].name;
        button.id = tags[i].name;
        button.onclick = function () { onClick(button.id) }
        elementsContainer.appendChild(button);
    }
}

function onClick(className) {
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
                filterables[i].classList.remove('hidden');
            } else {
                filterables[i].classList.add('hidden');
            }
        }

        // case 2: clicking an active button
        // remove that button from active, show everything
    } else if (button.classList.contains('active')) {
        button.classList.remove('active');
        for (let i = 0; i < filterables.length; i++) {
            filterables[i].classList.remove('hidden');
        }

        // case 3: there is another filter active
        // remove that button from active, hide the other class, show the
        // respective class
    } else {
        currentActive[0].classList.remove('active');
        button.classList.add('active');
        for (let i = 0; i < filterables.length; i++) {
            if (filterables[i].classList.contains(className)) {
                filterables[i].classList.remove('hidden');
            } else {
                filterables[i].classList.add('hidden');
            }
        }
    }

}
