import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const suffix = file.mimetype.split("/");
    cb(null, `${file.fieldname}-${Date.now()}.${suffix[1]}`);
  },
});

export const upload = multer({ storage });
