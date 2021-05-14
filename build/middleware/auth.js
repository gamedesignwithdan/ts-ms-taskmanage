"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForAuth = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var User_1 = __importDefault(require("../models/User"));
function checkForAuth(req, res, next) {
    var _a;
    try {
        var token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', "");
        if (token) {
            var decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            var user = User_1.default.findById(decoded._id);
            if (user) {
                req.query['decoded'] = decoded._id;
                req.query['token'] = token;
            }
            else {
                throw new Error();
            }
        }
        else {
            throw new Error();
        }
        next();
    }
    catch (err) {
        res.status(401).send({ error: "Unauthorised" });
    }
}
exports.checkForAuth = checkForAuth;
