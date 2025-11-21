import { STORAGE_KEYS } from "./config.js";

// ════════════════ Show Data ════════════════ //

function createPostCard(postData, currentUserId) {
  const post = document.createElement("article");
  post.className = "post";
  post.dataset.id = postData.id;
  post.dataset.userid = postData.author.id;

  // === Post Header ===
  const postHeader = document.createElement("div");
  postHeader.className = "post-header";

  // Profile Image - fallback if image is invalid
  const userPhoto = document.createElement("img");
  userPhoto.className = "user-photo";
  userPhoto.setAttribute("loading", "lazy");
  userPhoto.setAttribute("alt", "user-photo");

  userPhoto.src =
    typeof postData.author.profile_image !== "object"
      ? postData.author.profile_image
      : "../../imgs/no-profile-photo.webp";
  userPhoto.onerror = function () {
    this.src = "../../imgs/no-profile-photo.webp";
  };

  const userName_postTime = document.createElement("div");

  const userName = document.createElement("h2");
  userName.className = "user-name";
  // textContent is XSS safe - prevents script injection
  userName.textContent = postData.author.username;

  const postTime = document.createElement("p");
  postTime.className = "post-time";
  postTime.textContent = postData.created_at;

  userName_postTime.append(userName, postTime);

  postHeader.append(userPhoto, userName_postTime);

  // Only show edit/delete buttons if post owner is current user
  if (postData.author.id === currentUserId) {
    const editDeletePostWrapper = document.createElement("div");
    editDeletePostWrapper.className = "edit-delete-post-wrapper";

    const editBtn = document.createElement("span");
    editBtn.className = "edit-btn";
    // innerHTML with hardcoded HTML is safe (no user data)
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';

    const deleteBtn = document.createElement("span");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

    editDeletePostWrapper.append(editBtn, deleteBtn);
    postHeader.append(editDeletePostWrapper);
  }

  // === Post Content ===
  const postContent = document.createElement("div");
  postContent.className = "post-content";
  postContent.setAttribute("dir", "auto");

  const postText = document.createElement("p");
  postText.className = "post-text";
  postText.textContent = postData.body;

  postContent.append(postText);

  // === Post Image ===
  // Only add image if it's a valid string URL
  if (typeof postData.image !== "object") {
    const postMedia = document.createElement("img");
    postMedia.setAttribute("loading", "lazy");
    postMedia.setAttribute("alt", "Post image");

    postMedia.className = "post-img";
    postMedia.src = postData.image;
    postMedia.onerror = function () {
      this.remove();
    };
    postContent.append(postMedia);
  }

  // === Comments Wrapper ===
  const commentsWrapper = document.createElement("div");
  commentsWrapper.className = "comments-wrapper";

  const commentsIcon = document.createElement("i");
  commentsIcon.className = "fa-regular fa-comment comments-icon";

  const commentsCount = document.createElement("span");
  commentsCount.className = "comments-count";
  // Use 0 as fallback if comments_count doesn't exist
  commentsCount.textContent = postData.comments_count || 0;

  const commentsWord = document.createElement("span");
  commentsWord.className = "comments-word";
  commentsWord.textContent = "Comments";

  commentsWrapper.append(commentsIcon, commentsCount, commentsWord);

  // === Append All ===
  post.append(postHeader, postContent, commentsWrapper);

  return post;
}

function displayPosts(posts) {
  const fragment = document.createDocumentFragment();
  const postsContainer = document.querySelector(".posts-container");

  // Clear previous posts to avoid duplicates
  postsContainer.innerHTML = "";

  const userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
  const currentUserId = userData?.id;

  posts.forEach((postData) => {
    const postCard = createPostCard(postData, currentUserId);
    fragment.append(postCard);
  });

  postsContainer.append(fragment);
}

function displayPost(post) {
  const postContainer = document.querySelector(".post-container");
  postContainer.innerHTML = "";

  const userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
  const currentUserId = userData?.id;

  const postCard = createPostCard(post, currentUserId);

  // ✅ 1. أضف الـ comment form الأول
  const addCommentForm = createAddCommentForm(post.id);
  postCard.append(addCommentForm);

  // ✅ 2. بعدين أضف التعليقات (لو موجودة)
  if (post.comments_count > 0) {
    const commentsSection = createCommentsSection(post.comments);
    postCard.append(commentsSection);
  }

  postContainer.append(postCard);
}

function createCommentsSection(comments) {
  const commentsSection = document.createElement("div");
  commentsSection.className = "comments-section";

  const fragment = document.createDocumentFragment();

  comments.forEach((comment) => {
    const commentDiv = document.createElement("div");
    commentDiv.className = "comment";

    // ✅ صورة المستخدم
    const userPhoto = document.createElement("img");
    userPhoto.className = "user-photo-comment";
    userPhoto.setAttribute("loading", "lazy");
    userPhoto.setAttribute("alt", "profile-photo");

    userPhoto.src =
      comment.author.profile_image &&
      typeof comment.author.profile_image === "string"
        ? comment.author.profile_image
        : "../../imgs/no-profile-photo.webp";
    userPhoto.onerror = function () {
      this.src = "../../imgs/no-profile-photo.webp";
    };

    // ✅ محتوى التعليق
    const commentContent = document.createElement("div");
    commentContent.className = "comment-content";

    const commentAuthor = document.createElement("h4");
    commentAuthor.className = "comment-author";
    commentAuthor.textContent = comment.author.username;

    const commentBody = document.createElement("p");
    commentBody.className = "comment-body";
    commentBody.textContent = comment.body;
    commentBody.setAttribute("dir", "auto"); // ✅ أضف هنا

    commentContent.append(commentAuthor, commentBody);
    commentDiv.append(userPhoto, commentContent); // ✅ صورة + محتوى
    fragment.append(commentDiv);
  });

  commentsSection.append(fragment);
  return commentsSection;
}

function createAddCommentForm(postId) {
  // Main container
  const container = document.createElement("div");
  container.className = "add-comment-container";

  // Form
  const form = document.createElement("form");
  form.className = "add-comment-form";
  form.dataset.postId = postId;

  // Comment input (textarea)
  const textarea = document.createElement("textarea");
  textarea.placeholder = "Write a comment...";
  textarea.className = "comment-input";
  textarea.required = true;
  textarea.rows = 1;

  // Submit button
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Comment";
  submitBtn.className = "add-comment-btn"; // ✅ الـ class الصحيح

  // Append
  form.append(textarea, submitBtn);
  container.append(form);

  return container; // ✅ نرجع الـ container مش الـ form
}

function displayUserProfile(user) {
  const profileContainer = document.querySelector(".profile-container");

  if (!profileContainer) return;

  const profileAvatar = profileContainer.querySelector(".profile-avatar");
  if (profileAvatar) {
    profileAvatar.src =
      user.profile_image && typeof user.profile_image === "string"
        ? user.profile_image
        : "../../imgs/no-profile-photo.webp";
    profileAvatar.onerror = function () {
      this.src = "../../imgs/no-profile-photo.webp";
    };
  }

  const profileName = profileContainer.querySelector(".profile-name");
  if (profileName) {
    profileName.textContent = user.name || user.username || "Unknown";
  }

  const profileUsername = profileContainer.querySelector(".profile-username");
  if (profileUsername) {
    profileUsername.textContent = `@${user.username}`;
  }

  const profileEmail = profileContainer.querySelector(".profile-email");
  if (profileEmail) {
    profileEmail.textContent = user.email || "No email provided";
  }

  const profilePostsCount = profileContainer.querySelector(".posts-count");
  if (profilePostsCount) {
    profilePostsCount.textContent = user.posts_count || 0;
  }

  const profileCommentsCount =
    profileContainer.querySelector(".comments-count");
  if (profileCommentsCount) {
    profileCommentsCount.textContent = user.comments_count || 0;
  }
}

function displayUserPosts(posts) {
  const fragment = document.createDocumentFragment();
  const postsContainer = document.querySelector(".posts-container");

  postsContainer.innerHTML = "";

  if (posts.length === 0) {
    postsContainer.innerHTML = `
      <div class="empty-state">
        <p class="empty-text">No posts yet</p>
      </div>
      `;
    return;
  }

  const userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
  const currentUserId = userData?.id;

  posts.forEach((postData) => {
    const postCard = createPostCard(postData, currentUserId);
    fragment.append(postCard);
  });

  postsContainer.append(fragment);
}

// ════════════════ Notifications ════════════════ //

function showSuccessMessage(message) {
  const notification = document.querySelector("#notification");

  notification.textContent = message;
  notification.className = "notification notification-success";

  // Show
  setTimeout(() => {
    notification.classList.remove("hidden");
  }, 0);

  // Hide after 2 seconds
  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3000);
}

function showErrorMessage(message) {
  const notification = document.querySelector("#notification");

  notification.textContent = message;
  notification.className = "notification notification-error";

  // Show
  setTimeout(() => {
    notification.classList.remove("hidden");
  }, 0);

  // Hide after 2 seconds
  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3000);
}

function showConfirmDialog(title, message) {
  return new Promise((resolve) => {
    const dialog = document.querySelector("#confirm-dialog");
    const titleEl = document.querySelector("#confirm-title");
    const messageEl = document.querySelector("#confirm-message");
    const yesBtn = document.querySelector("#confirm-yes");
    const noBtn = document.querySelector("#confirm-no");

    // Set content
    titleEl.textContent = title;
    messageEl.textContent = message;

    // Show dialog
    dialog.classList.remove("hidden");

    // Handle buttons
    const handleYes = () => {
      cleanup();
      resolve(true);
    };

    const handleNo = () => {
      cleanup();
      resolve(false);
    };

    const cleanup = () => {
      dialog.classList.add("hidden");
      yesBtn.removeEventListener("click", handleYes);
      noBtn.removeEventListener("click", handleNo);
    };

    yesBtn.addEventListener("click", handleYes);
    noBtn.addEventListener("click", handleNo);
  });
}

// ════════════════ Loading State ════════════════ //

function showLoading() {
  const loader = document.querySelector("#loader");
  loader.classList.remove("hidden");
}

function hideLoading() {
  const loader = document.querySelector("#loader");
  loader.classList.add("hidden");
}

// ════════════════ Modal Functions ════════════════ //

function openCreatePostModal() {
  const modalOverlay = document.querySelector("#modalOverlay");
  const modalHeader = document.querySelector(".modal-header h2");

  // ✅ استخدم selector أكتر تحديدًا
  const modalBtn = document.querySelector(".modal-footer .btn-submit");

  const modalBody = document.querySelector("#postBody");
  const postForm = document.querySelector("#postForm");

  if (modalOverlay) {
    modalOverlay.classList.add("active");
  }
  if (modalHeader) {
    modalHeader.textContent = "Create New Post";
  }
  if (modalBtn) {
    modalBtn.textContent = "Submit Post"; // ✅ هيرجع للنص الأصلي
  }
  if (modalBody) {
    modalBody.value = "";
  }
  if (postForm) {
    postForm.dataset.mode = "create";
    delete postForm.dataset.postId;
  }
}

function closeCreatePostModal() {
  const modalOverlay = document.querySelector("#modalOverlay");
  const postForm = document.querySelector("#postForm");
  const fileName = document.querySelector("#fileName");

  if (modalOverlay) {
    modalOverlay.classList.remove("active");
  }

  if (postForm) {
    postForm.reset();
    delete postForm.dataset.postId;
    delete postForm.dataset.mode;
  }

  if (fileName) {
    fileName.style.display = "none";
  }
}

function openEditPostModal(post) {
  const modalOverlay = document.querySelector("#modalOverlay");
  const modalHeader = document.querySelector(".modal-header h2");

  // ✅ استخدم selector أكتر تحديدًا
  const modalBtn = document.querySelector(".modal-footer .btn-submit");

  const postForm = document.querySelector("#postForm");
  const modalBody = document.querySelector("#postBody");
  const modalOldBody = post.querySelector(".post-text").textContent;

  if (modalOverlay) {
    modalOverlay.classList.add("active");
  }
  if (modalHeader) {
    modalHeader.textContent = "Edit Post";
  }
  if (modalBtn) {
    modalBtn.textContent = "Update Post"; // ✅ هيشتغل دلوقتي
  }
  if (modalBody && post) {
    modalBody.value = modalOldBody;
  }
  if (postForm && post) {
    postForm.dataset.mode = "edit";
    postForm.dataset.postId = post.dataset.id;
  }
}

function closeEditPostModal() {
  closeCreatePostModal();
}

// ════════════════ Scroll To Top ════════════════ //
function showScrollToTopBtn(active) {
  const scrollToTopBtn = document.querySelector("#scrollToTopBtn");
  if (scrollToTopBtn) {
    if (active) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  }
}

export {
  // Display
  displayPosts,
  displayPost,
  displayUserProfile,
  displayUserPosts,
  createPostCard,
  createCommentsSection,
  createAddCommentForm,

  // Notifications
  showSuccessMessage,
  showErrorMessage,
  showConfirmDialog,

  // Loading
  showLoading,
  hideLoading,

  // Modals
  openCreatePostModal,
  closeCreatePostModal,
  openEditPostModal,
  closeEditPostModal,

  // Scroll
  showScrollToTopBtn,
};
