// maintenanceFundsController.js
const db = require('../config/db');

const maintenanceFundsController = {
    getAllFunds: async (req, res) => {
        try {
            const [funds] = await db.execute('SELECT * FROM maintenance_funds');
            res.status(200).json(funds);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    getFundById: async (req, res) => {
        try {
            const { fundId } = req.params;
            const [fund] = await db.execute('SELECT * FROM maintenance_funds WHERE id = ?', [fundId]);

            if (fund.length === 0) {
                res.status(404).json({ message: 'Fund not found', status: false });
            } else {
                res.status(200).json(fund[0]);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    createFund: async (req, res) => {
        try {
            const { description, amount, allocation_date } = req.body;
            const [result] = await db.execute(
                'INSERT INTO maintenance_funds (description, amount, allocation_date) VALUES (?, ?, ?)',
                [description, amount, allocation_date]
            );
            const fundId = result.insertId;
            res.status(201).json({ id: fundId, description, amount, allocation_date });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    updateFund: async (req, res) => {
        try {
            const { fundId } = req.params;
            const { description, amount, allocation_date, utilization_date, status } = req.body;
            const query = 'UPDATE maintenance_funds SET description = ?, amount = ?, allocation_date = ?, utilization_date = ?, status = ? WHERE id = ?';
            await db.execute(query, [description, amount, allocation_date, utilization_date, status, fundId]);
            res.status(200).json({ message: 'Fund updated successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    deleteFund: async (req, res) => {
        try {
            const { fundId } = req.params;
            const query = 'DELETE FROM maintenance_funds WHERE id = ?';
            await db.execute(query, [fundId]);
            res.status(200).json({ message: 'Fund deleted successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    searchFundsByDescription: async (req, res) => {
        try {
            const { description } = req.query;

            if (!description) {
                return res.status(400).json({ message: 'Description is required', status: false });
            }

            const query = 'SELECT * FROM maintenance_funds WHERE description LIKE ?';
            const [funds] = await db.execute(query, [`%${description}%`]);

            if (funds.length === 0) {
                res.status(404).json({ message: 'No funds found with the specified description', status: false });
            } else {
                res.status(200).json(funds);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = maintenanceFundsController;
