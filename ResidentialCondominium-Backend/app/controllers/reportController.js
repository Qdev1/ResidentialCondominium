// reportController.js
const db = require('../config/db');

const reportController = {
    createAssetReport: async (req, res) => {
        try {
            const { assetId, reportDate, reportDescription } = req.body;

            // Thực hiện truy vấn SQL để thêm báo cáo tài sản vào bảng "asset_reports"
            const query = 'INSERT INTO asset_reports (asset_id, report_date, report_description) VALUES (?, ?, ?)';
            const [result] = await db.execute(query, [assetId, reportDate, reportDescription]);
            const reportId = result.insertId;
            res.status(201).json({ id: reportId, assetId, reportDate, reportDescription });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAssetReports: async (req, res) => {
        try {
            const assetId = req.params.assetId;

            // Thực hiện truy vấn SQL để lấy danh sách báo cáo tài sản từ bảng "asset_reports"
            const query = 'SELECT * FROM asset_reports WHERE asset_id = ?';
            const [reports] = await db.execute(query, [assetId]);
            res.status(200).json({ data: reports });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    generateAssetStatistics: async (req, res) => {
        try {
            // Lấy tham số từ request, ví dụ: năm và tháng
            const { year, month } = req.query;

            // Thực hiện truy vấn SQL để tính thống kê tài sản dựa trên năm và tháng
            const query = `
                SELECT
                    ${year} AS year,
                    ${month} AS month,
                    SUM(value) AS total_value,
                    COUNT(id) AS total_assets
                FROM assets
                WHERE YEAR(created_at) = ? AND MONTH(created_at) = ?
            `;
            const [result] = await db.execute(query, [year, month]);

            if (result.length === 0) {
                return res.status(404).json({ message: 'No assets found for the specified month and year' });
            }

            const statistics = result[0];
            res.status(200).json({ data: statistics });
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },
};

module.exports = reportController;
