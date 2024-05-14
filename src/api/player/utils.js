import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "No token provided!" }); // If there is no token, return 401
  }

  if (token !== process.env.SECRET_KEY) {
    return res.status(403).json({ message: "Invalid token!" }); // If the token is invalid, return 403
  }

  next(); // If the token is valid, proceed to the next middleware/route handler
};

export default authenticateToken;

/*
import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401).json({message: "No token provided!"});

  if (token !== process.env.SECRET_KEY) {
    return res.sendStatus(403).json({message: "Invalid token!"}); 
  }
    next(); 
  });
};

export default authenticateToken;
*/
