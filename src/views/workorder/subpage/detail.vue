<template>
  <div class="app-container">
    <el-form label-width="100px">
      <el-form-item label="问题标题:">
        {{ replies.title }}
      </el-form-item>
    </el-form>
    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="(reply, index) in replies.replies" :key="index" name="1" :is-active="false">
        <template slot="title">
          <span v-if="reply.type == 1">时间: {{ reply.created_at }}</span>
          <span v-if="reply.type == 2">工程师回复: {{ reply.created_at }}</span>
        </template>
        <section class="ql-container ql-snow">
          <div v-if="reply.type == 1" v-html="reply.content" class="ql-editor ql-blank"></div>
          <div v-if="reply.type == 2" v-html="reply.content" class="ql-editor ql-blank"></div>
        </section>
        <viewattachment :attachments='reply.attachment'></viewattachment>
      </el-collapse-item>
    </el-collapse>
    <div class="rate-wrap" v-if="showRateInfo">
      <h2>意见</h2>
      <div class="content" v-text="replies.evaluation.evaluation_content"></div>
      <h2>问题是否解决</h2>
      <div class="content">
        <span v-text="replies.evaluation.solved ? '已解决' : '未解决'"></span>
      </div>
      <h2>评分</h2>
      <div class="content">
        <el-row>
          <el-col :span="2">服务态度：</el-col>
          <el-col :span="22">
            <el-rate v-model="replies.evaluation.service_attitude"
            disabled
            show-text
            :texts="rate.texts"
            :text-template="rate.texts[replies.evaluation.service_attitude - 1]"
            :text-color="rate.color"></el-rate>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">响应时间：</el-col>
          <el-col :span="22">
            <el-rate v-model="replies.evaluation.response_time"
            disabled
            show-text
            :texts="rate.texts"
            :text-template="rate.texts[replies.evaluation.response_time - 1]"
            :text-color="rate.color"></el-rate>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">处理结果：</el-col>
          <el-col :span="22">
            <el-rate v-model="replies.evaluation.handle_result"
            disabled
            show-text
            :texts="rate.texts"
            :text-template="rate.texts[replies.evaluation.handle_result - 1]"
            :text-color="rate.color"></el-rate>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { getWorkorderById } from '@/api/workorders';
  import Viewattachment from '@/components/Viewattachment';

  export default {
    components: {
      Viewattachment
    },
    data() {
      return {
        replies: [],
        activeNames: ['1'],
        rate: {
          color: '#f90',
          texts: ['极差', '差', '一般', '良好', '优秀']
        }
      }
    },
    computed: {
      showRateInfo() {
        return this.replies.evaluation && this.replies.evaluation.service_attitude;
      }
    },
    mounted() {
      getWorkorderById(this.$route.params.id)
        .then(res => {
          this.replies = res.data.data;
        });
    }
  }

</script>

<style lang="scss" scoped>
  @import '../../../styles/quill.snow.scss';

  .ql-container {
    &.ql-snow {
      border: none;
    }
  }

  .el-form-item__label {
    text-align: left;
    font-size: 17px;
  }

  .el-form-item__content {
    margin-left: 0px !important;
  }

  .el-textarea__inner {
    height: 225px !important;
  }

  .rate-wrap {
    margin-top: 25px;
    border: 1px solid #dfe6ec;
    border-width: 0 1px 1px;
    font-size: 14px;

    & > h2 {
      margin: 0;
      padding: 15px 10px;
      font-size: 14px;
      font-weight: normal;
      background-color: #fbfdff;
      border: 1px solid #dfe6ec;
      border-width: 1px 0;
    }

    & > .content {
      padding: 10px;

      & > .el-row {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
</style>