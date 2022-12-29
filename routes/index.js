import express from "express";

import { FetchUsers, AddUser, UpdateUser, DeleteUser, Register, Login, Logout, GetCurrentUser } from "../controllers/Users.js";
import { GetWithdrawal, GetCurrentUserWithdrawals,
        UpdateWithdrawalStatus, InsertWithdrawal,
        UpdateWithdrawal, DeleteWithdrawal,
        FetchWithdrawals } from "../controllers/Withdrawals.js";

import { CheckToken } from "../middleware/CheckToken.js";
import { CheckTokenAdmin } from "../middleware/CheckTokenAdmin.js";
import { RefreshToken } from "../controllers/RefreshToken.js";
 
const router = express.Router();

// Users
 
router.get('/usercurrent', CheckToken, GetCurrentUser);
router.post('/register', Register);
router.post('/login', Login);
router.delete('/logout', Logout);
router.get('/tokenrefresh', RefreshToken);

router.get('/users', CheckTokenAdmin, FetchUsers);
router.post('/users', CheckTokenAdmin, AddUser);
router.put('/users/:id', CheckTokenAdmin, UpdateUser);
router.delete('/users/:id', CheckTokenAdmin, DeleteUser);

// Withdrawals

router.get('/withdrawals_current', CheckToken, GetCurrentUserWithdrawals);
router.get('/withdrawals/:id', GetWithdrawal);

router.get('/withdrawals_admin', CheckTokenAdmin, FetchWithdrawals);
router.post('/withdrawals', CheckTokenAdmin, InsertWithdrawal);
router.put('/withdrawals/:id', CheckTokenAdmin, UpdateWithdrawal);
router.delete('/withdrawals/:id', CheckTokenAdmin, DeleteWithdrawal);
// router.patch('/withdrawals/update/:id', CheckTokenAdmin, UpdateWithdrawalStatus);

 
export default router;