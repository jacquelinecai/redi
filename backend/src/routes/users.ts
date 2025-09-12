import express from "express";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../firebaseAdmin";
import {
    CreateUserInput,
    FirestoreDoc,
    UserDoc,
    UserDocWrite,
    UserResponse
} from "../../types"; // Adjust path as needed
// If "../types" does not exist, create it or update the path below:

const router = express.Router();

// Convert Firestore user doc to API response
const userDocToResponse = (doc: FirestoreDoc<UserDoc>): UserResponse => ({
  netid: doc.netid,
  createdAt: doc.createdAt instanceof Date 
    ? doc.createdAt.toISOString() 
    : doc.createdAt.toDate().toISOString()
});

// GET all users (admin endpoint - consider authentication)
router.get("/api/users", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users: UserResponse[] = snapshot.docs.map((doc) => 
      userDocToResponse({ id: doc.id, ...doc.data() as UserDoc })
    );
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: errorMessage });
  }
});

// GET user by netid
router.get("/api/users/:netid", async (req, res) => {
  try {
    const { netid } = req.params;
    const snapshot = await db.collection("users").where("netid", "==", netid).get();
    
    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const doc = snapshot.docs[0];
    const user = userDocToResponse({ id: doc.id, ...doc.data() as UserDoc });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: errorMessage });
  }
});

// POST create new user
router.post("/api/users", async (req, res) => {
  try {
    console.log("Creating user:", req.body);
    const userData: CreateUserInput = req.body;
    
    // Validate required fields
    if (!userData.netid || !userData.password) {
      return res.status(400).json({ error: "netid and password are required" });
    }

    // Check if user already exists
    const existingUser = await db.collection("users").where("netid", "==", userData.netid).get();
    if (!existingUser.empty) {
      return res.status(409).json({ error: "User with this netid already exists" });
    }

    // Create user document
    const userDoc: UserDocWrite = {
      ...userData,
      createdAt: FieldValue.serverTimestamp()
    };

    const docRef = await db.collection("users").add(userDoc);
    res.status(201).json({ 
      id: docRef.id, 
      netid: userData.netid,
      message: "User created successfully" 
    });
  } catch (error) {
    console.error("Error creating user:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: errorMessage });
  }
});

// POST login endpoint
router.post("/api/users/login", async (req, res) => {
  try {
    const { netid, password } = req.body;
    
    if (!netid || !password) {
      return res.status(400).json({ error: "netid and password are required" });
    }

    const snapshot = await db.collection("users")
      .where("netid", "==", netid)
      .where("password", "==", password) // Note: Use proper password hashing in production!
      .get();
    
    if (snapshot.empty) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const doc = snapshot.docs[0];
    const user = userDocToResponse({ id: doc.id, ...doc.data() as UserDoc });
    
    // In a real app, you'd generate a JWT token here
    res.status(200).json({ 
      message: "Login successful", 
      user,
      // token: generateJWT(user.netid) // Add JWT generation
    });
  } catch (error) {
    console.error("Error during login:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: errorMessage });
  }
});

// DELETE user by netid
router.delete("/api/users/:netid", async (req, res) => {
  try {
    const { netid } = req.params;
    const snapshot = await db.collection("users").where("netid", "==", netid).get();
    
    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user document
    const doc = snapshot.docs[0];
    await doc.ref.delete();
    
    // Also delete associated profile if it exists
    const profileSnapshot = await db.collection("profiles").where("netid", "==", netid).get();
    if (!profileSnapshot.empty) {
      const profileDoc = profileSnapshot.docs[0];
      await profileDoc.ref.delete();
    }

    res.status(200).json({ message: "User and associated profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: errorMessage });
  }
});

export default router;