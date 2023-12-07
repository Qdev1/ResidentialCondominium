const db = require('../config/db');
const nodemailer = require('nodemailer');

const residentEventsController = {

    getAllMeetingAndComplaint: async (req, res) => {
        try {
            // Lấy tất cả thông tin của khiếu nại
            const [complaints] = await db.execute('SELECT * FROM complaints');
    
            // Lấy tất cả thông tin sự kiện cư dân
            const [events] = await db.execute('SELECT * FROM events');
    
            // Tổng hợp dữ liệu và gửi về phản hồi
            const allData = {
                complaints: complaints,
                residentEvents: events,
            };
    
            res.status(200).json(allData);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    createMeeting: async (req, res) => {
        try {
            // Lấy thông tin cuộc họp từ req.body
            const { title, date, description, location, role } = req.body;

            // Lưu thông tin cuộc họp vào cơ sở dữ liệu
            const [meetingRows] = await db.execute(
                'INSERT INTO meetings (title, date, description, location) VALUES (?, ?, ?, ?)',
                [title, date, description, location]
            );

            const meetingId = meetingRows.insertId;

            // Gửi thông báo tới cư dân tham gia cuộc họp
            const transporter = nodemailer.createTransport({
                host: 'smtp-relay.brevo.com',
                port: '587',
                auth: {
                    user: 'h5studiogl@gmail.com',
                    pass: 'fScdnZ4WmEDqjBA1',
                },
            });

           // Tìm tất cả người dùng có vai trò là "resident"
           const [userRows] = await db.execute('SELECT * FROM users WHERE role = ?', [role]);

           for (const user of userRows) {
               const mailOptions = {
                   from: 'coms@gmail.com',
                   to: user.email,
                   subject: title,
                   text: description,
               };

               transporter.sendMail(mailOptions, (error, info) => {
                   if (error) {
                       console.error(error);
                   }
               });
           }

            res.status(201).json({ message: 'Meeting created successfully', meetingId, status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    recordEvent: async (req, res) => {
        try {
            // Lấy thông tin sự kiện từ req.body
            const { eventName, eventDate, description, meetingId } = req.body;
    
            // Lưu thông tin sự kiện vào cơ sở dữ liệu
            const [eventRows] = await db.execute(
                'INSERT INTO events (event_name, event_date, description, meeting_id) VALUES (?, ?, ?, ?)',
                [eventName, eventDate, description, meetingId]
            );
    
            const eventId = eventRows.insertId;
    
            // Gửi thông báo tới cư dân về sự kiện
            const transporter = nodemailer.createTransport({
                host: 'smtp-relay.brevo.com',
                port: '587',
                auth: {
                    user: 'h5studiogl@gmail.com',
                    pass: 'fScdnZ4WmEDqjBA1',
                },
            });
    
            // Lấy danh sách cư dân để gửi thông báo
            const [residentsRows] = await db.execute('SELECT email FROM users WHERE role = "resident"');
    
            const residentEmails = residentsRows.map((resident) => resident.email);
    
            const mailOptions = {
                from: 'coms@gmail.com',
                to: residentEmails,
                subject: `Thông báo sự kiện: ${eventName}`,
                text: `Sự kiện "${eventName}" sẽ diễn ra vào ngày ${eventDate}.`
            };
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                }
            });
    
            res.status(201).json({ message: 'Event recorded successfully', eventId, status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    getAllEventsByMeetingId: async (req, res) => {
        try {
            // Lấy meeting_id từ tham số của yêu cầu
            const { meetingId } = req.params;
    
            // Truy vấn SQL để lấy tất cả sự kiện theo meeting_id
            const [eventRows] = await db.execute('SELECT * FROM events WHERE meeting_id = ?', [meetingId]);
    
            // Trả về danh sách sự kiện trong phản hồi HTTP
            res.status(200).json({ data: eventRows });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    

    registerForMeeting: async (req, res) => {
        try {
            // Lấy thông tin đăng ký tham gia cuộc họp từ req.body
            const { meetingId, userId } = req.body;
    
            // Kiểm tra tính hợp lệ của cuộc họp và người dùng
    
            // Điều kiện kiểm tra ví dụ: Đảm bảo người dùng và cuộc họp tồn tại và người dùng có vai trò "resident"
            const [meetingRows] = await db.execute('SELECT * FROM meetings WHERE id = ?', [meetingId]);
            const [userRows] = await db.execute('SELECT * FROM users WHERE id = ? AND role = "resident"', [userId]);
    
            if (meetingRows.length === 0 || userRows.length === 0) {
                return res.status(400).json({ message: 'Invalid meeting or user', status: false });
            }
    
            // Cập nhật danh sách tham dự cuộc họp - thêm thông tin người dùng vào bảng trung gian
            await db.execute('INSERT INTO meeting_participants (meeting_id, user_id) VALUES (?, ?)', [meetingId, userId]);
    
            // Gửi thông báo cho người dùng
            const transporter = nodemailer.createTransport({
                host: 'smtp-relay.brevo.com',
                port: '587',
                auth: {
                    user: 'h5studiogl@gmail.com',
                    pass: 'fScdnZ4WmEDqjBA1',
                }
            });
    
            const [meetingInfo] = meetingRows;
            const [userInfo] = userRows;
    
            const mailOptions = {
                from: 'coms@gmail.com',
                to: userInfo.email,
                subject: `Đăng ký tham gia cuộc họp: ${meetingInfo.title}`,
                text: `Bạn đã đăng ký tham gia cuộc họp "${meetingInfo.title}" vào ngày ${meetingInfo.date}.`
            };
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                }
            });
    
            res.status(200).json({ message: 'Registration for meeting successful', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    
    getAllMeetings: async (req, res) => {
        try {
            // Truy vấn tất cả cuộc họp
            const [meetings] = await db.execute('SELECT * FROM meetings');
            res.status(200).json(meetings);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    getMeetingById: async (req, res) => {
        try {
            const { meetingId } = req.params;
            // Truy vấn thông tin cuộc họp dựa trên ID
            const [meeting] = await db.execute('SELECT * FROM meetings WHERE id = ?', [meetingId]);
    
            if (meeting.length === 0) {
                res.status(404).json({ message: 'Meeting not found', status: false });
            } else {
                const [meetingInfo] = meeting;
    
                // Truy vấn tất cả sự kiện liên quan đến cuộc họp
                const [events] = await db.execute('SELECT * FROM events WHERE meeting_id = ?', [meetingId]);
                meetingInfo.events = events;
    
                res.status(200).json(meetingInfo);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },    

    getAllRegistrationsForMeeting: async (req, res) => {
        try {
            const { meetingId } = req.params;
            // Truy vấn tất cả đăng ký tham gia cuộc họp dựa trên ID cuộc họp
            const [registrations] = await db.execute(
                'SELECT users.username, users.email FROM meeting_participants ' +
                'INNER JOIN users ON meeting_participants.user_id = users.id ' +
                'WHERE meeting_participants.meeting_id = ?',
                [meetingId]
            );
    
            res.status(200).json(registrations);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    
    searchMeetingsByTitle: async (req, res) => {
        try {
            const { title } = req.query;

            const [meetings] = await db.execute('SELECT * FROM meetings WHERE title LIKE ?', [`%${title}%`]);

            res.status(200).json(meetings);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    }
    
};

module.exports = residentEventsController;
