function init() {
  handleSubmission();
  renderDropdownMenu();
}

// FETCH REQUESTS ////////////////////////////////////////////

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map( key => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
  });
  return queryItems.join('&');  
}

function fetchStateParkInfo(states, maxResults) {

  const apiKey = 'u6K1ocedCPmLuGnYTpUvemCaApOGAj0vidPwS3TI';
  const baseURL = 'https://developer.nps.gov/api/v1/parks';

  const params = {
    stateCode: states,
    limit: maxResults,
    fields: 'images',   
    api_key: apiKey,
  };

  const queryString = formatQueryParams(params);
  const url = baseURL + '?' + queryString;
  
  // DUE TO LATENCY FOR THE PROMISE TO BE FULFILLED
  // INFORMING THE USER TO BE PATIENT ;P
  $('.js-please-wait').removeClass('hidden').html('<b>Searching...</b> Please be patient wait while we fetch this data for you...');
  $('.js-error-msg').addClass('hidden').html('');

  fetch(url)
  .then(response => {
    if(!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  })
  .then(data => {
    renderStateParkInfo(data);
    $('.js-please-wait').addClass('hidden').html('');
  })
  .catch(err => {
    console.log(err);
    $('.js-please-wait').addClass('hidden').html('');
    $('.js-error-msg').removeClass('hidden').html(err);
  });
}

// TEMPLATE GENERATORS ///////////////////////////////////////

function generateStateParkInfo(dataInfo) {
  const arr = [];

  for (let i = 0; i < dataInfo.data.length; i++) {
    
    const physicalAddress = [];
    for (let j = 0; j < dataInfo.data[i].addresses.length; j++) {
      if (dataInfo.data[i].addresses[j].type === 'Physical') {
        physicalAddress.push(`
        ${dataInfo.data[i].addresses[j].line1}, 
        ${dataInfo.data[i].addresses[j].city},
        ${dataInfo.data[i].addresses[j].stateCode},
        ${dataInfo.data[i].addresses[j].postalCode}
        `);
      }
    }
    const strPhysicalAddress = physicalAddress.join('');
    strPhysicalAddress.replace(/\, /g, '');

    arr.push(`<li> 
        <h3 class="park-name">${dataInfo.data[i].fullName}</h3>
        <img src="${dataInfo.data[i].images[0].url}" alt="${dataInfo.data[i].images[0].caption}">
        <p class="park-description"><b>${dataInfo.data[i].states}</b> ${dataInfo.data[i].description}</p>
        <p class="park-website"><b>Website:</b> <a href="${dataInfo.data[i].url}" target="_blank">${dataInfo.data[i].url}</a></p>
        <p class="park-address"><b>Address:</b> ${strPhysicalAddress}</p>
      </li>
    `);
  }
  return arr.join('');
}

// RENDERING FUNCTIONS ///////////////////////////////////////

function renderStateParkInfo(dataInfo) {
  const results = generateStateParkInfo(dataInfo);
  $('#js-list-results').html(results);
  $('#js-results').removeClass('hidden');
}

// EVENT HANDLERS ////////////////////////////////////////////

function handleSubmission() {
  $('#search-form').on('submit', event => {
    event.preventDefault();
    const maxResults = $('#max-num-results').val();
    const selectedStatesPre = $('#js-select-state').val();
    // precaution to remove potential whitespace within string
    const selectedStates = selectedStatesPre.split(' ').join('');
    fetchStateParkInfo(selectedStates, maxResults);
    // clear out previous result, if applicable
    $('#js-list-results').empty();
  });
}

// FOR STATE GLOSSARY //////////////////////////

function generateDropdownMenu(STATES) {
  const options = STATES.map(item => {
    return `<option value=""${item.abbreviation}"">${item.abbreviation} (${item.name})</option>
    `;
  });
  return `<option value="" disabled selected>State Codes</option>
    ${options}
  `;
}

function renderDropdownMenu() {
  const listOfStates = generateDropdownMenu(STATES);
  $('#js-glossary').html(listOfStates);
}

// document.ready
$(init);