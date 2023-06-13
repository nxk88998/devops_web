<template>
    <!--操作栏：编辑对话框-->
    <el-dialog
      :model-value="visible"
      width="30%"
      title="修改环境信息"
      @close="dialogClose"
      >
      <el-form :model="row" ref="formRef" :rules="formRules" label-position=“right” label-width="100px">
        <el-form-item label="环境名称：" prop="name">
          <el-input v-model="row.name"></el-input>
        </el-form-item>
        <el-form-item label="英文名称：" prop="english_name">
          <el-input v-model="row.english_name"></el-input>
          <span style="color: darkgrey">可以由字母、数字、横线和下划线组成。</span>
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
        name: "envEdit.vue",
        props: {
          visible: Boolean,
          row: '', // 父组件传递过来的当前行数据
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
              ]
            },
          }
        },
        methods: {
            dialogClose() {
              this.$emit('update:visible', false);

            },
            submit() {
                this.$refs.formRef.validate((valid) => {
                    if (valid) {
                        this.$http.put('/app_release/project/' + this.row.id + '/', this.row)
                            .then(res => {
                                if (res.data.code === 200) {
                                    this.$message.success(res.data.msg);
                                    this.$parent.getData();  // 调用父组件方法，更新数据
                                    this.dialogClose()  // 关闭窗口
                                }
                            })
                    } else {
                        this.$message.error('格式错误！')
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>