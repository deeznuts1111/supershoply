const express = require("express");
const { createOrder, getOrderById, listOrders, updateOrderStatus, deleteOrder } = require("../controllers/orders.controller");
const { createOrderSchema } = require("../schemas/order.dto");
const { requireAuth, requireRole } = require("../middlewares/auth");

const router = express.Router();
const validate = (schema) => (req, _res, next) => { 
  try { 
    req.body = schema.parse(req.body); 
    next(); 
  } catch (e) { 
    e.status = 400; 
    next(e); 
  } 
};

// ✅ Admin only: List all orders (đặt TRƯỚC /:id)
router.get("/", requireAuth, requireRole("admin"), (req, res, next) => 
  Promise.resolve(listOrders(req, res, next)).catch(next)
);

// ✅ Public: Create order (checkout)
router.post("/", validate(createOrderSchema), (req, res, next) => 
  Promise.resolve(createOrder(req, res, next)).catch(next)
);

// ✅ Public: Get single order by ID (đặt SAU route /)
router.get("/:id", (req, res, next) => 
  Promise.resolve(getOrderById(req, res, next)).catch(next)
);

// ✅ Admin only: Update order status
router.patch("/:id", requireAuth, requireRole("admin"), (req, res, next) => 
  Promise.resolve(updateOrderStatus(req, res, next)).catch(next)
);

// ✅ Admin only: Delete order
router.delete("/:id", requireAuth, requireRole("admin"), (req, res, next) => 
  Promise.resolve(deleteOrder(req, res, next)).catch(next)
);

module.exports = router;
