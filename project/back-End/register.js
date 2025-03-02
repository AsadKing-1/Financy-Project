document.querySelector("#btnRegister").addEventListener("click", () => {
  async function registerUser() {
    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: document.querySelector("#name").value,
          email: document.querySelector("#email").value,
          password: document.querySelector("#password").value,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("User registered successfully");
      } else {
        alert("An error occurred: " + data.message);
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  }
  registerUser();
});