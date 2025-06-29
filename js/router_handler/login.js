// ./router_handler/login.js
const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

exports.login = (req, res) => {
    const userinfo = req.body
    console.log(userinfo);
    
    
    const sqlStr = 'SELECT * FROM user_information WHERE username = ?'
    db.query(sqlStr, [userinfo.username], (err, results) => {
        if (err) {
            console.error(err);
            return res.cc(err)
        }
        
        if (results.length !== 1) {
            console.warn('[登录] 用户不存在:', userinfo.username);
            return res.cc('用户不存在')
        }
        
        const user = results[0];
        console.log('[登录] 数据库返回的用户对象:', user); 
        
        let userId = user.user_id; 
        
        if (!userId) {
            console.error('[登录] 无法获取用户ID，尝试其他字段名');
            const possibleFields = ['user_id', 'id', 'userId', 'user_Id'];
            for (const field of possibleFields) {
                if (user[field]) {
                    userId = user[field];
                    console.log(`[登录] 使用备用字段名 ${field}: ${userId}
                        `);
                    break;
                }
            }
        }
        
        if (!userId) {
            console.error('[登录] 用户对象缺少ID字段');
            return res.cc('用户数据异常');
        }
        
        const passwordMatch = bcrypt.compareSync(userinfo.password, user.password)
        
        if (!passwordMatch) {
            console.warn('[登录] 密码错误:', userinfo.username);
            return res.cc('密码错误')
        }
        
        const tokenPayload = { 
            user_id: userId, 
            username: user.username
        };
        console.log('[登录] Token负载:', tokenPayload);
        
        const token = jwt.sign(tokenPayload, config.jwtSecretKey, { expiresIn: '365d' })
        console.log('[登录] 生成的Token:', token);
        
        const sqlStr = 'select * from user_information join personal_information on user_information.user_Id = personal_information.user_Id '
        let ifOK = false;
        db.query(sqlStr, (err, result) => {
            if (err) {
                console.error('查询失败:', err.message);
            }
            console.log('查询结果:', userId);
            const sql1 = `SELECT * 
                        FROM user_information AS u
                        JOIN personal_information AS p 
                        ON u.user_Id = p.user_Id 
                        WHERE u.user_id = ${userId};`
            db.query(sql1, (err, result) => {
                if (err) {
                    console.error('查询失败:', err.message);
                }
                const age = result[0].age;
                console.log('查询结果:', age);
                console.log('查询结果:', result);
                if (age === null) {
                    ifOK = false;
                }else {
                    ifOK = true;
                }
                console.log('查询结果:', ifOK);
                res.send({
                    status: 0,
                    message: '登录成功',
                    token: 'Bearer ' + token,
                    ifOK: ifOK
                })
            })

        })
        
    })
}
