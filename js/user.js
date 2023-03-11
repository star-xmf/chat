// 用户登录和注册的表单项验证的通用代码
class FieldValidator {
  /**
   * 对某一个表单项进行验证
   * 构造器
   * @param {String} txtId 文本框的ID
   * @param {Function} validatorFunc 验证规则函数
   */
  constructor(txtId, validatorFunc) {
    this.input = $("#" + txtId);
    this.validatorFunc = validatorFunc;
    this.p = this.input.nextElementSibling;
    // 箭头函数的this指向该构造对象，function函数this指向调用者input
    this.input.onblur = () => {
      // 文本框失去焦点时，自动调用验证函数
      this.validator();
    };
  }

  async validator() {
    // 等待验证函数执行完成之后显示结果，所以使用异步函数
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }

  /**
   * 对传入的所有验证器进行统一验证
   * @param {FieldValidator[]} validators 需要验证的对象
   *
   * ...validators：进行解构，可以直接传入对象序列，而不是对象数组
   */
  static async validator(...validators) {
    // proms 得到一个数组，每一项都是Promise对象
    const proms = validators.map((v) => v.validator());
    const result = await Promise.all(proms);
    return result.every((r) => r);
  }
}
