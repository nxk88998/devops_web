<template>
    <el-dialog
      :model-value="visible"
      width="40%"
      title="发布申请"
      @close="dialogClose"
      >
      <el-form :model="form" ref="formRef" :rules="formRules" label-position="right" label-width="100px" >
        <el-form-item label="发布环境：" prop="env">
          <el-select class="m-2" v-model="form.env" @click="getEnv" placeholder="请选择" style="width: 100%">
            <el-option v-for="row in env" :key="row.id" :label="row.name" :value="row.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布应用：" prop="app">
          <el-select class="m-2" v-model="form.app" @click="getReleaseConfig" placeholder="请选择" style="width: 100%">
            <el-option v-for="row in releaseConfig" :key="row.app.id" :label="row.app.name" :value="row.app.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请标题：" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="选择分支：" prop="branch">
          <el-select class="m-2" v-model="form.branch" @click="getBranch" placeholder="请选择" style="width: 100%">
            <el-option v-for="name in branch" :key="name" :label="name" :value="name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标主机：" prop="server_ids">
          <el-select class="m-2" v-model="form.server_ids" @click="getServer" multiple placeholder="请选择" style="width: 100%">
            <el-option v-for="row in server" :key="row.id" :label="row.name" :value="row.id">
            </el-option>
          </el-select>
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
        props: {
          visible: Boolean,
        },
        data() {
          return {
            form: {
              'env': '',
              'app': '',
              'title': '',
              'version': '',
              'server_ids': '',
              'note': ''
            },
            formRules: {
              env: [
                  {required: true, message: '请选择发布环境', trigger: 'blur'}
              ],
              app: [
                  {required: true, message: '请选择发布应用', trigger: 'blur'},
              ],
              title: [
                  {required: true, message: '请输入申请标题', trigger: 'blur'},
                  {min: 2, message: '申请标题长度应不小于2个字符', trigger: 'blur'}
              ],
              branch: [
                  {required: true, message: '请选择发布分支', trigger: 'blur'},
              ],
              server_ids: [
                  {required: true, message: '请选择目标主机', trigger: 'blur'},
              ]
            },
            env: '',
            releaseConfig: '',
            app: '',
            branch: '',
            server: '',
          }
        },
        methods: {
            submit() {
              this.$refs.formRef.validate((valid) => {
                if (valid) {
                  this.$http.post('/app_release/apply/', this.form)
                    .then(res => {
                      if (res.data.code === 200){
                        this.$message.success('创建成功');
                        this.$parent.getData();  // 调用父组件方法，更新数据
                        this.dialogClose()  // 关闭窗口
                      }
                    })
                } else {
                  this.$message.error('格式错误！')
                }
              })
            },
            dialogClose() {
              this.$emit('update:visible', false)
            },
            // 选择发布环境
            getEnv() {
                this.$http.get('/app_release/env/')
                    .then(res => {
                        this.env = res.data.data;
                    });
                this.form.app = '';  // 再次选择发布环境将发布应用表单清空
            },
            // 选择发布应用（获取发布配置）
            getReleaseConfig() {
                if(this.form.env) {
                  // 获取所有发布配置
                  this.$http.get('/app_release/config/', {params: {'env': this.form.env}})  // this.createForm.env 环境ID
                    .then(res => {
                        this.releaseConfig = res.data.data; // 临时存储所有应用发布配置
                    });
                } else {
                    this.$message.error('请先选择发布环境！')
                }
            },
            // 选择分支
            getBranch() {
                // 根据选择的应用获取发布配置
                this.form.branch = '';
                if(this.form.app) {
                    this.releaseConfig.forEach(row =>{
                        if(row.app.id === this.form.app) {
                            const git_repo = row.git_repo;
                            const credential_id = row.git_credential_id;
                            this.form.release_config = row.id; // 添加发布配置id，用于上面submit方法提交到后端
                            this.$http.get('/app_release/git/', {params: {'git_repo': git_repo, 'git_credential_id': credential_id}})
                            .then(res => {
                                this.branch = res.data.data;
                            })
                        }
                    })
                } else {
                  this.$message.error('请先选择应用！')
                }

            },
            // 获取目标主机
            getServer() {
                this.$http.get('/cmdb/server/?page_size=100')
                    .then(res => {
                        this.server = res.data.data;
                    });
            },
        },
      watch: {
        // 当选择发布应用后，自动渲染目标主机
        'form.app': {
          handler: function () {
            this.getServer();  // 执行获取服务器
            this.releaseConfig.forEach(row => {
              if(row.id === this.form.app) {  // app是ID，获取选择发布应用对应发布配置里目标主机ID
                this.form.server_ids = row.server_ids;
                // 把发布配置id保存到里面，用于提交到后端
                this.form.release_config = row.id;
              }
            });
          }
        },
      }
    }
</script>

<style scoped>

</style>