// =====================================
// API BASE
// =====================================
const ENDPOINT = "http://localhost:3001";

// =====================================
// LOGIN HANDLER
// =====================================
const accessForm = document.getElementById("accessForm");

if (accessForm) {
  accessForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const enteredEmail = document.getElementById("userMail").value;
    const enteredPass = document.getElementById("userPass").value;

    fetch(`${ENDPOINT}/users?email=${enteredEmail}&password=${enteredPass}`)
      .then((res) => res.json())
      .then((matches) => {
        if (matches.length === 0) {
          alert("Incorrect email or password");
          return;
        }

        const loggedUser = matches[0];

        // Save session
        localStorage.setItem("session", JSON.stringify(loggedUser));

        // Redirect by role
        if (loggedUser.role === "admin") {
          window.location.href = "../../public/views/admin.html";
        } else {
          window.location.href = "../../public/views/tasks.html";
        }
      })
      .catch(() => alert("Server error while trying to log in"));
  });
}

// =====================================
// REGISTRATION HANDLER
// =====================================
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullName = document.getElementById("regFullName").value;
    const emailInput = document.getElementById("regEmail").value;
    const passInput = document.getElementById("regPass").value;
    const passConfirm = document.getElementById("regPassConfirm").value;

    if (passInput !== passConfirm) {
      alert("Passwords do not match");
      return;
    }

    const userPayload = {
      name: fullName,
      email: emailInput,
      password: passInput,
      role: "user",
    };

    fetch(`${ENDPOINT}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userPayload),
    })
      .then(() => {
        alert("Account successfully created");
        window.location.href = "../../public/views/login.html";
      })
      .catch(() => alert("Error creating account"));
  });
}
