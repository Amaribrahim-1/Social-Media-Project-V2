import { register } from "./api.js";
import {
  showLoading,
  hideLoading,
  showErrorMessage,
  showSuccessMessage,
} from "./ui.js";

// ════════════════ Profile Picture Preview ════════════════ //
function setupProfilePreview() {
  const fileInput = document.querySelector("#profile-picture");
  const preview = document.querySelector("#profilePreview");

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate image size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showErrorMessage("Image is too large (max 5MB)");
        fileInput.value = "";
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.style.backgroundImage = `url(${e.target.result})`;
        preview.style.backgroundSize = "cover";
        preview.style.backgroundPosition = "center";
        preview.innerHTML = "";
      };
      reader.readAsDataURL(file);
    }
  });
}

function initRegisterPage() {
  const registerForm = document.querySelector(".auth-form");

  const passwordInput = document.querySelector("#register-password");
  const togglePasswordBtn = document.querySelector("#togglePasswordRegister");

  setupPasswordToggle(passwordInput, togglePasswordBtn);

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const profileImage =
      registerForm.querySelector("#profile-picture").files[0];
    const fullName = registerForm
      .querySelector("#register-fullname")
      .value.trim();
    const username = registerForm
      .querySelector("#register-username")
      .value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password || !fullName) {
      showErrorMessage("Username, password, and name are required!");
      return;
    }

    if (password.length < 6) {
      showErrorMessage("Password must be at least 6 characters");
      return;
    }

    showLoading();

    const formData = new FormData();
    if (profileImage) {
      formData.append("image", profileImage);
    }
    formData.append("name", fullName);
    formData.append("username", username);
    formData.append("password", password);

    try {
      await register(formData);
      hideLoading();
      showSuccessMessage("Register successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } catch (error) {
      hideLoading();
      const errorMsg = error.response?.data?.message || "Register failed!";
      showErrorMessage(errorMsg);
    }
  });
}

function setupPasswordToggle(passwordInput, toggleBtn) {
  if (!passwordInput || !toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    // Toggle type
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";

    // Toggle active class
    toggleBtn.classList.toggle("active");

    // Update aria-label
    toggleBtn.setAttribute(
      "aria-label",
      isPassword ? "Hide password" : "Show password"
    );
  });
}
setupProfilePreview();
initRegisterPage();
