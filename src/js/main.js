// ======= IMPORTS =======
import { initializeNavbar } from "./navbarManager.js";
import { getPosts, createPost, updatePost } from "./api.js";
import {
  displayPosts,
  createPostCard,
  openCreatePostModal,
  showErrorMessage,
  showScrollToTopBtn,
} from "./ui.js";
import {
  setupModalListeners,
  setupPostFormListener,
  setupFileUploadListener,
  setupPostInteractions,
  initTheme,
} from "./helpers.js";
import { STORAGE_KEYS } from "./config.js";

// ======= GLOBAL VARIABLES =======
let currentPage = 1;
let lastPage = 1;
let isLoading = false;

// ======= PAGE INIT =======
async function init() {
  initializeNavbar();
  initTheme();
  await loadInitialPosts();
  setupEventListeners();
  setupInfiniteScroll();
  setupShowScrollToTopBtn();
  setupScrollToTopActive();
}

async function loadInitialPosts() {
  try {
    const response = await getPosts(1);
    const posts = response.data;
    const meta = response.meta;
    if (meta) {
      currentPage = meta.current_page;
      lastPage = meta.last_page;
    }
    displayPosts(posts);
  } catch (error) {
    showErrorMessage("Failed to load posts");
  }
}

function setupShowScrollToTopBtn() {
  window.addEventListener("scroll", () => {
    const viewport = document.documentElement.clientHeight;
    const scrolled = document.documentElement.scrollTop;

    if (scrolled > viewport) {
      showScrollToTopBtn(true);
    } else {
      showScrollToTopBtn(false);
    }
  });
}

function setupScrollToTopActive() {
  const scrollToTopBtn = document.querySelector("#scrollToTopBtn");
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function setupAddPostListener() {
  const addPostBtn = document.querySelector(".add-post-btn");
  if (addPostBtn) {
    addPostBtn.addEventListener("click", openCreatePostModal);
  }
}

function setupEventListeners() {
  setupAddPostListener();
  setupModalListeners();
  setupPostFormListener(createOrUpdatePost, refreshPosts);
  setupFileUploadListener();
  setupPostInteractions(refreshPosts);
}

function setupInfiniteScroll() {
  window.addEventListener("scroll", async () => {
    const pageHeight = document.documentElement.scrollHeight;
    const viewport = document.documentElement.clientHeight;
    const scrolled = document.documentElement.scrollTop;
    if (
      viewport + scrolled + 1250 >= pageHeight &&
      currentPage < lastPage &&
      !isLoading
    ) {
      isLoading = true;
      currentPage++;
      await loadMorePosts();
      isLoading = false;
    }
  });
}

async function loadMorePosts() {
  try {
    const response = await getPosts(currentPage);
    const posts = response.data;
    const meta = response.meta;
    if (meta) {
      lastPage = meta.last_page;
    }
    const postsContainer = document.querySelector(".posts-container");
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    const currentUserId = userData?.id;
    posts.forEach((postData) => {
      const postCard = createPostCard(postData, currentUserId);
      postsContainer.append(postCard);
    });
  } catch (error) {
    showErrorMessage("Failed to load more posts");
  }
}

async function refreshPosts() {
  try {
    currentPage = 1;
    const response = await getPosts(1);
    const posts = response.data;
    const meta = response.meta;
    if (meta) {
      currentPage = meta.current_page;
      lastPage = meta.last_page;
    }
    displayPosts(posts);
  } catch (error) {
    showErrorMessage("Failed to load posts");
  }
}

async function createOrUpdatePost(postIdOrFormData, formData = null) {
  if (formData === null) {
    return await createPost(postIdOrFormData);
  }
  return await updatePost(postIdOrFormData, formData);
}

// ======= INITIAL RUN =======
init();
