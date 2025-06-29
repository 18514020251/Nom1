const db = require('../db/index')

exports.userinfo = (req, res) => {
    try {
    
        console.log('请求头:', req.headers);
        
        const userId = req.user.user_id;
        console.log('从req.user获取的user_id:', userId);
        
        if (!userId) {
            console.error('user_id未定义');
            return res.cc('无法获取用户ID', 401);
        }
        
        const { username, age, gender, email } = req.body;
        console.log('请求体数据:', { username, age, gender, email });
        
        let genderValue;
        if (gender === '男') {
            genderValue = 'male';
        } else if (gender === '女') {
            genderValue = 'female';
        } else {
            console.error('无效的性别:', gender);
            return res.cc('无效的性别', 400);
        }
        
        // 执行数据库更新 
        const sqlStr = `UPDATE personal_information 
                       SET username = ?, age = ?, gender = ?, email = ?
                       WHERE user_id = ?`;
        
        console.log('执行SQL:', sqlStr);
        console.log('参数:', [username, age, genderValue, email, userId]);
        
        db.query(sqlStr, [username, age, genderValue, email, userId], (err, results) => {
            if (err) {
                console.error('SQL错误详情:', {
                    sql: sqlStr,
                    params: [username, age, genderValue, email, userId],
                    error: err
                });
                return res.cc('数据库操作失败: ' + err.message);
            }
            
            console.log('数据库操作结果:', results);
            
            if (results.affectedRows !== 1) {
                console.log('影响行数:', results.affectedRows);
                console.log('可能的原因: 用户不存在或数据未变化');
                return res.cc('更新用户信息失败！');
            }
            
            res.send({
                status: 0,
                message: '更新用户信息成功！'
            });
        });
    } catch (err) {
        console.error('处理请求失败:', err);
        res.cc('服务器内部错误', 500);
    }
}