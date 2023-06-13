<template>
   <el-card>
       <div class="tools">
           <div class="tools-left">
               <el-input
                  v-model="urlParams.search"
                  placeholder="请输入关键字"
                  @keyup.enter="onSearch"
                  clearable
                  @clear="onSearch"
                  class="search"
                />
            <el-button type="primary" @click="onSearch"><el-icon><search /></el-icon>&nbsp;搜索</el-button>
           </div>
            <div class="tools-right">
                <el-button type="primary" @click="createDiglogVisible = true"><el-icon><Plus /></el-icon>&nbsp;创建</el-button>

                <!--展示列弹出框-->
                <el-popover placement="left" :width="100" v-model:visible='columnVisible'>
                  <template #reference>
                    <el-button type="primary" @click="columnVisible = true"><el-icon><setting /></el-icon>&nbsp;展示列</el-button>
                  </template>
                <el-checkbox v-model="showColumn.name" disabled>项目名称</el-checkbox>
                <el-checkbox v-model="showColumn.english_name" disabled>英文名称</el-checkbox>
                <el-checkbox v-model="showColumn.note">备注</el-checkbox>
                <el-checkbox v-model="showColumn.create_time">创建时间</el-checkbox>
                    <div style="text-align: right; margin: 0">
                      <el-button size="small" type="text" @click="columnVisible = false">取消</el-button>
                      <el-button size="small" type="primary" @click="saveColumn">确认</el-button>
                    </div>
                </el-popover>
            </div>
       </div>
       <el-table
               :data="tableData"
               border
               style="width: 100%"
       >
          <el-table-column prop="name" label="项目名称" fixed="left" sortable v-if="showColumn.name"/>
          <el-table-column prop="english_name" label="英文名称" fixed="left" sortable v-if="showColumn.english_name"/>
          <el-table-column prop="note" label="备注" v-if="showColumn.note"/>
          <el-table-column prop="create_time" label="创建时间" sortable v-if="showColumn.create_time"/>

        <el-table-column fixed="right" label="操作栏" width="150" flexd>
          <template #default="scope">
            <el-button type="primary" size="small" @click="Edit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="Delete(scope.$index, scope.row)">删除</el-button>
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

<ProjectEdit v-model:visible="editDiglogVisible"  :row="currentRow"></ProjectEdit>
<ProjectCreate v-model:visible="createDiglogVisible"></ProjectCreate>
</template>

<script>

    import ProjectEdit from '@/views/app_project/projectEdit';
    import ProjectCreate from '@/views/app_project/projectCreate';
    export default {
        name: "Project",
        data() {
          return {
            tableData: [],
            currentPage: 1, // 默认开始页面
            pageSize: 10, // 默认每页的数据条数
            total: 0,  // 总数据条数
            urlParams: {   // URL查询参数，传递服务端，放这里方便修改值
              page_num: 1,
              page_size: this.pageSize,
              search: '',
            },
            editDialogVisible: false,  // 编辑对话框显示与隐藏
            currentRow: '',
            editDiglogVisible: false,
            createDiglogVisible: false,
            createDialogVisible: false, // 创建对话框显示与隐藏
            showColumn: {
              name: true,
              english_name: true,
              note: true,
              create_time: false
            },
            columnVisible: false
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
                this.$http.get('/app_release/project/', {params: this.urlParams})
                .then(res => {
                    this.tableData = res.data.data;
                    this.total = res.data.count;
                })
            },
            // 分页：监听【选择每页数量】的事件
            handleSizeChange(pageSize) {
                this.pageSize = pageSize; // 重新设置分页显示
                this.urlParams.page_size = pageSize;  // 将最新值设置到数据里，用于下面用新值重新获取数据
                this.getData()
            },
            // 分页：监听【点击页码】的事件
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage; // 重新设置分页显示
                this.urlParams.page_num = currentPage;
                this.getData()
            },
            Edit(index, row) {
                this.editDiglogVisible = true;
                this.currentRow = row; // 将当前行内容传递给子组件
            },
            Delete(index, row) {
                this.$confirm("你确定要删除这条记录吗？", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                  })
                  .then(() => {  // 点击确定
                    this.$http.delete('/app_release/project/'+ row.id + '/')
                        .then(res => {
                          if(res.data.code === 200) {
                            this.$message.success(res.data.msg);
                            this.tableData.splice(index, 1); // 根据表格索引临时删除数据
                          }
                        });
                  })
            },
            onSearch() {
                this.getData()
            },
            saveColumn() {
                // 将可显示的字段存储到浏览器本地存储
                localStorage.setItem(this.$route.path + '-columnSet', JSON.stringify(this.showColumn));
                this.columnVisible = false;
            }
        },
        components: {
            ProjectEdit,
            ProjectCreate,
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