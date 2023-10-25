// createTables.js

const db = require('../config/db');

const createTables = async () => {
    try {
        // Tạo bảng "users" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
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

        console.log('Table "users" created or already exists.');

        // Tạo bảng "rooms" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS rooms (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(255),
                area FLOAT,
                capacity INT,
                status VARCHAR(255) DEFAULT 'available',
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Table "rooms" created or already exists.');

        // Tạo bảng trung gian "room_residents" để theo dõi cư dân của từng phòng
        await db.execute(`
            CREATE TABLE IF NOT EXISTS room_residents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                room_id INT,
                user_id INT,
                FOREIGN KEY (room_id) REFERENCES rooms(id),
                FOREIGN KEY (user_id) REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Table "room_residents" created or already exists.');

        // Thêm bảng "asset_categories"
        await db.execute(`
         CREATE TABLE IF NOT EXISTS asset_categories (
             id INT AUTO_INCREMENT PRIMARY KEY,
             name VARCHAR(255) NOT NULL,
             description TEXT,
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         )
     `);

        console.log('Table "asset_categories" created or already exists.');

        // Tạo bảng "password_reset_tokens" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token VARCHAR(255) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        `);

        console.log('Table "password_reset_tokens" created or already exists.');

        // Tạo bảng "assets " nếu chưa tồn tại
        await db.execute(`
          CREATE TABLE IF NOT EXISTS assets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            value DECIMAL(10, 2), -- Thay đổi kiểu dữ liệu tùy theo cần
            location VARCHAR(255),
            status VARCHAR(255),
            quantity INT,
            category_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES asset_categories(id)
        )
          `);

        console.log('Table "assets" created or already exists.');

        // Tạo bảng "asset_reports" nếu chưa tồn tại
        await db.execute(`
         CREATE TABLE IF NOT EXISTS asset_reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            asset_id INT,
            report_date DATE,
            report_description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (asset_id) REFERENCES assets(id)
        )
         `);

        console.log('Table "asset_reports" created or already exists.');

        // Tạo bảng "asset_event_history" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS asset_event_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                asset_id INT,
                event_type VARCHAR(255),
                event_date TIMESTAMP,
                description TEXT,
                quantity INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (asset_id) REFERENCES assets(id)
            )
            `);

        console.log('Table "asset_event_history" created or already exists.');

        // Tạo bảng "maintenance_plans" nếu chưa tồn tại
        await db.execute(`
         CREATE TABLE IF NOT EXISTS maintenance_plans (
            id INT AUTO_INCREMENT PRIMARY KEY,
            asset_id INT,
            plan_description TEXT,
            start_date DATE,
            end_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (asset_id) REFERENCES assets(id)
        )
         `);

        console.log('Table "maintenance_plans" created or already exists.');

        // Tạo bảng "vendors " nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS vendors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(255),
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        
      `);

        console.log('Table "vendors " created or already exists.');

        // await db.execute(`
        //     ALTER TABLE assets
        //     ADD quantity INT;
        //     `);

    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
    }
};

createTables();
