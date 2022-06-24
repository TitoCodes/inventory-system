import express from "express";
import category from "./route/category.route";
const app = express();

app.use(express.json());
app.use("/category", category);

export default app;
