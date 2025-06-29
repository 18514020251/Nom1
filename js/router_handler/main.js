const db = require('../db/index')

const sqlall = 'select count(*) from tasktable where user_Id = ?'



exports.mainpost = (req, res) => {
    try {
        console.log('主文件返回数据', req.body)
        const userId = req.body.user_id
        console.log('返回id', userId)
        if (!userId) {
            console.log('没有id')
            return res.cc('没有id' , 401)
        }
        const { taskname, detailed, Deadline } = req.body
        console.log('返回数据', taskname, detailed, Deadline)
        
    }catch (err) {
        res.cc(err)
    }
}

exports.mainget = (req, res) => {
    try {
        console.log('请求头:', req.headers);
        const user_id = req.user.user_id
        console.log('id:' , user_id)
        console.log('请求体:', req.query);
        const sql = `select * from personal_information where user_Id = ?`
        db.query(sql, user_id, (err, results) => {
            if (err) return res.cc(err)
            if (results.length === 0) return res.cc('没有数据', 401)
            res.send({
                status: 0,
                message: '获取成功',
                data: results,
            })
        })
    } catch (err) {
        res.cc(err)
    }
}   

exports.add_task_information = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { taskname, detailed, Deadline } = req.body;
        
        // 插入新任务
        const insertSql = `INSERT INTO tasktable (user_Id, taskname, detailed, Deadline) VALUES(?,?,?,?)`;
        const insertResult = await new Promise((resolve, reject) => {
            db.query(insertSql, [user_id, taskname, detailed, Deadline], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
        
        if (insertResult.affectedRows !== 1) {
            return res.cc('添加失败', 401);
        }
        
        // 获取任务总数
        const totalResult = await new Promise((resolve, reject) => {
            db.query(sqlall, [user_id], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
        
        // 获取所有任务
        const tasksResult = await new Promise((resolve, reject) => {
            const sqlStr = `SELECT * FROM tasktable WHERE user_id = ? and Completion_status = 0`;
            db.query(sqlStr, [user_id], (err, results) => {
                if (err) reject(err);
                console.log('获取所有任务', results)
                resolve(results);
            });
        });
        
        res.send({
            status: 0,
            message: '添加成功',
            data: tasksResult,
            all: totalResult[0]['count(*)'] 
        });
        
    } catch (err) {
        res.cc(err);
    }
}

exports.tasks = (req, res) => {
    try {
        console.log('请求头:', req.headers)
        const user_id = req.user.user_id
        console.log('id:', user_id)
        console.log('请求体:', req.query)
        const sql = `select * from tasktable where user_Id = ? and Completion_status = 0`
        db.query(sql, user_id, (err, results) => {
            if (err) return res.cc(err)
            if (results.length === 0) return res.cc('没有数据', 401)
            res.send({
                status: 0,
                message: '获取成功',
                data: results
            })
        })
    }catch (err) {
        res.cc(err)
    }
}



// 更改事务
exports.update = (req, res) => {
    try {
        console.log('请求头:', req.headers);
        const user_id = req.user.user_id
        console.log('id:', user_id)
        console.log('请求体:', req.body);
        const user_Id = req.params.taskId
        const { taskname, detailed, Deadline } = req.body
        const sql = 'update tasktable set taskname = ?, detailed = ? ,Deadline = ? where `num-id` = ? and Completion_status = 0'
        db.query(sql, [taskname, detailed, Deadline, user_Id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新失败', 401)
            console.log('更新成功', results)
            const sqlStr = `select * from tasktable where user_id = ?`
            db.query(sqlStr, user_id, (err, results) => {
                if (err) return res.cc(err)
                if (results.length === 0) return res.cc('没有数据', 401)
                res.send({
                    status: 0,
                    message: '获取成功',
                    data: results
                })
            })
        })
    }catch (err) {
        res.cc(err)
    }
}


exports.deleteTasks = (req, res) => {
    try {
        const user_id = req.user.user_id;
        console.log('用户ID:', user_id);
        const taskId = req.params.taskId;

        const deleteSql = 'DELETE FROM tasktable WHERE `num-id` = ?';
        const selectSql = 'SELECT * FROM tasktable WHERE user_Id = ?';
        
        db.query(deleteSql, [taskId], (err, deleteResults) => {
            if (err) {
                console.error('删除操作数据库错误:', err);
                return res.status(500).json({
                    status: 1,
                    message: '服务器错误，删除失败',
                    error: err.message
                });
            }
            
            if (deleteResults.affectedRows !== 1) {
                return res.status(404).json({
                    status: 1,
                    message: '删除失败，未找到该任务'
                });
            }
            
            db.query(selectSql, [user_id], (err, selectResults) => {
                if (err) {
                    console.error('查询操作数据库错误:', err);
                    return res.status(500).json({
                        status: 1,
                        message: '服务器错误，查询失败',
                        error: err.message
                    });
                }
                
                res.json({
                    status: 0,
                    message: '任务删除成功',
                    data: selectResults
                });
            });
        });
        
    } catch (err) {
        console.error('控制器逻辑错误:', err);
        res.status(500).json({
            status: 1,
            message: '服务器内部错误',
            error: err.message
        });
    }
};



exports.finish = (req, res) => {
    try {
        const taskId = req.params.taskId;
        const user_id = req.user.user_id;
        console.log('请求头ID', taskId);
        const qsl = 'update tasktable set Completion_status = 1 where `num-id` = ?'
        db.query(qsl, taskId, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新失败', 401)
            console.log('更新成功', results)
            const sqlStr = `select * from tasktable where user_id = ? and Completion_status = 0`
            db.query(sqlStr, user_id, (err, results) => {
                if (err) return res.cc(err)
                if (results.length === 0) return res.cc('没有数据', 401)
                res.send({
                    status: 0,
                    message: '获取成功',
                    data: results
                })
            })
        })
    }
    catch (err) {
        console.log(err);  
    }
}

exports.finishTasks = (req, res) => {
    try {
        const user_id = req.user.user_id;
        console.log('用户ID:', user_id);
        const sqlStr = 'select * from tasktable where user_id = ? and Completion_status = 1'
        db.query(sqlStr, user_id, (err, results) => {
            if (err) return res.cc(err)
            if (results.length === 0) return res.cc('没有数据', 401)
            res.send({
                status: 0,
                message: '获取成功',
                data: results
            })
        })
    } catch (err) {
        console.log(err);
    }
}



exports.deleteFinishedTasks = (req, res) => {
    try {
        const taskId = req.params.taskId;
        const user_id = req.user.user_id;
        console.log('请求头ID', taskId);
        const qsl = 'delete from tasktable where `num-id` = ?'
        db.query(qsl, taskId, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新失败', 401)
            console.log('更新成功', results)
            const sqlStr = `select * from tasktable where user_id = ? and Completion_status = 1`
            db.query(sqlStr, user_id, (err, results) => {
                if (err) return res.cc(err)
                if (results.length === 0) return res.cc('没有数据', 401)
                res.send({
                    status: 0,
                    message: '获取成功',
                })
            })
        })
    }catch (err) {
        console.log(err);
    }
}


exports.completedNum = (req, res) => {
    try {
        const user_id = req.user.user_id;
        console.log('用户ID:', user_id);
        
        const sqlStr = 'SELECT COUNT(*) AS count FROM tasktable WHERE user_id = ? AND Completion_status = 1';
        
        db.query(sqlStr, user_id, (err, results) => {
            if (err) {
                console.error('数据库查询错误:', err);
                return res.status(500).json({
                    status: 1,
                    message: '数据库查询失败',
                    error: err.message
                });
            }
            
            const count = results[0]?.count || 0;
            
            res.json({
                status: 0,
                message: '获取成功',
                data: count
            });
        });
    } catch (err) {
        console.error('服务器错误:', err);
        res.status(500).json({
            status: 1,
            message: '服务器内部错误',
            error: err.message
        });
    }
}

exports.logout = (req, res) => {
    try {
        const user_id = req.user.user_id;
        console.log('用户ID:', user_id);

        const sqlStr = 'DELETE FROM user_information WHERE user_id = ?;';

        db.query(sqlStr, user_id, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新失败', 401)
            // console.log('更新成功', results)
            res.send({
                status: 0,
                message: '删除成功',
            })
        })
    }
    catch (err) {
        console.log(err);
    }
}