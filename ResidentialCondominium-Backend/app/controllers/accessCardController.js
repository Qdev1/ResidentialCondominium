const db = require('../config/db');

const accessCardController = {
    getAllAccessCards: async (req, res) => {
        try {
            const [accessCards] = await db.execute('SELECT * FROM access_cards');
            res.status(200).json(accessCards);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    getAccessCardById: async (req, res) => {
        try {
            const { cardId } = req.params;
            const [accessCard] = await db.execute('SELECT * FROM access_cards WHERE id = ?', [cardId]);

            if (accessCard.length === 0) {
                res.status(404).json({ message: 'Access card not found', status: false });
            } else {
                res.status(200).json(accessCard[0]);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    createAccessCard: async (req, res) => {
        try {
            const { residentId, cardNumber, issueDate, expirationDate } = req.body;
            const query = 'INSERT INTO access_cards (resident_id, card_number, issue_date, expiration_date) VALUES (?, ?, ?, ?)';
            const [result] = await db.execute(query, [residentId, cardNumber, issueDate, expirationDate]);
            const cardId = result.insertId;
            res.status(201).json({ id: cardId, residentId, cardNumber, issueDate, expirationDate, status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    updateAccessCard: async (req, res) => {
        try {
            const { cardId } = req.params;
            const { residentId, cardNumber, issueDate, expirationDate } = req.body;
            const query = 'UPDATE access_cards SET resident_id = ?, card_number = ?, issue_date = ?, expiration_date = ? WHERE id = ?';
            await db.execute(query, [residentId, cardNumber, issueDate, expirationDate, cardId]);
            res.status(200).json({ message: 'Access card updated successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    deleteAccessCard: async (req, res) => {
        try {
            const { cardId } = req.params;
            const query = 'DELETE FROM access_cards WHERE id = ?';
            await db.execute(query, [cardId]);
            res.status(200).json({ message: 'Access card deleted successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    searchAccessCards: async (req, res) => {
        try {
            const { query } = req.query;
            const searchQuery = 'SELECT * FROM access_cards WHERE card_number LIKE ?';
            const [result] = await db.execute(searchQuery, [`%${query}%`]);

            if (result.length === 0) {
                res.status(404).json({ message: 'No access cards found with the specified query', status: false });
            } else {
                res.status(200).json(result);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = accessCardController;
