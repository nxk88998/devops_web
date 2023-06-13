<template>
    <!--发布配置-->
    <el-dialog
    :model-value="visible"
    @close="dialogClose"
    width="60%"
    title="发布配置"
    >
      <div style="margin-left: 91%;margin-bottom: 15px">
        <!--展示列弹出框-->
        <el-popover placement="left" :width="100" :visible='columnVisible'>
          <template #reference>
            <el-button type="primary" @click="columnVisible = true"><el-icon><setting /></el-icon>&nbsp;展示列</el-button>
          </template>
            <el-checkbox v-model="showColumn.env" disabled>发布环境</el-checkbox>
            <el-checkbox v-model="showColumn.server_ids">目标主机</el-checkbox>
            <el-checkbox v-model="showColumn.git_repo">Git仓库</el-checkbox>
            <el-checkbox v-model="showColumn.git_credential_id">Git凭据</el-checkbox>
            <el-checkbox v-model="showColumn.notify">消息通知</el-checkbox>
            <el-checkbox v-model="showColumn.note">备注</el-checkbox>
            <el-checkbox v-model="showColumn.source_file">源文件</el-checkbox>
            <el-checkbox v-model="showColumn.global_variables">自定义全局变量</el-checkbox>
            <el-checkbox v-model="showColumn.pre_checkout_script">代码检出前执行脚本</el-checkbox>
            <el-checkbox v-model="showColumn.post_checkout_script">代码检出后执行脚本</el-checkbox>
            <el-checkbox v-model="showColumn.dst_dir">服务器部署路径</el-checkbox>
            <el-checkbox v-model="showColumn.history_version_dir">历史版本路径</el-checkbox>
            <el-checkbox v-model="showColumn.history_version_number">历史版本保留数</el-checkbox>
            <el-checkbox v-model="showColumn.pre_deploy_script">部署前执行脚本</el-checkbox>
            <el-checkbox v-model="showColumn.post_deploy_script">部署后执行脚本</el-checkbox>
            <el-checkbox v-model="showColumn.create_time">创建时间</el-checkbox>
            <div style="text-align: right; margin: 0">
              <el-button size="small"  @click="columnVisible = false">取消</el-button>
              <el-button size="small" type="primary" @click="saveColumn">确认</el-button>
            </div>
        </el-popover>
      </div>

      <el-table
          ref="Table"
          :data="tableData"
          border
          prop
          style="width: 100%"
          :header-cell-style="{ background: '#F0F2F5' }"
        >
          <el-table-column prop="env" label="发布环境" fixed="left" v-if="showColumn.env">
            <template #default="scope">
              {{scope.row.env.name}}
            </template>
          </el-table-column>
          <el-table-column prop="server_ids" label="目标主机" v-if="showColumn.server_ids"/>
          <el-table-column prop="git_repo" label="Git仓库" v-if="showColumn.git_repo"/>
          <el-table-column prop="git_credential_id" label="Git凭据" v-if="showColumn.git_credential_id"/>
          <el-table-column prop="notify" label="消息通知" v-if="showColumn.notify"/>
          <el-table-column prop="note" label="备注" v-if="showColumn.note"/>
          <el-table-column prop="source_file" label="源文件" v-if="showColumn.source_file"/>
          <el-table-column prop="global_variables" label="自定义全局变量" v-if="showColumn.global_variables"/>
          <el-table-column prop="pre_checkout_script" label="代码检出前执行脚本" v-if="showColumn.pre_checkout_script"/>
          <el-table-column prop="post_checkout_script" label="代码检出后执行脚本" v-if="showColumn.post_checkout_script"/>
          <el-table-column prop="dst_dir" label="服务器部署路径" v-if="showColumn.dst_dir"/>
          <el-table-column prop="history_version_dir" label="历史版本路径" v-if="showColumn.history_version_dir"/>
          <el-table-column prop="history_version_number" label="历史版本保留数" v-if="showColumn.history_version_number"/>
          <el-table-column prop="pre_deploy_script" label="部署前执行脚本" v-if="showColumn.pre_deploy_script"/>
          <el-table-column prop="post_deploy_script" label="部署后执行脚本" v-if="showColumn.post_deploy_script"/>
          <el-table-column prop="create_time" label="创建时间" v-if="showColumn.create_time"/>
          <!--操作栏-->
          <el-table-column label="操作" align="left" width="150" fixed="right">
            <template #default="scope">
              <el-button
                size="small"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
            </template>
          </el-table-column>
      </el-table>
    </el-dialog>

    <!--发布配置：编辑对话框-->
    <el-dialog
    :model-value="editDialogVisible"
    @close="editDialogClose"
    width="45%"
    title="修改发布配置"
    >
    <el-steps :space="200" :active="active" align-center style="margin-bottom: 10%">
      <el-step title="基本配置"></el-step>
      <el-step title="构建配置"></el-step>
      <el-step title="部署配置"></el-step>
    </el-steps>
    <el-form :model="form" ref="formRef" :rules="formRules" label-position="right" label-width="160px" >
      <div v-show="active === 1">
          <el-form-item label="发布环境：" prop="env"> <!-- 点击对应环境编辑，不让再选择，所以env数据打开就执行函数-->
            <el-select class="m-2" v-model="form.env.name" placeholder="请选择" style="width: 100%" disabled>
            </el-select>
          </el-form-item>
          <el-form-item label="目标主机：" prop="server_ids">
            <el-select class="m-2" v-model="form.server_ids" multiple placeholder="请选择" @click="getServer" style="width: 100%">
              <el-option v-for="row in server" :key="row.id" :label="row.name" :value="row.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Git仓库：" prop="git_repo">
            <el-input v-model="form.git_repo"></el-input>
          </el-form-item>
          <el-form-item label="Git凭据：" prop="git_credential_id">
            <el-select class="m-2" v-model="form.git_credential_id" placeholder="请选择" @click="getCredential" style="width: 100%" clearable>
              <el-option label="无" :value="0"></el-option>
              <el-option v-for="row in credential" :key="row.id" :label="row.name" :value="row.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消息通知：">
            <el-select class="m-2" v-model="form.notify_id" placeholder="请选择" @click="getNotify" style="width: 100%" clearable>
              <el-option label="无" :value="0"></el-option>
              <el-option v-for="row in notify" :key="row.id" :label="row.name" :value="row.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="form.note" type="textarea"></el-input>
          </el-form-item>
      </div>

      <div v-show="active === 2">
          <el-form-item label="源文件：" prop="source_file">
            <el-input v-model="form.source_file"></el-input>
          </el-form-item>
          <el-form-item label="自定义全局变量：">
            <el-input v-model="form.global_variables" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="代码检出前执行脚本：">
            <el-input v-model="form.pre_checkout_script" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="代码检出后执行脚本：">
            <el-input v-model="form.post_checkout_script" type="textarea"></el-input>
          </el-form-item>
      </div>

      <div v-show="active === 3">
          <el-form-item label="服务器部署路径：" prop="dst_dir">
            <el-input v-model="form.dst_dir"></el-input>
          </el-form-item>
          <el-form-item label="历史版本路径：" prop="history_version_dir">
            <el-input v-model="form.history_version_dir"></el-input>
          </el-form-item>
          <el-form-item label="历史版本保留数：" prop="history_version_number">
            <el-input v-model="form.history_version_number" placeholder="默认7"></el-input>
          </el-form-item>
          <el-form-item label="部署前执行脚本：">
            <el-input v-model="form.pre_deploy_script" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="部署后执行脚本：">
            <el-input v-model="form.post_deploy_script" type="textarea"></el-input>
          </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogClose" v-if="active == 1">取消</el-button>
        <el-button type="primary" @click="editDialogToggle('pre')" v-if="active > 1">上一步</el-button>
        <el-button type="primary" @click="editDialogToggle('next')" v-if="active < 3">下一步</el-button>
        <el-button type="primary" @click="submit" v-if="active == 3">确定</el-button>
      </span>
    </template>
  </el-dialog>


</template>

<script>
export default {
    props: {
      visible: Boolean,
      rowId: ''
    },
    data() {
      return {
        tableData: [],
        columnVisible: false, // 可展示列显示与隐藏
        showColumn: {  // 字段默认是否展示
          env: true,
          server_ids: true,
          git_repo: true,
          git_credential_id: false,
          notify_id: false,
          source_file: false,
          global_variables: false,
          pre_checkout_script: false,
          post_checkout_script: false,
          dst_dir: true,
          history_version_dir: false,
          history_version_number: false,
          pre_deploy_script: false,
          post_deploy_script: false,
          note: false,
          create_time: false
        },
        editDialogVisible: false, // 编辑对话框显示与隐藏
        active: 1,
        env: '',
        server: '',
        credential: '',
        notify: '',
        form: "",
        formRules: {
          env: [
              {required: true, message: '请选择发布环境', trigger: 'blur'}
          ],
          server_ids: [
              {required: true, message: '请选择目标主机', trigger: 'blur'},
          ],
          git_repo: [
              {required: true, message: '请输入Git仓库地址', trigger: 'blur'},
              {min: 16, message: 'Git仓库地址长度应不小于16个字符', trigger: 'blur'}
          ],
          source_file: [
              {required: true, message: '请输入源文件', trigger: 'blur'},
          ],
          dst_dir: [
              {required: true, message: '请输入部署路径', trigger: 'blur'},
              {min: 3, message: '请输入部署路径应不小于3个字符', trigger: 'blur'}
          ],
          history_version_dir: [
              {required: true, message: '请输入历史版本路径', trigger: 'blur'},
              {min: 3, message: '请输入历史版本路径应不小于3个字符', trigger: 'blur'}
          ]
        },
      }
    },
    updated() {  // 这里使用updated，在等父组件传递子组件当前行之后
      // 加载页面时获取数据
      this.getData();
      // 从浏览器本地存储获取历史展示列字段存储
      const columnSet = localStorage.getItem(this.$route.path + "-columnSet2");
      // 如果有则使用本地字段
      if(columnSet) {
        this.showColumn = JSON.parse(columnSet)
      }
    },
    methods: {
        getData() {
          this.$http.get('/app_release/config/',{params: {app: this.rowId}})  // 根据当前应用id显示配置
              .then(res => {
                  this.tableData = res.data.data;
                  // 重新赋值目标主机为数量
                  for(let i in this.tableData) {
                    const server_number = this.tableData[i].server_ids.length;
                    this.tableData[i].server_ids = server_number + ' 台'
                  }
              })
        },
        // 可展示列
        saveColumn() {
          localStorage.setItem(this.$route.path + '-columnSet2', JSON.stringify(this.showColumn));
          this.columnVisible = false;
        },
        // 点击关闭，子组件通知父组件更新属性
        dialogClose() {
            this.$emit('update:visible', false)
        },
        // 删除
        handleDelete(index, row) {
            this.$confirm("你确定要删除选中的吗？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
              })
              .then(() => {  // 点击确定
                this.$http.delete('/app_release/config/'+ row.id + '/')
                    .then(res => {
                      if(res.data.code === 200) {
                        this.$message.success('删除成功');
                        this.tableData.splice(index, 1); // 根据表格索引临时删除数据
                      }
                    });
              })
        },
        // 发布配置：编辑
        handleEdit(index,row) {
            this.$http.get('/app_release/config/'+ row.id + '/')
                .then(res => {
                  if(res.data.code === 200) {
                      this.form = res.data.data;
                      this.editDialogVisible = true
                  }
                });
        },
        // 对话框切换
        editDialogToggle(action) {
            if (action === 'pre') {
                if (this.active-- < 2) {
                  this.active = 1;
                }
            } else if (action === 'next') {
                if (this.active++ > 3) {
                  this.active = 1;
                }
            }
        },
        // 关闭对话框，修改父组件值
        editDialogClose() {
            this.editDialogVisible = false;
        },
        // 获取服务器
        getServer() {
            this.$http.get('/cmdb/server/?page_size=100')
                .then(res => {
                    this.server = res.data.data;
                });
        },
        // 获取凭据
        getCredential() {
            this.$http.get('/config/credential/')
                .then(res => {
                    this.credential = res.data.data;
                });
        },
        // 获取通知
        getNotify() {
            this.$http.get('/config/notify/')
                .then(res => {
                    this.notify = res.data.data;
                });
        },
        // 发布配置编辑提交
        submit() {
          this.$refs.formRef.validate((valid) => {
            if (valid) {
              this.$http.put('/app_release/config/' + this.form.id + '/', this.form)
                .then(res => {
                  if (res.data.code === 200){
                    this.$message.success('修改成功');
                    this.editDialogClose()  // 关闭窗口
                  }
                })
            } else {
              this.$message.error('格式错误！')
            }
          })
        },
    },
    // 监听窗口打开
    watch: {
        editDialogVisible() {
           if(this.editDialogVisible) {
                this.getServer();
                this.getCredential();
                this.getNotify();
           }
        }
    }
};
</script>

<style scoped>

</style>
