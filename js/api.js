// 避免污染全局
var API = (function () {
  // 全局常量一般大写
  const BASE_URL = "https://study.duyiedu.com";
  const TOKEN_KEY = "token";

  // 封装两个函数 get 和 post
  function get(path) {
    const headers = {};
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers });
  }

  function post(path, bodyObj) {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyObj),
    });
  }

  async function register(userInfo) {
    const resp = await post("/api/user/reg", userInfo);
    return await resp.json();
  }

  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo);
    const result = await resp.json();
    if (result.code === 0) {
      // 登录成功，将响应头中的token保存起来（localStorage）
      const token = resp.headers.get("authorization");
      localStorage.setItem(TOKEN_KEY, token);
    }
    return result;
  }

  async function exists(loginId) {
    const resp = await get("/api/user/exists?loginId=" + loginId);
    return await resp.json();
  }

  async function profile() {
    const resp = await get("/api/user/profile");
    return await resp.json();
  }

  async function sendChat(content) {
    const resp = await post("/api/chat", { content });
    return await resp.json();
  }

  async function getHistory() {
    const resp = await get("/api/chat/history");
    return await resp.json();
  }

  // 取消登录
  // 删除localStorage的token令牌值，使用方法localStorage.removeItem(xxx)
  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }

  return {
    register,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
  };
})();
