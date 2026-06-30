const express = require("express");
const router = express.Router();
const multer = require("multer");

const { handlePdf, handleConvertPdf } = require("../controllers/pdfController");

// Lưu file vào RAM thay vì ổ đĩa
const upload = multer({
    storage: multer.memoryStorage(),
});

// const storage = multer.diskStorage({
//     destination: "uploads/",
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "-" + file.originalname);
//     },
// });

// const upload = multer({ storage: storage });

router.post("/", upload.single("ANH_THE"), handlePdf);
router.post("/convert", handleConvertPdf);

module.exports = router;