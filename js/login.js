const loginIdValidator = new FieldValidator("txtLoginId", function (value) {
  if (!value) {
    return "请输入账号";
  }
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请输入密码";
  }
});

const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault();
  // result是所有input的最终结果
  const result = await FieldValidator.validator(
    loginIdValidator,
    loginPwdValidator
  );
  if (!result) return;

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const resp = await API.login(data);
  if (resp.code === 0) {
    alert("登录成功，点击确定，跳转到首页");
    location.href = Base_Url + "index.html";
  } else {
    loginIdValidator.p.innerText = "账号或密码错误，请重新输入";
    loginPwdValidator.input.value = "";
  }
};
