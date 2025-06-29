const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer'); 

// 配置 CORS
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        });
    };
    next();
});

app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));

// 路由
const userRouter = require('./router/add');
const loginRouter = require('./router/login');
const userinfoRouter = require('./router/userinfo');
const mainRouter = require('./router/main');
const avatarRouter = require('./router/avatar');

app.use('/register', userRouter);
app.use('/my', loginRouter);
app.use('/my', userinfoRouter);
app.use('/my', mainRouter);
app.use('/my', avatarRouter); 

app.use((err, req, res, next) => {
    console.error('全局错误:', err.stack);
    
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            status: 400,
            error: 'UPLOAD_ERROR',
            message: err.message || '文件上传失败',
            details: {
                code: err.code,
                field: err.field
            }
        });
    }

    if (err.message.includes('path-to-regexp')) {
        return res.status(500).json({
            status: 500,
            message: '路由配置错误',
            details: err.message
        });
    }
    
    res.status(500).json({
        status: 500,
        message: '服务器内部错误'
    });
});


const PORT = 1024;
app.listen(PORT, () => {
    console.log(`服务器已启动, 端口号: ${PORT}`);
});