export const API_CONFIG = {
  BASE_URL: "https://tarmeezacademy.com/api/v1",

  ENDPOINTS: {
    AUTH: {
      LOGIN: "/login",
      REGISTER: "/register",
    },

    POSTS: {
      GET_ALL: "/posts",
      CREATE: "/posts",
      GET_ONE: (id) => `/posts/${id}`,
      UPDATE: (id) => `/posts/${id}`,
      DELETE: (id) => `/posts/${id}`,
      GET_COMMENTS: (id) => `/posts/${id}/comments`,
      ADD_COMMENT: (id) => `/posts/${id}/comments`,
    },

    USERS: {
      GET_PROFILE: (id) => `/users/${id}`,
      GET_POSTS: (id) => `/users/${id}/posts`,
    },
  },
};

export const STORAGE_KEYS = {
  TOKEN: "app_token",
  USER: "app_user",
  CLICKED_POST_ID: "clicked_post",
  CLICKED_USER_ID: "clicked_user_id",
  CLICKED_USER_NAME: "clicked_user_name",
  REMEMBER_USER_NAME: "remember_user_name",
  THEME: "theme", // ✅ أضف هنا
};

export const UI_MESSAGES = {
  SUCCESS: {
    LOGIN: "Login successful!",
    LOGOUT: "Logged out successfully",
    POST_CREATED: "Post created successfully",
    POST_UPDATED: "Post updated successfully",
    POST_DELETED: "Post deleted successfully",
    COMMENT_ADDED: "Comment added successfully",
  },

  ERROR: {
    LOGIN_FAILED: "Login failed - check your credentials",
    REGISTER_FAILED: "Registration failed - try again",
    NETWORK_ERROR: "Network error - check your connection",
    UNAUTHORIZED: "You must login first",
    NOT_FOUND: "Resource not found",
    SERVER_ERROR: "Server error - please try again",
    INVALID_DATA: "Please check your input",
  },

  CONFIRM: {
    DELETE_POST: "Are you sure you want to delete this post?",
    LOGOUT: "Are you sure you want to logout?",
  },
};
