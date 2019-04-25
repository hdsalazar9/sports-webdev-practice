function displaySportList(data){
  console.log(data);
  data.sports.forEach(item => {
    let newSportHtml = `<li> ${item.name} </li>`;
    $('.ulOfSports').append(newSportHtml);
  });
}

function onLoad(){
  let url="./sports/api/list-sports";
  let settings = {
    method : "GET",
    headers : {
      //The way we receive the things from the get or fetch call
      'Content-Type' : 'application/json'
    }
  };
  fetch(url, settings)
  .then(response => {
    //Check the status of the response
    if(response.ok){
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJSON => {
    displaySportList(responseJSON);
  });
}

let sportToAdd = {
  id: "",
  name: ""
};

$('.sportForm').on('submit', function(event){
  event.preventDefault();
  sportToAdd.id = $('#sportId').val();
  sportToAdd.name = $('#sportName').val();
  if(sportToAdd.id != "" || sportToAdd.name != "")
    postToDatabase(sportToAdd);
});

function postToDatabase(sport){
  let url="./sports/api/post-sports";
  let settings = {
    method : "POST",
    headers : {
      //The way we receive the things from the get or fetch call
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify({id : sport.id, name : sport.name})
  };
  fetch(url, settings)
  .then(response => {
    //Check the status of the response
    if(response.ok){
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJSON => {
    displaySportList(responseJSON);
  });
}

//Call the function cuando carga la pagina la primera vez
$(onLoad);
