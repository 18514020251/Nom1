const username = document.querySelector('#username')
const password = document.querySelector('#password')
const password2 = document.querySelector('#password2')
const username_err = document.querySelector('.username_err')
const password_err = document.querySelector('.password_err')
const password_err2 = document.querySelector('.password_err2')
const enroll = document.querySelector('.enroll')
const input_button = document.querySelector('.input-box button')
const status_information = document.querySelector('.status_information')
const jump = document.querySelector('.jump')
const h1 = document.querySelector('h1')


// 点击后更改样式所需
const body = document.querySelector('body')
const login_title = document.querySelector('.login-title')
const enroll_title = document.querySelector('.enroll-title')
const login_box = document.querySelector('.login-box')
const input1 = document.querySelector('.input-box input')
const input2 = document.querySelector('.input1')
const input3 = document.querySelector('.input2')
const input4 = document.querySelector('.input3')
const cloudone = document.querySelector('.cloudone1')
const cloudtwo = document.querySelector('.cloudtwo1')
const Double_confirmation = document.querySelector('.Double-confirmation')
const loginDiv = document.querySelector('.inputremove')
const flaydiv = document.querySelector('.flaydiv')

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});
// 点击注册后判断
function validateForm() {
    let isValid = true;
    const passwordRegex = /^[A-Za-z\d]{6,10}$/

    // 清空错误信息
    username_err.innerHTML = '';
    password_err.innerHTML = '';
    password_err2.innerHTML = '';


    if (username.value === '') {
        username_err.innerHTML = `<i class="fa-solid fa-xmark"></i>用户名不能为空`;
        isValid = false;
    } else if (username.value.length < 3 || username.value.length > 10) {
        username_err.innerHTML = `<i class="fa-solid fa-xmark"></i>用户名长度应在3-10之间`;
        isValid = false;
    }


    if (password.value === '') {
        password_err.innerHTML = `<i class="fa-solid fa-xmark"></i>密码不能为空`;
        isValid = false;
    } else if (!passwordRegex.test(password.value)) {
        password_err.innerHTML = `<i class="fa-solid fa-xmark"></i>密码长度应在6-10之间,且只能包含字母和数字`;
        isValid = false;
    }


    if (enroll.innerHTML === '已有账号?点击登录') {
        if (password2.value === '') {
            password_err2.innerHTML = `<i class="fa-solid fa-xmark"></i>请确认密码`;
            isValid = false;
        } else if (password.value !== password2.value) {
            password_err2.innerHTML = `<i class="fa-solid fa-xmark"></i>两次密码不一致`;
            isValid = false;
        }
    }

    return isValid;
}

// 清空输入框
function clearInput() {
    username.value = ''
    password.value = ''
    password2.value = ''
}


function handleButtonClick() {

    if (!validateForm()) return;
    

    const userDate = {
        username: username.value.trim(),
        password: password.value
    }


    const originalButtonHTML = input_button.innerHTML;
    

    if (enroll.innerHTML === '已有账号?点击登录') {
        const apiUrl = 'http://127.0.0.1:1024/register'

        axios.post(apiUrl, JSON.stringify(userDate), {
            headers: {
                'Content-Type': 'application/json' 
            }
        })
            .then(response => {
                console.log(response)   
                if (response.data.message === '注册成功') {
                    status_information.classList.add('Registration_passed')
                    status_information.classList.remove('Registration_failed')
                    status_information.innerHTML = `<i class="fa-solid fa-check"></i>注册成功`

                    // 加载动画
                    input_button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>加载中...`;
                    enroll.style.opacity = '0';

                    jump.style.opacity = '1'
                    let count = 5;
                    const countdown = setInterval(() => {
                        jump.innerHTML = `将在${count}秒后跳转到登录页面`;
                        count--;
                        
                        if (count < 0) {
                            clearInterval(countdown);
                            enroll.click();
                            jump.style.opacity = '0';
                            status_information.innerHTML = '';
                            input_button.innerHTML = originalButtonHTML;
                            enroll.style.opacity = '1';
                        }
                    }, 1000);
                }
                else if (response.data.message === '用户名已存在') {
                    status_information.classList.add('Registration_failed')
                    status_information.innerHTML = `<i class="fa-solid fa-xmark"></i>用户名已存在`
                    input_button.innerHTML = originalButtonHTML;
                }
                else {
                    status_information.classList.add('Registration_failed')
                    status_information.innerHTML = `<i class="fa-solid fa-xmark"></i>注册失败`
                    input_button.innerHTML = originalButtonHTML;
                }
            })
            .catch(error => {
                console.error(error);
                status_information.classList.add('Registration_failed')
                status_information.innerHTML = `<i class="fa-solid fa-xmark"></i>请求失败`
                input_button.innerHTML = originalButtonHTML;
            })
    }
    // 判断是否是登录
    else if (enroll.innerHTML === '还没有?点击注册') {
        const apiUrl = 'http://127.0.0.1:1024/my/login'
        axios.post(apiUrl, JSON.stringify(userDate), {
            
            headers: {
                'Content-Type' : 'application/json'
            }
        })
            .then(response => {
                console.log(response)
                if (response.data.message === '用户不存在') {
                    status_information.classList.add('Registration_failed')
                    status_information.innerHTML = `<i class="fa-solid fa-xmark"></i>用户不存在`
                }
                else if (response.data.message === '密码错误') {
                    status_information.classList.add('Registration_failed')
                    status_information.innerHTML = `<i class="fa-solid fa-xmark"></i>密码错误`
                } else if (response.data.ifOK === true) {
                    status_information.classList.add('Registration_passed')
                    status_information.classList.remove('Registration_failed')
                    status_information.innerHTML = `<i class="fa-solid fa-check"></i>登录成功`
                    input_button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>加载中...`
                    localStorage.setItem('token', response.data.token.split(' ')[1])
                    flaydiv.innerHTML = '欢迎使用'
                    flaydiv.classList.add('fullscreen-div')
                    setTimeout(() => {
                        window.location.href = '../html/main.html'
                    },3000)
                }
                else {
                    status_information.classList.add('Registration_passed')
                    status_information.classList.remove('Registration_failed')
                    status_information.innerHTML = `<i class="fa-solid fa-check"></i>登录成功`
                    input_button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>加载中...`
                    localStorage.setItem('token', response.data.token.split(' ')[1])
                    flaydiv.innerHTML = '欢迎使用'
                    flaydiv.classList.add('fullscreen-div')
                    setTimeout(() => {
                        window.location.href = '../html/user_information.html'
                    },3000)
                }
            })
            .catch(error => {
                console.error(error);
                status_information.classList.add('Registration_failed')
                status_information.innerHTML = `<i class="fa-solid fa-xmark"></i>登录失败`
            })
    }
}




input_button.addEventListener('click', handleButtonClick)
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        // console.log('Enter key pressed');
        handleButtonClick()
    }
})



// 切换样式
enroll.addEventListener('click', () => {
    username_err.value = ''
    password_err.value = ''
    clearInput()
    // 注册
    if (enroll.innerHTML === '还没有?点击注册') {
        enroll.innerHTML = '已有账号?点击登录'
        body.style.backgroundColor = '#ffa9ff'
        enroll_title.style.opacity = '1'
        login_title.style.opacity = '0'
        enroll.style.color = '#8c18ff'
        input_button.style.backgroundColor = '#8c18ff'
        login_box.style.border = '3px solid #8c18ff'
        input_button.style.border = '1px solid #8c18ff'
        // input1.classList.remove('skyblue')
        input2.classList.remove('skyblue')
        input3.classList.remove('skyblue')
        input4.classList.remove('skyblue')
        // input1.classList.add('ffa9ff')
        input2.classList.add('ffa9ff')
        input3.classList.add('ffa9ff')
        input4.classList.add('ffa9ff')
        password_err.innerHTML = ''
        username_err.innerHTML = ''
        status_information.innerHTML = ''
        password_err2.innerHTML = ''
        input1.classList.add('input2')
        input1.classList.remove('input1')
        input2.classList.add('input2')
        input2.classList.remove('input1')
        h1.classList.remove('blue')
        h1.classList.add('pink')
        input_button.innerHTML = `<i class="fa-solid fa-user-plus"></i>注册`
        input_button.style.color = '#fff'
        cloudone.classList.remove('cloudone1')
        cloudone.classList.add('cloudone2')
        cloudtwo.classList.remove('cloudtwo1')
        cloudtwo.classList.add('cloudtwo2')
        Double_confirmation.style.opacity = '1'
        loginDiv.style.top = '0px'
    }
    // 登录
    else if (enroll.innerHTML === '已有账号?点击登录') {
        enroll.innerHTML = '还没有?点击注册'
        body.style.backgroundColor = 'skyblue'
        enroll_title.style.opacity = '0'
        login_title.style.opacity = '1'
        enroll.style.color = '#4e99e8'
        input_button.style.backgroundColor = '#4e99e8'
        login_box.style.border = '3px solid #4e99e8'
        input_button.style.border = '1px solid #4e99e8'
        // input1.classList.remove('ffa9ff')
        input2.classList.remove('ffa9ff')
        input3.classList.remove('ffa9ff')
        input4.classList.remove('ffa9ff')
        // input1.classList.add('skyblue')
        input2.classList.add('skyblue')
        input3.classList.add('skyblue')
        input4.classList.add('skyblue')
        username_err.innerHTML = ''
        password_err.innerHTML = ''
        status_information.innerHTML = ''
        input1.classList.remove('input2')
        input2.classList.remove('input2')
        input2.classList.add('input1')
        h1.classList.remove('pink')
        h1.classList.add('blue')
        input_button.innerHTML = `<i class="fa-solid fa-arrow-right fa-fade"></i>登录`
        input_button.style.color = '#000'
        cloudone.classList.remove('cloudone2')
        cloudone.classList.add('cloudone1')
        cloudtwo.classList.remove('cloudtwo2')
        cloudtwo.classList.add('cloudtwo1')
        Double_confirmation.style.opacity = '0'
        loginDiv.style.top = '-100px'
    }
})


