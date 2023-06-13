<template>
    <div class="main">
        <div class="login_box">
            <div class="title">
                欢迎访问DevOps平台
            </div>
            <div class="login_form">
                <el-form label-width="30px" ref="form" :model="form" :rules="rules">
                    <el-form-item prop="username">
                        <el-input
                                :prefix-icon="User"
                                placeholder="用户名"
                                v-model="form.username"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input
                                :prefix-icon="Lock"
                                placeholder="密码"
                                type="password"
                                show-password
                                v-model="form.password"
                        ></el-input>
                    </el-form-item>
                    <el-form-item class="btn">
                       <el-button type="primary" @click="onSubmit" >登 录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>

</template>

<script>
    import {User, Lock} from "@element-plus/icons-vue"
    export default {
        name: "Login",
        data() {
            return {
                form: {
                    username: '',
                    password: ''
                },
                rules: {
                  username: [
                      {required: true, message: '请输入用户名', trigger: 'blur'},
                      {min: 3, message: '用户名长度应不小于3个字符', trigger: 'blur'}
                  ],
                  password: [
                      {required: true, message: '请输入密码', trigger: 'blur'},
                      {min: 6, message: '用户名长度应不小于6个字符', trigger: 'blur'}
                  ]
                }
            }
        },
        methods: {
            onSubmit() {
                this.$refs.form.validate((valid) => {
                    if(valid) {
                        this.$http.post('/login/', this.form)
                        .then(res => {
                            if (res.data.code === 200) {
                                this.$message.success('登录成功');
                                // 保存token到浏览器会话存储，方便让后续请求携带访问
                                // window.sessionStorage.setItem('token', res.data.token);
                                // window.sessionStorage.setItem('username', res.data.username);
                                window.localStorage.setItem('token',res.data.token);
                                window.localStorage.setItem('username',res.data.username);
                                this.$router.push('/dashboard') //导航跳转到首页
                            }
                        })
                    } else {
                        this.$message.error("用户名或者密码格式输入错误！")
                    }
                })

            }
        },
        setup() {
            return {
                User, Lock
            }
        }
    }
</script>

<style scoped>
    .main {
        background-image: url("../assets/img/login_background.jpg");
        background-size: 100% 100%;
        height: 100%;
    }
    .login_box {
        width: 400px;
        height: 300px;
        background-color: #FFF;
        border-radius: 20px;
        box-shadow: 0 5px 20px 0 #e8e8e8;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
    }
    .title {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        color: #3499FF;
        margin-top: 20px;
    }
    .login_form {
        margin-top: 40px;
        margin-right: 30px;
    }
    .btn {
        margin-left: 110px;
    }
    .btn .el-button {
        font-size: 18px;
        width: 130px;
    }
</style>