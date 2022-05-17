"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    tokens: { type: Number, required: true, default: 50 },
    role: { type: String, required: true, default: 'User' },
    uid: { type: String, required: true, unique: true }
});
exports.User = (0, mongoose_1.model)('User', userSchema);
