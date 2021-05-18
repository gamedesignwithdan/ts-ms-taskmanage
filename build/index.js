"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var multer_1 = __importDefault(require("multer"));
require('dotenv').config();
var AppRouter_1 = require("./AppRouter");
require("./db/mongoose");
require("./controllers/TaskController");
require("./controllers/UserController");
var app = express_1.default();
var upload = multer_1.default({
    dest: "avatars/",
    limits: {
        fileSize: 1000000
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload a pdf file"));
        }
        cb(null, true);
    }
});
app.post("/upload", upload.single('avatar'), function (req, res) {
    console.log(req.file);
    // res.send(req.file)
});
var port = process.env.PORT || 1010;
// app.use(upload.single("avatar"))
app.use(cors_1.default());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(AppRouter_1.AppRouter.getInstance());
app.listen(port, function () {
    console.log("Listening! See: http://localhost:" + port);
});
