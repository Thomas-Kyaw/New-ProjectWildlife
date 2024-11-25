const express = require("express");
const mongoose = require("mongoose");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// MongoDB connection using environment variable from .env
const mongoURI =
  process.env.MONGODB_URI || "mongodb+srv://thomaskyaw69:<987654321>@uni-project-cluster.as7yc.mongodb.net/";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    createMockUsers(); // Create mock users only if they don't exist
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit if cannot connect to database
  });

// JWT Secret Key
const jwtSecret = process.env.JWT_SECRET || "yourFallbackSecretKey";

// MongoDB Users collection setup
const usersCollection = mongoose.connection.collection("Users");

// Token generation ensuring _id is converted to string
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    jwtSecret,
    { expiresIn: "1h" }
  );
};

// Test route to verify server is responding
app.get("/test", (req, res) => {
  res.json({ message: "Server is running" });
});

// Register a new user
app.post("/api/auth/register", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = {
      email,
      password: hashedPassword,
      role: role || "user", // Default role is 'user'
    };

    // Insert user into the Users collection
    await usersCollection.insertOne(newUser);

    // Generate token and send response
    const token = generateToken(newUser);
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// User login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate token and send response
    const token = generateToken(user);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add this endpoint to your server.js
app.put("/api/user/update", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userId = new ObjectId(decoded.userId);
    const { email, currentPassword, newPassword } = req.body;

    // Find user
    const user = await usersCollection.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Prepare update object
    const updateData = { email };

    // If new password provided, hash it
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Update user
    await usersCollection.updateOne({ _id: userId }, { $set: updateData });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Protected route for admin
app.get("/api/admin", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden, not an admin" });
    }

    res.status(200).json({ message: "Welcome, Admin!" });
  } catch (error) {
    console.error("JWT error:", error);
    res.status(403).json({ error: "Invalid or expired token" });
  }
});

// Profile endpoint with detailed logging
app.get("/api/auth/profile", async (req, res) => {
  console.log("Profile endpoint hit");
  console.log("Authorization header:", req.headers.authorization);

  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ error: "Unauthorized, token missing" });
    }

    const decoded = jwt.verify(token, jwtSecret);
    console.log("Decoded token:", decoded);

    if (!decoded.userId) {
      console.log("No userId in token");
      return res.status(401).json({ error: "Invalid token format" });
    }

    let userId;
    try {
      userId = new ObjectId(decoded.userId);
      console.log("Converted userId:", userId);
    } catch (error) {
      console.error("ObjectId conversion error:", error);
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await usersCollection.findOne({ _id: userId });
    console.log("Found user:", user ? "Yes" : "No");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const response = {
      email: user.email,
      displayName: user.displayName || user.email.split("@")[0],
      role: user.role,
    };
    console.log("Sending response:", response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Profile fetch error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// File type validation middleware
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image."), false);
  }
};

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "image-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Upload endpoint
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadedFilePath = req.file.path;

    // Create form data for Python API
    const formData = new FormData();
    formData.append("file", fs.createReadStream(uploadedFilePath), {
      filename: req.file.filename,
      contentType: req.file.mimetype,
    });

    // Call Python API
    const pythonApiUrl = "http://localhost:8000/detect/";
    const pythonResponse = await axios.post(pythonApiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
        Accept: "application/json",
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    // Clean up the uploaded file
    fs.unlink(uploadedFilePath, (err) => {
      if (err) console.error("Error deleting uploaded file:", err);
    });

    res.status(200).json({
      message: "Image processed successfully",
      annotatedImageUrl: pythonResponse.data.image_path,
      csvUrl: pythonResponse.data.csv_path,
    });
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Server error during file upload or processing",
      details: error.response?.data || error.message,
    });
  }
});

// Update the WildLife Schema to include base64 data and specify collection
const WildLifeSchema = new mongoose.Schema(
  {
    image_filename: {
      type: String,
      required: true,
    },
    image_data: {
      type: String, // for base64 image data
      required: true,
    },
    csv_filename: {
      type: String,
      required: true,
    },
    csv_data: {
      type: String, // for base64 CSV data
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "WildLife", // Explicitly specify the collection name
  }
);

// Create WildLife model
const WildLife =
  mongoose.models.WildLife || mongoose.model("WildLife", WildLifeSchema);

app.get("/api/data", async (req, res) => {
  try {
    const data = await WildLife.find({}).sort({ createdAt: -1 }).lean().exec();

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "No data found",
      });
    }

    // Transform dates to ISO strings and handle missing fields
    const formattedData = data.map((item) => ({
      ...item,
      createdAt: item.createdAt ? item.createdAt : null, // Handle missing or invalid `createdAt`
      _id: item._id.toString(),
      imageUrl: `data:image/jpeg;base64,${item.image_data}`,
      csvUrl: `data:text/csv;base64,${item.csv_data}`,
    }));

    res.status(200).json(formattedData);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({
      message: "Error fetching data",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
});

// Updated save data endpoint to handle base64 data
app.post("/api/save-data", async (req, res) => {
  try {
    const { image_filename, image_data, csv_filename, csv_data } = req.body;

    if (!image_filename || !image_data || !csv_filename || !csv_data) {
      return res.status(400).json({
        message:
          "All fields (image_filename, image_data, csv_filename, csv_data) are required",
      });
    }

    const newEntry = new WildLife({
      image_filename,
      image_data,
      csv_filename,
      csv_data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await newEntry.save();

    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({
      message: "Error saving data",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
});

// Mock user creation function
const createMockUsers = async () => {
  try {
    // Check if the admin and user already exist
    const adminExists = await usersCollection.findOne({
      email: "admin@example.com",
    });
    const userExists = await usersCollection.findOne({
      email: "user@example.com",
    });

    if (!adminExists) {
      // Hash the password
      const hashedAdminPassword = await bcrypt.hash("adminpassword", 10);
      // Create a mock admin
      const adminUser = {
        email: "admin@example.com",
        password: hashedAdminPassword,
        role: "admin",
      };
      await usersCollection.insertOne(adminUser);
      console.log("Mock admin user created");
    }

    if (!userExists) {
      // Hash the password
      const hashedUserPassword = await bcrypt.hash("userpassword", 10);
      // Create a mock user
      const regularUser = {
        email: "user@example.com",
        password: hashedUserPassword,
        role: "user",
      };
      await usersCollection.insertOne(regularUser);
      console.log("Mock regular user created");
    }
  } catch (error) {
    console.error("Error creating mock users:", error);
  }
};

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
