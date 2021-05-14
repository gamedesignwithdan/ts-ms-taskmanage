"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
var mongoose_1 = require("mongoose");
var decorators_1 = require("../decorators");
var IUserDocument_1 = require("../models/interfaces/IUserDocument");
var User_1 = __importDefault(require("../models/User"));
var auth_1 = require("../middleware/auth");
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.getLoggedIn = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, user, tokenForResponse, bool_1, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.query.decoded;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, User_1.default.findById(id)];
                    case 2:
                        user = _a.sent();
                        tokenForResponse = { _id: user === null || user === void 0 ? void 0 : user.id, token: typeof req.query.token === "string" ? req.query.token : "" };
                        bool_1 = false;
                        user === null || user === void 0 ? void 0 : user.tokens.forEach(function (token) {
                            if (token.token === req.query.token) {
                                bool_1 = true;
                            }
                        });
                        if (!bool_1 || !user) {
                            return [2 /*return*/, res.send({ error: "Please authenticate by signing in again." })];
                        }
                        res.status(200).send({ user: user.getPublicProfile(), token: tokenForResponse });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        res.status(404).send(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.loginUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, tokenString, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, User_1.default.findByCredentials(req.body.email, req.body.password)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, user.generateAuthToken()];
                    case 2:
                        tokenString = _a.sent();
                        user.tokens = user.tokens.concat({ _id: user.id, token: tokenString });
                        user.save();
                        res.status(201).send({ user: user.getPublicProfile(), token: tokenString });
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        res.status(401).send({ err: "Failed to authorise user - please check your password and email are correct." });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.logoutUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, requestToken_1, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, User_1.default.findById(req.query.decoded)];
                    case 1:
                        user = _a.sent();
                        requestToken_1 = req.query.token;
                        if ((user === null || user === void 0 ? void 0 : user.tokens[0]) !== undefined) {
                            user.tokens = user.tokens.filter(function (token) { return requestToken_1 !== token.token; });
                            user.save();
                        }
                        res.send();
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        res.status(400).send(err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.logoutAllJWTs = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, User_1.default.findById(req.query.decoded)];
                    case 1:
                        user = _a.sent();
                        if (user) {
                            user.tokens = [];
                            user.save();
                        }
                        res.status(200).send();
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        res.status(400).send(err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.createUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, tokenString, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = new User_1.default(req.body);
                        return [4 /*yield*/, user.generateAuthToken()];
                    case 1:
                        tokenString = _a.sent();
                        user.tokens = user.tokens.concat({ _id: user.id, token: tokenString });
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, user.save()];
                    case 3:
                        _a.sent();
                        res.status(201).send({ user: user.getPublicProfile() });
                        return [3 /*break*/, 5];
                    case 4:
                        err_5 = _a.sent();
                        res.status(400).send(err_5);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // @get('/:id')
    // async getUser(req: Request, res: Response) {
    //     try {
    //         let user;
    //         if (isValidObjectId(req.params.id)) {
    //             user = await User.findById(req.params.id);
    //         }
    //         if (!user) {
    //             return res.status(404).send({ error: 'Failed to find this user' })
    //         } 
    //         res.status(200).send({user: user.getPublicProfile()});
    //     } catch (err) {
    //         res.status(500).send(err)
    //     }
    // }
    // @get('/')
    // async allUsers(req: Request, res: Response) {
    //     try {
    //         const users = await User.find();
    //         res.send(users);
    //     } catch(err) {
    //         res.send(err)
    //     }
    // }
    UserController.prototype.updateMe = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var updates, allowedUpdates, isValidOptions, id, user_1, _a, err_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        updates = Object.keys(req.body);
                        allowedUpdates = [IUserDocument_1.UserKeys.name, IUserDocument_1.UserKeys.password, IUserDocument_1.UserKeys.email, IUserDocument_1.UserKeys.age];
                        isValidOptions = updates.every(function (update) { return allowedUpdates.includes(update); });
                        if (!isValidOptions)
                            return [2 /*return*/, res.status(400).send({ error: 'Invalid updates!' })];
                        id = req.query.decoded;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        if (!mongoose_1.isValidObjectId(req.params.id)) return [3 /*break*/, 3];
                        return [4 /*yield*/, User_1.default.findById(id)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = null;
                        _b.label = 4;
                    case 4:
                        user_1 = _a;
                        if (!user_1)
                            return [2 /*return*/, res.status(400).send()];
                        updates.forEach(function (update) { return user_1[update] = req.body[update]; });
                        user_1.save();
                        res.status(200).send({ user: user_1.getPublicProfile() });
                        return [3 /*break*/, 6];
                    case 5:
                        err_6 = _b.sent();
                        res.status(400).send(err_6);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.deleteMe = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, user, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.query.decoded;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, User_1.default.findByIdAndDelete(id)];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            res.status(404).send();
                        }
                        res.send(user);
                        return [3 /*break*/, 4];
                    case 3:
                        err_7 = _a.sent();
                        res.status(500).send(err_7);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        decorators_1.get('/me'),
        decorators_1.use(auth_1.checkForAuth)
    ], UserController.prototype, "getLoggedIn", null);
    __decorate([
        decorators_1.bodyValidator('email', 'password'),
        decorators_1.post('/login')
    ], UserController.prototype, "loginUser", null);
    __decorate([
        decorators_1.post('/logout'),
        decorators_1.use(auth_1.checkForAuth)
    ], UserController.prototype, "logoutUser", null);
    __decorate([
        decorators_1.post("/logoutAll"),
        decorators_1.use(auth_1.checkForAuth)
    ], UserController.prototype, "logoutAllJWTs", null);
    __decorate([
        decorators_1.post('/')
    ], UserController.prototype, "createUser", null);
    __decorate([
        decorators_1.patch('/me'),
        decorators_1.use(auth_1.checkForAuth)
    ], UserController.prototype, "updateMe", null);
    __decorate([
        decorators_1.del('/me'),
        decorators_1.use(auth_1.checkForAuth)
    ], UserController.prototype, "deleteMe", null);
    UserController = __decorate([
        decorators_1.controller('/users')
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
