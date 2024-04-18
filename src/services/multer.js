import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Set up storage for Multer with UUID filenames
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueFileName = uuidv4() + ext;
        cb(null, uniqueFileName);
    },
});

export const upload = multer({ storage });

/////////////////////////////////////////////////////////////////////////
const storageData = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set upload directory
        cb(null, "./downloads");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filenameWithoutExt = path.basename(file.originalname, ext);
        const originalFilename = filenameWithoutExt + ext;
        const finalFilename = originalFilename;
        cb(null, finalFilename);
    },
});

// Define file filter for multer
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith("image/") ||
        file.mimetype === "application/pdf"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF and image files are allowed!"), false);
    }
};

// Initialize multer with options
export const uploadFile = multer({
    storage: storageData,
    fileFilter: fileFilter,
});
