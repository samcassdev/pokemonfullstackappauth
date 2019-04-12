let image = document.getElementById("sprite").src

document.getElementById("save").addEventListener("click", function(){

  image = document.getElementById("sprite").src

  console.log("url: ", image)

          fetch('poke', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "image": image

            })
          }).then(function (response) {
            window.location.reload()
          })

})
