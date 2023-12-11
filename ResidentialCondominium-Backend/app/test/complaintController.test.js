const db = require('../config/db');

const complaintController = require('../controllers/complaintController');

jest.mock('../config/db');

    describe('submitComplaint', () => {
        it('should successfully submit a complaint', async () => {
            // Mock user data as would be returned from MySQL database
            const mockUserRows = [{ id: 1, name: 'John Doe', email: 'john@example.com' }];

            // Mock result of complaint insertion
            const mockInsertResult = { insertId: 1, affectedRows: 1 };

            // Mocking db.execute to simulate MySQL responses
            db.execute
                .mockResolvedValueOnce([mockUserRows]) // First call to check user
                .mockResolvedValueOnce([mockInsertResult]); // Second call to insert complaint

            const req = {
                body: {
                    user_id: 1,
                    subject: 'Noise Complaint',
                    description: 'Loud music at night'
                }
            };
            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };
try{
  await complaintController.submitComplaint(req, res);

}catch{
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: 'Complaint submitted successfully', complaintId: 1 });

}

        });

        it('should handle user not found scenario', async () => {
            // Simulate no user found in MySQL database
            db.execute.mockResolvedValueOnce([[]]);

            const req = {
                body: {
                    user_id: 2,
                    subject: 'Subject',
                    description: 'Description'
                }
            };
            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };
try{
  await complaintController.submitComplaint(req, res);

}catch{
  
              expect(res.status).toHaveBeenCalledWith(400);
              expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });

}
        });

        it('should handle database errors', async () => {
            const mockError = new Error('Database error');
            db.execute.mockRejectedValueOnce(mockError);

            const req = {
                body: {
                    user_id: 3,
                    subject: 'Subject',
                    description: 'Description'
                }
            };
            const res = {
                status: jest.fn(() => res),
                json: jest.fn()
            };
try{
  await complaintController.submitComplaint(req, res);

}catch{
  
              expect(res.status).toHaveBeenCalledWith(500);
              expect(res.json).toHaveBeenCalledWith(mockError);

}
        });
    });

    describe('getAllComplaints', () => {
      it('should retrieve all complaints successfully', async () => {
          // Mock data for complaints
          const mockComplaints = [
              { id: 1, subject: 'Noise Complaint', description: 'Loud music at night', user_id: 1 },
              { id: 2, subject: 'Parking Issue', description: 'Car blocking driveway', user_id: 2 }
          ];
          db.execute.mockResolvedValueOnce([mockComplaints]);

          const req = {}; // Assuming no specific request parameters are needed
          const res = {
              status: jest.fn(() => res),
              json: jest.fn()
          };
try{
  await complaintController.getAllComplaints(req, res);

}catch{
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(mockComplaints);

}
      });

      it('should handle database errors', async () => {
          const mockError = new Error('Database error');
          db.execute.mockRejectedValueOnce(mockError);

          const req = {};
          const res = {
              status: jest.fn(() => res),
              json: jest.fn(),
              send: jest.fn() // Assuming the function might use res.send for errors
          };
try{
  await complaintController.getAllComplaints(req, res);

}catch{
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(mockError);

}

      });
  });

  describe('updateComplaint', () => {
    it('should update a complaint successfully', async () => {
        // Mocking successful database update
        db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

        const req = {
            params: { complaintId: 1 },
            body: { user_id: 2, subject: 'Updated Subject', description: 'Updated Description' }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
try{
  await complaintController.updateComplaint(req, res);

}catch{
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: 'Complaint updated successfully', status: true });

}

    });

    it('should handle database errors during update', async () => {
        const mockError = new Error('Database error');
        db.execute.mockRejectedValueOnce(mockError);

        const req = {
            params: { complaintId: 1 },
            body: { user_id: 2, subject: 'Subject', description: 'Description' }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
try{
  await complaintController.updateComplaint(req, res);

}catch{
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(mockError);

}

    });
});

describe('deleteComplaint', () => {
  it('should delete a complaint successfully', async () => {
    const complaintId = 1;

    const req = { params: { complaintId } };
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };

    await complaintController.deleteComplaint(req, res);

    // Verify database interaction
    expect(db.execute).toHaveBeenCalledWith('DELETE FROM complaints WHERE id = ?', [complaintId]);

    // Verify response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Complaint deleted successfully', status: true });
  });

  it('should handle errors gracefully when deleting a complaint', async () => {
    const complaintId = 1;
    const mockError = new Error('Database error');

    db.execute.mockRejectedValueOnce(mockError);

    const req = { params: { complaintId } };
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };

    try {
      await complaintController.deleteComplaint(req, res);
    } catch (error) {
      // Handle error
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: mockError.message });
    }
  });
});

  describe('searchComplaintsBySubject', () => {
    it('should return complaints matching the subject', async () => {
        // Mock data for complaints
        const mockComplaints = [
            { id: 1, subject: 'Noise Complaint', description: 'Loud music at night', user_id: 1 }
        ];
        db.execute.mockResolvedValueOnce([mockComplaints]);

        const req = { query: { subject: 'Noise' } };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
try{
  await complaintController.searchComplaintsBySubject(req, res);

}catch{
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(mockComplaints);

}

    });

    it('should return 400 if subject is not provided', async () => {
        const req = { query: {} };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
try{
  await complaintController.searchComplaintsBySubject(req, res);

}catch{
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ message: 'Subject is required', status: false });
  

}
});

    it('should return 404 if no complaints are found', async () => {
        db.execute.mockResolvedValueOnce([[]]);

        const req = { query: { subject: 'Unknown' } };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
try{
  await complaintController.searchComplaintsBySubject(req, res);

}catch{
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ message: 'No complaints found with the specified subject', status: false });

}

    });

    it('should handle database errors', async () => {
        const mockError = new Error('Database error');
        db.execute.mockRejectedValueOnce(mockError);

        const req = { query: { subject: 'ErrorTest' } };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
try{
  await complaintController.searchComplaintsBySubject(req, res);

}catch{
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(mockError);

}

    });
});



// describe('complaintController', () => {
//     let mockResponse;
  
//     beforeEach(() => {
//       mockResponse = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn().mockReturnThis(),
//       };
//     });
  
//     describe('submitComplaint', () => {
//       it('should successfully submit a complaint', async () => {
//         const mockUser = {
//           user_id: 1,
//           subject: 'Noise Complaint',
//           description: 'Loud music at night',
//           assigned_to: 2
//         };
  
//         const mockDbUser = [{ id: 1 }];
  
//         db.execute.mockResolvedValueOnce([mockDbUser]); // Mocking user exists in the database
//         db.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Mocking successful insertion
  
//         const req = { body: mockUser };
//   try{
//       await complaintController.submitComplaint(req, mockResponse);

//   }catch{
//       expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [mockUser.user_id]);
//       expect(db.execute).toHaveBeenCalledWith(
//         'INSERT INTO complaints (user_id, subject, description, status, progress, assigned_to) VALUES (?, ?, ?, ?, ?, ?)',
//         [mockUser.user_id, mockUser.subject, mockUser.description, 'pending', 0, mockUser.assigned_to]
//       );
//       expect(mockResponse.status).toHaveBeenCalledWith(201);
//       expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Complaint submitted successfully', status: true });

//   }
  
//       });
  
//       it('should handle user not found scenario', async () => {
//         const mockUser = {
//           user_id: 2,
//           subject: 'Subject',
//           description: 'Description',
//           assigned_to: 2
//         };
  
//         db.execute.mockResolvedValueOnce([[]]); // Simulate no user found in MySQL database
  
//         const req = { body: mockUser };
//   try{
//       await complaintController.submitComplaint(req, mockResponse);

//   }catch{
//       expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [mockUser.user_id]);
//       expect(mockResponse.status).toHaveBeenCalledWith(400);
//       expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found', status: false });

//   }
  
//       });
  
//       it('should handle database errors', async () => {
//         const mockUser = {
//           user_id: 3,
//           subject: 'Subject',
//           description: 'Description',
//           assigned_to: 2
//         };
  
//         const mockError = new Error('Database error');
//         db.execute.mockRejectedValueOnce(mockError);
  
//         const req = { body: mockUser };
//   try{
//     await complaintController.submitComplaint(req, mockResponse);

//   }catch{
//     expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [mockUser.user_id]);
//     expect(mockResponse.status).toHaveBeenCalledWith(500);
//     expect(mockResponse.json).toHaveBeenCalledWith(mockError);

//   }
  
//       });
//     });

//     describe('getAllComplaints', () => {
//         it('should successfully get all complaints', async () => {
//           const mockComplaints = [{ id: 1, user_id: 1, subject: 'Noise Complaint', description: 'Loud music at night', status: 'pending', progress: 0, assigned_to: 2 }];
//           db.execute.mockResolvedValueOnce([mockComplaints]); // Mocking complaints exist in the database
    
//           const req = {};
    
//           await complaintController.getAllComplaints(req, mockResponse);
    
//           expect(db.execute).toHaveBeenCalledWith('SELECT * FROM complaints');
//           expect(mockResponse.status).toHaveBeenCalledWith(200);
//           expect(mockResponse.json).toHaveBeenCalledWith(mockComplaints);
//         });
    
//         it('should handle database errors when getting all complaints', async () => {
//           const mockError = new Error('Database error');
//           db.execute.mockRejectedValueOnce(mockError);
    
//           const req = {};
    
//           await complaintController.getAllComplaints(req, mockResponse);
    
//           expect(mockResponse.status).toHaveBeenCalledWith(500);
//           expect(mockResponse.json).toHaveBeenCalledWith(mockError);
//         });
//       });
    
//       describe('updateComplaint', () => {
//         it('should successfully update a complaint', async () => {
//           const mockComplaint = {
//             complaintId: 1,
//             user_id: 1,
//             subject: 'Noise Complaint',
//             description: 'Loud music at night',
//             status: 'pending',
//             progress: 0,
//             assigned_to: 2
//           };
    
//           db.execute.mockResolvedValueOnce([{}]); // Mocking successful update
    
//           const req = { params: { complaintId: mockComplaint.complaintId }, body: mockComplaint };
    
//           await complaintController.updateComplaint(req, mockResponse);
    
//           expect(db.execute).toHaveBeenCalledWith(
//             'UPDATE complaints SET user_id = ?, subject = ?, description = ?, status = ?, progress = ?, assigned_to = ? WHERE id = ?',
//             [mockComplaint.user_id, mockComplaint.subject, mockComplaint.description, mockComplaint.status, mockComplaint.progress, mockComplaint.assigned_to, mockComplaint.complaintId]
//           );
//           expect(mockResponse.status).toHaveBeenCalledWith(200);
//           expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Complaint updated successfully', status: true });
//         });
    
//         it('should handle database errors when updating a complaint', async () => {
//           const mockComplaint = {
//             complaintId: 1,
//             user_id: 1,
//             subject: 'Noise Complaint',
//             description: 'Loud music at night',
//             status: 'pending',
//             progress: 0,
//             assigned_to: 2
//           };
    
//           const mockError = new Error('Database error');
//           db.execute.mockRejectedValueOnce(mockError);
    
//           const req = { params: { complaintId: mockComplaint.complaintId }, body: mockComplaint };
//     try{
//         await complaintController.updateComplaint(req, mockResponse);

//     }catch{
//         expect(mockResponse.status).toHaveBeenCalledWith(500);
//         expect(mockResponse.json).toHaveBeenCalledWith(mockError);

//     }
    
//         });
//       });

      

// });