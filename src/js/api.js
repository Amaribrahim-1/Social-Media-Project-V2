// 1. function login(username, password) { }
// 2. function register(formData) { }
// 3. function getPosts(page = 1) { }
// 4. function getPost(postId) { }
// 5. function createPost(formData) { }
// 6. function updatePost(postId, formData) { }
// 7. function deletePost(postId) { }
// 8. function addComment(postId, body) { }
// 9. function getUserProfile(userId) { }
// 10. function getUserPosts(userId, page = 1) { }

import { API_CONFIG, STORAGE_KEYS } from "./config.js";

async function login(username, password) {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`;
    const response = await axios.post(url, { username, password });

    const token = response.data.token;
    const user = response.data.user;

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

async function register(formData) {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`;
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const token = response.data.token;
    const user = response.data.user;

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
}

async function getPosts(page = 1) {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POSTS.GET_ALL}?limit=10&page=${page}`;
    const response = await axios.get(url);

    return response.data; // ✅ غيّر من response.data.data
  } catch (error) {
    console.error("Get posts error:", error);
    throw error;
  }
}

async function getPost(postId) {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POSTS.GET_ONE(
      postId
    )}`;
    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    console.error("Get post error:", error);
    throw error;
  }
}

async function createPost(formData) {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POSTS.CREATE}`;
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Create Post error:", error);
    throw error;
  }
}

async function updatePost(postId, formData) {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POSTS.UPDATE(
      postId
    )}`;
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    formData.append("_method", "put");
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Update Post error:", error);
    throw error;
  }
}

async function deletePost(postId) {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POSTS.DELETE(
      postId
    )}`;
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Delete Post error:", error);
    throw error;
  }
}

async function addComment(postId, body) {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POSTS.ADD_COMMENT(
      postId
    )}`;
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    const response = await axios.post(
      url,
      { body: body },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Add Comment error:", error);
    throw error;
  }
}

async function getUserProfile(userId) {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS.GET_PROFILE(
      userId
    )}`;
    const response = await axios.get(url);

    return response.data.data;
  } catch (error) {
    console.error("Get user profile error:", error);
    throw error;
  }
}

async function getUserPosts(userId, page = 1) {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS.GET_POSTS(
      userId
    )}?limit=10&page=${page}`;
    const response = await axios.get(url);

    return response.data; // ✅ غيّر من response.data.data
  } catch (error) {
    console.error("Get user posts error:", error);
    throw error;
  }
}

export {
  login,
  register,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  getUserProfile,
  getUserPosts,
};
