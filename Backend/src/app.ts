import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes"
import productRouter from "./routes/productRoutes"
import profileRoutes from "./routes/profileRoutes"
import userRoutes from "./routes/userRoutes"
import referralRoutes from "./routes/referralRoutes"
import adminRoutes from "./routes/adminRoutes"
import commisionRoutes from "./routes/commisionRoutes"
import walletRoutes from "./routes/walletRoutes"
import withdrawalRoutes from "./routes/withdrawalRoutes"

const app = express();

app.use(express.json());

app.use(cookieParser());


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

app.use("/api/categories",categoryRoutes);

app.use("/api/products" , productRouter)

app.use("/api/profiles" , profileRoutes)

app.use("/api/users" , userRoutes)

app.use("/api/referrals" , referralRoutes)

app.use("/api/admin" , adminRoutes)

app.use("/api/commission-settings" , commisionRoutes)

app.use( "/api/wallet", walletRoutes);

app.use("/api/withdrawals" , withdrawalRoutes)

export default app;