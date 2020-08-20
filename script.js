function init() {
  renderDropdownMenu();
  handleSubmission();
}

function fetchStateParkInfo(state, maxResults) {
  console.log(state, maxResults);
  const apiKey = 'u6K1ocedCPmLuGnYTpUvemCaApOGAj0vidPwS3TI';
  const baseURL = 'https://developer.nps.gov/api/v1/parks';
  const params = {
    stateCode: state,
    limit: maxResults,
    api_key: apiKey,
  };
  const queryString = formatQueryParams(params);

  const url = baseURL + '?' + queryString;
  console.log(url);

  // INFORM THE USER TO BE PATIENT WHILE WE FETCH THE DATA
  $('.js-please-wait').removeClass('hidden').html('<b>Searching...</b> Please be patient wait while we create this list for you.');
  fetch(url)
    .then(response => {
      console.log('response to fetch query');
      if (!response.ok) {
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
      $('.js-error-msg').removeClass('hidden').html(err);
    });
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
  });
  return queryItems.join('&');
}
function generateDropdownMenu(STATES) {
  const options = STATES.map(item => {
    return `<option value=${item.abbreviation}>${item.name}</option>`;
  });
  
  return `
    <option value="" disabled selected>Select a State</option>
    ${options}
  `;
}

// generate HTML & then render into DOM
function renderStateParkInfo(dataInfo) {
  // clear out previous result, if applicable
  $('#js-list-results').empty();

  for (let i = 0; i < dataInfo.data.length; i++) {
    $('#js-list-results').append(`
    <li> 
      <h3 class="park-name">${dataInfo.data[i].fullName}</h3>
      <p class="park-description">${dataInfo.data[i].description}</p>
      <p class="park-website"><a href="${dataInfo.data[i].url}" target="_blank">${dataInfo.data[i].url}</a></p>
    </li>`);
  }

  $('#js-results').removeClass('hidden');
}
function renderDropdownMenu() {
  const listOfStates = generateDropdownMenu(STATES);
  // render HTML in the DOM
  $('#js-select-state').html(listOfStates);
}
// EVENT HANDLERS //
function handleSubmission() {
  $('#search-form').on('submit', event => {
    event.preventDefault();
    const selectedState = $('#js-select-state').val();
    const maxResults = $('#max-num-results').val();
    fetchStateParkInfo(selectedState, maxResults);
    // clear out previous results, if applicable
    $('#js-list-results').empty();
  });
}
// INVOKE INIT
$(init);