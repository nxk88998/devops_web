<template>
    <!--操作栏：编辑对话框-->
<el-dialog
  :model-value="visible"
  width="30%"
  title="修改凭据信息"
  @close="dialogClose"
  >
      <el-form :model="row" ref="formRef" :rules="formRules" label-position="right" label-width="100px">
        <el-form-item label="凭据名称：" prop="name">
          <el-input v-model="row.name"></el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="row.username"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password" v-if="row.auth_mode==1">
          <el-input v-model="row.password" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="私钥：" prop="private_key" v-if="row.auth_mode==2">
          <el-input v-model="row.private_key" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="row.note" type="textarea"></el-input>
        </el-form-item>
      </el-form>

  <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogClose">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </span>
  </template>
</el-dialog>

</template>

<script>
    export default {
        name: "IdcEdit.vue",
        props:{
            row:'', //父组件传递过来的当前数据
            visible: Boolean,
        },
        data() {
            return {
                formRules: {
                  name: [
                      {required: true, message: '请输入凭据名称', trigger: 'blur'},
                      {min: 2, message: '凭据名称长度应不小于2个字符', trigger: 'blur'}
                  ],
                  username: [
                      {required: true, message: '请输入用户名', trigger: 'blur'},
                      {min: 2, message: '用户名长度应不小于2个字符', trigger: 'blur'}
                  ],
                  password: [
                      {required: true, message: '请输入密码', trigger: 'blur'},
                      {min: 6, message: '密码长度应不小于6个字符', trigger: 'blur'}
                  ],
                  private_key: [
                      {required: true, message: '请输入私钥', trigger: 'blur'},
                      {min: 20, message: '私钥长度应不小于20个字符', trigger: 'blur'}
                  ]
                },

            }
        },
        methods:{
            submit() {
            this.$refs.formRef.validate((valid) => {
              if (valid) {
                this.$http.put('/config/credential/' + this.row.id + '/', this.row)
                  .then(res => {
                    if (res.data.code == 200){
                      this.$message.success(res.data.msg);
                      this.$parent.getData();  // 调用父组件方法，更新数据
                      this.dialogClose()  // 关闭窗口
                    }
                  })
              } else {
                this.$message.error('格式错误！')
              }
            })
          },
          // 点击关闭，子组件通知父组件更新属性
          dialogClose() {
            this.$emit('update:visible', false)  // 父组件必须使用v-model
          }
      },
    }
</script>

<style scoped>

</style>