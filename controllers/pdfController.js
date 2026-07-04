const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const ImageModule = require("docxtemplater-image-module-free");
const path = require("path");
const axios = require("axios");

const JSZip = require("jszip");
const { XMLParser, XMLBuilder } = require("fast-xml-parser");
// const handlePdf = async (req, res) => {
//     const docxPath = path.join(
//         process.cwd(),
//         "templates",
//         "don-hoc-lai.docx"
//     );

//     const data = fs.readFileSync(docxPath);
//     const zip = await JSZip.loadAsync(data);

//     let documentXml = await zip.file("word/document.xml").async("string");

//     documentXml = documentXml
//         .replace(/\{MSSV\}/g, "123456")
//         .replace(/\{HO_TEN\}/g, "Nguyễn Minh Hiếu");

//     zip.file("word/document.xml", documentXml);

//     const buffer = await zip.generateAsync({
//         type: "nodebuffer"
//     });

//     res.send(documentXml);

//     fs.writeFileSync("output.docx", buffer);
// };

// const handlePdf = (req, res) => {
//     try {
//         console.log("file:", req.file.buffer.toString("base64"));
//         const content = fs.readFileSync("./templates/don-hoc-lai.docx");

//         const zip = new PizZip(content);

//         const imageModule = new ImageModule({
//             getImage(tagValue) {
//                 return tagValue;
//             },

//             getSize() {
//                 return [120, 90];
//             },
//         });

//         const doc = new Docxtemplater(zip, {
//             modules: [imageModule],
//         });

//         doc.render({
//             MSSV: req.body.MSSV,
//             HO_TEN: req.body.HO_TEN,
//             ANH_THE: req.file.buffer,
//         });

//         const buffer = doc.getZip().generate({
//             type: "nodebuffer",
//         });

//         fs.writeFileSync("output.docx", buffer);

//         res.setHeader(
//             "Content-Type",
//             "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//         );

//         res.setHeader(
//             "Content-Disposition",
//             'inline; filename="output.docx"'
//         );

//         res.send(buffer);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             message: err.message,
//         });
//     }
// };

const handlePdf = async (req, res) => {
    try {
        const { url, ...fields } = req.body;

        if (!url) {
            return res.status(400).json({ message: "Missing template URL" });
        }

        // 1. download docx từ URL
        const response = await axios.get(url, {
            responseType: "arraybuffer",
        });

        const content = Buffer.from(response.data);

        const zip = new PizZip(content);

        // 2. image module (giữ nguyên nếu bạn có ảnh)
        const imageModule = new ImageModule({
            getImage(tagValue) {
                return tagValue;
            },

            getSize() {
                return [120, 90];
            },
        });

        const doc = new Docxtemplater(zip, {
            modules: [imageModule],
        });

        // 3. render dynamic toàn bộ body
        doc.render({
            ...fields,
        });

        // 4. generate file
        const buffer = doc.getZip().generate({
            type: "nodebuffer",
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );

        res.setHeader(
            "Content-Disposition",
            'inline; filename="output.docx"'
        );

        //fs.writeFileSync("output.docx", buffer);    

        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message,
        });
    }
};


// const cloudconvert = require("cloudconvert");
// const client = new cloudconvert(process.env.CLOUDCONVERT_API_KEY);
// const handleConvertPdf = async (req, res) => {
//     try {
//         const { url } = req.body;

//         if (!url) {
//             return res.status(400).json({ message: "Missing Cloudinary URL" });
//         }

//         // 1. download DOCX từ Cloudinary
//         const response = await axios.get(url, {
//             responseType: "arraybuffer"
//         });

//         const fileBuffer = Buffer.from(response.data);

//         // 2. create job
//         const job = await client.jobs.create({
//             tasks: {
//                 import_file: {
//                     operation: "import/upload"
//                 },
//                 convert_file: {
//                     operation: "convert",
//                     input: "import_file",
//                     output_format: "pdf"
//                 },
//                 export_file: {
//                     operation: "export/url",
//                     input: "convert_file"
//                 }
//             }
//         });

//         // 3. upload buffer vào CloudConvert
//         const importTask = job.tasks.find(t => t.name === "import_file");

//         await client.tasks.upload(importTask, fileBuffer, "file.docx");

//         // 4. wait convert
//         const result = await client.jobs.wait(job.id);

//         // 5. get PDF URL
//         const exportTask = result.tasks.find(t => t.name === "export_file");

//         return res.json({
//             success: true,
//             pdfUrl: exportTask.result.files[0].url
//         });

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// };


const { exec } = require("child_process");
const os = require("os");
const crypto = require("crypto");

const handleConvertPdfLibreOffice = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                message: "Missing DOCX URL"
            });
        }

        // tạo thư mục tạm
        const tempDir = path.join(os.tmpdir(), "libreoffice");
        fs.mkdirSync(tempDir, { recursive: true });

        const fileId = crypto.randomUUID();

        const docxPath = path.join(tempDir, `${fileId}.docx`);
        const pdfPath = path.join(tempDir, `${fileId}.pdf`);

        // download docx
        const response = await axios.get(url, {
            responseType: "arraybuffer"
        });

        fs.writeFileSync(docxPath, response.data);

        const libreOfficePath = '"C:\\Program Files\\LibreOffice\\program\\soffice.exe"';
        // convert
        await new Promise((resolve, reject) => {
            exec(
                `${libreOfficePath} --headless --convert-to pdf "${docxPath}" --outdir "${tempDir}"`,
                (error, stdout, stderr) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve();
                }
            );
        });

        if (!fs.existsSync(pdfPath)) {
            throw new Error("Convert failed");
        }

        const pdfBuffer = fs.readFileSync(pdfPath);

        // xóa file tạm
        fs.unlinkSync(docxPath);
        fs.unlinkSync(pdfPath);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            'inline; filename="output.pdf"'
        );

        res.send(pdfBuffer);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { handlePdf,/*handleConvertPdf,*/ handleConvertPdfLibreOffice };