<template>
    <!--操作栏：编辑对话框-->
    <el-dialog
      :model-value="visible"
      width="30%"
      title="修改应用信息"
      @close="dialogClose"
      >
      <el-form :model="row" ref="formRef" :rules="formRules" label-position=“right” label-width="100px">
        <el-form-item label="应用名称：" prop="name">
          <el-input v-model="row.name"></el-input>
        </el-form-item>
        <el-form-item label="英文名称：" prop="english_name">
          <el-input v-model="row.english_name"></el-input>
          <span style="color: darkgrey">可以由字母、数字、横线和下划线组成。</span>
        </el-form-item>
        <el-form-item label="项目名称：" prop="project">
          <el-select class="m-2" v-model="row.project" @click="getProject" placeholder="请选择" style="width: 100%">
            <el-option v-for="row in project" :key="row.id" :label="row.name" :value="row.id">
            </el-option>
          </el-select>
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
        props: {
          visible: Boolean,
          row: '',
        },
        data() {
          return {
            form: '',
            formRules: {
              name: [
                  {required: true, message: '请输入环境名称', trigger: 'blur'},
                  {min: 2, message: '环境名称长度应不小于2个字符', trigger: 'blur'}
              ],
              english_name: [
                  {required: true, message: '请输入英文名称', trigger: 'blur'},
                  {min: 2, message: '英文名称长度应不小于2个字符', trigger: 'blur'},
                  {validator: function (rule, value, callback) {
                      // 效验英文
                      if(/[a-zA-Z0-9]$/.test(value) == false) {
                        callback(new Error('请输入英文名称'))
                      } else {
                        return callback();
                      }
                    }, trigger: 'blur'},
              ],
              project: [
                  {required: true, message: '请选择项目名称', trigger: 'blur'}
              ],
            },
            project: []
          }
        },
        methods: {
            submit() {
              this.$refs.formRef.validate((valid) => {
                if (valid) {
                  this.$http.put('/app_release/app/' + this.row.id + '/', this.row)
                    .then(res => {
                      if (res.data.code === 200){
                        this.$message.success('修改成功');
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
              this.$emit('update:visible', false);
              this.$parent.getData();  // 调用父组件方法，更新数据
            },
            // 获取主机分组
            getProject() {
                this.$http.get('/app_release/project/')
                    .then(res => {
                        this.project = res.data.data;
                    });
            },
        },
        // 监听窗口打开
        watch: {
            visible() {
               if(this.visible) {
                  this.row.project = this.row.project.id;  // 重新赋值为ID
                  this.getProject();  // 经过上面赋值，表单中只显示一个ID，还需要重新渲染所有值，才能对应显示名称
               }
            }
        }
    }
</script>

<style scoped>

</style>