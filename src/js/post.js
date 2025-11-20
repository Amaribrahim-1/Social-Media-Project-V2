// ======= IMPORTS =======
import { STORAGE_KEYS } from "./config.js";
import { initializeNavbar } from "./navbarManager.js";
import { getPost, addComment, updatePost } from "./api.js";
import {
  displayPost,
  showSuccessMessage,
  showErrorMessage,
  showLoading,
  hideLoading,
} from "./ui.js";
import {
  setupPostInteractions,
  setupModalListeners,
  setupPostFormListener,
  setupFileUploadListener,
  initTheme,
} from "./helpers.js";

// ======= PAGE INIT =======
async function init() {
  initializeNavbar();
  initTheme();

  const clickedPostId = localStorage.getItem(STORAGE_KEYS.CLICKED_POST_ID);
  if (!clickedPostId) {
    showErrorMessage("No post selected!");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
    return;
  }

  await fetchAndDisplayPost(clickedPostId);
  setupEventListeners(clickedPostId);
}

// تحميل وعرض البيانات فقط
async function fetchAndDisplayPost(postId) {
  try {
    showLoading();
    const postData = await getPost(postId);
    hideLoading();
    displayPost(postData);
  } catch (error) {
    hideLoading();
    showErrorMessage("Failed to load post");
    console.error(error);
  }
}

// إعادة تحميل بعد التعليق أو التعديل
async function refreshPost(postId) {
  try {
    showLoading();
    const post = await getPost(postId);
    hideLoading();
    displayPost(post);
  } catch (error) {
    hideLoading();
    showErrorMessage("Failed to refresh post");
  }
}

// كل الأحداث modular بدون تكرار
function setupEventListeners(postId) {
  setupModalListeners();
  setupPostFormListener(
    (id, formData) => updatePost(id, formData),
    () => refreshPost(postId)
  );
  setupFileUploadListener();
  setupPostInteractions(() => refreshPost(postId));
  setupAddCommentListener(postId); // دي خاصة بالتعليقات للبوست بس
}

// setup للتعليقات (modular)
function setupAddCommentListener(postId) {
  const postContainer = document.querySelector(".post-container");
  if (!postContainer) return;
  postContainer.addEventListener("submit", async (e) => {
    if (e.target.classList.contains("add-comment-form")) {
      e.preventDefault();
      const commentInput = e.target.querySelector(".comment-input");
      const commentText = commentInput?.value.trim();

      if (!commentText) {
        showErrorMessage("Comment cannot be empty!");
        return;
      }
      showLoading();
      try {
        await addComment(postId, commentText);
        showSuccessMessage("Comment added successfully!");
        commentInput.value = "";
        await refreshPost(postId);
      } catch (error) {
        const errorMsg =
          error.response?.data?.message || "Failed to add comment";
        showErrorMessage(errorMsg);
      } finally {
        hideLoading();
      }
    }
  });
}

// ======= INITIAL RUN =======
init();
