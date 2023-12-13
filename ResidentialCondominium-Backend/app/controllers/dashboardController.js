const db = require('../config/db');

const dashboardController = {
    getStatistics: async (req, res) => {
        try {
            // Đếm số lượng người dùng
            const [userCountResult] = await db.execute('SELECT COUNT(*) AS userCount FROM users');
            const userCount = userCountResult[0].userCount;

            // Đếm số lượng phòng
            const [roomCountResult] = await db.execute('SELECT COUNT(*) AS roomCount FROM rooms');
            const roomCount = roomCountResult[0].roomCount;

            // Tính tổng giá trị của tất cả tài sản
            const [totalAssetsValueResult] = await db.execute('SELECT SUM(value) AS totalValue FROM assets');
            const totalAssetsValue = totalAssetsValueResult[0].totalValue || 0;

            // Đếm số lượng hợp đồng
            const [contractCountResult] = await db.execute('SELECT COUNT(*) AS contractCount FROM contracts');
            const contractCount = contractCountResult[0].contractCount;

            // Lấy tổng số lượng các bản ghi sự kiện từ lịch sử sự kiện của tài sản
            const [eventHistoryCountResult] = await db.execute('SELECT COUNT(*) AS eventHistoryCount FROM asset_event_history');
            const eventHistoryCount = eventHistoryCountResult[0].eventHistoryCount;

            // Tính tổng số lượng khách hàng
            const [customerCountResult] = await db.execute('SELECT COUNT(*) AS customerCount FROM customers');
            const customerCount = customerCountResult[0].customerCount;

            // Tính tổng số lượng người dùng tham gia cuộc họp
            const [meetingParticipantsCountResult] = await db.execute('SELECT COUNT(*) AS meetingParticipantsCount FROM meeting_participants');
            const meetingParticipantsCount = meetingParticipantsCountResult[0].meetingParticipantsCount;

            // Tổng hợp dữ liệu và trả về cho client
            const statistics = {
                userCount,
                roomCount,
                totalAssetsValue,
                contractCount,
                eventHistoryCount,
                customerCount,
                meetingParticipantsCount,
            };

            res.status(200).json(statistics);
        } catch (error) {
            console.error('Error fetching statistics:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = dashboardController;
