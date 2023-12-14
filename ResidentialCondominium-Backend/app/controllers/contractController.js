const db = require('../config/db');

const contractController = {
    createContract: async (req, res) => {
        try {
            const { vendorId, title, startDate, endDate, description, value, fileUrl } = req.body;

            const query = 'INSERT INTO contracts (vendor_id, title, start_date, end_date, description, value, file_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const [result] = await db.execute(query, [vendorId, title, startDate, endDate, description, value, fileUrl]);
            const contractId = result.insertId;

            res.status(201).json({ id: contractId, vendorId, title, startDate, endDate, description, value, fileUrl });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateContract: async (req, res) => {
        try {
            const contractId = req.params.id;
            const { vendorId, title, startDate, endDate, description, value, fileUrl } = req.body;
            const query = 'UPDATE contracts SET vendor_id = ?, title = ?, start_date = ?, end_date = ?, description = ?,file_url = ?, value = ? WHERE id = ?';
            await db.execute(query, [vendorId, title, startDate, endDate, description, fileUrl, value, contractId]);
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
            const query = `
                SELECT contracts.*, vendors.name AS vendor_name
                FROM contracts
                LEFT JOIN vendors ON contracts.vendor_id = vendors.id
            `;
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
            const { keyword } = req.query;
    
            let conditions = [];
            let params = [];
    
            if (keyword) {
                conditions.push('(contracts.title LIKE ? OR vendors.name LIKE ?)');
                params.push(`%${keyword}%`);
                params.push(`%${keyword}%`);
            }
    
            let conditionStr = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
            const query = `
                SELECT contracts.*, vendors.name AS vendor_name
                FROM contracts
                LEFT JOIN vendors ON contracts.vendor_id = vendors.id
                ${conditionStr}
            `;
            const [contracts] = await db.execute(query, params);
    
            res.status(200).json({ data: contracts });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    
    
};

module.exports = contractController;
