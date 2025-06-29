// 任务
let globalTasks = [];
// 任务ID
let currentDeleteId = null;
// 任务时间
let currentDeleteElement = null;
// 状态
let currentDeleteType = null;
// 唯一定时器
let searchTimeout = null;

const searchInput = document.getElementById('search');
const login = document.querySelector('.login');
const add = document.querySelector('.add');
const set = document.querySelector('.set');
const body = document.querySelector('body');
const add_user_form_close = document.querySelector('.add-user-form-close');
const overlay = document.querySelector('.overlay');
const setting_up = document.querySelector('.setting-up');
const userimg = document.querySelector('.personal_information_img img')
const imgbutton = document.querySelector('.img-button')
const add_user_form_submit = document.querySelector('.add-user-form-submit');
const setting_up_close = document.querySelector('.setting-up-close');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const deleteConfirm = document.getElementById('deleteConfirm');
const logoutButton = document.getElementById('logoutButton');
const logoutConfirm = document.getElementById('logoutConfirm');
const logoutConfirmBtn = document.getElementById('logoutConfirmBtn');
const logoutCancel = document.getElementById('logoutCancel');



setTimeout(() => {
    document.querySelector('.flaydiv').style.animation = 'none'
    document.querySelector('.flaydiv').style.animation = 'flyOut 1s ease-in-out forwards'
}, 500);

// 设置
logoutButton.addEventListener('click', function() {
    logoutConfirm.classList.add('show');
    overlay.classList.add('active');
});


logoutConfirmBtn.addEventListener('click', function () {
    axios.delete('http://127.0.0.1:1024/my/logout',{
        headers: {'Authorization': 'Bearer ' + token}
    })
    .then(response => {
        logoutConfirm.classList.remove('show');
        overlay.classList.remove('active');
        localStorage.removeItem('token');
        body.classList.add('side-out');
        showToast('用户已永久注销', 'success');
        setTimeout(() => window.location.href = '../html/login.html',500);
    }).catch(error => {
        console.error(error);
    })
});


logoutCancel.addEventListener('click', function() {
    logoutConfirm.classList.remove('show');
    overlay.classList.remove('active');
});


overlay.addEventListener('click', function() {
    logoutConfirm.classList.remove('show');
    overlay.classList.remove('active');
});

// 进度条
function updateDayProgress() {
    const now = new Date();
    const totalMilliseconds = 24 * 60 * 60 * 1000;
    const elapsedMilliseconds = now.getHours() * 60 * 60 * 1000 + 
                                now.getMinutes() * 60 * 1000 + 
                                now.getSeconds() * 1000 + 
                                now.getMilliseconds();
    const progress = elapsedMilliseconds / totalMilliseconds;
    const percentage = Math.round(progress * 100);
    
    const progressBar = document.getElementById('day-progress-bar');
    progressBar.style.width = percentage + '%';
    document.getElementById('progress-value').innerHTML = percentage + '%';
}

// 提示框
function showLoginPrompt() {
    const toast = document.getElementById('loginPrompt');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// 搜索框
searchInput.addEventListener('focus', function() {
    this.style.borderColor = 'rgba(240, 200, 132, 1)';
    this.style.boxShadow = '0 0 0 3px rgba(240, 200, 132, 0.34)';
});

searchInput.addEventListener('blur', function() {
    this.style.borderColor = '#ff6347';
    this.style.boxShadow = 'none';
});


function updateAvatar(avatarUrl) {
    // 更新设置面板的头像
    const avatarPreview = document.getElementById('avatarPreview');
    if (avatarUrl) {
        avatarPreview.innerHTML = `<img src="${avatarUrl}" alt="用户头像">`;
    } else {
        avatarPreview.innerHTML = `<i class="fa-solid fa-user"></i>`;
    }

    const topAvatar = document.querySelector('.personal_information_img img');
    if (topAvatar) {
        if (avatarUrl) {
            topAvatar.src = avatarUrl;
        } else {
            topAvatar.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/></svg>';
        }
    }

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.avatar = avatarUrl;
    localStorage.setItem('userData', JSON.stringify(userData));
}

// 头像

function setupAvatarUpload() {
    const avatarPreview = document.getElementById('avatarPreview');
    const avatarUpload = document.getElementById('avatarUpload');
    const avatarContainer = document.querySelector('.avatar-container');
    
    avatarContainer.addEventListener('click', () => {
        avatarUpload.click();
    });
    
    avatarUpload.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const token = localStorage.getItem('token');
            if (!token) {
                showToast('请先登录账号', 'error');
                return;
            }
            

            const file = this.files[0];
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                showToast('只支持 JPG, PNG, GIF 或 WEBP 格式的图片', 'error');
                return;
            }
            
            if (file.size > 2 * 1024 * 1024) {
                showToast('图片大小不能超过 2MB', 'error');
                return;
            }
            
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'avatar-loading';
            avatarContainer.appendChild(loadingOverlay);
            
            // 预览图片
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                avatarPreview.innerHTML = '';
                avatarPreview.appendChild(img);
            };
            reader.readAsDataURL(file);
            
            // 上传图片
            const formData = new FormData();
            formData.append('avatar', file);
            
            axios.post('http://localhost:1024/my/avatar', formData, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                if (response.data && response.data.status === 0) {
                    const avatarUrl = response.data.data.avatarUrl;
                    showToast('头像更新成功', 'success');
                    
                    const userData = JSON.parse(localStorage.getItem('userData') || {});
                    userData.avatar = avatarUrl;
                    localStorage.setItem('userData', JSON.stringify(userData));
                    
                    // 立即更新所有头像显示
                    updateAvatar(avatarUrl);
                } else {
                    const message = response.data.message || '头像上传失败';
                    showToast(message, 'error');
                }
            })
            .catch(error => {
                let message = '头像上传失败';
                if (error.response) {
                    // 服务器返回的错误信息
                    if (error.response.data && error.response.data.message) {
                        message = error.response.data.message;
                    }
                    // 特定错误代码处理
                    if (error.response.status === 400) {
                        message = '请求格式错误: ' + message;
                    } else if (error.response.status === 413) {
                        message = '图片文件太大';
                    }
                }
                showToast(message, 'error');
            })
            .finally(() => {
                // 移除加载动画
                setTimeout(() => {
                    if (avatarContainer.contains(loadingOverlay)) {
                        avatarContainer.removeChild(loadingOverlay);
                    }
                }, 500);
            });
        }
    });
}


function initializeApp() {
    userInformationRendering();
}

// 添加
function openAddForm() {
    overlay.classList.add('active');
    document.querySelector('.add-user-form').classList.add('active');
    document.querySelector('.add-user-form-title').innerHTML = '添加任务';
    
    const data = new Date();
    let year = data.getFullYear();
    let month = String(data.getMonth() + 1).padStart(2, '0');
    let day = String(data.getDate()).padStart(2, '0');
    let formattedDate = `${year}-${month}-${day}`

    const submitButton = document.querySelector('.add-user-form-submit');
    submitButton.textContent = '添加';
    delete submitButton.dataset.editId;
    
    document.getElementById('title').value = '';
    document.getElementById('detail').value = '';
    document.getElementById('deadline').value = formattedDate;
}

// 关闭添加
function closeAddForm() {
    overlay.classList.remove('active');
    document.querySelector('.add-user-form').classList.remove('active');
}

// 设置
function openSetting() {
    overlay.classList.add('active');
    setting_up.classList.add('active');
}

// 关闭设置
function closeSetting() {
    overlay.classList.remove('active');
    setting_up.classList.remove('active');
}

// 删除确定
function showDeleteConfirm(taskId, element, type) {
    currentDeleteId = taskId;
    currentDeleteElement = element;
    currentDeleteType = type;
    deleteConfirm.classList.add('show');
    overlay.classList.add('active');
}


// 关闭删除
function closeDeleteConfirm() {
    deleteConfirm.classList.remove('show');
    overlay.classList.remove('active');
    currentDeleteId = null;
    currentDeleteElement = null;
    currentDeleteType = null;
}

// 确定删除
function confirmDelete() {
    if (currentDeleteId && currentDeleteElement) {
        // 未完成
        if (currentDeleteType === 'task') {
            currentDeleteElement.classList.add('fade-out');
        } else {
            currentDeleteElement.classList.add('slide-out');
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('请先登录', 'error');
            return;
        }
        
        if (currentDeleteType === 'task') {
            axios.delete(`http://127.0.0.1:1024/my/deleteInformation/${currentDeleteId}`, {
                headers: {'Authorization': 'Bearer ' + token}
            })
            .then(response => {
                 setTimeout(() => {
                    globalTasks = globalTasks.filter(task => task['num-id'] != currentDeleteId);
                    renderTasks(globalTasks);
                    showToast('任务已成功删除', 'success');
                    closeDeleteConfirm();
                }, 500);
            })
            .catch(error => {
                currentDeleteElement.classList.remove('fade-out');
                showToast('删除任务失败，请重试', 'error');
                closeDeleteConfirm();
            });
        } else {
            axios.delete(`http://127.0.0.1:1024/my/deleteFinishedTask/${currentDeleteId}`, {
                headers: {'Authorization': 'Bearer ' + token}
            })
            .then(() => {
                setTimeout(() => {
                    // 渲染两个模块
                    fetchAndRenderCompletedCount(); 
                    fetchAndRenderFinishedTasks();
                    showToast('任务已永久删除', 'success');
                    closeDeleteConfirm();
                }, 500);
            })
            .catch(error => {
                currentDeleteElement.classList.remove('slide-out');
                showToast('删除失败', 'error');
                closeDeleteConfirm();
            });
        }
    }
}


 


function cancelDelete() {
    closeDeleteConfirm();
}

// 完成数渲染
function fetchAndRenderCompletedCount() {
    const token = localStorage.getItem('token');
    const countElement = document.querySelector('.ok_span_num');
    

    if (!token) {
        countElement.textContent = '--';
        return;
    }
    

    countElement.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    
    axios.get('http://127.0.0.1:1024/my/completedNum', {
        headers: {'Authorization': 'Bearer ' + token}
    })
    .then(response => {
        const completedCount = response.data.data;
        countElement.textContent = completedCount;
    })
    .catch(error => {
        console.error('获取完成数失败:', error);
    });
}


function userInformationRenderingandjudgment() {
    const token = localStorage.getItem('token');
    

    login.onclick = null;
    add.onclick = null;
    set.onclick = null;
    
    if (!token) {
        login.innerHTML = `<i class="fa-solid fa-user-plus"></i>登录账号`;
        
        login.onclick = () => {
            body.classList.add('side-out');
            setTimeout(() => window.location.href = '../html/login.html', 500);
        };
        
        add.onclick = showLoginPrompt;
        set.onclick = showLoginPrompt;
        document.querySelector('.ok_span_num').textContent = '0';
    } else {
        login.innerHTML = `<i class="fa-solid fa-user"></i>退出登录`;
        add.onclick = openAddForm;
        set.onclick = openSetting;

        login.onclick = () => {
            const flyDiv = document.querySelector('.flaydiv');
            flyDiv.style.animation = 'none';
            void flyDiv.offsetWidth;
            flyDiv.style.animation = 'flyIn 1s ease-in-out forwards';
            
            setTimeout(() => {
                localStorage.removeItem('token');
                window.location.reload();
            }, 1000);
        }


        overlay.addEventListener('click', () => {
            closeAddForm();
            closeSetting();
            closeDeleteConfirm();
        });
        
        add_user_form_close.addEventListener('click', closeAddForm);
        setting_up_close.addEventListener('click', closeSetting);
    }
    
}


    function userInformationRendering() {
        const token = localStorage.getItem('token');
        if (!token) {
            const avatarPreview = document.getElementById('avatarPreview');
            avatarPreview.innerHTML = `<i class="fa-solid fa-user"></i>`;
            return;
        }
        
        axios.post(`http://127.0.0.1:1024/my/mainget`, {}, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            const req = response.data.data;
            if (!req || !req[0]) return;
        
            let gender = '未知';
            if (req[0].gender === 'male') gender = '男';
            else if (req[0].gender === 'female') gender = '女';
        
            document.querySelector('.personal_information_ul').innerHTML = `
                <li class="username"><i class="fa-solid fa-user"></i> 姓名:<span class="username_span">${req[0].username}</span></li>
                <li class="age"><i class="fa-solid fa-cake-candles"></i> 年龄:${req[0].age}岁</li>
                <li class="gender"><i class="fa-solid fa-venus-mars"></i> 性别:${gender}</li>
            `;
        
            updateAvatar(req[0].avatar);
        })
        .catch(error => {
            console.error('获取用户信息失败:', error);
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            if (userData.avatar) {
                updateAvatar(userData.avatar);
            }
        });
    }
    
    

    // 任务添加及渲染
    function handleTaskFormSubmit(event) {
        event.preventDefault();
    
        const token = localStorage.getItem('token');
        if (!token) return showToast('请先登录', 'error');
    
        const title = document.getElementById('title').value.trim();
        const detail = document.getElementById('detail').value.trim();
        const deadline = document.getElementById('deadline').value;
        const deadlinereg = /^(\d{4})-((0?[1-9])|(1[0-2]))-((0?[1-9])|([12][0-9])|(3[01]))$/;
    
        if (!title || !detail || !deadline) return showToast('请输入完整信息', 'error');
        if (!deadlinereg.test(deadline)) return showToast('请输入正确的日期格式（YYYY-MM-DD）', 'error');
    
        const taskData = { taskname: title, detailed: detail, Deadline: deadline };
        const submitButton = document.querySelector('.add-user-form-submit');
    
        if (submitButton.textContent === '添加') {
            axios.post('http://127.0.0.1:1024/my/addInformation', taskData, {
                headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
            })
                .then(() => {
                    showToast('任务添加成功');
                    closeAddForm();
                    fetchAndRenderTasks();
                })
                .catch(error => {
                    closeAddForm();
                    showToast('任务添加失败', 'error');
                });
        } else if (submitButton.textContent === '更新任务') {
            const taskId = submitButton.dataset.editId;
            axios.post(`http://127.0.0.1:1024/my/updateInformation/${taskId}`, taskData, {
                headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
            })
                .then(() => {
                    showToast('任务更新成功');
                    closeAddForm();
                    fetchAndRenderTasks();
                })
                .catch(error => showToast('任务更新失败', 'error'));
        }
    

        document.getElementById('title').value = '';
        document.getElementById('detail').value = '';
        document.getElementById('deadline').value = '';
    }


    // 更新渲染
    function editTask(taskId) {
        const taskToEdit = globalTasks.find(task => task['num-id'] == taskId);
        if (!taskToEdit) return;
    
        document.getElementById('title').value = taskToEdit.taskname;
        document.getElementById('detail').value = taskToEdit.detailed;
        document.getElementById('deadline').value = taskToEdit.Deadline;
    
        document.querySelector('.add-user-form-title').innerHTML = '编辑任务';
        const submitButton = document.querySelector('.add-user-form-submit');
        submitButton.textContent = '更新任务';
        submitButton.dataset.editId = taskId;
    
        overlay.classList.add('active');
        document.querySelector('.add-user-form').classList.add('active');
    }


    // 获取数据
    function fetchAndRenderTasks() {
        const token = localStorage.getItem('token');
        if (!token) return;
    
        axios.get('http://127.0.0.1:1024/my/tasks', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                globalTasks = response.data.data || [];
                renderTasks(globalTasks);
            })
            .catch(error => showToast('获取任务失败，请重试', 'error'));
    }

    // 渲染任务模块
    function renderTasks(tasks) {
        const tasksWrapper = document.querySelector('.tasks-wrapper');
        document.querySelector('.total_span_num').innerHTML = tasks.length;

        let urgentCount = 0;
        let overdueCount = 0;

        if (!tasks || tasks.length === 0) {
            tasksWrapper.innerHTML = `
            <div class="ifnull">
                <div class="loading">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <p>等待添加事务</p>
            </div>`;
            document.querySelector('.urgent_span_num').innerHTML = 0;
            document.querySelector('.overdue_span_num').innerHTML = 0;
            return;
        }
    
        const taskElements = tasks.map(task => {
            const deadline = new Date(task.Deadline);
            const today = new Date();
            const cleanDeadline = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
            const cleanToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const diffDays = Math.ceil((cleanDeadline - cleanToday) / (1000 * 60 * 60 * 24));
            
            let priorityClass = 'priority-low';
            let priorityText = '时间充裕';
            
            if (diffDays < 0) {
                priorityClass = 'priority-overdue';
                priorityText = '已过期';
                overdueCount++;
            } else if (diffDays === 0) {
                priorityClass = 'priority-high';
                priorityText = '今天到期';
                urgentCount++;
            } else if (diffDays === 1) {
                priorityClass = 'priority-high';
                priorityText = '明天到期';
                urgentCount++;
            } else if (diffDays <= 3) {
                priorityClass = 'priority-medium';
                priorityText = '3天内到期';
            } else if (diffDays >= 7) {
                priorityClass = 'priority-lowlow';
                priorityText = '长远任务';
            }

            return `
        <div class="task-module" data-id="${task['num-id']}">
            <div class="task-header">
                <div class="task-title">${task.taskname}</div>
                <div class="task-priority ${priorityClass}">${priorityText}</div>
            </div>
            <div class="task-content">
                <p>${task.detailed}</p>
            </div>
            <div class="task-footer">
                <div class="task-date">
                    <i class="fa-regular fa-clock"></i> 时间: ${task.Deadline}
                </div>
                <div class="task-actions">
                    <button data-id="${task['num-id']}" class='remove'><i class="fa-solid fa-trash"></i></button>
                    <button data-id="${task['num-id']}" class='change'><i class="fa-regular fa-edit" ></i></button>
                    <button data-id="${task['num-id']}" class='finish'><i class="fa-solid fa-check"></i></button>
                </div>
            </div>
        </div>
        `;
        });
    
        tasksWrapper.innerHTML = taskElements.join('');
        document.querySelector('.urgent_span_num').innerHTML = urgentCount;
        document.querySelector('.overdue_span_num').innerHTML = overdueCount;
    }

    // 已完成模块
    function fetchAndRenderFinishedTasks() {
        const token = localStorage.getItem('token');
        if (!token) return;

        axios.get(`http://127.0.0.1:1024/my/finishTasks`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(response => {
                const finishTask = response.data.data || [];
                const finishContainer = document.querySelector('#studentTableBody');
        
                if (finishTask.length === 0) {
                    finishContainer.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #6c757d;">暂无已完成任务</td></tr>';
                    return;
                }
        
                finishContainer.innerHTML = finishTask.map(task => `
            <tr data-id="${task['num-id']}">
                <td>${task.taskname}</td>
                <td>${task.detailed}</td>
                <td>${task.Deadline}</td>
                <td><button class="delete-finished" data-id="${task['num-id']}"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
        `).join('');
            })
            .catch(error => showToast('获取已完成任务失败', 'error'));
    }


    // 完成模块
    function finishTask(taskId) {
        const token = localStorage.getItem('token');
        if (!token) return;

        const taskElement = document.querySelector(`.task-module[data-id="${taskId}"]`);
        if (!taskElement) return;

        const finishButton = taskElement.querySelector('.finish');
        finishButton.classList.add('removing');

        axios.post(`http://127.0.0.1:1024/my/finishTask/${taskId}`, {}, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(() => {
                fetchAndRenderCompletedCount()
                taskElement.style.animation = 'disappear 0.5s forwards';
        
                taskElement.addEventListener('animationend', () => {
                    globalTasks = globalTasks.filter(task => task['num-id'] != taskId);
                    renderTasks(globalTasks);
                    showToast('任务已完成', 'success');
                    fetchAndRenderFinishedTasks();
                }, { once: true });
            })
            .catch(error => {
                showToast('完成任务失败', 'error');
                finishButton.classList.remove('removing');
            });
    }

    // 信息提示
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // 添加动画效果
        setTimeout(() => {
            toast.style.transition = 'opacity 0.3s, transform 0.3s';
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    function initializeApp() {
        // 1. 用户状态判断
        userInformationRenderingandjudgment();
        
        // 2. 调用用户信息渲染
        userInformationRendering();

        // 3. 获取完成数
        fetchAndRenderCompletedCount();
        
        // 4. 获取其他数据
        fetchAndRenderFinishedTasks();
        fetchAndRenderTasks();
        
        // 5. 设置头像上传功能
        setupAvatarUpload();
        
        // 6. 初始化进度条
        updateDayProgress();
        setInterval(updateDayProgress, 1000);
    

        add_user_form_submit.addEventListener('click', handleTaskFormSubmit);
        confirmDeleteBtn.addEventListener('click', confirmDelete);
        cancelDeleteBtn.addEventListener('click', cancelDelete);
    

        document.querySelector('.tasks-wrapper').addEventListener('click', function (event) {
            if (event.target.closest('.remove')) {
                const taskId = event.target.closest('.remove').dataset.id;
                const taskElement = event.target.closest('.task-module');
                showDeleteConfirm(taskId, taskElement, 'task');
            }
            if (event.target.closest('.change')) {
                const taskId = event.target.closest('.change').dataset.id;
                editTask(taskId);
            }
            if (event.target.closest('.finish')) {
                const taskId = event.target.closest('.finish').dataset.id;
                finishTask(taskId);
            }
        });


        document.querySelector('#studentTableBody').addEventListener('click', function (e) {
            if (e.target.closest('.delete-finished')) {
                const taskId = e.target.closest('.delete-finished').dataset.id;
                const rowElement = e.target.closest('tr');
                showDeleteConfirm(taskId, rowElement, 'finished');
            }
        });

        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            const searchTerm = this.value.trim().toLowerCase();
        
            if (!searchTerm) {
                renderTasks(globalTasks);
                return;
            }
        
            searchTimeout = setTimeout(() => {
                const filteredTasks = globalTasks.filter(task =>
                    task.taskname.toLowerCase().includes(searchTerm) ||
                    task.detailed.toLowerCase().includes(searchTerm) ||
                    task.Deadline.includes(searchTerm)
                );
                renderTasks(filteredTasks);
            }, 300);
        });
    }


window.addEventListener('DOMContentLoaded', initializeApp);