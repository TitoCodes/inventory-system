import express from "express";
import category from "./route/category.route";
const app = express();

app.use(express.json());

app.use("/category", category);

const server = app.listen(3001, () =>
  console.log(`
🚀 Server ready at: http://localhost:3001`)
);
