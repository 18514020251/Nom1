const maleOption = document.getElementById('male');
const femaleOption = document.getElementById('female');
const cloudone = document.getElementById('cloudone1');
const cloudtwo = document.getElementById('cloudtwo1');
const username = document.getElementById('username');
const age = document.getElementById('age');
const email = document.getElementById('email');
const body = document.querySelector('body');
const title = document.querySelector('.title');
const login_box = document.querySelector('.login-box');
const button_color = document.querySelector('.button_color1');
const err_massage = document.querySelector('.err_massage');
const flaydiv = document.querySelector('.flaydiv');

// 点击下一步时验证
function validateForm() {
    let isValid = true;
    const usernameValue = /^(?:[\u4e00-\u9fa5]{2,10}|[\u4e00-\u9fa5]{1,5}[·．.][\u4e00-\u9fa5]{1,5})$/
    const ageValue = /^([1-9][0-9]?|1[01][0-9]|120)$/
    const emailValue = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/

    // 清空错误信息
    err_massage.innerHTML = ''

    // 验证用户名
    if (username.value === '') {
        err_massage.innerHTML = `<i class="fa-solid fa-xmark"></i>请输入名字`
        isValid = false
    } else if (!usernameValue.test(username.value)) {
        err_massage.innerHTML = '请输入正确的名字'
        isValid = false
    } else if (age.value === '') {
        err_massage.innerHTML = `<i class="fa-solid fa-xmark"></i>请输入年龄`
        isValid = false
    } else if (!ageValue.test(age.value)) {
        err_massage.innerHTML = '<i class="fa-solid fa-xmark"></i>请输入正确的年龄'
        isValid = false
    } else if (email.value === '') {
        err_massage.innerHTML = `<i class="fa-solid fa-xmark"></i>请输入邮箱`
        isValid = false
    } else if (!emailValue.test(email.value)) {
        err_massage.innerHTML = '<i class="fa-solid fa-xmark"></i>请输入正确的邮箱'
        isValid = false
    }
    return isValid
}


function handleButtonClick() {
    if (!validateForm()) return

    // 获取选中的性别
    const gender = maleOption.classList.contains('selected') ? '男' : '女'
    
    const userInformation = {
        username: username.value.trim(),
        age: age.value,
        gender: gender,
        email: email.value.trim()
    }

    const token = localStorage.getItem('token');

    axios.post('http://127.0.0.1:1024/my/userinfo', userInformation, {
        headers: {
            'Authorization': 'Bearer ' + token, 
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('API响应:', response.data);
        if (response.data.status === 0) {
            flaydiv.innerHTML = '欢迎使用'
            flaydiv.classList.add('fullscreen-div1')
            setTimeout(() => {
                window.location.href = '../html/main.html'
            },2000)
        } else {
            err_massage.innerHTML = `<i class="fa-solid fa-xmark"></i>${response.data.message}`
        }
    })
    .catch(error => {
        console.error('API请求错误:', error);
        if (error.response) {
            console.error('错误响应:', error.response.data);
            err_massage.innerHTML = `<i class="fa-solid fa-xmark"></i>请求失败: ${error.response.data.message || error.response.data.error}`
        } else {
            err_massage.innerHTML = `<i class="fa-solid fa-xmark"></i>请求失败: ${error.message}`
        }
    })
}

button_color.addEventListener('click', handleButtonClick)


// 切换
maleOption.addEventListener('click', function() {
    maleOption.classList.add('selected');
    femaleOption.classList.remove('selected1');
    cloudone.classList.add('cloudone1');
    cloudtwo.classList.add('cloudtwo1');
    cloudone.classList.remove('cloudone2');
    cloudtwo.classList.remove('cloudtwo2');
    // body.classList.add('bodybgc1');
    // body.classList.remove('bodybgc2');
    title.classList.add('blue');
    title.classList.remove('pink');
    login_box.classList.add('login-box1');
    login_box.classList.remove('login-box2');
    button_color.classList.add('button_color1');
    button_color.classList.remove('button_color2');
    username.classList.add('skyblue');
    age.classList.add('skyblue');
    email.classList.add('skyblue')
    username.classList.remove('ffa9ff');
    age.classList.remove('ffa9ff');
    email.classList.remove('ffa9ff')
});
  
femaleOption.addEventListener('click', function() {
    femaleOption.classList.add('selected1');
    maleOption.classList.remove('selected');
    cloudone.classList.add('cloudone2');
    cloudtwo.classList.add('cloudtwo2');
    cloudone.classList.remove('cloudone1');
    cloudtwo.classList.remove('cloudtwo1');
    // body.classList.add('bodybgc2');
    // body.classList.remove('bodybgc1');
    title.classList.add('pink');
    title.classList.remove('blue')
    login_box.classList.add('login-box2');
    login_box.classList.remove('login-box1');
    button_color.classList.add('button_color2');
    button_color.classList.remove('button_color1');
    username.classList.add('ffa9ff');
    age.classList.add('ffa9ff');
    email.classList.add('ffa9ff');
    username.classList.remove('skyblue');
    age.classList.remove('skyblue');
    email.classList.remove('skyblue')
});