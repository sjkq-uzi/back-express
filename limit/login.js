const joi = require("joi");
//对账号进行验证
//string 表示字符串，alphanum 表示只能包含字母和数字，min(6) 表示最小长度为6，max(12) 表示最大长度为12,required表示必填
const account = joi.string().alphanum().min(6).max(12).required();
//对密码进行验证
const password = joi
  .string()
  .pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/)
  .min(6)
  .max(12)
  .required();

const body = joi.object({
  account: joi.string().alphanum().min(6).max(12).required(),
  password: joi
    .string()
    .pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/)
    .min(6)
    .max(12)
    .required(),
});
exports.schema = body;
// exports.login_limit = {
//   //表示对req中的body进行验证
//   body: {
//     account,
//     password,
//   },
// };
