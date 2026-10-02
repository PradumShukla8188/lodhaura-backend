const { Roles } = require('../constants/roles');

const checkPermission = (moduleName, actionName) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user || !user.roleId) {
                return res.status(401).json({ message: 'Unauthorized access.' });
            }

            // Super admin bypasses all checks
            if (user.roleId.name === Roles.SuperAdmin.name) {
                return next();
            }

            // Combine permissions from primary role and additional roles
            const allRoles = [user.roleId];
            if (user.additionalRoles && Array.isArray(user.additionalRoles)) {
                allRoles.push(...user.additionalRoles);
            }

            let hasPermission = false;
            const targetModule = moduleName.toLowerCase();
            const targetAction = actionName.toLowerCase();

            for (const role of allRoles) {
                if (role && role.permissions && Array.isArray(role.permissions)) {
                    // Check if role has 'ALL'/'ALL' or the specific module/action
                    const hasModuleAction = role.permissions.some(
                        p => (p.module === 'ALL' || p.module?.toLowerCase() === targetModule) && 
                             (p.action === 'ALL' || p.action?.toLowerCase() === targetAction)
                    );
                    if (hasModuleAction) {
                        hasPermission = true;
                        break;
                    }
                }
            }

            if (hasPermission) {
                return next();
            }

            return res.status(403).json({ message: 'Forbidden. You do not have permission for this action.' });
        } catch (err) {
            next(err);
        }
    };
};

module.exports = { checkPermission };
