<template>
    <el-dialog
      :model-value="visible"
      width="60%"
      :title=row.title
      @close="dialogClose"
      >
        <el-steps style="margin-bottom: 5%">
          <el-step title="检出前任务" status="finish"></el-step>
          <el-step title="执行检出" status="finish"></el-step>
          <el-step title="检出后任务" status="finish"></el-step>
          <el-step title="代码备份" status="finish"></el-step>
          <el-step title="推送代码" status="finish"></el-step>
          <el-step title="发布前任务" status="finish"></el-step>
          <el-step title="发布后任务" status="finish"></el-step>
        </el-steps>
        <div class="result">
            <span v-if="result.hasOwnProperty('检出前任务')">
                <el-divider content-position="left">检出前任务</el-divider>
                <span v-if="Object.keys(result['检出前任务'].success).length !== 0">
                    <span v-for="(v, ip) in result['检出前任务'].success" :key="v">
                        【{{ip}}】{{v.start}}<br>
                        <span v-if="v.stdout.length !== 0">
                            <pre>{{v.cmd}}<br>{{v.stdout}}</pre>
                        </span>
                        <span v-else>
                            <pre>{{v.cmd}}<br>{{v.stderr}}</pre>
                        </span>
                    </span>
                </span>
                <span v-else-if="Object.keys(result['检出前任务'].failed).length !== 0">
                    <span v-for="(v, ip) in result['检出前任务'].failed" :key="v">
                        【{{ip}}】{{v.start}}<br>
                        <span v-if="v.stdout.length !== 0">
                            <pre>{{v.cmd}}<br>{{v.stdout}}</pre>
                        </span>
                        <span v-else>
                            <pre>{{v.cmd}}<br>{{v.stderr}}</pre>
                        </span>
                    </span>
                </span>
                <span v-else>
                    <span v-for="(v, ip) in result['检出前任务'].unreachable" :key="v">
                        【{{ip}}】{{v.start}}<br>
                        <span v-if="v.stdout.length !== 0">
                            <pre>{{v.cmd}}<br>{{v.stdout}}</pre>
                        </span>
                        <span v-else>
                            <pre>{{v.cmd}}<br>{{v.stderr}}</pre>
                        </span>
                    </span>
                </span>
            </span>

            <span v-if="result.hasOwnProperty('执行检出')">
                <el-divider content-position="left">执行检出</el-divider>
                <span v-if="Object.keys(result['执行检出'].success).length !== 0">
                    <span v-for="(v, ip) in result['执行检出'].success" :key="v">
                        【{{ip}}】{{v.start}}<br>
                        代码地址：{{v.invocation.module_args.repo}}<br>
                        拉取分支：{{v.invocation.module_args.version}}<br>
                        克隆目录：{{v.invocation.module_args.dest}}
                    </span>
                </span>
                <span v-else-if="Object.keys(result['执行检出'].failed).length !== 0">
                    <span v-for="(v, ip) in result['执行检出'].failed" :key="v">
                        【{{ip}}】{{v.start}}<br>
                        代码地址：{{v.invocation.module_args.repo}}<br>
                        拉取分支：{{v.invocation.module_args.version}}<br>
                        克隆目录：{{v.invocation.module_args.dest}}
                        {{v.msg}}
                    </span>
                </span>
                <span v-else>
                    <span v-for="(v, ip) in result['执行检出'].unreachable" :key="v">
                        【{{ip}}】{{v.start}}<br>
                         {{v.msg}}
                    </span>
                </span>
            </span>

            <span v-if="result.hasOwnProperty('检出后任务')">
                <el-divider content-position="left">检出后任务</el-divider>
                <span v-if="Object.keys(result['检出后任务'].success).length !== 0">
                    <span v-for="(v, ip) in result['检出后任务'].success" :key="v">
                        【{{ip}}】{{v.start}}<br>
                        <span v-if="v.stdout.length !== 0">
                            <pre>{{v.cmd}}<br>{{v.stdout}}</pre>
                        </span>
                        <span v-else>
                            <pre>{{v.cmd}}<br>{{v.stderr}}</pre>
                        </span>
                    </span>
                </span>
                <span v-else-if="Object.keys(result['检出后任务'].failed).length !== 0">
                    <span v-for="(v, ip) in result['检出后任务'].failed" :key="v">
                        【{{ip}}】{{v.start}}<br>
                        <span v-if="v.stdout.length !== 0">
                            <pre>{{v.cmd}}<br>{{v.stdout}}</pre>
                        </span>
                        <span v-else>
                            <pre>{{v.cmd}}<br>{{v.stderr}}</pre>
                        </span>
                    </span>
                </span>
                <span v-else>
                    <span v-for="(v, ip) in result['检出后任务'].unreachable" :key="v">
                        【{{ip}}】<br>
                         {{v.msg}}
                    </span>
                </span>
            </span>

            <span v-if="result.hasOwnProperty('代码备份')">
                <el-divider content-position="left">代码备份</el-divider>
                <span v-if="Object.keys(result['代码备份'].success).length !== 0">
                    <span v-for="(v, ip) in result['代码备份'].success" :key="v">
                        【{{ip}}】{{v.start}}<br>
                        <span v-if="v.stdout.length !== 0">
                            <pre>{{v.cmd}}<br>{{v.stdout}}</pre>
                        </span>
                        <span v-else>
                            <pre>{{v.cmd}}<br>{{v.stderr}}</pre>
                        </span>
                    </span>
                </span>
                <span v-else-if="Object.keys(result['代码备份'].failed).length !== 0">
                    <span v-for="(v, ip) in result['代码备份'].failed" :key="v">
                        【{{ip}}】{{v.start}}<br>
                        <span v-if="v.stderr.length !== 0">
                            <pre>{{v.cmd}}<br>{{v.stderr}}</pre>
                        </span>
                        <span v-else-if="Object.keys(v.msg).length !== 0">
                            <pre>{{v.msg}}</pre>
                        </span>
                        <span v-else>
                            <pre>{{v.cmd}}<br>{{v.stdout}}</pre>
                        </span>
                    </span>
                </span>
                <span v-else>
                        <span v-for="(v, ip) in result['代码备份'].unreachable" :key="v">
                            【{{ip}}】<br>
                            {{v.msg}}
                        </span>
                </span>
            </span>

            <span v-if="result.hasOwnProperty('推送代码')">
                <el-divider content-position="left">推送代码</el-divider>
                <span v-if="Object.keys(result['推送代码'].success).length !== 0">
                    <span v-for="(v, ip) in result['推送代码'].success" :key="v">
                        【{{ip}}】{{v.start}}<br>
                        <pre>{{v.cmd}}<br>{{v.stdout}}</pre>
                    </span>
                </span>
                <span v-else-if="Object.keys(result['推送代码'].failed).length !== 0">
                    <span v-for="(v, ip) in result['推送代码'].failed" :key="v">
                        【{{ip}}】{{v.start}}<br>
                         {{v.msg}}
                    </span>
                </span>
                <span v-else>
                    <span v-for="(v, ip) in result['推送代码'].unreachable" :key="v">
                        【{{ip}}】{{v.start}}<br>
                         {{v.msg}}
                    </span>
                </span>
            </span>

            <span v-if="result.hasOwnProperty('发布前任务')">
                <el-divider content-position="left">发布前任务</el-divider>
                <span v-if="Object.keys(result['发布前任务'].success).length !== 0">
                    <span v-for="(v, ip) in result['发布前任务'].success" :key="v">
                        【{{ip}}】{{v.start}}<br>
                        <span v-if="v.stdout.length !== 0">
                            <pre>{{v.cmd}}<br>{{v.stdout}}</pre>
                        </span>
                        <span v-else>
                            <pre>{{v.cmd}}<br>{{v.stderr}}</pre>
                        </span>
                    </span>
                </span>
                <span v-else-if="Object.keys(result['发布前任务'].failed).length !== 0">
                    <span v-for="(v, ip) in result['发布前任务'].failed" :key="v">
                        【{{ip}}】{{v.start}}<br>
                        <span v-if="v.stdout.length !== 0">
                            <pre>{{v.cmd}}<br>{{v.stdout}}</pre>
                        </span>
                        <span v-else>
                            <pre>{{v.cmd}}<br>{{v.stderr}}</pre>
                        </span>
                    </span>
                </span>
                <span v-else>
                    <span v-for="(v, ip) in result['发布前任务'].unreachable" :key="v">
                        【{{ip}}】{{v.start}}<br>
                         {{v.msg}}
                    </span>
                </span>
            </span>

            <span v-if="result.hasOwnProperty('发布后任务')">
                <el-divider content-position="left">发布后任务</el-divider>
                <span v-if="Object.keys(result['发布后任务'].success).length !== 0">
                    <span v-for="(v, ip) in result['发布后任务'].success" :key="v">
                        【{{ip}}】{{v.start}}<br>
                        <span v-if="v.stdout.length !== 0">
                            <pre>{{v.cmd}}<br>{{v.stdout}}</pre>
                        </span>
                        <span v-else>
                            <pre>{{v.cmd}}<br>{{v.stderr}}</pre>
                        </span>
                    </span>
                </span>
                <span v-else-if="Object.keys(result['发布后任务'].failed).length !== 0">
                    <span v-for="(v, ip) in result['发布后任务'].failed" :key="v">
                        【{{ip}}】{{v.start}}<br>
                        <span v-if="v.stdout.length !== 0">
                            <pre>{{v.cmd}}<br>{{v.stdout}}</pre>
                        </span>
                        <span v-else>
                            <pre>{{v.cmd}}<br>{{v.stderr}}</pre>
                        </span>
                    </span>
                </span>
                <span v-else>
                    <span v-for="(v, ip) in result['发布后任务'].unreachable" :key="v">
                        【{{ip}}】{{v.start}}<br>
                         {{v.msg}}
                    </span>
                </span>
            </span>
        </div>
        <br><br><br>
        <span v-loading="loading" element-loading-text="发布中..." style="width: 100%; position: absolute;bottom: 30%;"></span>
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
                loading: true,
                result: ''
            }
        },
        methods: {
            // 关闭对话框，修改父组件值
            dialogClose() {
                this.$emit('update:visible', false)
            },
        },
        watch: {
           visible() {
               if(this.visible){
                   this.result = "";  // 再次点击发布清空原先日志
                   this.loading = true;
                   this.row.deploy_result = "";  // 保存在前端的日志不传递后端
                   this.$http.post('/app_release/deploy/', this.row,  {timeout: 30000})
                      .then(res => {
                        if(res.data.code === 200) {
                            this.result = res.data.data;
                            this.$message.success('发布成功');
                            this.loading = false
                        } else {
                            this.result = res.data.data;
                            this.loading = false
                        }
                        this.parent.getData(); // 更新发布状态
                      });

               }
           }
        }

    }
</script>

<style scoped>
    .result {
        font-size: 16px;
        line-height:30px;
        white-space: normal;
        overflow: hidden;
    }
    .result pre {
        background: #000000;
        color: #FFFFFF;
        padding: 10px;
    }
</style>