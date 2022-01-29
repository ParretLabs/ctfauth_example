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