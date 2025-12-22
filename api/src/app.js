const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// ===== App =====
const app = express();
app.set("trust proxy", 1);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false, // tránh chặn ảnh/static khi cần
  })
);

// CORS - HỖ TRỢ NHIỀU ORIGIN
const allowedOrigins = [
  "https://supershoply-2.onrender.com",
  "http://localhost:3000",
  "http://localhost:5173", // nếu dùng Vite
];

// Nếu có CORS_ORIGIN trong env thì thêm vào
if (process.env.CORS_ORIGIN) {
  const envOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
  allowedOrigins.push(...envOrigins);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (Postman, mobile apps, curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️ CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body parser & logger
app.use(express.json({ limit: "10kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Load Routers and Mount them

// 1. Product Router
const productsRouter = require("./routes/products.router");
app.use("/api/v1/products", productsRouter);

// 2. Order Router 
const ordersRouter = require("./routes/orders.router");
app.use("/api/v1/orders", ordersRouter);

// 3. Auth Router
const authRouter = require("./routes/auth.router");
app.use("/api/v1/auth", authRouter);

// 4. API prefix v1 (Health check)
const api = express.Router();
api.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "shoply-api",
    version: "v1",
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
app.use("/api/v1", api);

// 5. Root path
app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "shoply-api",
    tip: "API health at /api/v1/health",
    version: "v1",
  });
});

// 6. 404 Not Found (LAST ROUTE HANDLER)
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: { code: "NOT_FOUND", message: "Route not found", path: req.originalUrl },
  });
});

// 7. Error Handler chuẩn JSON (LAST MIDDLEWARE)
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  const code = err.code || (status === 500 ? "INTERNAL_ERROR" : "UNKNOWN_ERROR");
  const message = err.message || "Internal Server Error";
  
  // Log error trong mọi môi trường để debug
  console.error("[ERROR]", status, code, message);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }
  
  res.status(status).json({ ok: false, error: { code, message } });
});

module.exports = app;
