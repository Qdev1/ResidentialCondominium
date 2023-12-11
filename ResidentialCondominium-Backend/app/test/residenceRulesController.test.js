const db = require('../config/db');
const residenceRulesController = require('../controllers/residenceRulesController');

jest.mock('../config/db');

describe('residenceRulesController', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('getAllResidenceRules', () => {
    it('should successfully get all residence rules', async () => {
      const req = {};

      const mockRules = [
        { id: 1, title: 'Rule 1', content: 'Rule 1 content' },
        { id: 2, title: 'Rule 2', content: 'Rule 2 content' }
      ];
      db.execute.mockResolvedValueOnce([mockRules]);

      await residenceRulesController.getAllResidenceRules(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM residence_rules');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockRules);
    });

    it('should handle database errors when getting all residence rules', async () => {
      const req = {};

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      await residenceRulesController.getAllResidenceRules(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('addResidenceRule', () => {
    it('should successfully add a residence rule', async () => {
      const req = {
        body: {
          title: 'Test Rule',
          content: 'Test Rule Content'
        }
      };

      await residenceRulesController.addResidenceRule(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO residence_rules (title, content) VALUES (?, ?)',
        [req.body.title, req.body.content]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Residence rule added successfully', status: true });
    });

    it('should handle database errors when adding a residence rule', async () => {
      const req = {
        body: {
          title: 'Test Rule',
          content: 'Test Rule Content'
        }
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      await residenceRulesController.addResidenceRule(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });
  describe('updateResidenceRule', () => {
    it('should successfully update a residence rule', async () => {
      const req = {
        params: {
          ruleId: 1
        },
        body: {
          title: 'Test Rule',
          content: 'Test Rule Content'
        }
      };

      await residenceRulesController.updateResidenceRule(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'UPDATE residence_rules SET title = ?, content = ? WHERE id = ?',
        [req.body.title, req.body.content, req.params.ruleId]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Residence rule updated successfully', status: true });
    });

    it('should handle database errors when updating a residence rule', async () => {
      const req = {
        params: {
          ruleId: 1
        },
        body: {
          title: 'Test Rule',
          content: 'Test Rule Content'
        }
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      await residenceRulesController.updateResidenceRule(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteResidenceRule', () => {
    it('should successfully delete a residence rule', async () => {
      const req = {
        params: {
          ruleId: 1
        }
      };

      await residenceRulesController.deleteResidenceRule(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'DELETE FROM residence_rules WHERE id = ?',
        [req.params.ruleId]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Residence rule deleted successfully', status: true });
    });

    it('should handle database errors when deleting a residence rule', async () => {
      const req = {
        params: {
          ruleId: 1
        }
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      await residenceRulesController.deleteResidenceRule(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getResidenceRuleById', () => {
    it('should successfully get a residence rule by id', async () => {
      const req = {
        params: {
          ruleId: 1
        }
      };

      const mockRule = [{ id: 1, title: 'Rule 1', content: 'Rule 1 content' }];
      db.execute.mockResolvedValueOnce([mockRule]);

      await residenceRulesController.getResidenceRuleById(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM residence_rules WHERE id = ?', [req.params.ruleId]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockRule[0]);
    });

    it('should handle errors when residence rule not found', async () => {
      const req = {
        params: {
          ruleId: 1
        }
      };

      const mockRule = [];
      db.execute.mockResolvedValueOnce([mockRule]);

      await residenceRulesController.getResidenceRuleById(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM residence_rules WHERE id = ?', [req.params.ruleId]);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Residence rule not found', status: false });
    });

    it('should handle database errors when getting a residence rule by id', async () => {
      const req = {
        params: {
          ruleId: 1
        }
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      await residenceRulesController.getResidenceRuleById(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

  describe('searchResidenceRules', () => {
    it('should successfully search residence rules', async () => {
      const req = {
        query: {
          query: 'Rule 1'
        }
      };

      const mockRules = [{ id: 1, title: 'Rule 1', content: 'Rule 1 content' }];
      db.execute.mockResolvedValueOnce([mockRules]);

      await residenceRulesController.searchResidenceRules(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT * FROM residence_rules WHERE title LIKE ? OR content LIKE ?',
        [`%${req.query.query}%`, `%${req.query.query}%`]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockRules);
    });

    it('should handle errors when no residence rules found with the specified query', async () => {
      const req = {
        query: {
          query: 'Rule 1'
        }
      };

      const mockRules = [];
      db.execute.mockResolvedValueOnce([mockRules]);

      await residenceRulesController.searchResidenceRules(req, mockResponse);

      expect(db.execute).toHaveBeenCalledWith(
        'SELECT * FROM residence_rules WHERE title LIKE ? OR content LIKE ?',
        [`%${req.query.query}%`, `%${req.query.query}%`]
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'No residence rules found with the specified query', status: false });
    });

    it('should handle database errors when searching residence rules', async () => {
      const req = {
        query: {
          query: 'Rule 1'
        }
      };

      const mockError = new Error('Database error');
      db.execute.mockRejectedValueOnce(mockError);

      await residenceRulesController.searchResidenceRules(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(mockError);
    });
  });

});