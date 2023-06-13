<template>
    <el-dialog
      :model-value="visible"
      width="30%"
      title="创建凭据"
      @close="dialogClose"
      >
      <el-form :model="form" ref="formRef" :rules="formRules" label-position="right" label-width="100px" >
          <el-form-item label="凭据名称：" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="k8sapi_ip：" prop="k8sapi_ip">
            <el-input v-model="form.k8sapi_ip"></el-input>
          </el-form-item>
          <el-form-item label="认证方式：">
            <el-radio-group v-model="form.auth_mode">
              <el-radio border label="2" disabled >token未开发</el-radio>
              <el-radio border label="1" >秘钥</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码：" prop="k8s_token" v-if="form.auth_mode=='1'">
            <el-input v-model="form.k8s_token" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item label="私钥：" prop="private_key" v-if="form.auth_mode=='2'">
            <el-input v-model="form.private_key" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="form.note" type="textarea"></el-input>
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
        name: "k8sCreate",
        props: {
          visible: Boolean,
        },
        data() {
          return {
            form: {
                  'name': '',
                  'k8sapi_ip': '',
                  'auth_mode': '1',
                  'k8s_token': '',
                  'private_key': '',
                  'note': ''
            },
                formRules: {
                    name: [
                        {required: true, message: '请输入凭据名称', trigger: 'blur'},
                        {min: 2, message: '凭据名称长度应不小于2个字符', trigger: 'blur'}
                    ],
                    k8sapi_ip: [
                        {required: true, message: '请输入ip', trigger: 'blur'},
                        {min: 7, message: 'ip长度应不小于8个字符', trigger: 'blur'}
                    ],
                    k8s_token: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, message: 'k8s_token长度应不小于6个字符', trigger: 'blur'}
                    ],
                    private_key: [
                        {required: true, message: '请输入私钥', trigger: 'blur'},
                        {min: 20, message: '私钥长度应不小于20个字符', trigger: 'blur'}
                    ]
                },
          }
        },
            methods: {
            submit() {
              this.$refs.formRef.validate((valid) => {
                if (valid) {
                  console.log(this.form)
                  this.$http.post('/k8s/node/', this.form)
                    .then(res => {
                      if (res.data.code == 200){

                        this.$message.success('导入集群成功');
                        this.$parent.getData();  // 调用父组件方法，更新数据
                        this.dialogClose()  // 关闭窗口
                      }
                    })
                } else {
                  this.$message.error('文件格式不正确或服务器连接失败！')
                }
              })
            },
            // 点击关闭，子组件通知父组件更新属性
            dialogClose() {
              this.$emit('update:visible', false)  // 父组件必须使用v-model
            }
        }
    }
</script>



<style scoped>

</style>