const { RoleModel } = require('../../../databaseModels/role');

const getRoles = async (req, res) => {
    try {
        const roles = await RoleModel.find({ isDeleted: false }).populate('department').sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: roles });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const createRole = async (req, res) => {
    try {
        const { name, displayValue, code, description, department, status, permissions } = req.body;
        if (!name || !displayValue) {
            return res.status(400).json({ success: false, message: 'Name and Display Value are required' });
        }
        
        const existing = await RoleModel.findOne({ name, isDeleted: false });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Role already exists' });
        }

        const role = new RoleModel({ 
            name, displayValue, code, description, department, status, permissions 
        });
        await role.save();
        return res.status(201).json({ success: true, data: role });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, displayValue, code, description, department, status, permissions } = req.body;

        const role = await RoleModel.findById(id);
        if (!role || role.isDeleted) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        if (name) role.name = name;
        if (displayValue) role.displayValue = displayValue;
        if (code !== undefined) role.code = code;
        if (description !== undefined) role.description = description;
        if (department !== undefined) role.department = department;
        if (status) role.status = status;
        if (permissions !== undefined) role.permissions = permissions;

        await role.save();
        return res.status(200).json({ success: true, data: role });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await RoleModel.findById(id);
        if (!role || role.isDeleted) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        // Check if Admin role is being deleted
        if (role.name === 'Admin') {
            return res.status(400).json({ success: false, message: 'Cannot delete the Admin role' });
        }

        role.isDeleted = true;
        await role.save();
        return res.status(200).json({ success: true, message: 'Role deleted successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getRoles,
    createRole,
    updateRole,
    deleteRole
};
