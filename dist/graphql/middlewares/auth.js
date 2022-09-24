"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const isAuth = ({ context }, next) => {
    const authorization = context.req.headers['authorization'];
    if (!authorization) {
        throw new Error('Not authenticated');
    }
    try {
        const token = authorization.split(' ')[1];
        const payload = (0, jsonwebtoken_1.verify)(token, 'MySecretKey');
        console.log(payload);
        context.payload = payload;
    }
    catch (err) {
        console.log(err);
        throw new Error('Not authenticated');
    }
    return next();
};
exports.isAuth = isAuth;
//# sourceMappingURL=auth.js.map