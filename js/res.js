// 注册与其他的不同，需要检测账号是否存在
const loginIdValidator = new FieldValidator("txtLoginId", async function (
  value
) {
  if (!value) {
    return "请输入账号";
  }
  const resp = await API.exists(value);
  if (resp.data) {
    return "账号已存在，请重新选择";
  }
});

const nicknameValidator = new FieldValidator("txtNickname", function (val) {
  if (!val) {
    return "请填写昵称";
  }
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请输入密码";
  }
});

const loginPwdConfirmValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  function (val) {
    if (!val) {
      return "请再次输入密码";
    }
    if (val !== loginPwdValidator.input.value) {
      return "两次输入的密码不一致，请重新输入";
    }
  }
);

// 给表单注册提交事件
const form = $(".user-form");
form.onsubmit = async function (e) {
  // 阻止表单提交的默认事件，点击注册，表单重新请求当前页面
  e.preventDefault();
  // result是所有input的最终结果
  const result = await FieldValidator.validator(
    loginIdValidator,
    loginPwdValidator,
    loginPwdConfirmValidator,
    nicknameValidator
  );
  if (!result) {
    // 含有一项失败，则验证失败
    return;
  }

  // new FormData(form)：该方法获取form表单中所有含有name属性的元素，返回一个迭代器
  const formData = new FormData(form);
  // 将迭代器转换为对象
  // data : {loginId: '', nickname: '', loginPwd: ''}
  const data = Object.fromEntries(formData.entries());

  const resp = await API.register(data);
  if (resp.code === 0) {
    alert("注册成功，点击确定，跳转到登录页面");
    location.href = Base_Url + "login.html";
  }
};
