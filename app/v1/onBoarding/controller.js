const crypto = require('crypto');
const { UserModel } = require('../../../databaseModels/users');
const { hashPassword, comparePassword } = require('../../../helper/bcrypt');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../../../helper/jwt');
const { RoleModel } = require('../../../databaseModels/role');
const { Roles } = require('../../../constants/roles');
const { sendPasswordResetEmail } = require('../../../helper/mailer');

const issueTokens = async (user, roleName) => {
    const payload = { id: user._id, role: roleName };
    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);
    user.refreshToken = refreshToken;
    await user.save();
    return { token, refreshToken };
};

module.exports = {
    register: async (req, res) => {
        try {
            const { name, email, password, phone } = req.body;
            const lowerEmail = email.toLowerCase();
            const userExists = await UserModel.findOne({ email: lowerEmail });
            if (userExists) {
                return res.status(400).send({ message: 'User already exists with this email.' });
            }

            const role = await RoleModel.findOne({ name: Roles.User.name });
            if (!role) {
                return res.status(400).send({ message: 'User role not found.' });
            }

            const user = await UserModel.create({
                name,
                email: lowerEmail,
                phone: phone || '',
                password: await hashPassword(password),
                roleId: role._id,
            });

            const userResponse = await UserModel.findById(user._id)
                .select('-password -refreshToken -resetPasswordToken')
                .populate('roleId');

            return res.status(201).send({
                message: 'User registered successfully.',
                data: userResponse,
            });
        } catch (err) {
            console.log('register err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const lowerEmail = email.toLowerCase();
            const user = await UserModel.findOne({ email: lowerEmail })
                .populate('roleId')
                .populate('additionalRoles');
            if (!user) {
                return res.status(400).send({ message: 'User not found.' });
            }
            if (user.status === 'inactive') {
                return res.status(403).send({ message: 'Your account has been disabled. Contact admin.' });
            }
            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).send({ message: 'Invalid password.' });
            }
            const roleName = user.roleId?.name || Roles.User.name;
            const tokens = await issueTokens(user, roleName);
            const userResponse = user.toObject();
            delete userResponse.password;
            delete userResponse.refreshToken;
            delete userResponse.resetPasswordToken;
            userResponse.roleName = roleName;
            return res.status(200).send({
                message: 'User logged in successfully.',
                data: {
                    token: tokens.token,
                    refreshToken: tokens.refreshToken,
                    user: userResponse,
                },
            });
        } catch (err) {
            console.log('login err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    refreshToken: async (req, res) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).send({ message: 'Refresh token is required.' });
            }
            const decoded = verifyRefreshToken(refreshToken);
            if (!decoded) {
                return res.status(401).send({ message: 'Invalid or expired refresh token.' });
            }
            const user = await UserModel.findById(decoded.id).populate('roleId');
            if (!user || user.refreshToken !== refreshToken) {
                return res.status(401).send({ message: 'Invalid refresh token.' });
            }
            const roleName = user.roleId?.name || Roles.User.name;
            const tokens = await issueTokens(user, roleName);
            return res.status(200).send({
                message: 'Token refreshed successfully.',
                data: {
                    token: tokens.token,
                    refreshToken: tokens.refreshToken,
                },
            });
        } catch (err) {
            console.log('refreshToken err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const lowerEmail = email.toLowerCase();
            const user = await UserModel.findOne({ email: lowerEmail });
            if (!user) {
                return res.status(200).send({
                    message: 'If an account exists with this email, a reset link has been sent.',
                });
            }
            const resetToken = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = new Date(Date.now() + 3600000);
            await user.save();
            await sendPasswordResetEmail(lowerEmail, resetToken);
            return res.status(200).send({
                message: 'If an account exists with this email, a reset link has been sent.',
                data: process.env.NODE_ENV === 'development' ? { resetToken } : undefined,
            });
        } catch (err) {
            console.log('forgotPassword err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { token, password } = req.body;
            const user = await UserModel.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: new Date() },
            });
            if (!user) {
                return res.status(400).send({ message: 'Invalid or expired reset token.' });
            }
            user.password = await hashPassword(password);
            user.resetPasswordToken = '';
            user.resetPasswordExpires = undefined;
            user.refreshToken = '';
            await user.save();
            return res.status(200).send({ message: 'Password reset successfully.' });
        } catch (err) {
            console.log('resetPassword err', err?.message || err);
            return res.status(500).send({ message: err?.message || 'Internal server error.' });
        }
    },
};
