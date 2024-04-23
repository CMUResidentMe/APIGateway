import dotenv from "dotenv";
dotenv.config();

import multer from "multer";
import jwt from "jsonwebtoken";
import fs from "fs";

const getMulter = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const decoded = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );
      let pp = `uploads/${decoded.id}`;
      if (!fs.existsSync(pp)) {
        fs.mkdirSync(pp, 0o777);
      }
      cb(null, pp);
    },
    filename: (req, file, cb) => {
      let ext = file.originalname.split(".").pop();
      let name = Date.now();
      cb(null, `${name}.${ext}`);
    },
  });
  return multer({ storage: storage });
};

export { getMulter };
