const db = require('../config/db');

const isRoomNameExist = async (roomName, excludeRoomId = null) => {
  const params = [roomName];
  let query = 'SELECT * FROM rooms WHERE name = ?';
  
  if (excludeRoomId) {
    query += ' AND id <> ?';
    params.push(excludeRoomId);
  }

  const [result] = await db.execute(query, params);
  return result.length > 0;
};

const roomController = {
  
  createRoom: async (req, res) => {
    try {
      const { name, type, area, capacity, status, description, residents } = req.body;

       // Kiểm tra xem tên phòng đã tồn tại chưa
       const roomNameExist = await isRoomNameExist(name);
       if (roomNameExist) {
         return res.status(200).json({ message: 'Room name already exists' });
       }

      const query = 'INSERT INTO rooms (name, type, area, capacity, status, description) VALUES (?, ?, ?, ?, ?, ?)';
      const [result] = await db.execute(query, [name, type, area, capacity, status, description]);

      const roomId = result.insertId;


      res.status(200).json({ id: roomId, name, type, area, capacity, status, description, residents });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getAllRooms: async (req, res) => {
    try {
      const roomsQuery = 'SELECT rooms.id, rooms.name, rooms.type, rooms.area, rooms.capacity, rooms.status, rooms.description FROM rooms';
      const [rooms] = await db.execute(roomsQuery);
  
      for (const room of rooms) {
        const residentsQuery = 'SELECT users.username, users.email FROM users INNER JOIN room_residents ON users.id = room_residents.user_id WHERE room_residents.room_id = ?';
        const [residents] = await db.execute(residentsQuery, [room.id]);
        room.residents = residents;
      }
  
      res.status(200).json({ data: rooms });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  

  deleteRoom: async (req, res) => {
    try {
      const roomId = req.params.id;

      const [checkRoomExist] = await db.execute('SELECT * FROM rooms WHERE id = ?', [roomId]);

      if (checkRoomExist.length === 0) {
        return res.status(404).json({ message: 'Room not found' });
      }

      const deleteQuery = 'DELETE FROM rooms WHERE id = ?';
      await db.execute(deleteQuery, [roomId]);

      res.status(200).json("Room deleted successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  updateRoom: async (req, res) => {
    try {
      const roomId = req.params.id;
      const { name, type, area, capacity, status, description } = req.body;

      // Kiểm tra xem tên phòng đã tồn tại chưa (trừ phòng hiện tại)
      const roomNameExist = await isRoomNameExist(name, roomId);
      if (roomNameExist) {
        return res.status(200).json({ message: 'Room name already exists' });
      }

      const updateQuery = 'UPDATE rooms SET name = ?, type = ?, area = ?, capacity = ?, status = ?, description = ? WHERE id = ?';
      const updatedValues = [name || null, type || null, area || null, capacity || null, status || null, description || null, roomId];

      const [result] = await db.execute(updateQuery, updatedValues);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Room not found' });
      }

      res.status(200).json("Room updated successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  searchRooms: async (req, res) => {
    try {
      const { keyword } = req.query;

      const query = 'SELECT id, name, type, area, capacity, status, description FROM rooms WHERE name LIKE ? OR type LIKE ?';
      const searchTerm = `%${keyword}%`;

      const [roomList] = await db.execute(query, [searchTerm, searchTerm]);
      res.status(200).json({ data: roomList });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getRoomById: async (req, res) => {
    try {
      const roomId = req.params.id;
  
      const roomQuery = 'SELECT rooms.id, rooms.name, rooms.type, rooms.area, rooms.capacity, rooms.status, rooms.description FROM rooms WHERE rooms.id = ?';
      const [room] = await db.execute(roomQuery, [roomId]);
  
      if (room.length === 0) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      const residentsQuery = 'SELECT users.username, users.email FROM users INNER JOIN room_residents ON users.id = room_residents.user_id WHERE room_residents.room_id = ?';
      const [residents] = await db.execute(residentsQuery, [roomId]);
  
      room[0].residents = residents;
  
      res.status(200).json({ data: room[0] });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  

  addResidentToRoom: async (req, res) => {
    try {
      const { roomId, userId } = req.body;

      const [checkRoomExist] = await db.execute('SELECT * FROM rooms WHERE id = ?', [roomId]);
      const [checkUserExist] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);

      if (checkRoomExist.length === 0 || checkUserExist.length === 0) {
        return res.status(200).json({ message: 'Room or user not found' });
      }

      const insertQuery = 'INSERT INTO room_residents (room_id, user_id) VALUES (?, ?)';
      await db.execute(insertQuery, [roomId, userId]);

      res.status(200).json({ message: 'Resident added to room successfully' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  removeResidentFromRoom: async (req, res) => {
    try {
      const { roomId, userId } = req.body;

      const [checkRoomExist] = await db.execute('SELECT * FROM rooms WHERE id = ?', [roomId]);
      const [checkUserExist] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);

      if (checkRoomExist.length === 0 || checkUserExist.length === 0) {
        return res.status(404).json({ message: 'Room or user not found' });
      }

      const deleteQuery = 'DELETE FROM room_residents WHERE room_id = ? AND user_id = ?';
      await db.execute(deleteQuery, [roomId, userId]);

      res.status(200).json({ message: 'Resident removed from room successfully' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

};

module.exports = roomController;
