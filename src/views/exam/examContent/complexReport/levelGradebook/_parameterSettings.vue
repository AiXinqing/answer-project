<template>
  <hj-dialog
    class="newAdd-content"
    :title="'等级设置'"
    :visible.sync="openedFrame"
    :width="'420px'"
    :before-close="closeFrame"
    :show-close="false"
    :append-to-body="true"
  >
    
    <div class="lvle_box">
      <div class="lvle_boxList">
        <setFrom
          v-for="(item,i) in  data"
          :key="i"
          :group="item"
          :item-index="i"
          @remove-outline="removeOutline"
          @verify-change="verifyChange"
        />
      </div>
      <div class="add_lvle" @click="plusOutline" >+ 添加等级</div>
    </div>
    <div class="lvle_tig"> <i class="el-icon-warning-outline lvle_tig_icon"/> 所填值为分数百分比，各等级所填值依次递减，统计数据包含所填值</div>
    <div class="dialog-footer">
      <hj-button type="cancel" @click="closeFrame">取 消</hj-button>
      <hj-button
        type="confirm"
        :disabled="isdisabledFn"
        @click="handelDetermine"
        v-loading.fullscreen.lock="fullscreenLoading"
      >确 定</hj-button>
    </div>
  </hj-dialog>
</template>

<script>
  import qs from 'qs'
  import { mapState} from 'vuex'
  import setFrom from './_setFrom'
  export default {
    components: {
      setFrom
    },

    props: {
      lvleList:{
        type:Array,
        default:() => []
      },
      lvleType:{
        type:Object,
        default:()=>{}
      }
    },

    data() {
      return {
        openedFrame: false,
        data:[],
        fullscreenLoading:false,
        subject:'',
        parameter:{},
        tid:'',
        verify:true
      }
    },

    computed: {
      ...mapState('parameterSet', ['tableLoading','TableList']),

      isdisabledFn(){
        return this.verify ? true : false
      }
    },

    watch: {
      lvleList:{
        immediate: true,
        handler () {
          this.data = this.lvleList
        },
      },
    },

    methods: {
      openFrame(){
        this.verify = false
        this.openedFrame = true
      },

      closeFrame() {
        this.data = this.lvleList
        this.verify = false
        this.openedFrame = false
      },

      handelDetermine(){
        // 保存
        this.data = this.data.map(item => ({
          ...item,
          ...this.lvleType,
        }))

        let params = {
          prmASAnalyseLvlList:JSON.stringify(this.data)
        }
        this.$http.post(this.URL.SaveASAnalyseLvl, qs.stringify(params) ).then(res => {

          if(res.data.ResponseCode == 'Success'){
            this.openedFrame = false
            this.$emit('change-set')
          }

        }).catch(() => {
          this.fullscreenLoading = false
        })
      },

      removeOutline(item){
        const {obj,index} = item
        this.data = this.data.filter((item,i) => i !=index)
        const indexs = this.data.findIndex((item) => item.substart == '' || item.subname == '')
        if(indexs > -1){
          this.verify = true
        }else{
          this.verify = false
        }
      },

      plusOutline(){
        // 追加
        const index = this.data.findIndex((item) => item.substart == '' || item.subname == '')
        if(index > -1){
          this.$message({
            message: '请先完善添加的等级',
            type: 'warning'
          })
        }else{
          if(this.data.length){
            let lastData = this.data[this.data.length-1]
            this.data.push({
              ...this.lvleType,
              subend: lastData.substart,
              subname: '',
              substart: null,
            })
          }else{
            this.data.push({
              subend: '100',
              subname: '',
              substart: null,
              ...this.lvleType,
            })
          }
        }
      },

      verifyChange(verify){
        this.verify = verify
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  i.el-icon-warning-outline{
    &.lvle_tig_icon{
      color: @warning;
      font-size: 16px;
    }
  }
  .lvle_boxList{
    max-height: 550px;
    overflow: auto;
  }
  .add_lvle{
    height: 35px;
    width: 100%;
    text-align: center;
    font-size: 16px;
    color: @main;
    border:1px solid @main;
    line-height: 35px;
    border-radius: 4px;
    cursor: pointer;
  }
  .lvle_box {
    border: 1px solid @ece;
    padding: 5px 15px;
    margin-bottom: 10px;
  }
</style>
