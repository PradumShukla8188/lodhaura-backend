const { DepartmentModel } = require('../../../databaseModels/department');

const getDepartments = async (req, res) => {
    try {
        const departments = await DepartmentModel.find({ isDeleted: false }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: departments });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const createDepartment = async (req, res) => {
    try {
        const { name, code, description, status } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }
        
        const existing = await DepartmentModel.findOne({ name, isDeleted: false });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Department already exists' });
        }

        const department = new DepartmentModel({ name, code, description, status });
        await department.save();
        return res.status(201).json({ success: true, data: department });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, description, status } = req.body;

        const department = await DepartmentModel.findById(id);
        if (!department || department.isDeleted) {
            return res.status(404).json({ success: false, message: 'Department not found' });
        }

        if (name) department.name = name;
        if (code !== undefined) department.code = code;
        if (description !== undefined) department.description = description;
        if (status) department.status = status;

        await department.save();
        return res.status(200).json({ success: true, data: department });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await DepartmentModel.findById(id);
        if (!department || department.isDeleted) {
            return res.status(404).json({ success: false, message: 'Department not found' });
        }

        department.isDeleted = true;
        await department.save();
        return res.status(200).json({ success: true, message: 'Department deleted successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
};
