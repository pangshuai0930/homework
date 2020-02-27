<template>
  <div>
    <el-form style="margin-top:30px;overflow:hidden" v-if="files.length">
      <span style="float:left">附件:</span>
      <el-form-item style="float:left;">
        <div class="upload-wrap" style="border:none">
          <ul class="el-upload-list el-upload-list--picture-card">
            <li v-for="(file, index) in files">
              <div class="el-upload-list__item">
                <img v-if="file.isImage" :src="file.url" :alt="file.name" @click="showDialog(index)">
                <a v-else :href="file.url" target="_blank" class="el-icon-document other-file"></a>
              </div>
              <p class="filename" v-text="file.name"></p>
            </li>
          </ul>
        </div>
      </el-form-item>
    </el-form>
    
    <el-dialog title="附件图片" :visible.sync="dialogVisible">
      <el-carousel ref="carousel" trigger="click" :autoplay="carouselProps.autoplay" :initial-index="carouselProps.index">
        <el-carousel-item v-for="(url, index) in images" :key="index">
          <a :href="url" target="_blank">
            <img :src="url" class="carousel_images">            
          </a>
        </el-carousel-item>
      </el-carousel>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
  .carousel_images {
    width: 100%;
    height: auto;
  }

  .el-upload-list {
    overflow: hidden;
  }

  .el-upload-list > li {
    float: left;
    margin: 0 0 10px 10px;

    .other-file {
      display: block;
      font-size: 72px;
      line-height: 148px;
      text-align: center;
    }
    
    & > .el-upload-list__item {
      margin: 0;
    }
    
    & > .filename {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      width: 148px;
      height: 63px;
      padding: 0;
      margin: 0;
      text-align: center;
      word-wrap: break-word;
      word-break: normal;
      line-height: 1.5;
    }
  }

  .el-upload-list__item > img {
    width: 148px;
    height: 148px;
  }

  .el-carousel__item {
    overflow: visible;
    height: auto;
  }
</style>

<script>
  import { getFilenameByPath } from '@/utils/'
  import { validateImage } from '@/utils/validate';

  export default {
    props: ['attachments'],
    data() {
      return {
        dialogVisible: false,
        carouselProps: {
          autoplay: false,
          index: 0
        }
      }
    },
    computed: {
      files() {
        return this.attachments.map(item => {
          const URI = decodeURI(item);

          return {
            url: URI,
            name: getFilenameByPath(URI),
            isImage: validateImage(URI)
          };
        });
      },
      images() {
        return this.attachments.filter(item => validateImage(item));
      }
    },
    methods: {
      showDialog(index) {
        this.dialogVisible = true;

        if (this.$refs.carousel) {
          this.$refs.carousel.setActiveItem(index);
        }
      }
    }
  }
</script>