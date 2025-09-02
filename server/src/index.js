import dotenv from "dotenv";
import dbConnect from "./db/dbConnect.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

// DB Connection Intry Point
dbConnect()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is Running at Port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error", err);
  });
