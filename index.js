//STATE//
const BASE_URL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2401-FSA-ET-WEB-FT";
const endpoint = "/events";
const API_URL = BASE_URL + COHORT + endpoint;

const state = {
  events: [],
  selectedEvent: null,
};

const partiesList = document.querySelector("#parties");
const selectedParty = document.querySelector("#selectedParty");
const addPartyForm = document.querySelector("#addParties");

addPartyForm.addEventListener("submit", addParty);

function setSelectedEvent(event) {
  state.selectedEvent = event;
  location.hash = event.id;
}

function loadEventFromHash() {
  const id = +location.hash.slice(1);
  state.selectedEvent = state.events.find((event) => event.id === id);
}

async function getParties() {
  try {
    const response = await fetch(API_URL);
    const parsedResponse = await response.json();
    state.events = parsedResponse.data;
  } catch (error) {
    console.log(error);
  }
}
async function deleteEvent(id) {
  const deleteURL =
    "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-FSA-ET-WEB-FT/events/" +
    id;
  try {
    const response = await fetch(deleteURL, {
      method: "DELETE",
    });
    render();
  } catch (error) {
    console.error(error);
  }
}

async function addParty(event) {
  event.preventDefault();
  const date = new Date(addPartyForm.date.value).toISOString();
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPartyForm.name.value,
        date,
        location: addPartyForm.location.value,
        description: addPartyForm.description.value,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create party!");
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

//RENDER//
function renderEvents() {
  if (state.events.length === 0) {
    const $li = document.createElement("li");
    $li.textContent = "No Events Here!";
    return $li;
  } else {
    const $events = state.events.map((event) => {
      const $event = document.createElement("li");
      $event.textContent = event.name;

      $event.addEventListener("click", (_event) => {
        setSelectedEvent(event);
        renderSelectedEvent();
      });

      const $delete = document.createElement("button");
      $delete.addEventListener("click", (_event) => deleteEvent(event.id));
      $delete.textContent = "Delete Event";
      $event.append($delete);
      return $event;
    });
    partiesList.replaceChildren(...$events);
  }
}

function renderSelectedEvent() {
  const $name = document.createElement("h2");
  $name.textContent = state.selectedEvent.name;
  const $date = document.createElement("li");
  $date.textContent = state.selectedEvent.date;
  const $time = document.createElement("li");
  $time.textContent = state.selectedEvent.time;
  const $location = document.createElement("li");
  $location.textContent = state.selectedEvent.location;
  const $description = document.createElement("li");
  $description.textContent = state.selectedEvent.description;
  const $eventDetails = [$name, $date, $time, $location, $description];
  selectedParty.replaceChildren(...$eventDetails);
}

//SCRIPT

async function render() {
  await getParties();
  renderEvents();
  loadEventFromHash();
  renderSelectedEvent();
}
window.addEventListener("load", render);
