// createTables.js
const db = require('../config/db');

const createTables = async () => {

    try {
        // Kiểm tra xem bảng "users" đã tồn tại chưa
        const [rows, fields] = await db.execute('SHOW TABLES LIKE "users"');

        if (rows.length === 0) {
            // Nếu bảng "users" chưa tồn tại, tạo nó
            await db.execute(`
                CREATE TABLE users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    phone VARCHAR(255),
                    username VARCHAR(255),
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(255),
                    status VARCHAR(255) DEFAULT 'noactive',
                    image VARCHAR(255) DEFAULT 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `);

            console.log('Table "users" created.');
        } else {
            console.log('Table "users" already exists.');
        }
    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
    }
};

createTables();
