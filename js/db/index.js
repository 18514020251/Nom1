const mysql = require('mysql');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '0d000721',
    database: 'task management system',
    connectionLimit: 10
});


pool.getConnection((err, connection) => {
    if (err) {
        console.error('数据库连接失败:', err.message);
    } else {
        console.log('数据库连接成功');
        connection.release(); 
    }
});

const sqlStr = 'select * from user_information join personal_information on user_information.user_Id = personal_information.user_Id '
pool.query(sqlStr, (err, result) => {
    if (err) {
        console.error('查询失败:', err.message);
    } else {
        console.log('查询结果:', result);
    }
})

// 导出连接池
module.exports = pool;