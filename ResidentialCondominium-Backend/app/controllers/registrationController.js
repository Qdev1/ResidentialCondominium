const db = require('../config/db');

const registrationController = {
    registerPersonalInfo: async (req, res) => {
        try {
            const { userId, personalInfo, familyInfo } = req.body;

            // Kiểm tra xem userId có tồn tại trong cơ sở dữ liệu không
            const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
            const user = userRows[0];

            if (!user) {
                return res.status(400).json({ message: 'User not found', status: false });
            }

            // Thực hiện lưu thông tin cá nhân và thông tin gia đình vào cơ sở dữ liệu
            const [personalInfoRows] = await db.execute(
                'INSERT INTO personal_info (user_id, full_name, address, phone_number) VALUES (?, ?, ?, ?)',
                [userId, personalInfo.fullName, personalInfo.address, personalInfo.phoneNumber]
            );

            const personalInfoId = personalInfoRows.insertId;

            if (familyInfo) {
                // Lưu thông tin gia đình và liên kết chúng với thông tin cá nhân
                for (const childName of familyInfo.children) {
                    await db.execute(
                        'INSERT INTO family_info (personal_info_id, spouse_name, child_name) VALUES (?, ?, ?)',
                        [personalInfoId, familyInfo.spouseName, childName]
                    );
                }
            }

            // Sau khi lưu thông tin, bạn có thể trả về thông báo hoặc dữ liệu của thông tin đã được lưu
            res.status(201).json({ message: 'Personal information registered successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    updatePersonalInfo: async (req, res) => {
        try {
            const { userId, personalInfo, familyInfo } = req.body;

            // Kiểm tra xem userId có tồn tại trong cơ sở dữ liệu không
            const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
            const user = userRows[0];

            if (!user) {
                return res.status(400).json({ message: 'User not found', status: false });
            }

            // Kiểm tra xem thông tin cá nhân đã tồn tại hay chưa
            const [existingPersonalInfoRows] = await db.execute('SELECT * FROM personal_info WHERE user_id = ?', [userId]);
            const existingPersonalInfo = existingPersonalInfoRows[0];

            if (!existingPersonalInfo) {
                return res.status(400).json({ message: 'Personal information not found', status: false });
            }

            // Thực hiện cập nhật thông tin cá nhân
            await db.execute(
                'UPDATE personal_info SET full_name = ?, address = ?, phone_number = ? WHERE user_id = ?',
                [personalInfo.fullName, personalInfo.address, personalInfo.phoneNumber, userId]
            );

            // Nếu có thông tin gia đình, cập nhật hoặc thêm mới thông tin gia đình
            if (familyInfo) {
                // Xóa thông tin gia đình cũ
                await db.execute('DELETE FROM family_info WHERE personal_info_id = ?', [existingPersonalInfo.id]);

                // Thêm thông tin gia đình mới
                for (const childName of familyInfo.children) {
                    await db.execute(
                        'INSERT INTO family_info (personal_info_id, spouse_name, child_name) VALUES (?, ?, ?)',
                        [existingPersonalInfo.id, familyInfo.spouseName, childName]
                    );
                }
            }

            res.status(200).json({ message: 'Personal information updated successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = registrationController;
