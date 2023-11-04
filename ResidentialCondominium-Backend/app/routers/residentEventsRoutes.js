const express = require('express');
const router = express.Router();
const residentEventsController = require('../controllers/residentEventsController');

// Định nghĩa tuyến đường cho API tìm kiếm cuộc họp theo tiêu đề
router.get('/search', residentEventsController.searchMeetingsByTitle);

// Lấy tất cả đăng ký tham gia cuộc họp
router.get('/:meetingId/registrations', residentEventsController.getAllRegistrationsForMeeting);

// Lấy tất cả cuộc họp
router.get('/', residentEventsController.getAllMeetings);

// Lấy thông tin cuộc họp dựa trên ID
router.get('/:meetingId', residentEventsController.getMeetingById);

// Tạo cuộc họp mới
router.post('/', residentEventsController.createMeeting);

// Ghi sự kiện của cư dân
router.post('/events', residentEventsController.recordEvent);

// Đăng ký tham gia cuộc họp
router.post('/register', residentEventsController.registerForMeeting);

module.exports = router;
