// ======= Imports =======
import { STORAGE_KEYS } from "./config.js";
import { deletePost, updatePost } from "./api.js";
import {
  showConfirmDialog,
  showSuccessMessage,
  showErrorMessage,
  showLoading,
  hideLoading,
  openEditPostModal,
  closeEditPostModal,
} from "./ui.js";

// ======= Post Interactions =======
export function setupPostInteractions(refreshCallback) {
  const postsContainer = document.querySelector(
    ".posts-container, .post-container"
  );
  if (!postsContainer) return;
  postsContainer.addEventListener("click", async (event) => {
    const post = event.target.closest(".post");
    const deleteBtn = event.target.closest(".delete-btn");
    const editBtn = event.target.closest(".edit-btn");
    const userPhoto = event.target.closest(".user-photo");
    const userName = event.target.closest(".user-name");

    if (!post) return;
    const postId = post.dataset.id;
    const userId = post.dataset.userid;

    // Delete
    if (deleteBtn) {
      event.stopPropagation();
      await handleDeletePost(postId, refreshCallback);
      return;
    }
    // Edit
    if (editBtn) {
      event.stopPropagation();
      openEditPostModal(post);
      return;
    }
    // Profile navigation
    if (userPhoto || userName) {
      event.stopPropagation();
      handleProfileNavigation(userId);
      return;
    }
    // Post details
    if (postsContainer.classList.contains("posts-container")) {
      localStorage.setItem(STORAGE_KEYS.CLICKED_POST_ID, postId);
      window.location.href = "post.html";
    }
  });
}

async function handleDeletePost(postId, refreshCallback) {
  const deleteConfirm = await showConfirmDialog(
    "Confirm Delete",
    "Are you sure you want to delete this post?"
  );
  if (!deleteConfirm) return;
  try {
    showLoading();
    await deletePost(postId);
    showSuccessMessage("Post deleted successfully!");
    if (window.location.pathname.includes("post.html")) {
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      await refreshCallback();
    }
  } catch (error) {
    showErrorMessage("Failed to delete post");
  } finally {
    hideLoading();
  }
}

function handleProfileNavigation(userId) {
  localStorage.setItem(STORAGE_KEYS.CLICKED_USER_ID, userId);
  window.location.href = "profile.html";
}

// ======= Modal Events =======
export function setupModalListeners() {
  const closeBtn = document.querySelector(".close-button");
  const cancelBtn = document.querySelector(".modal-footer .btn-cancel");
  const modalOverlay = document.getElementById("modalOverlay");
  if (closeBtn) closeBtn.addEventListener("click", closeEditPostModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeEditPostModal);
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (event) => {
      if (event.target === modalOverlay) closeEditPostModal();
    });
  }
}

// ======= Post Form Submit =======
export function setupPostFormListener(submitCallback, refreshCallback) {
  const postForm = document.querySelector("#postForm");
  if (!postForm) return;
  postForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const mode = postForm.dataset.mode;
    const postId = postForm.dataset.postId;
    const postBody = document.querySelector("#postBody").value.trim();
    const imageFile = document.querySelector("#imageUpload").files[0];
    if (!postBody) {
      showErrorMessage("Post body is required!");
      return;
    }
    showLoading();
    try {
      const formData = new FormData();
      formData.append("body", postBody);
      if (imageFile) formData.append("image", imageFile);
      if (mode === "create") {
        await submitCallback(formData);
        showSuccessMessage("Post created successfully!");
      } else if (mode === "edit") {
        formData.append("_method", "put");
        await submitCallback(postId, formData);
        showSuccessMessage("Post updated successfully!");
      }
      closeEditPostModal();
      postForm.reset();
      await refreshCallback();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Operation failed!";
      showErrorMessage(errorMsg);
    } finally {
      hideLoading();
    }
  });
}

// ======= File Upload Handler =======
export function setupFileUploadListener() {
  const imageFile = document.querySelector("#imageUpload");
  if (!imageFile) return;
  imageFile.addEventListener("change", () => {
    const file = imageFile.files[0];
    const fileName = document.querySelector("#fileName");
    const uploadText = document.querySelector("#uploadText");
    if (file) {
      if (fileName) {
        fileName.textContent = `✓ ${file.name}`;
        fileName.style.display = "block";
      }
      if (uploadText) {
        uploadText.textContent = "Change image";
      }
    }
  });
}

// ════════════════ Theme Management ════════════════ //

export function initTheme() {
  // ✅ تحميل الـ theme المحفوظ
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);

  // ✅ أو استخدام تفضيلات النظام
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // ✅ تحديد الـ theme الحالي
  const currentTheme = savedTheme || (prefersDark ? "dark" : "light");

  // ✅ تطبيق الـ theme
  applyTheme(currentTheme);

  // ✅ إعداد الزرار (لو موجود)
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
}

// ✅ دالة تبديل الـ theme
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
}

// ✅ دالة تطبيق الـ theme
function applyTheme(theme) {
  // إضافة أو إزالة الـ attribute
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  // حفظ الاختيار
  localStorage.setItem(STORAGE_KEYS.THEME, theme);

  // تغيير الأيقونات (لو موجودة)
  updateThemeIcons(theme);
}

// ✅ دالة تحديث الأيقونات
function updateThemeIcons(theme) {
  const sunIcon = document.querySelector(".sun-icon");
  const moonIcon = document.querySelector(".moon-icon");

  if (!sunIcon || !moonIcon) return;

  if (theme === "dark") {
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
  } else {
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
  }
}
