<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">注册界面</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password2">
                    <el-input type="password2" placeholder="password2" v-model="ruleForm.password2"
                              @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="sex" @change="changeValue()">
                    <el-radio-group v-model="ruleForm.sex" size="mini">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input v-model="ruleForm.email" placeholder="email">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="tel">
                    <el-input v-model="ruleForm.tel" placeholder="tel">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>


                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">注册</el-button>
                </div>
                <p class="login-tips">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>

    </div>
</template>


<script>
    import {
        registered,
    } from '../api/login';

    export default {
        data: function () {
            return {

                ruleForm: {
                    username: '',
                    password: '',
                    password2: '',
                    sex: '1',
                    email: '',
                    tel: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm() {

                const parem = {
                    userName: this.ruleForm.username,
                    password: this.ruleForm.password,
                    sex: this.ruleForm.sex,
                    email: this.ruleForm.email,
                    tel: this.ruleForm.tel
                }
                registered(parem).then((res) => {
                    console.log(res);
                    if (res.status === 200 || res.message === '成功') {
                        this.$router.push('/login')
                    } else {
                        this.$notify.error({
                            // title: '错误',
                            message: res.message
                        });
                    }

                });
            },

            // 判断各个框是否传值




        }
    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../assets/img/login-bg.jpg);
        background-size: 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }

    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }
</style>
