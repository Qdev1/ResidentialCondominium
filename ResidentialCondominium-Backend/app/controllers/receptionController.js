// receptionController.js

const db = require('../config/db');

const receptionController = {
    createReception: async (req, res) => {
        try {
            const { resident_id, guest_name, entry_date, purpose, note } = req.body;
            const query = 'INSERT INTO receptions (resident_id, guest_name, entry_date, purpose, note) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.execute(query, [resident_id, guest_name, entry_date, purpose, note]);
            const receptionId = result.insertId;

            res.status(201).json({ id: receptionId, resident_id, guest_name, entry_date, purpose, note });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateReception: async (req, res) => {
        try {
            const receptionId = req.params.id;
            const { resident_id, guest_name, entry_date, purpose, note } = req.body;
            const query = 'UPDATE receptions SET resident_id = ?, guest_name = ?, entry_date = ?, purpose = ?, note = ? WHERE id = ?';
            await db.execute(query, [resident_id, guest_name, entry_date, purpose, note, receptionId]);

            res.status(200).json({ message: 'Reception updated successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deleteReception: async (req, res) => {
        try {
            const receptionId = req.params.id;
            const query = 'DELETE FROM receptions WHERE id = ?';
            await db.execute(query, [receptionId]);

            res.status(200).json({ message: 'Reception deleted successfully' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAllReceptions: async (req, res) => {
        try {
            const query = `
                SELECT receptions.*, users.username AS resident_username
                FROM receptions
                INNER JOIN users ON receptions.resident_id = users.id
            `;
            const [receptions] = await db.execute(query);

            res.status(200).json({ data: receptions });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getReceptionById: async (req, res) => {
        try {
            const receptionId = req.params.id;
            const query = 'SELECT * FROM receptions WHERE id = ?';
            const [reception] = await db.execute(query, [receptionId]);

            if (reception.length === 0) {
                return res.status(404).json({ message: 'Reception not found' });
            }

            res.status(200).json({ data: reception[0] });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    searchReceptions: async (req, res) => {
        try {
            const { query } = req.query;

            let searchQuery;
            let searchSql;

            if (query) {
                searchQuery = `%${query}%`;
                searchSql = `
                    SELECT receptions.*, users.username AS resident_username
                    FROM receptions
                    INNER JOIN users ON receptions.resident_id = users.id
                    WHERE receptions.guest_name LIKE ? OR receptions.purpose LIKE ? OR receptions.note LIKE ?
                `;
            } else {
                // Trường hợp không có query, trả về toàn bộ data
                searchQuery = '%';
                searchSql = 'SELECT * FROM receptions';
            }

            const [receptions] = await db.execute(searchSql, [searchQuery, searchQuery, searchQuery]);

            res.status(200).json({ data: receptions });
        } catch (err) {
            res.status(500).json(err);
        }
    }
    
};

module.exports = receptionController;
