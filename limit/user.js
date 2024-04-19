const joi = require("joi");
//增加用户信息的一些验证规则
//required为必填项
const id = joi.required();
const name = joi
  .string()
  .pattern(/^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/)
  .required();
const email = joi
  .string()
  .pattern(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/)
  .required();
const newPassword = joi
  .string()
  .pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/)
  .min(6)
  .max(12)
  .required();

const oldPassword = joi
  .string()
  .pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/)
  .min(6)
  .max(12)
  .required();

exports.name_limit = {
  //表示对req中的body进行验证
  body: {
    id,
    name,
  },
};
exports.email_limit = {
  //表示对req中的body进行验证
  body: {
    id,
    email,
  },
};
exports.password_limit = {
  //表示对req中的body进行验证
  body: {
    id,
    newPassword,
    oldPassword,
  },
};
exports.forget_password_limit = {
  //表示对req中的body进行验证
  body: {
    id,
    newPassword,
  },
}
