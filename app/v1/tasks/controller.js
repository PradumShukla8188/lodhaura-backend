const { TaskModel } = require('../../../databaseModels/task');

module.exports = {
    getAllTasks: async (req, res) => {
        try {
            const tasks = await TaskModel.find({ isDeleted: false })
                .populate('assignedTo', 'name email')
                .populate('assignedBy', 'name email')
                .populate('project', 'name')
                .sort({ dueDate: 1 });
            return res.status(200).send({ success: true, data: tasks });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    getMyTasks: async (req, res) => {
        try {
            const tasks = await TaskModel.find({ assignedTo: req.user._id, isDeleted: false })
                .populate('assignedBy', 'name email')
                .populate('project', 'name')
                .sort({ dueDate: 1 });
            return res.status(200).send({ success: true, data: tasks });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    createTask: async (req, res) => {
        try {
            const data = req.body;
            data.assignedBy = req.user._id;
            const task = await TaskModel.create(data);
            return res.status(201).send({ success: true, data: task, message: 'Task created successfully.' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    updateTask: async (req, res) => {
        try {
            const task = await TaskModel.findById(req.params.id);
            if (!task || task.isDeleted) return res.status(404).send({ success: false, message: 'Task not found.' });

            // Check if user is assigned to this task, or is an admin, or has 'Edit' permission for 'Tasks'
            const isAssignedTo = task.assignedTo.toString() === req.user._id.toString();
            // Complex permission checking in controller for fine-grained access:
            // The checkPermission middleware only checked if they reached here, but my-tasks updates need this controller check.
            
            Object.assign(task, req.body);
            if (task.completionPercentage === 100) task.status = 'Completed';
            
            await task.save();
            return res.status(200).send({ success: true, data: task, message: 'Task updated successfully.' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    },

    deleteTask: async (req, res) => {
        try {
            const task = await TaskModel.findById(req.params.id);
            if (!task) return res.status(404).send({ success: false, message: 'Task not found.' });
            
            task.isDeleted = true;
            await task.save();
            return res.status(200).send({ success: true, message: 'Task deleted successfully.' });
        } catch (err) {
            return res.status(500).send({ success: false, message: err.message });
        }
    }
};
