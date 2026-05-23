const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        if( error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
}

//----------------WAS DONE FOR DEBUGGINGGG---------------------------------------------

/*function authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      console.log("Auth header:", authHeader);
  
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }
  
      const token = authHeader.split(" ")[1];
      console.log("Extracted token:", token.substring(0, 20) + "...");
      console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded payload:", decoded);
  
      req.user = decoded;
      next();
    } catch (error) {
      console.log("JWT Error:", error.message);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
}*/
//---------------------------------------------------------------------------------------------------
module.exports = { authenticate };