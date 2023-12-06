// customerEnrollmentController.js

const db = require('../config/db');

const customerEnrollmentController = {
    getAllCustomers: async (req, res) => {
        try {
            const query = 'SELECT * FROM customers';
            const [customers] = await db.execute(query);
            res.status(200).json({ data: customers });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getCustomerById: async (req, res) => {
        try {
            const customerId = req.params.id;
            const query = 'SELECT * FROM customers WHERE id = ?';
            const [customer] = await db.execute(query, [customerId]);

            if (customer.length === 0) {
                return res.status(404).json({ message: 'Customer not found' });
            }

            res.status(200).json({ data: customer[0] });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    createCustomer: async (req, res) => {
        try {
            const { name, email, phone, address, note } = req.body;
            const query = 'INSERT INTO customers (name, email, phone, address, note) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.execute(query, [name, email, phone, address, note]);
            const customerId = result.insertId;
            res.status(201).json({ id: customerId, name, email, phone, address, note });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateCustomer: async (req, res) => {
        try {
            const customerId = req.params.id;
            const { name, email, phone, address, note } = req.body;
            const query = 'UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, note = ? WHERE id = ?';
            await db.execute(query, [name, email, phone, address, note, customerId]);
            res.status(200).json({ message: 'Customer updated successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },


    deleteCustomer: async (req, res) => {
        try {
            const customerId = req.params.id;
            const query = 'DELETE FROM customers WHERE id = ?';
            await db.execute(query, [customerId]);
            res.status(200).json({ message: 'Customer deleted successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    searchCustomers: async (req, res) => {
        try {
            const { keyword } = req.query;
            const query = `
                SELECT * FROM customers
                WHERE 
                    name LIKE ? OR 
                    email LIKE ? OR 
                    phone LIKE ? OR 
                    address LIKE ?
            `;
            const [result] = await db.execute(query, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`]);

            res.status(200).json({ data: result });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = customerEnrollmentController;
