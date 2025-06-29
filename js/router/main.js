const express = require('express')
const authMiddleware = require('../authMiddleware')

const router = express.Router()

const { mainpost , mainget , add_task_information ,tasks, update, deleteTasks, finish, finishTasks, deleteFinishedTasks, completedNum, logout } = require('../router_handler/main')

router.options('/', (req, res) => {
    res.sendStatus(200);
});

router.post('/mainpost', mainpost)
router.post('/mainget', authMiddleware,mainget)
router.post('/addInformation', authMiddleware, add_task_information)
router.get('/tasks' , authMiddleware , tasks)
router.post('/updateInformation/:taskId', authMiddleware, update)
router.delete('/deleteInformation/:taskId', authMiddleware, deleteTasks)
router.post('/finishTask/:taskId' , authMiddleware , finish)
router.get('/finishTasks', authMiddleware, finishTasks)
router.delete('/deleteFinishedTask/:taskId' , authMiddleware , deleteFinishedTasks)
router.get('/completedNum', authMiddleware, completedNum)
router.delete('/logout' , authMiddleware , logout)

module.exports = router