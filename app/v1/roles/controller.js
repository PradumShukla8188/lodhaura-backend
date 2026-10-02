const { RoleModel } = require('../../../databaseModels/role');

const { Roles } = require('../../../constants/roles');

const getRoles = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '' } = req.query;
        const query = { isDeleted: false };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { displayValue: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        
        const [roles, total] = await Promise.all([
            RoleModel.find(query)
                .populate('department')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            RoleModel.countDocuments(query)
        ]);

        return res.status(200).json({ 
            success: true, 
            data: roles,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalRecords: total,
                totalPages: Math.ceil(total / Number(limit)),
                hasNextPage: skip + Number(limit) < total,
                hasPreviousPage: Number(page) > 1
            }
        });
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

        // Protect SuperAdmin from being edited by non-SuperAdmin
        if (role.name === Roles.SuperAdmin.name && req.user.roleId.name !== Roles.SuperAdmin.name) {
            return res.status(403).json({ success: false, message: 'Cannot modify Super Admin role' });
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

        // Prevent deletion of core roles
        const coreRoles = [Roles.SuperAdmin.name, Roles.Admin.name, Roles.User.name];
        if (coreRoles.includes(role.name)) {
            return res.status(400).json({ success: false, message: `Cannot delete the core role: ${role.displayValue}` });
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
