const db = require('../config/db');

const maintenanceHistoryController = {
    createMaintenanceRecord: async (req, res) => {
        try {
            const { asset_id, description, date, cost, plan_id } = req.body;
            const query = 'INSERT INTO maintenance_history (asset_id, description, date, cost, plan_id) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.execute(query, [asset_id, description, date, cost, plan_id]);
            const recordId = result.insertId;
            res.status(201).json({ id: recordId, asset_id, description, date, cost, plan_id });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateMaintenanceRecord: async (req, res) => {
        try {
            const recordId = req.params.id;
            const { asset_id, description, date, cost, plan_id } = req.body;
            const query = 'UPDATE maintenance_history SET asset_id = ?, description = ?, date = ?, cost = ?, plan_id = ? WHERE id = ?';
            await db.execute(query, [asset_id, description, date, cost, plan_id, recordId]);
            res.status(200).json({ message: 'Maintenance record updated successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deleteMaintenanceRecord: async (req, res) => {
        try {
            const recordId = req.params.id;
            const query = 'DELETE FROM maintenance_history WHERE id = ?';
            await db.execute(query, [recordId]);
            res.status(200).json({ message: 'Maintenance record deleted successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    searchMaintenanceRecords: async (req, res) => {
        try {
            const { keyword } = req.query;
            const query = `
                SELECT mh.*, mp.plan_description
                FROM maintenance_history mh
                JOIN maintenance_plans mp ON mh.plan_id = mp.id
                WHERE mh.description LIKE ? OR mp.plan_description LIKE ?
            `;
            const [maintenanceRecords] = await db.execute(query, [`%${keyword}%`, `%${keyword}%`]);
            res.status(200).json({ data: maintenanceRecords });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getMaintenanceRecordById: async (req, res) => {
        try {
            const recordId = req.params.id;
            const query = 'SELECT * FROM maintenance_history WHERE id = ?';
            const [maintenanceRecord] = await db.execute(query, [recordId]);

            if (maintenanceRecord.length === 0) {
                res.status(404).json({ message: 'Maintenance record not found', status: false });
            } else {
                res.status(200).json(maintenanceRecord[0]);
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getMaintenanceRecordsForPlan: async (req, res) => {
        try {
            const planId = req.params.planId;
            const query = 'SELECT * FROM maintenance_history WHERE plan_id = ?';
            const [maintenanceRecords] = await db.execute(query, [planId]);
            res.status(200).json({ data: maintenanceRecords });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAllMaintenanceRecords: async (req, res) => {
        try {
            const query = `
                SELECT mh.*, mp.plan_description
                FROM maintenance_history mh
                JOIN maintenance_plans mp ON mh.plan_id = mp.id
            `;
            const [maintenanceRecords] = await db.execute(query);
            res.status(200).json({ data: maintenanceRecords });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = maintenanceHistoryController;
