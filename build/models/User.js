"use strict";
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
exports.User = void 0;
var mongoose_1 = require("mongoose");
var validator = require('validator');
var bcrypt = require('bcryptjs');
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var Task_1 = __importDefault(require("./Task"));
var UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate: function (value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }
    },
    email: {
        type: String,
        required: true,
        validate: function (value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate: function (value) {
            if (value < 0) {
                throw new Error("Age must be a positive number");
            }
        }
    },
    tokens: [{
            token: {
                type: String,
                required: true
            }
        }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var token = jsonwebtoken_1.default.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "7 days" });
    return token;
};
UserSchema.virtual('tasks', {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
});
UserSchema.methods.getPublicProfile = function () {
    var user = this;
    var name = user.name, email = user.email, age = user.age;
    var userObject = { name: name, email: email, age: age };
    return userObject;
};
UserSchema.statics.findByCredentials = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var user, access;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.User.findOne({ email: email })];
            case 1:
                user = _a.sent();
                if (!user)
                    throw new Error("Unable to login");
                return [4 /*yield*/, bcrypt.compare(password, user.password)];
            case 2:
                access = _a.sent();
                if (!access)
                    throw new Error("Unable to login - password incorrect");
                return [2 /*return*/, user];
        }
    });
}); };
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!this.isModified('password')) return [3 /*break*/, 2];
                    _a = this;
                    return [4 /*yield*/, bcrypt.hash(this.password, 8)];
                case 1:
                    _a.password = _b.sent();
                    _b.label = 2;
                case 2:
                    this.updatedAt = new Date().toString();
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
UserSchema.pre("remove", function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = this;
                    return [4 /*yield*/, Task_1.default.deleteMany({ owner: user._id })];
                case 1:
                    _a.sent();
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
exports.User = mongoose_1.model('User', UserSchema);
exports.default = exports.User;
