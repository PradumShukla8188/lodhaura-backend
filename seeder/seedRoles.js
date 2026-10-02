const mongoose = require('mongoose');
const DB = require('../connection');
const { RoleModel } = require('../databaseModels/role');
const { Roles } = require('../constants/roles');

const MODULES = [
    "Village Projects",
    "Government Schemes",
    "Funds",
    "Complaints & Issues",
    "Users",
    "Roles",
    "Departments",
    "Documents",
    "Audit Logs",
    "Tasks",
    "Panchayat Meetings",
    "Events",
    "Village Information",
    "Local Services",
    "Agriculture Services",
    "Jobs",
    "Marketplace",
    "Emergency Contacts",
    "Residents",
    "Website Settings",
    "Workers"
];

const ACTIONS = ["View", "Create", "Edit", "Delete", "Approve", "Export"];

async function seedRoles() {
    try {
        await DB.connect();

        console.log('Generating all permissions...');
        const allPermissions = [];
        for (const module of MODULES) {
            for (const action of ACTIONS) {
                allPermissions.push({ module, action });
            }
        }

        console.log('Seeding roles...');

        // 1. Super Admin (All Permissions)
        await RoleModel.findOneAndUpdate(
            { name: Roles.SuperAdmin.name },
            {
                name: Roles.SuperAdmin.name,
                displayValue: Roles.SuperAdmin.displayValue,
                description: 'Full system access',
                permissions: allPermissions,
                status: 'active'
            },
            { upsert: true, new: true }
        );
        console.log('Super Admin role seeded.');

        // 2. Admin (All Permissions)
        await RoleModel.findOneAndUpdate(
            { name: Roles.Admin.name },
            {
                name: Roles.Admin.name,
                displayValue: Roles.Admin.displayValue,
                description: 'Administrator access',
                permissions: allPermissions,
                status: 'active'
            },
            { upsert: true, new: true }
        );
        console.log('Admin role seeded.');

        // 3. User (No Special Permissions, just the base role)
        await RoleModel.findOneAndUpdate(
            { name: Roles.User.name },
            {
                name: Roles.User.name,
                displayValue: Roles.User.displayValue,
                description: 'Standard user access',
                permissions: [],
                status: 'active'
            },
            { upsert: true, new: true }
        );
        console.log('User role seeded.');

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding roles:', error);
        process.exit(1);
    }
}

module.exports = { seedRoles };

