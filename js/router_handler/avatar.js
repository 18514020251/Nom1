const db = require('../db');

// 更新用户头像
exports.updateAvatar = (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            status: 400,
            error: 'FILE_MISSING',
            message: '请选择要上传的头像文件'
        });
    }

    try {
        const userId = req.user.user_id;
        
        const avatarUrl = `${req.protocol}://${req.get('host')}/avatars/${req.file.filename}`;
        
        const updateQuery = 'UPDATE personal_information SET avatar = ? WHERE user_Id = ?';
        db.query(updateQuery, [avatarUrl, userId], (err, result) => {
            if (err) {
                console.error('数据库更新失败:', err);
                return res.status(500).json({
                    status: 500,
                    error: 'DATABASE_ERROR',
                    message: '更新头像失败'
                });
            }
            
            res.status(200).json({
                status: 0,
                message: '头像更新成功',
                data: {
                    avatarUrl,
                    userId
                }
            });
        });
    } catch (error) {
        console.error('头像更新失败:', error);
        res.status(500).json({
            status: 500,
            error: 'SERVER_ERROR',
            message: '服务器处理头像时发生错误'
        });
    }
};

// 获取用户头像
exports.getUserAvatar = (req, res) => {
    try {
        const userId = req.user.user_id;
        
        // 从数据库获取用户头像URL
        const query = 'SELECT avatar FROM personal_information WHERE user_Id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('数据库查询失败:', err);
                return res.status(500).json({
                    status: 500,
                    error: 'DATABASE_ERROR',
                    message: '获取用户头像失败'
                });
            }
            
            if (results.length === 0) {
                return res.status(404).json({
                    status: 404,
                    error: 'USER_NOT_FOUND',
                    message: '用户不存在'
                });
            }
            
            const avatarUrl = results[0].avatar;
            res.status(200).json({
                status: 0,
                data: {
                    avatarUrl
                }
            });
        });
    } catch (error) {
        console.error('获取用户头像失败:', error);
        res.status(500).json({
            status: 500,
            error: 'SERVER_ERROR',
            message: '服务器内部错误'
        });
    }
};