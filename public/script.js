// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// define variables that reference elements on our page
const verifyButton = document.getElementById("verifyBtn");
const animalBox = document.getElementById("animalText");

verifyButton.onclick = () => {
  fetch("/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      animal: animalBox.value.slice(0, 50)
    })
  }).then(a => a.json()).then(json => {
    if(json.err) {
      return alert("Error: " + json.err);
    }

    location.href = json.url;
  });
}