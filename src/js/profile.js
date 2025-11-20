// ======= IMPORTS =======
import { STORAGE_KEYS, API_CONFIG } from "./config.js";
import { initializeNavbar } from "./navbarManager.js";
import {
  showErrorMessage,
  showLoading,
  hideLoading,
  createPostCard,
} from "./ui.js";
import {
  setupPostInteractions,
  setupModalListeners,
  setupPostFormListener,
  setupFileUploadListener,
  initTheme,
} from "./helpers.js";
import { updatePost } from "./api.js";

// ======= GET USER INFO =======
const clickedUserId = localStorage.getItem(STORAGE_KEYS.CLICKED_USER_ID);
const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
const userId = clickedUserId || currentUser?.id;
const userInfoUrl = userId
  ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS.GET_PROFILE(userId)}`
  : null;

// ======= PAGE INIT =======
async function init() {
  initializeNavbar();
  initTheme();

  if (!userId) {
    showErrorMessage("Please login first!");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
    return;
  }

  await fetchAndDisplayUserInfo(userInfoUrl);
  await fetchAndDisplayUserPosts();
  setupEventListeners();
}

async function fetchAndDisplayUserInfo(url) {
  try {
    const request = await axios.get(url);
    const userInfo = request.data.data;
    updateUserInfoUI(userInfo);
  } catch (error) {
    console.error("Error fetching user info:", error);
    showErrorMessage("Failed to load user info");
  }
}

async function fetchAndDisplayUserPosts() {
  try {
    showLoading();
    const userPostsUrl =
      API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.USERS.GET_POSTS(userId);
    const request = await axios.get(userPostsUrl);
    const userPosts = request.data.data;
    updateUserPostsUI(userPosts);
    hideLoading();
  } catch (error) {
    hideLoading();
    console.error("Error fetching user posts:", error);
    showErrorMessage("Failed to load posts");
  }
}

// تحديث بيانات البروفايل في الصفحة
function updateUserInfoUI(userInfo) {
  const userProfileImg = document.querySelector(".profile-avatar");
  if (userProfileImg) {
    userProfileImg.src =
      typeof userInfo.profile_image === "object" || !userInfo.profile_image
        ? "./imgs/no-profile-photo.webp"
        : userInfo.profile_image;
    userProfileImg.onerror = function () {
      this.src = "./imgs/no-profile-photo.webp";
    };
  }
  const userFullName = document.querySelector(".profile-name");
  if (userFullName)
    userFullName.textContent = userInfo.name || userInfo.username;
  const userName = document.querySelector(".profile-username");
  if (userName) userName.textContent = `@${userInfo.username}`;
  const userEmail = document.querySelector(".profile-email");
  if (userEmail) userEmail.textContent = userInfo.email || "No email provided";
  const userPostsCount = document.querySelector(".posts-count");
  if (userPostsCount) userPostsCount.textContent = userInfo.posts_count || 0;
  const userCommentsCount = document.querySelector(".comments-count");
  if (userCommentsCount)
    userCommentsCount.textContent = userInfo.comments_count || 0;
  document.title = `${userInfo.username} - Profile`;
}

// تحديث عرض البوستات الخاصة بالمستخدم
function updateUserPostsUI(userPosts) {
  const postsContainer = document.querySelector(".posts-container");
  if (!postsContainer) return;
  postsContainer.innerHTML = "";

  if (userPosts.length === 0) {
    postsContainer.innerHTML = `
      <div class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-label="empty-icon">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="9" x2="15" y2="15"></line>
          <line x1="15" y1="9" x2="9" y2="15"></line>
        </svg>
        <p class="empty-text">No posts yet</p>
        <p class="empty-subtext">Start sharing your thoughts with the world!</p>
      </div>
    `;
    return;
  }

  const currentUserId = currentUser?.id;
  userPosts.forEach((post) => {
    const postCard = createPostCard(post, currentUserId);
    postsContainer.append(postCard);
  });
}

// إعادة تحميل البوستات والبيانات بعد أي تعديل
async function refreshUserPosts() {
  await fetchAndDisplayUserPosts();
  await fetchAndDisplayUserInfo(userInfoUrl);
}

// توحيد الأحداث modular
function setupEventListeners() {
  setupPostInteractions(refreshUserPosts);
  setupModalListeners();
  setupPostFormListener(updatePost, refreshUserPosts);
  setupFileUploadListener();
}

// ======= INITIAL RUN =======
init();
