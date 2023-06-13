<template>
    <el-card class="box-card">
    <div class="tools">
         <div class="tools-left">
            <el-input
              v-model="urlParams.search"
              placeholder="搜索标题"
              @keyup.enter="onSearch"
              clearable
              @clear="onSearch"
              class="search"
            />
            <!--选择发布环境-->
            <el-select v-model="urlParams.env" class="m-2" @click="getEnv" clearable placeholder="发布环境" @clear="onSearch">
                <el-option v-for="row in env" :key="row.id" :label="row.name" :value="row.id">
                </el-option>
            </el-select>
            <!--选择应用-->
            <el-select v-model="urlParams.app" class="m-2" @click="getApp" clearable placeholder="应用" @clear="onSearch">
                <el-option v-for="row in app" :key="row.id" :label="row.name" :value="row.id" >
                </el-option>
            </el-select>
            <el-button type="primary" @click="onSearch"><el-icon><search /></el-icon>&nbsp;查询</el-button>
        </div>
         <div class="tools-right">
            <el-button type="primary"  @click="createDialogVisible = true"><el-icon><plus /></el-icon>&nbsp;发布申请</el-button>
             <!--展示列弹出框-->
            <el-popover placement="left" :width="100" :visible="columnVisible">
              <template #reference>
                <el-button type="primary" @click="columnVisible = true"><el-icon><setting /></el-icon>&nbsp;展示列</el-button>
              </template>
                <el-checkbox v-model="showColumn.title" disabled>申请标题</el-checkbox>
                <el-checkbox v-model="showColumn.env">发布环境</el-checkbox>
                <el-checkbox v-model="showColumn.app">应用名称</el-checkbox>
                <el-checkbox v-model="showColumn.branch">代码分支</el-checkbox>
                <el-checkbox v-model="showColumn.status">状态</el-checkbox>
                <el-checkbox v-model="showColumn.note">备注</el-checkbox>
                <el-checkbox v-model="showColumn.release_time">发布时间</el-checkbox>
                <el-checkbox v-model="showColumn.create_time">创建时间</el-checkbox>
                <div style="text-align: right; margin: 0">
                  <el-button size="small" @click="columnVisible = false">取消</el-button>
                  <el-button size="small" type="primary" @click="saveColumn">确认</el-button>
                </div>
            </el-popover>

         </div>
    </div>

    <el-table
        ref="Table"
        :data="tableData"
        border
        prop
        style="width: 100%"
        :header-cell-style="{ background: '#F0F2F5' }"
      >
          <el-table-column prop="title" label="申请标题" fixed="left" sortable v-if="showColumn.title"/>
          <el-table-column prop="env" label="发布环境" sortable v-if="showColumn.env">
            <template #default="scope">
              {{scope.row.release_config.env.name}}
            </template>
          </el-table-column>
          <el-table-column prop="release_config.app.name" label="应用名称" v-if="showColumn.app"/>
          <el-table-column prop="branch" label="代码分支" v-if="showColumn.branch"/>
          <el-table-column prop="status" label="状态" v-if="showColumn.status">
            <template #default="scope">
              <el-tag v-if="scope.row.status === 1">待发布</el-tag>
              <el-tag type="warning" v-if="scope.row.status === 2">发布中</el-tag>
              <el-tag type="success" v-if="scope.row.status === 3">发布成功</el-tag>
              <el-tag type="danger" v-if="scope.row.status === 4">发布失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="note" label="备注" sortable v-if="showColumn.note"/>
          <el-table-column prop="release_time" label="发布时间" v-if="showColumn.release_time"/>
          <el-table-column prop="create_time" label="创建时间" sortable v-if="showColumn.create_time"/>
<!--                v-if="!scope.row.deploy_result"-->
<!--                v-if="scope.row.deploy_result"-->
        <!--操作栏-->
        <el-table-column label="操作" align="left" width="260px">
          <template #default="scope">
               <el-button
                size="small"
                type="success"
                @click="handleDeploy(scope.$index, scope.row)"

                >发布</el-button>
              <el-button
                size="small"
                type="primary"
                @click="handleDeployResult(scope.$index, scope.row)"

                >查看</el-button>
              <el-button
                size="small"
                type="info"
                @click="handleRollback(scope.$index, scope.row)"
                >回滚</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div style="margin-top: 20px">
        <el-pagination
          v-model:currentPage="currentPage"
          :page-sizes="[10, 15, 20, 25, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
  </el-card>

  <ApplyCreate v-model:visible="createDialogVisible"></ApplyCreate>
  <Deploy v-model:visible="deployDialogVisible" :row="row"></Deploy>
  <DeployResult v-model:visible="resultDialogVisible" :rowId="rowId"></DeployResult>
  <Rollback v-model:visible="rollbackDialogVisible" :row="row"></Rollback>
</template>

<script>
    import ApplyCreate from "./ApplyCreate";
    import Deploy from "./Deploy";
    import DeployResult from "./DeployResult";
    import Rollback from "./Rollback";
    import CSS from '../server/server.css';
    export default {
        data() {
          return {
            tableData: [],
            currentPage: 1, // 默认开始页面
            pageSize: 10, // 默认每页的数据条数
            total: 0,  // 总数据条数
            urlParams: {   // URL查询参数，传递服务端，放这里方便修改值
              page_num: 1,
              page_size: 10,
              search: '',
              env: '',
              app: '',
            },
            row: '',
            rowId: '',
            createDialogVisible: false, // 创建对话框显示与隐藏
            deployDialogVisible: false,  // 编辑对话框显示与隐藏
            resultDialogVisible: false,  // 查看对话框显示与隐藏
            rollbackDialogVisible: false,
            showColumn: {
              title: true,
              app: true,
              env: true,
              branch: true,
              status: true,
              note: true,
              release_time: true,
              create_time: false,
            },
            columnVisible: false,
            env: '',
            app: '',
          }
        },
        mounted() {
          this.getData();
          // 从浏览器本地存储获取历史存储展示
          const columnSet = localStorage.getItem(this.$route.path + '-columnSet');
          if(columnSet) {
              this.showColumn = JSON.parse(columnSet)
          }
        },
        methods: {
          getData() {
            if(!this.urlParams.search) {
              delete this.urlParams.search
            }
            if(!this.urlParams.env) {
              delete this.urlParams.env
            }
            if(!this.urlParams.app) {
              delete this.urlParams.app
            }
            this.$http.get('/app_release/apply/', {params: this.urlParams})
              .then(res => {
                this.tableData = res.data.data;
                this.total = res.data.count;
              })
          },
          // 分页：监听【选择每页数量】的事件
          handleSizeChange(pageSize) {
              // console.log(pageSize)
              this.pageSize = pageSize; // 重新设置分页显示
              this.urlParams.page_size = pageSize;  // 将最新值设置到数据里，用于下面用新值重新获取数据
              this.getData()
          },
          // 分页：监听【点击页码】的事件
          handleCurrentChange(currentPage) {
              // console.log(currentPage)
              this.currentPage = currentPage; // 重新设置分页显示
              this.urlParams.page_num = currentPage;
              this.getData()
          },
          // 操作栏：编辑显示
          handleEdit(index, row) {
              this.editDialogVisible = true;
              this.rowId = row.id; // 传递给子组件当前行ID
          },
          // 操作栏：删除
          handleDelete(index, row) {
              // console.log(index, row);
              this.$confirm("你确定要删除选中的吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "error"
                })
                .then(() => {  // 点击确定
                  this.$http.delete('/app_release/apply/'+ row.id + '/')
                      .then(res => {
                        if(res.data.code === 200) {
                          this.$message.success('删除成功');
                          this.tableData.splice(index, 1); // 根据表格索引临时删除数据
                        }
                      });
                })
          },
          // 搜索按钮
          onSearch() {
            this.getData();
          },
          saveColumn() {
              // 将可显示的字段存储到浏览器本地存储
              localStorage.setItem(this.$route.path + '-columnSet', JSON.stringify(this.showColumn));
              this.columnVisible = false;
          },
          // 获取目标主机
          getEnv() {
            this.$http.get('/app_release/env/')
                .then(res => {
                    this.env = res.data.data;
                });
          },
          // 获取目标主机
          getApp() {
            this.$http.get('/app_release/app/')
                .then(res => {
                    this.app = res.data.data;
                });
          },
          // 发布
          handleDeploy(index, row) {
              // this.$http.post('/app_release/deploy/', row)
              //   .then(res => {
              //        if(res.data.code === 200) {
              //         this.$message.success('发布中');
              //       }
              //   });
              this.deployDialogVisible = true;
              this.row = row;
          },
          // 查看
          handleDeployResult(index, row) {
              this.resultDialogVisible = true;
              this.rowId = row.id;
          },
          // 查看
          handleRollback(index, row) {
              this.rollbackDialogVisible = true;
              this.row = row;
              console.log(this.row)
          }
        },
        components: {
            ApplyCreate,
            Deploy,
            DeployResult,
            Rollback,
            CSS,
        }
    }
</script>

<style scoped>
    .tools {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    .tools-left {
        display: flex;
    }
    .search {
        width: 150px;
        margin-right: 10px;
    }
    .tools-right {
        display: flex;
    }

</style>