const db = require('../config/db');

const vendorController = {
    createVendor: async (req, res) => {
        try {
            const { name, email, phone, address } = req.body;

            const query = 'INSERT INTO vendors (name, email, phone, address) VALUES (?, ?, ?, ?)';
            const [result] = await db.execute(query, [name, email, phone, address]);
            const vendorId = result.insertId;

            res.status(201).json({ id: vendorId, name, email, phone, address });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateVendor: async (req, res) => {
        try {
            const vendorId = req.params.id;
            const { name, email, phone, address } = req.body;
            const query = 'UPDATE vendors SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?';
            await db.execute(query, [name, email, phone, address, vendorId]);
            res.status(200).json({ message: 'Vendor updated successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deleteVendor: async (req, res) => {
        try {
            const vendorId = req.params.id;
            const query = 'DELETE FROM vendors WHERE id = ?';
            await db.execute(query, [vendorId]);
            res.status(200).json({ message: 'Vendor deleted successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAllVendors: async (req, res) => {
        try {
            const query = 'SELECT * FROM vendors';
            const [vendors] = await db.execute(query);
            res.status(200).json({ data: vendors });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getVendorById: async (req, res) => {
        try {
            const vendorId = req.params.id;
            const query = 'SELECT * FROM vendors WHERE id = ?';
            const [vendor] = await db.execute(query, [vendorId]);

            if (vendor.length === 0) {
                return res.status(404).json({ message: 'Vendor not found' });
            }

            res.status(200).json({ data: vendor[0] });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    searchVendors: async (req, res) => {
        try {
            const { searchTerm } = req.query;

            // You can customize the query based on your search requirements
            const query = `
                SELECT * FROM vendors 
                WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR address LIKE ?
            `;
            const [vendors] = await db.execute(query, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]);

            res.status(200).json({ data: vendors });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = vendorController;
