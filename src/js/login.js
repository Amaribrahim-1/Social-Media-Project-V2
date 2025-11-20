// import { login } from "./api.js";
// import {
//   showLoading,
//   hideLoading,
//   showErrorMessage,
//   showSuccessMessage,
// } from "./ui.js";
// import { STORAGE_KEYS } from "./config.js";

// function initLoginPage() {
//   const loginForm = document.querySelector(".auth-form");
//   const usernameInput = document.getElementById("login-username");

//   loadRememberedUsername();

//   loginForm.addEventListener("submit", async (event) => {
//     event.preventDefault();

//     const username = usernameInput.value.trim();
//     const password = loginForm.querySelector("#login-password").value.trim();

//     if (!username || !password) {
//       showErrorMessage("Username and password are required!");
//       return;
//     }

//     if (password.length < 6) {
//       showErrorMessage("Password must be at least 6 characters");
//       return;
//     }

//     handleRememberMe(username);

//     showLoading();

//     try {
//       await login(username, password);
//       hideLoading();
//       showSuccessMessage("Login successful! Redirecting...");
//       setTimeout(() => {
//         window.location.href = "index.html";
//       }, 1000);
//     } catch (error) {
//       hideLoading();
//       const errorMsg = error.response?.data?.message || "Login failed!";
//       showErrorMessage(errorMsg);
//     }
//   });
// }

// function handleRememberMe(username) {
//   const rememberMeCheckbox = document.getElementById("rememberMe");

//   if (rememberMeCheckbox.checked) {
//     localStorage.setItem(STORAGE_KEYS.REMEMBER_USER_NAME, username);
//   } else {
//     localStorage.removeItem(STORAGE_KEYS.REMEMBER_USER_NAME);
//   }
// }

// function loadRememberedUsername() {
//   const savedUsername = localStorage.getItem(STORAGE_KEYS.REMEMBER_USER_NAME);
//   const usernameInput = document.getElementById("login-username");
//   const rememberMeCheckbox = document.getElementById("rememberMe");

//   if (savedUsername) {
//     usernameInput.value = savedUsername;
//     rememberMeCheckbox.checked = true;
//   }
// }

// initLoginPage();

import { login } from "./api.js";
import {
  showLoading,
  hideLoading,
  showErrorMessage,
  showSuccessMessage,
} from "./ui.js";
import { STORAGE_KEYS } from "./config.js";

function initLoginPage() {
  const loginForm = document.querySelector(".auth-form");
  const usernameInput = document.getElementById("login-username");
  const passwordInput = document.getElementById("login-password");
  const togglePasswordBtn = document.getElementById("togglePassword");

  setupPasswordToggle(passwordInput, togglePasswordBtn);

  loadRememberedUsername();

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showErrorMessage("Username and password are required!");
      return;
    }

    if (password.length < 6) {
      showErrorMessage("Password must be at least 6 characters");
      return;
    }

    handleRememberMe(username);

    showLoading();

    try {
      await login(username, password);
      hideLoading();
      showSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } catch (error) {
      hideLoading();
      const errorMsg = error.response?.data?.message || "Login failed!";
      showErrorMessage(errorMsg);
    }
  });
}

function setupPasswordToggle(passwordInput, toggleBtn) {
  if (!passwordInput || !toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";

    toggleBtn.classList.toggle("active");

    toggleBtn.setAttribute(
      "aria-label",
      isPassword ? "Hide password" : "Show password"
    );
  });
}

function handleRememberMe(username) {
  const rememberMeCheckbox = document.getElementById("rememberMe");

  if (rememberMeCheckbox.checked) {
    localStorage.setItem(STORAGE_KEYS.REMEMBER_USER_NAME, username);
  } else {
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_USER_NAME);
  }
}

function loadRememberedUsername() {
  const savedUsername = localStorage.getItem(STORAGE_KEYS.REMEMBER_USER_NAME);
  const usernameInput = document.getElementById("login-username");
  const rememberMeCheckbox = document.getElementById("rememberMe");

  if (savedUsername) {
    usernameInput.value = savedUsername;
    rememberMeCheckbox.checked = true;
  }
}

initLoginPage();
