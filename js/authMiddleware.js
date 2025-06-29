const jwt = require('jsonwebtoken')
const config = require('./config')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('[中间件] 接收的Authorization头:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('[中间件] 无效的Authorization头格式');
        return res.status(401).json({ error: '无效的认证令牌格式' });
    }
    
    const token = authHeader.split(' ')[1];
    console.log('[中间件] 提取的Token:', token);
    
    if (!token) {
        console.error('[中间件] Token为空');
        return res.status(401).json({ error: '未提供认证令牌' });
    }
    
    try {
        const decoded = jwt.verify(token, config.jwtSecretKey);
        console.log('[中间件] 解码的Token内容:', decoded);
        
        if (!decoded.user_id) {
            console.error('[中间件] Token缺少user_id属性');
            return res.status(401).json({ error: '无效的Token内容' });
        }
        
        req.user = {
            user_id: decoded.user_id,
            username: decoded.username
        };
        console.log('[中间件] 挂载的用户信息:', req.user);
        
        next();
    } catch (err) {
        console.error('[中间件] Token验证失败:', err.message);
        res.status(401).json({ error: '无效的认证令牌' });
    }
};