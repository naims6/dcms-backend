import { Router } from 'express';
import { roleController } from './role.controller.js';
import { CreateRoleSchema } from './role.validation.js';
import validateRequest from '../../middlewares/validateRequest.js';

const router: Router = Router();

// create role
router.post(
  '/create',
  validateRequest(CreateRoleSchema),
  roleController.createRole,
);

// get all roles
router.get('/get-all', roleController.getAllRole);

// get update
router.patch('/update/:roleId', roleController.updateRole);

// delete role
router.delete('/delete/:roleId', roleController.deleteRole);

// get role permissions by role id
router.get(
  '/get-role-permissions/:roleId',
  roleController.getPermissionsByRoleId,
);

export const RoleRoutes = router;
