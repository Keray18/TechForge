const express = require('express');
const {
    submitProject,
    getAllProjects,
    getClientProjects,
    acceptProject,
    rejectProject,
    completeProject,
    getProjectById,
    filterProjects
} = require('../controllers/projectController');
const { protect, requirePermission, requireRole, requireAnyPermission } = require('../middleware/authMiddleware');
const { PERMISSIONS, ROLES } = require('../config/roles');
const multer = require('multer');


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// client Routes
router.post('/submit', protect, upload.single('document'), requirePermission(PERMISSIONS.CREATE_PROJECT), submitProject);
router.get('/client', protect, requirePermission(PERMISSIONS.VIEW_OWN_PROJECTS), getClientProjects);

// Admin/Employee routes - SPECIFIC ROUTES FIRST
router.get('/filter', 
    protect, 
    requireRole(ROLES.EMPLOYEE, ROLES.ADMIN),
    requirePermission(PERMISSIONS.VIEW_ALL_PROJECTS), 
    filterProjects
);

router.get('/', protect, 
    requireRole(ROLES.EMPLOYEE, ROLES.ADMIN),
    requirePermission(PERMISSIONS.VIEW_ALL_PROJECTS), getAllProjects
);

router.put('/:projectId/accept', 
    protect, 
    requireRole(ROLES.EMPLOYEE, ROLES.ADMIN),
    requirePermission(PERMISSIONS.ACCEPT_PROJECT), acceptProject
);

router.put('/:projectId/reject', 
    protect, 
    requireRole(ROLES.EMPLOYEE, ROLES.ADMIN),
    requirePermission(PERMISSIONS.REJECT_PROJECT), rejectProject
);

router.put('/:projectId/complete', 
    protect, 
    requireRole(ROLES.EMPLOYEE, ROLES.ADMIN),
    requirePermission(PERMISSIONS.COMPLETE_PROJECT), completeProject
);

// PARAMETER ROUTES LAST
router.get('/:projectId', protect, requireAnyPermission([PERMISSIONS.VIEW_OWN_PROJECTS, PERMISSIONS.VIEW_ALL_PROJECTS]), getProjectById);

module.exports = router;