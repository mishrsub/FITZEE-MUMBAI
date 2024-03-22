import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from 'uuid'

// Set up storage for Multer with UUID filenames
const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,"./uploads");
    },
    filename: function(req,file,cb) {
        const ext = path.extname(file.originalname);
        const uniqueFileName = uuidv4() + ext;
        cb(null,uniqueFileName);
    }
});

export const upload = multer({ storage });
