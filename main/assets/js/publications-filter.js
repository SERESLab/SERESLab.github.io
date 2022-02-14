var CITATIONS = "";
const TAG = "tag";
const TYPE = "type";
const TAGSCONTAINER = document.querySelector("[data-tags]");
const TYPESCONTAINER = document.querySelector("[data-types]");

render();

async function render() {
  await getTags();
  await getCitations();
  await getTypes();
  associateTags();
}

async function getTypes() {
  await fetch('./data/articleTypes.json')
    .then(response => {
      if (!response.ok) {
        console.log(Error("HTTP error " + response.status));
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then(json => {
      createClickables(json, "type");
    })
    .catch(function () {
      this.dataError = true;
    })
}


/*
Return: fetches and parses the tags.json file, then calls createsClickables
        which then puts it on the DOM
*/
async function getTags() {
  await fetch('./data/tags.json')
    .then(response => {
      if (!response.ok) {
        console.log(Error("HTTP error " + response.status));
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then(json => {
      createClickables(json, "tag");
    })
    .catch(function () {
      this.dataError = true;
    })
}

/*
Return: outputs the citations to the DOM with their respective publications
*/
async function getCitations() {
  await fetch('./data/citations.bib')
    .then(response => {
      if (!response.ok) {
        console.log(Error("HTTP error " + response.status));
        throw new Error("HTTP error " + response.status);
      }
      return response.text();
    })
    .then(data => {
      generateCitations(data);
    })
    .catch(function () {
      this.dataError = true;
    })

}

/*
Return: puts the formatted citations on the DOM
String data: this is the parsed BibTeX file
*/
function generateCitations(data) {
  CITATIONS = new Cite(data); // use citations.data to access array of the Cite object

  output = CITATIONS.format('bibliography', {
    format: 'html',
    template: 'ieee',
  });

  document.querySelector('[data-publications]').innerHTML = output;
}

/*
This function adds CSS classes associated with the tags to be able to be
filtered
*/
function associateTags() {
  let data = CITATIONS.data;
  for (let i = 0; i < data.length; i++) {
    let currPublication = document.querySelector("[data-csl-entry-id=" + CSS.escape(data[i].id) + "]");
    currPublication.classList.add("filterable");
    currPublication.classList.add("filter-show");
    currPublication.classList.add("py-2");
    currPublication.classList.add(data[i].type);

    // this portion adds the link to the article of the publication
    let publicationLink = document.createElement("a");
    publicationLink.href = data[i].URL;
    publicationLink.target = "_blank";
    publicationLink.appendChild(document.createTextNode(currPublication.firstChild.nodeValue));
    currPublication.replaceChild(publicationLink, currPublication.firstChild);

    if (data[i].keyword === undefined) {
      continue;
    }

    let keywords = data[i].keyword.split(",");
    for (let j = 0; j < keywords.length; j++) {
      currPublication.classList.add(keywords[j]);
    }


  }


}

/*
Return: adds buttons to the DOM
Object Tags: This is the JSON file that was parsed
*/
function createClickables(tags, type) {
  for (let i = 0; i < tags.length; i++) {
    let button = document.createElement("button");
    button.innerText = tags[i].name;
    button.id = tags[i].name;
    button.onclick = function () { onClickFilter(tags[i].name, tags[i].name, type) }

    // adding attributes for future use
    if (tags[i].active === "yes") {
      button.setAttribute("data-active", "true");
    } else {
      button.setAttribute("data-active", "false");
    }

    // adding color style to each button (based off JSON variable value)
    button.style.backgroundColor = tags[i].color;

    // adding spacing styles to each button
    button.classList.add("mx-1");

    if (type === "tag") {
      TAGSCONTAINER.appendChild(button);
    } else if (type === "type") {
      TYPESCONTAINER.appendChild(button);
    }
  }
}

/* 
Return: a function that filters based off the button that was clicked
String buttonId: this is the ID of the button, it should be the same as the inner text
String className: this is the className added to the publications to filter what's hidden and shown
*/
function onClickFilter(buttonId, className, type) {
  let filterables = document.getElementsByClassName("filterable"); // these are the div elements
  let currentTagsActive = document.getElementsByClassName("tag-active"); // allowing us to deactivate other active button
  let currentTypesActive = document.getElementsByClassName("type-active"); // allowing us to deactivate other active button
  let button = document.getElementById(buttonId); // allowing us to set the button clicked to active

  if (type === "tag") {
    // case 1: no other filters are active
    // add the clicked button to active and show just that class
    if (currentTagsActive.length == 0) {
      button.classList.add("tag-active");
      for (let i = 0; i < filterables.length; i++) {
        if (filterables[i].classList.contains(className)) {
          filterables[i].classList.add("filter-show");
        } else {
          filterables[i].classList.remove("filter-show");
        }
      }

      // case 2: clicking an active button
      // remove that button from active, show everything
    } else if (button.classList.contains("tag-active")) {
      button.classList.remove("tag-active");
      for (let i = 0; i < filterables.length; i++) {
        filterables[i].classList.add("filter-show");
      }

      // case 3: there is another filter active
      // remove that button from active, hide the other class, show the
      // respective class
    } else {
      currentTagsActive[0].classList.remove("tag-active");
      button.classList.add("tag-active");
      for (let i = 0; i < filterables.length; i++) {
        if (filterables[i].classList.contains(className)) {
          filterables[i].classList.add("filter-show");
        } else {
          filterables[i].classList.remove("filter-show");
        }
      }
    }
  } else if (type === "type") {
    if (currentTypesActive.length == 0) {
      button.classList.add("type-active");
      for (let i = 0; i < filterables.length; i++) {
        if (filterables[i].classList.contains(className)) {
          filterables[i].classList.add("filter-show");
        } else {
          filterables[i].classList.remove("filter-show");
        }
      }

      // case 2: clicking an active button
      // remove that button from active, show everything
    } else if (button.classList.contains("type-active")) {
      button.classList.remove("type-active");
      for (let i = 0; i < filterables.length; i++) {
        filterables[i].classList.add("filter-show");
      }

      // case 3: there is another filter active
      // remove that button from active, hide the other class, show the
      // respective class
    } else {
      currentTypesActive[0].classList.remove("type-active");
      button.classList.add("type-active");
      for (let i = 0; i < filterables.length; i++) {
        if (filterables[i].classList.contains(className)) {
          filterables[i].classList.add("filter-show");
        } else {
          filterables[i].classList.remove("filter-show");
        }
      }
    }
  }
}