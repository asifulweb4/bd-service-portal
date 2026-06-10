  import "dotenv/config";
import express from "express";
import path from "path";
import pg from "pg";
import { createServer as createViteServer } from "vite";

const { Pool } = pg;
const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy database connection pool initialization
let pool: pg.Pool | null = null;

function getPool() {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  if (!pool) {
    const config: any = {
      connectionString: process.env.DATABASE_URL,
    };
    // Apply SSL rejectUnauthorized: false required for serverless Neon database connection
    if (process.env.DATABASE_URL.includes("neon.tech") || process.env.DATABASE_URL.includes("cockroachlabs") || process.env.DATABASE_URL.includes("render.com")) {
      config.ssl = { rejectUnauthorized: false };
    }
    pool = new Pool(config);
  }
  return pool;
}

// Automatically create tables on startup if Neon string is active
async function initDb() {
  const p = getPool();
  if (!p) {
    console.warn("⚠️ Neon DATABASE_URL environment variable is missing. Running in simulated offline state.");
    return false;
  }
  try {
    const client = await p.connect();
    try {
      // 1. Create Users Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          uid VARCHAR(64) PRIMARY KEY,
          email VARCHAR(128) UNIQUE NOT NULL,
          phone VARCHAR(32) UNIQUE,
          display_name VARCHAR(128) NOT NULL,
          balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
          role VARCHAR(32) NOT NULL DEFAULT 'citizen',
          password VARCHAR(256) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Ensure phone column exists for dual login compatibility
      try {
        await client.query(`
          ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(32) UNIQUE;
        `);
      } catch (colErr) {
        console.warn("Could not execute ALTER TABLE users ADD COLUMN IF NOT EXISTS phone:", colErr);
      }

      // 2. Create Transactions Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS transactions (
          id VARCHAR(64) PRIMARY KEY,
          uid VARCHAR(64) REFERENCES users(uid) ON DELETE CASCADE,
          type VARCHAR(32) NOT NULL,
          service_name VARCHAR(128),
          amount NUMERIC(15, 2) NOT NULL,
          method VARCHAR(32),
          trx_id VARCHAR(64),
          account_no VARCHAR(64),
          status VARCHAR(32) NOT NULL,
          timestamp VARCHAR(128) NOT NULL
        );
      `);
      console.log("✅ Neon PostgreSQL tables initialized successfully.");
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("❌ Failed to initialize Neon PostgreSQL tables:", error);
    return false;
  }
}

// API endpoint to verify Neon configuration details
app.get("/api/db-status", async (req, res) => {
  const isConfigured = !!process.env.DATABASE_URL;
  let connectionStable = false;
  if (isConfigured) {
    try {
      const p = getPool();
      if (p) {
        const testRes = await p.query("SELECT NOW()");
        connectionStable = !!testRes.rows.length;
      }
    } catch (e) {
      console.error("Health check database error:", e);
    }
  }
  res.json({
    configured: isConfigured,
    stable: connectionStable,
    message: isConfigured 
      ? (connectionStable ? "Neon Database connected correctly." : "Database variable present but failed connection handshake.")
      : "DATABASE_URL environment variable is currently absent."
  });
});

// Authentication endpoints
app.post("/api/auth/register", async (req, res) => {
  const { email, phone, name, password } = req.body;
  const p = getPool();
  if (!p) {
    return res.status(400).json({ error: "DATABASE_URL is missing. Please configure it in environment variables." });
  }

  try {
    const emailKey = email ? email.trim().toLowerCase() : '';
    const phoneVal = phone ? phone.trim() : null;

    if (!emailKey) {
      return res.status(400).json({ error: "ইমেইল প্রদান করা আবশ্যক। (Email is required.)" });
    }

    // Check if email already exists
    const duplicateEmail = await p.query("SELECT uid FROM users WHERE email = $1", [emailKey]);
    if (duplicateEmail.rows.length > 0) {
      return res.status(400).json({ error: "ইমেইলটি ইতিপূর্বে নিবন্ধিত হয়েছে। (This email is already registered.)" });
    }

    // Check if phone already exists
    if (phoneVal) {
      const duplicatePhone = await p.query("SELECT uid FROM users WHERE phone = $1", [phoneVal]);
      if (duplicatePhone.rows.length > 0) {
        return res.status(400).json({ error: "মোবাইল নম্বরটি ইতিপূর্বে নিবন্ধিত হয়েছে। (This phone number is already registered.)" });
      }
    }

    const uid = 'USR-' + Math.floor(100000 + Math.random() * 900000);
    
    // Insert new user with 0 BDT balance
    await p.query(
      "INSERT INTO users (uid, email, phone, display_name, balance, role, password) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [uid, emailKey, phoneVal, name || emailKey.split('@')[0], 0.00, 'citizen', password]
    );

    const userObj = {
      uid,
      email: emailKey,
      phone: phoneVal,
      displayName: name || emailKey.split('@')[0],
      balance: 0.00,
      role: 'citizen'
    };

    res.json(userObj);
  } catch (err: any) {
    console.error("Register Error:", err);
    res.status(500).json({ error: err.message || "Registration failed." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body; // 'email' can store email or phone in authentication forms
  const p = getPool();
  if (!p) {
    return res.status(400).json({ error: "DATABASE_URL is missing. Please configure it in environment variables." });
  }

  try {
    if (!email) {
      return res.status(400).json({ error: "ইমেইল বা মোবাইল নম্বর প্রদান করুন।" });
    }
    const cleanId = email.trim().toLowerCase();
    
    // Select by email or phone
    const result = await p.query("SELECT * FROM users WHERE email = $1 OR phone = $1", [cleanId]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "ভুল ইমেইল/মোবাইল নম্বর অথবা পাসওয়ার্ড।" });
    }

    const user = result.rows[0];
    if (user.password !== password) {
      return res.status(400).json({ error: "ভুল ইমেইল/মোবাইল নম্বর অথবা পাসওয়ার্ড। (Incorrect credentials.)" });
    }

    res.json({
      uid: user.uid,
      email: user.email,
      phone: user.phone,
      displayName: user.display_name,
      balance: parseFloat(user.balance),
      role: user.role
    });
  } catch (err: any) {
    console.error("Login Error:", err);
    res.status(500).json({ error: err.message || "Login failed." });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { identifier, newPassword } = req.body;
  const p = getPool();
  if (!p) {
    return res.status(400).json({ error: "DATABASE_URL is missing. Please configure it in environment variables." });
  }

  try {
    if (!identifier) {
      return res.status(400).json({ error: "ইমেইল বা মোবাইল নম্বর প্রদান করুন।" });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "পাসওয়ার্ডটি অবশ্যই অন্তত ৬ ডিজিটের হতে হবে।" });
    }
    const cleanId = identifier.trim().toLowerCase();

    // Check if user exists
    const result = await p.query("SELECT uid FROM users WHERE email = $1 OR phone = $1", [cleanId]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "এই ইমেইল বা মোবাইল নম্বরের কোনো ব্যবহারকারী পাওয়া যায়নি।" });
    }

    const uid = result.rows[0].uid;
    // Update password
    await p.query("UPDATE users SET password = $1 WHERE uid = $2", [newPassword, uid]);

    res.json({ success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।" });
  } catch (err: any) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ error: err.message || "Password reset failed." });
  }
});

// Sync transactions list
app.get("/api/transactions", async (req, res) => {
  const { uid } = req.query;
  const p = getPool();
  if (!p) return res.json([]);

  try {
    const result = await p.query(
      "SELECT id, type, service_name as \"serviceName\", amount, method, trx_id as \"trxId\", account_no as \"accountNo\", status, timestamp FROM transactions WHERE uid = $1 ORDER BY timestamp DESC LIMIT 50",
      [uid]
    );
    // Explicit format parse as float to prevent string problems
    const output = result.rows.map(item => ({
      ...item,
      amount: parseFloat(item.amount)
    }));
    res.json(output);
  } catch (err) {
    console.error("Fetch transactions error:", err);
    res.json([]);
  }
});

// Update user details
app.get("/api/user-profile", async (req, res) => {
  const { uid } = req.query;
  const p = getPool();
  if (!p) return res.status(404).json({ error: "Not configured" });

  try {
    const result = await p.query("SELECT uid, email, phone, display_name as \"displayName\", balance, role FROM users WHERE uid = $1", [uid]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User profile record not found." });
    }
    const user = result.rows[0];
    res.json({
      ...user,
      balance: parseFloat(user.balance)
    });
  } catch (err) {
    console.error("Profile sync check error:", err);
    res.status(500).json({ error: "Profile read error" });
  }
});

// Perform deposits
app.post("/api/transactions/deposit", async (req, res) => {
  const { uid, amount, method, trxId } = req.body;
  const p = getPool();
  if (!p) return res.status(400).json({ error: "DB missing" });

  try {
    const amountVal = parseFloat(amount);
    
    // Begin simple balance update
    await p.query("UPDATE users SET balance = balance + $1 WHERE uid = $2", [amountVal, uid]);
    
    // Log in ledger
    const id = 'DEP-' + Math.floor(100000 + Math.random() * 900000);
    await p.query(
      "INSERT INTO transactions (id, uid, type, amount, method, trx_id, status, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [id, uid, 'deposit', amountVal, method, trxId, 'Completed', new Date().toLocaleString()]
    );

    // Return latest profile
    const latestUser = await p.query("SELECT uid, email, display_name as \"displayName\", balance, role FROM users WHERE uid = $1", [uid]);
    res.json({
      success: true,
      balance: parseFloat(latestUser.rows[0].balance)
    });
  } catch (err: any) {
    console.error("Deposit processing failed:", err);
    res.status(500).json({ error: err.message });
  }
});

// Perform withdrawals
app.post("/api/transactions/withdraw", async (req, res) => {
  const { uid, amount, method, accountNo } = req.body;
  const p = getPool();
  if (!p) return res.status(400).json({ error: "DB missing" });

  try {
    const amountVal = parseFloat(amount);
    
    // View current balance to ensure valid limits
    const checkUsr = await p.query("SELECT balance FROM users WHERE uid = $1", [uid]);
    if (checkUsr.rows.length === 0) return res.status(404).json({ error: "User not found." });
    
    const balance = parseFloat(checkUsr.rows[0].balance);
    if (balance < amountVal) {
      return res.status(400).json({ error: "Insufficient wallet funds in persistent balance." });
    }

    // Execute safe deductions
    await p.query("UPDATE users SET balance = balance - $1 WHERE uid = $2", [amountVal, uid]);
    
    const id = 'WIT-' + Math.floor(100000 + Math.random() * 900000);
    await p.query(
      "INSERT INTO transactions (id, uid, type, amount, method, account_no, status, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [id, uid, 'withdraw', amountVal, method, accountNo, 'Completed', new Date().toLocaleString()]
    );

    const latestUser = await p.query("SELECT uid, email, display_name as \"displayName\", balance, role FROM users WHERE uid = $1", [uid]);
    res.json({
      success: true,
      balance: parseFloat(latestUser.rows[0].balance)
    });
  } catch (err: any) {
    console.error("Withdrawal error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Perform services fee deduction
app.post("/api/services/deduct", async (req, res) => {
  const { uid, amount, serviceName } = req.body;
  const p = getPool();
  if (!p) return res.status(400).json({ error: "DB missing" });

  try {
    const amountVal = parseFloat(amount);
    
    const checkUsr = await p.query("SELECT balance FROM users WHERE uid = $1", [uid]);
    if (checkUsr.rows.length === 0) return res.status(404).json({ error: "User not found." });
    
    const balance = parseFloat(checkUsr.rows[0].balance);
    if (balance < amountVal) {
      return res.status(400).json({ error: "Insufficient wallet funds to run this module." });
    }

    // Execute deduction
    await p.query("UPDATE users SET balance = balance - $1 WHERE uid = $2", [amountVal, uid]);
    
    const id = 'SERV-' + Math.floor(100000 + Math.random() * 900000);
    await p.query(
      "INSERT INTO transactions (id, uid, type, service_name, amount, method, status, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [id, uid, 'service', serviceName, amountVal, 'System', 'Completed', new Date().toLocaleString()]
    );

    const latestUser = await p.query("SELECT uid, email, display_name as \"displayName\", balance, role FROM users WHERE uid = $1", [uid]);
    res.json({
      success: true,
      balance: parseFloat(latestUser.rows[0].balance)
    });
  } catch (err: any) {
    console.error("Service charge failed:", err);
    res.status(500).json({ error: err.message });
  }
});


// Configure development Vite server or production bundle serve
async function startServer() {
  const dbConnected = await initDb();
  if (dbConnected) {
    console.log("🚀 Server running integrated with Neon database connection.");
  } else {
    console.log("ℹ️ Server running with dynamic demo fallback (awaiting DATABASE_URL).");
  }

  // Vite integration middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("Running in development environment mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Running in production deployment mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✨ Citizen Cloud Service Portal active directly on: http://localhost:${PORT}`);
  });
}

startServer();
