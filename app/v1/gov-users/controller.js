const { UserModel } = require('../../../databaseModels/users');
const { hashPassword } = require('../../../helper/bcrypt');

const getGovUsers = async (req, res) => {
    try {
        const users = await UserModel.find({ isDeleted: false })
            .populate('roleId')
            .populate('additionalRoles')
            .populate('department')
            .sort({ createdAt: -1 });
        
        // Optionally filter out regular citizens if needed. For now returning all users to manage them.
        return res.status(200).json({ success: true, data: users });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const createGovUser = async (req, res) => {
    try {
        const { name, email, phone, password, roleId, additionalRoles, department, designation, employeeId, status } = req.body;
        
        if (!name || !email || !password || !roleId) {
            return res.status(400).json({ success: false, message: 'Name, email, password, and Primary Role are required' });
        }

        const existingUser = await UserModel.findOne({ email, isDeleted: false });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new UserModel({
            name,
            email,
            phone,
            password: hashedPassword,
            roleId,
            additionalRoles: additionalRoles || [],
            department,
            designation,
            employeeId,
            status: status || 'active'
        });

        await newUser.save();
        return res.status(201).json({ success: true, data: newUser, message: 'User created successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const updateGovUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, roleId, additionalRoles, department, designation, employeeId, status } = req.body;

        const user = await UserModel.findById(id);
        if (!user || user.isDeleted) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (roleId) user.roleId = roleId;
        if (additionalRoles !== undefined) user.additionalRoles = additionalRoles;
        if (department !== undefined) user.department = department;
        if (designation !== undefined) user.designation = designation;
        if (employeeId !== undefined) user.employeeId = employeeId;
        if (status) user.status = status;

        await user.save();
        return res.status(200).json({ success: true, data: user, message: 'User updated successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const deleteGovUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent deleting oneself
        if (req.user._id.toString() === id) {
            return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
        }

        const user = await UserModel.findById(id).populate('roleId');
        if (!user || user.isDeleted) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.roleId && user.roleId.name === 'Admin') {
            return res.status(400).json({ success: false, message: 'Cannot delete an Admin account' });
        }

        user.isDeleted = true;
        await user.save();
        return res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getGovUsers,
    createGovUser,
    updateGovUser,
    deleteGovUser
};
