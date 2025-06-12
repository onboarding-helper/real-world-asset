import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import authMiddleware from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send({ message: "Server running!" });
});

app.use("/api/v1/users", authMiddleware, userRouter);
app.use("/api/v1/properties", propertyRouter);

const startServer = async () => {
  try {
    if (process.env.MONGODB_URL) {
      connectDB(process.env.MONGODB_URL);
    }
    app.listen(8080, () => console.log("Server started on port 8080"));
  } catch (error) {
    console.log(error);
  }
};

startServer();
