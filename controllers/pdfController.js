const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const ImageModule = require("docxtemplater-image-module-free");
const path = require("path");
const docxConverter = require("docx-pdf");

const JSZip = require("jszip");
const { XMLParser, XMLBuilder } = require("fast-xml-parser");
const handlePdf = async (req, res) => {
    const data = fs.readFileSync("./templates/don-hoc-lai.docx");
    const zip = await JSZip.loadAsync(data);

    let documentXml = await zip.file("word/document.xml").async("string");

    documentXml = documentXml
        .replace(/\{MSSV\}/g, "123456")
        .replace(/\{HO_TEN\}/g, "Nguyễn Minh Hiếu");

    zip.file("word/document.xml", documentXml);

    const buffer = await zip.generateAsync({
        type: "nodebuffer"
    });

    res.send(documentXml);

    //fs.writeFileSync("output.docx", buffer);


};

// const handlePdf = async (req, res) => {
//     try {
//         const content = fs.readFileSync("./templates/don-hoc-lai.docx");

//         const zip = new PizZip(content);

//         const imageModule = new ImageModule({
//             getImage(tagValue) {
//                 return fs.readFileSync(tagValue);
//             },

//             getSize() {
//                 return [120, 90];
//             },
//         });

//         const doc = new Docxtemplater(zip, {
//             modules: [imageModule],
//         });

//         await doc.renderAsync({
//             MSSV: req.body.MSSV,
//             HO_TEN: req.body.HO_TEN,
//             ANH_THE: req.file.path, // Đường dẫn ảnh Multer lưu
//         });

//         const buffer = doc.getZip().generate({
//             type: "nodebuffer",
//         });

//         //fs.writeFileSync("output.docx", buffer);

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

//const converter = require("docx2pdf-converter");

const handleConvertPdf = async (req, res) => {

    // const inputPath = path.join(__dirname, "../templates/file.docx");
    // console.log(inputPath)
    // const outputPath = path.join(__dirname, "../temp/output.pdf");

    // await converter.convert(inputPath, outputPath)
    
    res.send("success")
};

module.exports = { handlePdf, handleConvertPdf };