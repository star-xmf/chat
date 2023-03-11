(async function () {
  //验证是否有登录，如果有登录，获取登录信息，如果未登录，跳转到登录页面
  const resp = await API.profile();
  // 获取登录对象信息
  const user = resp.data;
  if (!user) {
    alert(resp.msg + "，请重新登录");
    location.href = "../login.html";
    return;
  }

  // 获取doms元素对象
  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    msgContainer: $(".msg-container"),
  };

  //设置用户登录信息
  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }
  setUserInfo();

  // 点击X关闭页面，注销事件
  doms.close.onclick = function () {
    API.loginOut();
    location.href = "../login.html";
  };

  // 加载聊天历史记录
  await loadHistory();
  async function loadHistory() {
    const resp = await API.getHistory();
    for (let item of resp.data) {
      addChat(item);
    }
    scrollBottom();
  }

  // 根据消息对象，将其添加到页面中
  function addChat(chatInfo) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (chatInfo.from) {
      div.classList.add("me");
    }

    const img = $$$("img");
    img.className = "chat-avatar";
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;

    const date = $$$("div");
    date.className = "chat-date";
    date.innerText = formatDate(chatInfo.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);

    doms.chatContainer.appendChild(div);
  }

  // 时间戳转化为正常时间
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  // 聊天区域滚动条到最后
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }

  // 发送消息函数
  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    // 手动界面上创建一个消息，然后再往服务器上面发
    addChat({
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
      content: content,
    });
    doms.txtMsg.value = "";
    scrollBottom();

    const resp = await API.sendChat(content);
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    scrollBottom();
  }

  // 回车发送消息
  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };
})();
