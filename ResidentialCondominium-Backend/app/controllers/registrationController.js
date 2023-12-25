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

   getAllPersonalInfo: async (req, res) => {
        try {
            // Query to retrieve all personal information records along with family_info and rooms
            const [personalInfoRows] = await db.execute(`
            SELECT 
    pi.id AS personal_info_id,
    pi.user_id,
    pi.created_at AS personal_info_created_at,
    pi.full_name,
    pi.address,
    pi.phone_number,
    fi.spouse_name, 
    GROUP_CONCAT(fi.child_name SEPARATOR ', ') AS children,
    GROUP_CONCAT(r.name SEPARATOR ', ') AS rooms
FROM personal_info pi
LEFT JOIN family_info fi ON pi.id = fi.personal_info_id
LEFT JOIN room_residents rr ON pi.user_id = rr.user_id
LEFT JOIN rooms r ON rr.room_id = r.id
GROUP BY pi.id, pi.user_id, pi.created_at, pi.full_name, pi.address, pi.phone_number, fi.spouse_name;
            `);

            // If there are no records, return an empty array
            if (!personalInfoRows || personalInfoRows.length === 0) {
                return res.status(404).json({ message: 'No personal information records found', status: false });
            }
            // Transform the structure of each personalInfo object
            const transformedData = personalInfoRows.map(personalInfo => ({
                id: personalInfo.user_id,
                personal_info_id: personalInfo.personal_info_id,
                personal_info_created_at: personalInfo.personal_info_created_at,
                full_name: personalInfo.full_name,
                address: personalInfo.address,
                phone_number: personalInfo.phone_number,
                spouse_name: personalInfo.spouse_name,
                children: personalInfo.children,
                rooms: personalInfo.rooms,
            }));

            // Sắp xếp transformedData theo id và personal_info_created_at giảm dần
            const sortedData = transformedData.sort((a, b) => {
                if (a.id === b.id) {
                    return new Date(b.personal_info_created_at) - new Date(a.personal_info_created_at);
                }
                return a.id - b.id;
            });

            // Tạo một đối tượng để theo dõi id đã xử lý và giữ lại bản ghi có personal_info_created_at mới nhất
            const uniqueTransformedData = sortedData.reduce((accumulator, currentRecord) => {
                if (!accumulator[currentRecord.id]) {
                    accumulator[currentRecord.id] = currentRecord;
                }
                return accumulator;
            }, {});

            // Chuyển uniqueTransformedData từ đối tượng về mảng
            const resultArray = Object.values(uniqueTransformedData);

            console.log(resultArray);

            // Return the list of transformed personal information records
            res.status(200).json({ data: resultArray });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

};

module.exports = registrationController;
