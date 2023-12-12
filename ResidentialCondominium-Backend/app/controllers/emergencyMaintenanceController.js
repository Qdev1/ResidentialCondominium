const db = require('../config/db');

const emergencyMaintenanceController = {
    getAllSecurityUsers: async (req, res) => {
        try {
            const query = 'SELECT * FROM users WHERE role = "isSecurity"';
            const [securityUsers] = await db.execute(query);
            res.status(200).json({ data: securityUsers });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    
    createEmergencyMaintenance: async (req, res) => {
        try {
            const { asset_id, description, reported_by } = req.body;
            const query = 'INSERT INTO emergency_maintenance (asset_id, description, reported_by) VALUES (?, ?, ?)';
            const [result] = await db.execute(query, [asset_id, description, reported_by]);
            const maintenanceId = result.insertId;
            res.status(201).json({ id: maintenanceId, asset_id, description, reported_by });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateEmergencyMaintenance: async (req, res) => {
        try {
            const maintenanceId = req.params.id;
            const { resolved_description, resolved_by } = req.body;
            const query = 'UPDATE emergency_maintenance SET resolved_description = ?, resolved_by = ?, status = "resolved", resolved_at = CURRENT_TIMESTAMP WHERE id = ?';
            await db.execute(query, [resolved_description, resolved_by, maintenanceId]);
            res.status(200).json({ message: 'Emergency maintenance resolved successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deleteEmergencyMaintenance: async (req, res) => {
        try {
            const maintenanceId = req.params.id;
            const query = 'DELETE FROM emergency_maintenance WHERE id = ?';
            await db.execute(query, [maintenanceId]);
            res.status(200).json({ message: 'Emergency maintenance record deleted successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getEmergencyMaintenanceById: async (req, res) => {
        try {
            const maintenanceId = req.params.id;
            const query = `
                SELECT emergency_maintenance.*, assets.name AS asset_name, users.username AS reported_by_name
                FROM emergency_maintenance
                LEFT JOIN assets ON emergency_maintenance.asset_id = assets.id
                LEFT JOIN users ON emergency_maintenance.reported_by = users.id
                WHERE emergency_maintenance.id = ?`;
            const [maintenance] = await db.execute(query, [maintenanceId]);

            if (maintenance.length === 0) {
                return res.status(404).json({ message: 'Emergency maintenance record not found' });
            }

            res.status(200).json({ data: maintenance[0] });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAllEmergencyMaintenance: async (req, res) => {
        try {
            const query = `
                SELECT em.*, a.name AS asset_name, ur.username AS reported_by_name, ures.username AS resolved_by_name
                FROM emergency_maintenance em
                LEFT JOIN assets a ON em.asset_id = a.id
                LEFT JOIN users ur ON em.reported_by = ur.id
                LEFT JOIN users ures ON em.resolved_by = ures.id
            `;
            const [maintenanceRecords] = await db.execute(query);
            res.status(200).json({ data: maintenanceRecords });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    
    searchEmergencyMaintenance: async (req, res) => {
        try {
            const { keyword } = req.query;
            const query = `
                SELECT em.*, a.name AS asset_name, ur.username AS reported_by_name, ures.username AS resolved_by_name
                FROM emergency_maintenance em
                LEFT JOIN assets a ON em.asset_id = a.id
                LEFT JOIN users ur ON em.reported_by = ur.id
                LEFT JOIN users ures ON em.resolved_by = ures.id
                WHERE 
                    em.description LIKE ? OR 
                    em.resolved_description LIKE ?
            `;
            const [result] = await db.execute(query, [`%${keyword}%`, `%${keyword}%`]);
    
            res.status(200).json({ data: result });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = emergencyMaintenanceController;
