var CITATIONS = "";
const TAG = "tag";
const TYPE = "type";
const TAGSCONTAINER = document.querySelector("[data-tags]");
const TYPESCONTAINER = document.querySelector("[data-types]");

render();

async function render() {
  await getCitations();
  await getTags();
  await getTypes();
  associateFilters();
}

async function getTypes() {
  await fetch('../data/publicationTypes.json')
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
  await fetch('../data/tags.json')
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
  await fetch('../data/citations.bib')
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
function associateFilters() {
  let data = CITATIONS.data;
  for (let i = 0; i < data.length; i++) {
    // once all the keywords get updated this bit of code can be
    // uncommented (as well as delete this comment)
    // if (data[i].keyword === undefined) {
    //   continue;
    // }

    let currPublication = document.querySelector("[data-csl-entry-id=" + CSS.escape(data[i].id) + "]");
    currPublication.classList.add("filterable");
    currPublication.classList.add("filter-show");
    currPublication.classList.add("py-2");
    currPublication.classList.add(data[i].type);

    currPublication.replaceChild(replaceTitleWithLink(currPublication, data[i].URL), currPublication.firstChild);
    // currPublication.append(addPublicationTypeSymbol(data[i].type));


    if (data[i].keyword === undefined) {
      continue;
    }
    let keywords = data[i].keyword.split(",");

    currPublication.append(addPublicationTags(keywords));
    currPublication.append(appendLink(data[i].DOI));

    for (let j = 0; j < keywords.length; j++) {
      currPublication.classList.add(keywords[j]);
    }
  }
}

/*
Div element: this is the div that the title is being retrieved from
string href: the link to the publication (URL in the bib file)
*/
function replaceTitleWithLink(element, href) {
  let publicationTitleLink = document.createElement("a");
  publicationTitleLink.href = href;
  publicationTitleLink.target = "_blank";
  publicationTitleLink.appendChild(document.createTextNode(element.firstChild.nodeValue));
  return publicationTitleLink;
}

/*
Return: A new "span" element to show the publication type
string type: the type of the publication used to associate color with the type
// */
// function addPublicationTypeSymbol(type) {
//   let symbol = document.createElement("span");
//   symbol.innerText = " ◼ ";
//   symbol.style.cssText += "font-size: 1.5rem;";
//   symbol.classList.add(type);
//   return symbol;
// }

/*
Return: A new "span" element to show all the tags associated with the publication
string Array tags: the tags that are to be listed after the publication citation
*/
function addPublicationTags(tags) {
  let output = document.createElement("span");
  // output.style.cssText += "font-size: 0.85rem !important;";
  // spanOutput.classList.add("span-tags");
  for (let i = 0; i < tags.length; i++) {
    let individualTag = document.createElement("span");
    individualTag.classList.add("publication-tag");
    individualTag.innerText = tags[i];
    output.append(individualTag);
  }
  return output;
}

/*
This function is to add a [link] to all the 
Return: A new "a" element
string href: the DOI link to the publication (from the bib file)
*/
function appendLink(href) {
  let link = document.createElement("a");
  link.href = href;
  link.target = "_bank";
  link.innerText = " [link]";
  link.style.cssText += "font-size:0.85rem";
  return link;
}


/*
Return: adds filtering buttons to the DOM
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
      button.classList.add("filter-tag");
      TAGSCONTAINER.appendChild(button);
    } else if (type === "type") {
      button.classList.add("filter-type");
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