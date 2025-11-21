import { STORAGE_KEYS } from "./config.js";
import { showConfirmDialog, showSuccessMessage } from "./ui.js";

// // ════════════════ Create Navbar HTML ════════════════
// function createNavbar() {
//   const navHTML = `
//     <nav>
//       <div class="nav-container">
//         <div class="nav-content">
//           <div class="nav-left">
//             <h1 class="logo" onclick="location.href='index.html'">Amar</h1>
//             <div class="nav-links">
//               <a href="index.html" class="home-page">Home</a>
//               <a href="profile.html" class="profile-page">Profile</a>
//             </div>
//           </div>

//           <div class="nav-buttons">
//             <!-- ✅ Theme Toggle Button -->
//             <button id="themeToggle" class="theme-toggle" aria-label="Toggle theme">
//               <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                 <circle cx="12" cy="12" r="5"></circle>
//                 <line x1="12" y1="1" x2="12" y2="3"></line>
//                 <line x1="12" y1="21" x2="12" y2="23"></line>
//                 <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
//                 <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
//                 <line x1="1" y1="12" x2="3" y2="12"></line>
//                 <line x1="21" y1="12" x2="23" y2="12"></line>
//                 <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
//                 <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
//               </svg>
//               <svg class="moon-icon hidden" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                 <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
//               </svg>
//             </button>

//             <img class="profile-img" alt="Profile" style="display: none;" loading="lazy">
//             <span class="user-name"></span>
//             <button class="btn-login" aria-label="Login">Login</button>
//             <button class="btn-register" aria-label="Register">Register</button>
//             <button class="btn-logout" style="display: none;" aria-label="Logout">Logout</button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   `;

//   // ✅ حط الـ HTML في الـ container
//   const navContainer = document.getElementById("navbar-container");
//   if (navContainer) {
//     navContainer.innerHTML = navHTML;
//   }
// }

function createNavbar() {
  const navHTML = `
    <nav>
      <div class="nav-container">
        <div class="nav-content">
          <div class="nav-left">
            <h1 class="logo" onclick="location.href='index.html'">Amar</h1>
            <div class="nav-links">
              <a href="index.html" class="home-page">Home</a>
              <a href="profile.html" class="profile-page">Profile</a>
            </div>
          </div>

          <div class="nav-right">
            <!-- يوزر ثابت دايمًا برّه المنيو -->
            <div class="user-info">
              <img class="profile-img" alt="Profile" style="display: none;" loading="lazy">
              <span class="user-name"></span>
            </div>

            <!-- زرار البرجر للموبايل -->
            <button class="burger-btn" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-actions">
              <span class="burger-line"></span>
              <span class="burger-line"></span>
              <span class="burger-line"></span>
            </button>

            <!-- المنيو الجانبية: ثيم + لوجين/ريجستر/لوج أوت -->
            <div class="nav-buttons" id="nav-actions">
            
            <button class="btn-login" aria-label="Login">Login</button>
            <button class="btn-register" aria-label="Register">Register</button>
            <button class="btn-logout" style="display: none;" aria-label="Logout">Logout</button>
            
            <button id="themeToggle" class="theme-toggle" aria-label="Toggle theme">
              <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2">
                <!-- دائرة الشمس -->
                <circle cx="12" cy="12" r="5"></circle>

                <!-- الأشعة -->
                <line x1="12" y1="1"  x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1"  y1="12" x2="3"  y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"></line>
                <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"></line>
              </svg>

              <svg class="moon-icon hidden" width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>

            </div>
          </div>
        </div>
      </div>
    </nav>
  `;

  const navContainer = document.getElementById("navbar-container");
  if (navContainer) {
    navContainer.innerHTML = navHTML;
  }
}

// ════════════════ Update Navbar UI ════════════════
function updateNavbarUI(user) {
  const profileImg = document.querySelector(".profile-img");
  const userName = document.querySelector(".user-name");
  const loginBtn = document.querySelector(".btn-login");
  const registerBtn = document.querySelector(".btn-register");
  const logoutBtn = document.querySelector(".btn-logout");

  if (user) {
    // ✅ User logged in
    if (profileImg) {
      profileImg.src = user.profile_image || "../../imgs/no-profile-photo.webp";
      profileImg.style.display = "block";

      profileImg.src =
        typeof user.profile_image !== "object"
          ? user.profile_image
          : "../../imgs/no-profile-photo.webp";
      profileImg.onerror = function () {
        this.src = "../../imgs/no-profile-photo.webp";
      };
    }
    if (userName) {
      userName.textContent = user.username || user.name;
    }
    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    // ❌ User not logged in
    if (profileImg) profileImg.style.display = "none";
    if (userName) userName.textContent = "";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (registerBtn) registerBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }

  const addPostBtn = document.querySelector(".add-post-btn");
  if (addPostBtn) {
    if (user) {
      // ✅ User logged in - اظهر الـ button
      addPostBtn.style.display = "inline-block";
    } else {
      // ❌ User not logged in - اخفي الـ button
      addPostBtn.style.display = "none";
    }
  }
}

// // ════════════════ Setup Event Listeners ════════════════
// function setupNavbarListeners() {
//   // Logout
//   const logoutBtn = document.querySelector(".btn-logout");
//   if (logoutBtn) {
//     logoutBtn.addEventListener("click", async () => {
//       const confirm = await showConfirmDialog(
//         "Confirm Logout",
//         "Are you sure you want to sign out?"
//       );
//       if (confirm) {
//         localStorage.removeItem(STORAGE_KEYS.TOKEN);
//         localStorage.removeItem(STORAGE_KEYS.USER);
//         showSuccessMessage("Logged out successfully!");
//         setTimeout(() => {
//           window.location.reload();
//         }, 1000);
//       }
//     });
//   }

//   // Login
//   const loginBtn = document.querySelector(".btn-login");
//   if (loginBtn) {
//     loginBtn.addEventListener("click", () => {
//       window.location.href = "login.html";
//     });
//   }

//   // Register
//   const registerBtn = document.querySelector(".btn-register");
//   if (registerBtn) {
//     registerBtn.addEventListener("click", () => {
//       window.location.href = "register.html";
//     });
//   }

//   // Profile
//   const profileLink = document.querySelector(".profile-page");
//   const profileImg = document.querySelector(".profile-img");

//   const handleProfileClick = () => {
//     const userJSON = localStorage.getItem(STORAGE_KEYS.USER);
//     const user = userJSON ? JSON.parse(userJSON) : null;
//     if (user) {
//       localStorage.setItem(STORAGE_KEYS.CLICKED_USER_ID, user.id);
//       window.location.href = "profile.html";
//     }
//   };

//   if (profileLink) {
//     profileLink.addEventListener("click", (e) => {
//       e.preventDefault();
//       handleProfileClick();
//     });
//   }

//   if (profileImg) {
//     profileImg.addEventListener("click", handleProfileClick);
//   }
// }
function setupNavbarListeners() {
  // Burger menu toggle
  const burgerBtn = document.querySelector(".burger-btn");
  const navButtons = document.querySelector(".nav-buttons");

  if (burgerBtn && navButtons) {
    burgerBtn.addEventListener("click", () => {
      const isOpen = navButtons.classList.toggle("nav-buttons--open");
      burgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.classList.toggle("no-scroll", isOpen);
    });
  }

  // Logout
  const logoutBtn = document.querySelector(".btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      const confirm = await showConfirmDialog(
        "Confirm Logout",
        "Are you sure you want to sign out?"
      );
      if (confirm) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        showSuccessMessage("Logged out successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }

  // باقي الكود بتاع Login / Register / Profile زي ما هو تحت هنا
  // Login
  const loginBtn = document.querySelector(".btn-login");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  // Register
  const registerBtn = document.querySelector(".btn-register");
  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      window.location.href = "register.html";
    });
  }

  // Profile
  const profileLink = document.querySelector(".profile-page");
  const profileImg = document.querySelector(".profile-img");

  const handleProfileClick = () => {
    const userJSON = localStorage.getItem(STORAGE_KEYS.USER);
    const user = userJSON ? JSON.parse(userJSON) : null;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CLICKED_USER_ID, user.id);
      window.location.href = "profile.html";
    }
  };

  if (profileLink) {
    profileLink.addEventListener("click", (e) => {
      e.preventDefault();
      handleProfileClick();
    });
  }

  if (profileImg) {
    profileImg.addEventListener("click", handleProfileClick);
  }
}

// ════════════════ Main Export Function ════════════════
export function initializeNavbar() {
  try {
    // 1. Create navbar HTML (في الـ container)
    createNavbar();

    // 2. Get user from localStorage
    const userJSON = localStorage.getItem(STORAGE_KEYS.USER);
    const user = userJSON ? JSON.parse(userJSON) : null;

    // 3. Update UI
    updateNavbarUI(user);

    // 4. Setup listeners
    setupNavbarListeners();
  } catch (error) {
    console.error("❌ Error initializing navbar:", error);
  }
}
