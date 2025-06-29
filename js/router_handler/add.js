// 点击登录时处理函数
// 导入数据库操作模块
const db = require('../db/index')
// 导入加密模块
const bcrypt = require('bcryptjs')


exports.register = (req, res) => {
    // res.send('ok')
    const userinfo = req.body
    // console.log(userinfo)
    const sqlStr = 'select * from user_information where username=?'
    db.query(sqlStr,  userinfo.username , (err, results) => {
        if (err) return res.cc(err)
        if (results.length > 0) return res.cc('用户名已存在')
        // 对密码进行加密处理
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // console.log(userinfo)
        // 将加密的密码插入数据库
        const sql = 'insert into user_information set ?'
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => { 
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('注册失败')
            res.cc('注册成功', 0)
            // 向第二个表添加空数据
            const sqlStr = `INSERT INTO personal_information () VALUES ()`
            db.query(sqlStr, (err, results) => { })
        })
    })
}


