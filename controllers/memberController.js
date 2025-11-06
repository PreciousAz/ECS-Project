const express = require("express");
const verifyToken = require('../verifications/authMiddleware');
const router = express.Router();
const {memberRequest, getAllMembers, getAllMemberRequest, deletMemberRequest,checkRequest,getRequest,deactivateMember,getNonDeactivatedMembers,restoreDeactivatedMember} = require('../blogics/member');

 // 📌 Send member request endpoint
router.post("/api/member/request", verifyToken, memberRequest);

 // 📌 Get all members endpoint
router.get('/api/member/all', getAllMembers);

 // 📌 Get non deactivated members endpoint
router.get('/api/member/active', getNonDeactivatedMembers);

 // 📌 Get all member request endpoint
router.get('/api/member/all-request', getAllMemberRequest);

 // 📌 Delete request endpoint
router.delete('/api/member/remove', deletMemberRequest);

 // 📌 Get all member request endpoint
router.get('/api/member/request',getRequest);

 // 📌 Check member request endpoint
router.get('/api/member/:id',checkRequest);

 // 📌 Deactivate a member endpoint
router.patch('/api/member/deactivate/:id',deactivateMember);

 // 📌 Restore deactivated member endpoint
router.patch('/api/member/restore/:id',restoreDeactivatedMember);



 // 📌 Exporting this router
module.exports = router;