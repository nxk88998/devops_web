<template>
  <div class="common-layout">
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          default-active="2"
          class="el-menu-vertical"
          background-color="#304156"
          text-color="#FFFFFF"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <div class="logo">
<!--            <img src="../assets/logo.png" alt="">-->
             <img src="../assets/touxiang.png" alt="">
          </div>

          <template v-for="menu in this.$router.options.routes" :key="menu">

            <!--单独处理仪表盘-->
            <el-menu-item v-if="menu.path == '/'" :index="menu.children[0].path">
              <el-icon><component :is="menu.children[0].icon"/></el-icon>
              <span>{{menu.children[0].name}}</span>
            </el-menu-item>
            <!--处理没有子路由的菜单-->
            <!--
            <el-menu-item v-if="!menu.children" :index="menu.path">
              <el-icon><component :is="menu.icon"/></el-icon>
              <span>{{menu.name}}</span>
            </el-menu-item>
            -->
            <!--处理有子路由的菜单-->
            <el-sub-menu v-else-if="menu.children" :index="menu.path">
              <template #title>
                <el-icon><component :is="menu.icon"/></el-icon>
                <span>{{menu.name}}</span>
              </template>
              <el-menu-item v-for="child in menu.children" :key="child" :index="child.path">{{child.name}}</el-menu-item>
            </el-sub-menu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <!--导航栏折叠-->
          <div class="toggleCollapse">
            <el-icon :size="25" @click="toggleCollapse"><Fold /></el-icon>
          </div>
          <!--头像-->
          <el-dropdown>
            <span class="el-dropdown-link">
              <img src="../assets/touxiang.png" alt="">
              <span>{{username}}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="dialogVisible = true">密码修改</el-dropdown-item>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>
        <el-main>
          <!--占位符，显示路由跳转后加载的内容-->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>

  <el-dialog
    v-model="dialogVisible"
    title="修改密码"
    width="30%"
  >
   <el-form :model="UserPasswordForm" label-position="right" label-width="100px" :rules="rules" ref="UserPasswordForm">
      <el-form-item label="原密码：" prop="old_password">
        <el-input
          v-model="UserPasswordForm.old_password"
          type="password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="new_password">
        <el-input
            v-model="UserPasswordForm.new_password"
            type="password"
            show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="再次确认：" prop="confirm_password">
        <el-input
            v-model="UserPasswordForm.confirm_password"
            type="password"
            show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="changePasswordSubmit">确定</el-button>
      </span>
    </template>

  </el-dialog>


</template>

<script>

export default {
  name: 'HomeView',
  data() {
    const checkNewOldPassword = (rule, value, callback) => {
      if (value == this.UserPasswordForm.old_password) {
          callback(new Error('新密码不能与旧密码一样！'))
      } else {
        return callback()
      }
    };
    const checkNewPassword = (rule, value, callback) => {
      if (value != this.UserPasswordForm.new_password) {
          callback(new Error('两次输入密码不一致！'))
      } else {
        return callback()
      }
    };
    return {
      isCollapse: false,
      username: window.localStorage.getItem('username'),
      dialogVisible: false,
      UserPasswordForm: {
        old_password: '',
        new_password: '',
        confirm_password: ''
      },
      rules: {
        old_password: [
            {required: true, message: '请输入原密码', trigger: 'blur'},
            {min: 6, message: '用户名长度应不小于6个字符', trigger: 'blur'}
        ],
        new_password: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {min: 6, message: '用户名长度应不小于6个字符', trigger: 'blur'},
            {validator: checkNewOldPassword, trgger: 'blur'}
        ],
        confirm_password: [
            {required: true, message: '请确认新密码', trigger: 'blur'},
            {min: 6, message: '用户名长度应不小于6个字符', trigger: 'blur'},
            {validator: checkNewPassword, trgger: 'blur'}
        ]
      }

    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse; // 切换取反作用
    },
    logout() {
      window.localStorage.clear();
      this.$router.push('/login')
    },
    changePasswordSubmit() {
      this.$refs.UserPasswordForm.validate((valid) => {
        if (valid) {
          // const username = window.sessionStorage.getItem('username');
          const username = window.localStorage.getItem('username');
          localStorage
          this.UserPasswordForm['username'] = username;
          this.$http.post('/change_password/', this.UserPasswordForm)
          .then(res => {
            if(res.data.code === 200) {
              this.$message.success(res.data.msg);
              this.dialogVisible = false;
            }
          })
        }
      })
     }
  }
}
</script>

<style>
  .common-layout,.el-container,.el-menu-vertical {
    height: 100%;
  }
  .el-main {
    background: #F5F7FA;
  }
  .toggleCollapse {
    cursor: pointer;
  }
  .logo img {
    width: 170px;
    height: 60px;
    margin-left: 10px;
  }
  .el-dropdown img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>