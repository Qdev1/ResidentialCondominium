const db = require('../config/db');

const contractController = {
    createContract: async (req, res) => {
        try {
            const { vendorId, contractorId, startDate, endDate, description, value } = req.body;

            const query = 'INSERT INTO contracts (vendor_id, contractor_id, start_date, end_date, description, value) VALUES (?, ?, ?, ?, ?, ?)';
            const [result] = await db.execute(query, [vendorId, contractorId, startDate, endDate, description, value]);
            const contractId = result.insertId;

            res.status(201).json({ id: contractId, vendorId, contractorId, startDate, endDate, description, value });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateContract: async (req, res) => {
        try {
            const contractId = req.params.id;
            const { vendorId, contractorId, startDate, endDate, description, value } = req.body;
            const query = 'UPDATE contracts SET vendor_id = ?, contractor_id = ?, start_date = ?, end_date = ?, description = ?, value = ? WHERE id = ?';
            await db.execute(query, [vendorId, contractorId, startDate, endDate, description, value, contractId]);
            res.status(200).json({ message: 'Contract updated successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deleteContract: async (req, res) => {
        try {
            const contractId = req.params.id;
            const query = 'DELETE FROM contracts WHERE id = ?';
            await db.execute(query, [contractId]);
            res.status(200).json({ message: 'Contract deleted successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAllContracts: async (req, res) => {
        try {
            const query = 'SELECT * FROM contracts';
            const [contracts] = await db.execute(query);
            res.status(200).json({ data: contracts });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getContractById: async (req, res) => {
        try {
            const contractId = req.params.id;
            const query = 'SELECT * FROM contracts WHERE id = ?';
            const [contract] = await db.execute(query, [contractId]);

            if (contract.length === 0) {
                return res.status(404).json({ message: 'Contract not found' });
            }

            res.status(200).json({ data: contract[0] });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    searchContracts: async (req, res) => {
        try {
            const { vendorId, contractorId, startDate, endDate } = req.query;

            let conditions = [];
            let params = [];

            if (vendorId) {
                conditions.push('vendor_id = ?');
                params.push(vendorId);
            }

            if (contractorId) {
                conditions.push('contractor_id = ?');
                params.push(contractorId);
            }

            if (startDate) {
                conditions.push('start_date >= ?');
                params.push(startDate);
            }

            if (endDate) {
                conditions.push('end_date <= ?');
                params.push(endDate);
            }

            let conditionStr = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
            const query = `SELECT * FROM contracts ${conditionStr}`;
            const [contracts] = await db.execute(query, params);

            res.status(200).json({ data: contracts });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = contractController;
