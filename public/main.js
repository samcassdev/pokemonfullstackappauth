var trash = document.getElementsByClassName("fa-trash-alt");

document.querySelector("button").addEventListener("click", pickOne);

function pickOne() {
  let pokemon = document.getElementById("pokemon").value;
  let error = document.getElementById('error')

  let apiURL =
    "https://pokeapi.co/api/v2/pokemon/" + pokemon;
  fetch(apiURL)
    .then(res => res.json()) // parse response as JSON (can be res.text() for plain response)
    .then(response => {
      console.log(response);

      document.querySelector("#submitPokemon").innerHTML = response.species.name;
      document.querySelector("#ability").innerHTML = response.abilities[0].ability.name;
      document.querySelector("#sprite").src = response.sprites.front_default;
      document.querySelector("#version").innerHTML = response.game_indices[4].version.name;

      console.log(response.species.name);
      console.log(response.abilities[0].ability.name);
      console.log(response.sprites.front_default);
      console.log(response.game_indices[4].version.name);
    })

    .catch(err => {
      console.log(`error ${err}`);
      error.innerHTML = '';
      let errorMsg = "We're sorry! We can't find the description for this one."
      error.innerHTML = errorMsg;
      alert(errorMsg);
    });
}

let apiCall = document.getElementById("pokemon");
let submit = document.getElementById("submitPokemon");
let save = document.getElementById("save");

//event listener to pull pokemon name from first input and place it in the second input
apiCall.addEventListener("change", ()=> {
  submit.value = apiCall.value;
})

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText;
        console.log(name);
        fetch('poke', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'poke': name
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

//IGNORE ME!!!!!
// //event listener to listen for when a pokemon is saved and will trigger a GET request to display the saved pokemon in a list
// save.addEventListener("click", () => {
//   // alert("dog!")
//
// })
