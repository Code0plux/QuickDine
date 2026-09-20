import db from "../config/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ALLOWED_ROLES = ['customer', 'owner'];

const signToken = (id, role) =>
    jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN });

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await db.query(`SELECT * FROM user WHERE email = ?`, [email]);
        if (rows.length === 0)
            return res.status(400).json({ message: "Email does not exist" });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch)
            return res.status(400).json({ message: "Password does not match" });

        res.status(200).json({ message: "Login success", token: signToken(user.id, user.role) });
    } catch {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const role = req.body.role && ALLOWED_ROLES.includes(req.body.role) ? req.body.role : 'customer';

        const [existing] = await db.query(`SELECT id FROM user WHERE email = ?`, [email]);
        if (existing.length > 0)
            return res.status(400).json({ message: "Email already exists" });

        const password_hash = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            `INSERT INTO user (name, email, phone, role, password_hash) VALUES (?, ?, ?, ?, ?)`,
            [name, email, phone, role, password_hash]
        );

        res.status(201).json({
            message: "User created",
            userId: result.insertId,
            token: signToken(result.insertId, role)
        });
    } catch {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const [users] = await db.query(`SELECT id FROM user WHERE email = ?`, [email]);
        if (users.length === 0)
            return res.status(400).json({ message: "Email does not exist" });

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = Date.now() + 15 * 60 * 1000;

        await db.query(
            `UPDATE user SET reset_token = ?, reset_token_expiry = ? WHERE email = ?`,
            [token, expiry, email]
        );

        // TODO: send token via email (e.g. nodemailer / SES)
        // For development only — remove before production:
        res.status(200).json({ message: "Reset token generated", reset_token: token });
    } catch {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const [users] = await db.query(`SELECT * FROM user WHERE reset_token = ?`, [token]);
        if (users.length === 0)
            return res.status(400).json({ message: "Invalid token" });
        if (users[0].reset_token_expiry < Date.now())
            return res.status(400).json({ message: "Token expired" });

        const hash = await bcrypt.hash(password, 10);
        await db.query(
            `UPDATE user SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?`,
            [hash, users[0].id]
        );

        res.status(200).json({ message: "Password reset successful" });
    } catch {
        res.status(500).json({ message: "Internal server error" });
    }
};

export default { login, register, forgotPassword, resetPassword };
