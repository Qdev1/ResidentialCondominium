const db = require('../config/db');

const maintenancePlanController = {
    createMaintenancePlan: async (req, res) => {
        try {
            const { asset_id, plan_description, start_date, end_date } = req.body;
            const query = 'INSERT INTO maintenance_plans (asset_id, plan_description, start_date, end_date) VALUES (?, ?, ?, ?)';
            const [result] = await db.execute(query, [asset_id, plan_description, start_date, end_date]);
            const planId = result.insertId;
            res.status(201).json({ id: planId, asset_id, plan_description, start_date, end_date });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateMaintenancePlan: async (req, res) => {
        try {
            const planId = req.params.id;
            const { asset_id, plan_description, start_date, end_date } = req.body;
            const query = 'UPDATE maintenance_plans SET asset_id = ?, plan_description = ?, start_date = ?, end_date = ? WHERE id = ?';
            await db.execute(query, [asset_id, plan_description, start_date, end_date, planId]);
            res.status(200).json({ message: 'Maintenance plan updated successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deleteMaintenancePlan: async (req, res) => {
        try {
            const planId = req.params.id;
            const query = 'DELETE FROM maintenance_plans WHERE id = ?';
            await db.execute(query, [planId]);
            res.status(200).json({ message: 'Maintenance plan deleted successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getMaintenancePlansForAsset: async (req, res) => {
        try {
            const assetId = req.params.assetId;
            const query = 'SELECT * FROM maintenance_plans WHERE asset_id = ?';
            const [maintenancePlans] = await db.execute(query, [assetId]);
            res.status(200).json({ data: maintenancePlans });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = maintenancePlanController;