export default function errorHandler(err: any, res: any) {
    if (err.name === "Error") {
      // custom application error
      return res.status(400).json({ message: err.message });
    }
  
    if (err.name === "TokenExpiredError") {
      // jwt authentication error
      return returnUnauthorizedError(res);
    }
  
    if (err.name === "UnauthorizedError") {
      // jwt authentication error
      return returnUnauthorizedError(res);
    }
  
    // default to 500 server error
    return res.status(500).json({ message: err.message });
  }
  
  function returnUnauthorizedError(res:any) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
  