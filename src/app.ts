import express from "express";
import category from "./route/category.route";
import item from "./route/item.route";
import user from "./route/user.route";
import supplier from "./route/supplier.route";

const app = express();

app.use(express.json());
app.use("/category", category);
app.use("/item", item);
app.use("/user", user);
app.use("/supplier", supplier);

export default app;
