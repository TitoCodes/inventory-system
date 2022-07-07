import createCategory from "./category/createCategory.validator";
import updateCategory from "./category/updateCategory.validator";
import createItem from "./item/createItem.validator";
import updateItem from "./item/updateItem.validator";
import createUser from "./user/createUser.validator";
import updateUser from "./user/updateUser.validator";
import createSupplier from "./supplier/createSupplier.validator";
import updateSupplier from "./supplier/updateSupplier.validator";
import signUp from "./user/signUp.validator";
import login from "./authentication/login.validator";

export default {
  createCategory,
  updateCategory,
  createItem,
  updateItem,
  createUser,
  updateUser,
  createSupplier,
  updateSupplier,
  signUp,
  login,
};
