import jwt from "jsonwebtoken";

const getAudience = () => {
  if(process.env.AUDIENCE === undefined || process.env.AUDIENCE === null){
    let error = new Error()
    error.name = "UndefinedConfiguration"
    error.message = "Missing Configuration"
    throw error
  }
  return process.env.AUDIENCE?.split(";");
};

const decodeToken = async (req: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    if (token === undefined) {
      const error = new Error();
      error.name = "UnauthorizedError";
      throw error;
    }

    let decoded = jwt.decode(token);
    return decoded;
  }
};

export default { getAudience, decodeToken };
