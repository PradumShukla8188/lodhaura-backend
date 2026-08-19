const { VillageInfoModel } = require('../databaseModels/villageInfo');
const { CategoryModel } = require('../databaseModels/category');
const { TempleModel } = require('../databaseModels/temple');
const { SchoolModel } = require('../databaseModels/school');
const { ServiceModel } = require('../databaseModels/service');
const { EventModel } = require('../databaseModels/event');
const { NewsModel } = require('../databaseModels/news');
const { SchemeModel } = require('../databaseModels/scheme');
const { UserModel } = require('../databaseModels/users');
const { slugify } = require('../helper/slug');

async function seedVillageInfo() {
    try {
        const existing = await VillageInfoModel.findOne({ isActive: true });
        if (existing) {
            console.log('Village info already exists.');
            return;
        }
        await VillageInfoModel.create({
            name: 'Lodhaura',
            tagline: 'Welcome to Lodhaura Village Portal',
            description: 'Lodhaura is a vibrant village community dedicated to preserving culture, supporting development, and connecting residents.',
            history: 'Lodhaura has a rich heritage spanning generations, known for its temples, schools, and community spirit.',
            location: {
                district: 'Ballia',
                state: 'Uttar Pradesh',
                country: 'India',
                pincode: '277001',
            },
            population: 5200,
            establishedYear: '1850',
            contactEmail: 'info@lodhaura.org',
            contactPhone: '+91-9876543210',
        });
        console.log('Village info seeded successfully.');
    } catch (err) {
        console.error('Error seeding village info:', err);
        return Promise.reject(err);
    }
}

async function seedCategories() {
    try {
        const categories = [
            { name: 'Culture', type: 'general', slug: 'culture' },
            { name: 'Education', type: 'general', slug: 'education' },
            { name: 'Festival', type: 'event', slug: 'festival' },
            { name: 'Government Scheme', type: 'scheme', slug: 'government-scheme' },
            { name: 'Village News', type: 'news', slug: 'village-news' },
            { name: 'Community Blog', type: 'blog', slug: 'community-blog' },
        ];
        for (const cat of categories) {
            const exists = await CategoryModel.findOne({ slug: cat.slug });
            if (!exists) await CategoryModel.create(cat);
        }
        console.log('Categories seeded successfully.');
    } catch (err) {
        console.error('Error seeding categories:', err);
        return Promise.reject(err);
    }
}

async function seedSampleData() {
    try {
        const admin = await UserModel.findOne().populate('roleId');
        if (!admin) {
            console.log('No users found, skipping sample data.');
            return;
        }
        const cultureCat = await CategoryModel.findOne({ slug: 'culture' });
        const festivalCat = await CategoryModel.findOne({ slug: 'festival' });
        const newsCat = await CategoryModel.findOne({ slug: 'village-news' });
        const schemeCat = await CategoryModel.findOne({ slug: 'government-scheme' });

        if (!(await TempleModel.findOne())) {
            await TempleModel.create({
                name: 'Lodhaura Devi Temple',
                description: 'Ancient temple dedicated to the village deity.',
                deity: 'Devi',
                location: 'Main Chowk, Lodhaura',
                timings: '5:00 AM - 9:00 PM',
                festivals: ['Navratri', 'Diwali'],
            });
        }

        if (!(await SchoolModel.findOne())) {
            await SchoolModel.create({
                name: 'Lodhaura Primary School',
                description: 'Government primary school serving the village.',
                type: 'primary',
                location: 'Lodhaura',
                principal: 'Shri Ram Prasad',
                establishedYear: '1965',
            });
        }

        if (!(await ServiceModel.findOne())) {
            await ServiceModel.create({
                name: 'Village Health Center',
                description: 'Primary healthcare services for residents.',
                provider: 'Government of UP',
                location: 'Lodhaura',
                availability: 'Mon-Sat 9AM-5PM',
            });
        }

        if (!(await EventModel.findOne())) {
            await EventModel.create({
                title: 'Lodhaura Annual Fair',
                slug: slugify('Lodhaura Annual Fair') + '-sample',
                description: 'Annual village fair celebrating local culture and traditions.',
                startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                location: 'Village Ground, Lodhaura',
                organizer: 'Village Committee',
                userId: admin._id,
                category: festivalCat?._id,
                status: 'approved',
            });
        }

        if (!(await NewsModel.findOne())) {
            await NewsModel.create({
                title: 'New Road Development Project Approved',
                slug: slugify('New Road Development') + '-sample',
                content: 'The village panchayat has approved a new road development project connecting Lodhaura to the main highway.',
                summary: 'Road development project approved for Lodhaura.',
                userId: admin._id,
                category: newsCat?._id,
                status: 'approved',
            });
        }

        if (!(await SchemeModel.findOne())) {
            await SchemeModel.create({
                title: 'PM Kisan Samman Nidhi',
                slug: slugify('PM Kisan Samman Nidhi') + '-sample',
                description: 'Financial support scheme for farmer families.',
                eligibility: 'All landholding farmer families',
                benefits: 'Rs. 6000 per year in three installments',
                category: schemeCat?._id,
                status: 'active',
            });
        }

        console.log('Sample data seeded successfully.');
    } catch (err) {
        console.error('Error seeding sample data:', err);
        return Promise.reject(err);
    }
}

module.exports = { seedVillageInfo, seedCategories, seedSampleData };
