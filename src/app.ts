import express from "express";
import category from "./route/category.route";
import item from "./route/item.route";

const app = express();

app.use(express.json());
app.use("/category", category);
app.use("/item", item);

export default app;
