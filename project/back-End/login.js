document.querySelector("#btnLogin").addEventListener("click", () => {
  async function loginUser() {
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: document.querySelector("#login-name").value,
          password: document.querySelector("#login-password").value,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Login successful");
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  }
  loginUser();
});

document.querySelector("#btnLogout").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  alert("Logged out successfully");
});