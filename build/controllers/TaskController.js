"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.TaskController = void 0;
var decorators_1 = require("../decorators");
var Task_1 = __importDefault(require("../models/Task"));
var User_1 = __importDefault(require("../models/User"));
var auth_1 = require("../middleware/auth");
var mongodb_1 = require("mongodb");
var TaskController = /** @class */ (function () {
    function TaskController() {
    }
    //  GET /tasks?completed=false OR /tasks/?completed=true
    //  GET /tasks?limit=2&skip=1
    //  GET /tasks?sortBy=createdAt_asc or /tasks?sortBy=createdAt_desc
    TaskController.prototype.AllMyTasks = function (req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var match, sort, parts, user, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        match = {};
                        sort = {};
                        if (req.query.completed) {
                            match.completed = req.query.completed === 'true';
                        }
                        if (req.query.sortBy && typeof req.query.sortBy === "string") {
                            parts = req.query.sortBy.split('_');
                            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, User_1.default.findById(req.query.decoded)];
                    case 2:
                        user = _c.sent();
                        return [4 /*yield*/, (user === null || user === void 0 ? void 0 : user.populate({
                                path: "tasks",
                                options: {
                                    limit: parseInt((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.limit),
                                    skip: parseInt((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.skip),
                                    sort: {
                                        createdAt: -1
                                    }
                                },
                                match: match
                            }).execPopulate())];
                    case 3:
                        _c.sent();
                        res.send(user === null || user === void 0 ? void 0 : user.tasks);
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _c.sent();
                        res.status(400).send({ error: "Unauthorised!" });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TaskController.prototype.getTask = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var task, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Task_1.default.findOne({
                                _id: req.params.id,
                                owner: new mongodb_1.ObjectId(req.query.decoded)
                            })];
                    case 1:
                        task = _a.sent();
                        // await task?.populate('owner').execPopulate();
                        if (!task) {
                            return [2 /*return*/, res.status(400).send()];
                        }
                        res.send(task);
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        res.send(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TaskController.prototype.createTask = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var task, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        task = new Task_1.default(__assign(__assign({}, req.body), { owner: req.query.decoded }));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, task.save()];
                    case 2:
                        _a.sent();
                        res.status(201).send(task);
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        res.status(400).send(err_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TaskController.prototype.updateTask = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var updates, allowedOptions, isValidOptions, task_1, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updates = Object.keys(req.body);
                        allowedOptions = ["description", "completed"];
                        isValidOptions = updates.every(function (update) { return allowedOptions.includes(update); });
                        if (!isValidOptions)
                            return [2 /*return*/, res.status(400).send({ error: 'Invalid updates!' })];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Task_1.default.findOne({
                                _id: req.params.id,
                                owner: new mongodb_1.ObjectId(req.query.decoded)
                            })];
                    case 2:
                        task_1 = _a.sent();
                        if (!task_1)
                            return [2 /*return*/, res.status(400).send({ error: "Failed to find task." })];
                        updates.forEach(function (update) { return task_1[update] = req.body[update]; });
                        task_1.save();
                        res.status(200).send(task_1);
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        res.status(400).send(err_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TaskController.prototype.deleteTaskById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var task, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Task_1.default.findOneAndDelete({
                                _id: req.params.id,
                                owner: new mongodb_1.ObjectId(req.query.decoded)
                            })];
                    case 1:
                        task = _a.sent();
                        if (!task) {
                            res.status(400).send();
                        }
                        res.send({ operation: "Deleted the following task", task: task });
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        res.status(400).send(err_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        decorators_1.get('/'),
        decorators_1.use(auth_1.checkForAuth)
    ], TaskController.prototype, "AllMyTasks", null);
    __decorate([
        decorators_1.get('/:id'),
        decorators_1.use(auth_1.checkForAuth)
    ], TaskController.prototype, "getTask", null);
    __decorate([
        decorators_1.post('/'),
        decorators_1.use(auth_1.checkForAuth)
    ], TaskController.prototype, "createTask", null);
    __decorate([
        decorators_1.patch('/:id'),
        decorators_1.use(auth_1.checkForAuth)
    ], TaskController.prototype, "updateTask", null);
    __decorate([
        decorators_1.del('/:id'),
        decorators_1.use(auth_1.checkForAuth)
    ], TaskController.prototype, "deleteTaskById", null);
    TaskController = __decorate([
        decorators_1.controller('/tasks')
    ], TaskController);
    return TaskController;
}());
exports.TaskController = TaskController;
