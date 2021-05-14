"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
require('dotenv').config();
var AppRouter_1 = require("./AppRouter");
require("./db/mongoose");
require("./controllers/TaskController");
require("./controllers/UserController");
var app = express_1.default();
var port = process.env.PORT || 1010;
app.use(cors_1.default());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(AppRouter_1.AppRouter.getInstance());
app.listen(port, function () {
    console.log("Listening! See: http://localhost:" + port);
});
