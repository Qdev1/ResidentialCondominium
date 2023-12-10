const db = require('../config/db');

const entryController = {
    createEntryRecord: async (req, res) => {
        try {
            const { userId, entryTime, exitTime, building, authorized, strangerName } = req.body;
            const query = 'INSERT INTO entry_records (user_id, entry_time, exit_time, building, authorized, stranger_name) VALUES (?, ?, ?, ?, ?, ?)';
            const [result] = await db.execute(query, [userId, entryTime, exitTime, building, authorized, strangerName]);
            const entryId = result.insertId;

            res.status(201).json({ id: entryId, userId, entryTime, exitTime, building, authorized, strangerName });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAllEntryRecords: async (req, res) => {
        try {
            const query = 'SELECT * FROM entry_records';
            const [entryRecords] = await db.execute(query);
            res.status(200).json({ data: entryRecords });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getEntryRecordById: async (req, res) => {
        try {
            const entryId = req.params.id;
            const query = 'SELECT * FROM entry_records WHERE id = ?';
            const [entryRecord] = await db.execute(query, [entryId]);

            if (entryRecord.length === 0) {
                return res.status(404).json({ message: 'Entry record not found' });
            }

            res.status(200).json({ data: entryRecord[0] });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateEntryRecord: async (req, res) => {
        try {
            const entryId = req.params.id;
            const { userId, entryTime, exitTime, building, authorized, strangerName } = req.body;
            const query = 'UPDATE entry_records SET user_id = ?, entry_time = ?, exit_time = ?, building = ?, authorized = ?, stranger_name = ? WHERE id = ?';
            await db.execute(query, [userId, entryTime, exitTime, building, authorized, strangerName, entryId]);
            res.status(200).json({ message: 'Entry record updated successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deleteEntryRecord: async (req, res) => {
        try {
            const entryId = req.params.id;
            const query = 'DELETE FROM entry_records WHERE id = ?';
            await db.execute(query, [entryId]);
            res.status(200).json({ message: 'Entry record deleted successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    searchEntryRecords: async (req, res) => {
        try {
            const { queryParam } = req.query;
            const query = 'SELECT * FROM entry_records WHERE user_id LIKE ? OR building LIKE ? OR stranger_name LIKE ?';
            const [entryRecords] = await db.execute(query, [`%${queryParam}%`, `%${queryParam}%`, `%${queryParam}%`]);

            res.status(200).json({ data: entryRecords });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = entryController;
