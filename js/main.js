//I am initializing all the variables I need.
let employeePictures = []; //Intializing Array for employeePictures.
let employeeNames = []; //Intializing Array for employeeNames.
let employeeEmail = []; //Intializing Array for employeeEmail.
let employeeCity = []; //Intializing Array for employeeCity.
let employeeState = []; //Intializing Array for employeeState.
let employeeCell = []; //Intializing Array for employeeCell.
let employeeDOB = []; //Intializing Array for employeeDOB.
let employeeLocation = []; //Intializing Array for employeeLocation.
let ajax = false; //Intializing ajax variable as a boolean to be changed by ajaxStop function.
let selected; //Intializing a selected variable to show which modal window is active.
let numSelected; //Intializing a numSelected variable to show which number modal window user is currently on.

//Function that starts the page by dynamically creating all the html necessary for the search bar, modal window, and cards.
(function startPage () {
  for (let i = 0; i < 12; i++) {
    $('.gallery').append('<div class="card ' + i + '"></div>');
    $('.card.' + i).append('<div class="card-img-container ' + i + '"></div>');
    $('.card.' + i).append('<div class="card-info-container ' + i + '"></div>');
  };
  $('body').append('<div class="modal-container"></div>');
  $('.modal-container').hide();
  $('.modal').hide();
  $('.search-container').append('<form action="#" method="get"></form>');
  $('form').append('<input type="search" id="search-input" class="search-input" placeholder="Search">')
  $('form').append('<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">')
  for (let i = 0; i < 12; i++) {
    $('.modal-container').append('<div class="modal ' + i + '"></div>');
    $('.modal.' + i).append('<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>');
    $('.modal.' + i).append('<div class="modal-info-container ' + i + '"></div>');
  };
  $('.modal-container').append('<div class="modal-btn-container">');
  $('.modal-btn-container').append('<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>');
  $('.modal-btn-container').append('<button type="button" id="modal-next" class="modal-next btn">Next</button>');
}) ();


//The on-clicks events for closing the modal window, as well as moving left and right across modal windows.
$('.modal-close-btn').on('click', function () {
  $('.modal-container').hide();
  $('.modal').hide();
});

//The on-click event for the prev button.
$('.modal-prev').on('click', function (e) {
  numSelected = selected[0].classList.item(1);
  numSelected = parseInt(numSelected);
  $('.modal').hide();
  numSelected = numSelected - 1;
  if (numSelected < 1) {
    $('.modal-prev').attr('disabled', 'disabled');
  } else if (numSelected >= 1 && numSelected <= 10) {
    $('.modal-prev').removeAttr('disabled');
    $('.modal-next').removeAttr('disabled');
  }
  $('.modal.' + numSelected).show();
  selected = $('.modal div:visible');
})


//The on-click event for the next button.
$('.modal-next').on('click', function (e) {
  numSelected = selected[0].classList.item(1);
  numSelected = parseInt(numSelected);
  $('.modal').hide();
  numSelected = numSelected + 1;
  if (numSelected > 10) {
    $('.modal-next').attr('disabled', 'disabled');
  } else if (numSelected <= 10 && numSelected >= 1){
    $('.modal-next').removeAttr('disabled');
    $('.modal-prev').removeAttr('disabled');
  }
  $('.modal.' + numSelected).show();
  selected = $('.modal div:visible');
})

//The on-click event for the card to modal window transition.
$('.card').on('click', function (e) {
  let num = e.target.classList.item(1);
  num = parseInt(num);
  $('.modal').hide();
  $('.modal-container').show();
  $('.modal.' + num).show();
  selected = $('.modal div:visible');
});

//Set up a boolean value to have the search function run only when ajax was done running.
$(document).ajaxStop(function () {
  ajax = true;
});

//The on-click event for the search function.
$('.search-submit').on('click', function () {
  if (ajax) {
    $('.card').hide();
    let input = $('.search-input').val().toLowerCase();
    for (let i = 0; i < employeeNames.length; i++) {
      let first = employeeNames[i].first;
      let last = employeeNames[i].last;
      let name = first + " " + last;
      if (name.includes(input)) {
        $('.card.' + i).show();
      }
    };
  }
})

//The AJAX call to the randomuser API that queries for US only nationalities.
//Runs 12 times through a loop to add information for a total of 12 employees.
//Calls all the functions that add information to the cards and modal windows once the response is returned successfully.
for (let i = 0; i < 12; i++) {
  $.ajax({
    dataType: "json",
    url: "https://randomuser.me/api/?nat=us",
    success: function (data) {
      employeePictures.push(data.results[0].picture.large);
      employeeNames.push(data.results[0].name);
      employeeEmail.push(data.results[0].email);
      employeeCity.push(data.results[0].location.city);
      employeeCell.push(data.results[0].cell);
      employeeDOB.push(data.results[0].dob.date);
      employeeDOB[i] = employeeDOB[i].slice(0, 10); //Taking only the date of birth from a string of letters and numbers.
      let year = employeeDOB[i].slice(0, 4); //Next three steps isolate the year, day, and month of the DOB.
      let month = employeeDOB[i].slice(5, 7);
      let day = employeeDOB[i].slice(8, 10);
      employeeDOB[i] = month + "/" + day + "/" + year; //Puts together the year, day, and month in the US Standard format of mm/dd/yyyy.
      employeeLocation.push(data.results[0].location);
      employeeState.push(data.results[0].location.state);
      addPicture();
      addName();
      addEmail();
      addCity();
      addCell();
      addLocation();
      addDOB();
    }
  })
};

//Function to add Pictures to card and modal window.
function addPicture () {
  for (let i = 0; i < employeePictures.length; i++) {
    $('.card-img-container.' + i).html('<img class="card-img ' + i + '" src=' + employeePictures[i] + ' alt="profile-picture">');
    $('.modal-info-container.' + i).html('<img class="card-img" src=' + employeePictures[i] + ' alt="profile-picture">');
  };
}

//Function to add Names to card and modal window.
function addName () {
  for (let i = 0; i < employeeNames.length; i++) {
    let first = employeeNames[i].first;
    let last = employeeNames[i].last;
    $('.card-info-container.' + i).html('<h3 id="name" class="card-name ' + i + ' cap">' + first + ' ' + last + '</h3>');
    $('.modal-info-container.' + i).append('<h3 id="name" class="modal-name cap">' + first + ' ' + last + '</h3>');
  };
}

//Function to add Emails to card and modal window.
function addEmail () {
  for (let i = 0; i < employeeEmail.length; i++) {
    $('.card-info-container.' + i).append('<p class="card-text ' + i + '">' + employeeEmail[i] + '</p>');
    $('.modal-info-container.' + i).append('<p class="modal-text">' + employeeEmail[i] + '</p>');
  };
}

//Function to add Cities to card and modal window.
function addCity () {
  for (let i = 0; i < employeeCity.length; i++) {
    let city = employeeCity[i]
    let state = employeeState[i]
    $('.card-info-container.' + i).append('<p class="card-text ' + i + ' cap">' + city + ", " + state + '</p>');
    $('.modal-info-container.' + i).append('<p class="modal-text cap">' + city + '</p><hr>');
  };
}

//Function to add Cell Numbers to card and modal window.
function addCell () {
  for (let i = 0; i < employeeCell.length; i++) {
    $('.modal-info-container.' + i).append('<p class="modal-text">' + employeeCell[i] + '</p>');
  };
}

//Function to add Locations to card and modal window.
function addLocation () {
  for (let i = 0; i < employeeLocation.length; i++) {
    $('.modal-info-container.' + i).append('<p class="modal-text cap">' + employeeLocation[i].street + ", "
     + employeeLocation[i].city + ", " + employeeLocation[i].state + ", " + employeeLocation[i].postcode + '</p>');
  };
}

//Function to add DOB to card and modal window.
function addDOB () {
  for (let i = 0; i < employeeDOB.length; i++) {
    $('.modal-info-container.' + i).append('<p class="modal-text"> Birthday: ' + employeeDOB[i] + '</p>');
  };
}



//CSS Changes:
//made changes to background color, border color/size/radius, added box-shadows,
//changed text color overall, changed text color/size on hover,
//changed colors of prev/next/exit buttons,
//changed the margin space between the modal-btn-container and the modal itself.
