<template>
  <hj-dialog
    class="newAdd-content"
    :title="'设置'+ subject +'得分率'"
    :visible.sync="openedFrame"
    :width="'820px'"
    :before-close="closeFrame"
    :show-close="false"
    :append-to-body="true"
  >
    <div class="Bin_line_box">
      <div class="binLine_th">
        <div>名称</div>
        <div>最低分</div>
        <div>最高分</div>
        <div>操作</div>
      </div>
      <setFrom
        v-for="(item,i) in  data"
        :key="i"
        :group="item"
        @remove-outline="removeOutline"
        @plus-outline="plusOutline"
        @verify-change="verifyChange"
      />
    </div>
    <div class="verify_style"></div>

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
    data() {
      return {
        openedFrame: false,
        isdisabledFn:false,
        data:[],
        fullscreenLoading:false,
        subject:'',

      }
    },

    computed: {
      ...mapState('parameterSet', ['tableLoading','TableList']),
    },

    watch: {
      TableList:{
        immediate: true,
        handler () {
          this.data = this.TableList
        },
      },
    },

    methods: {
      openFrame(obj){
        this.$store.dispatch('parameterSet/GetStuResults', obj.parameter)
        this.subject = obj.subject
        this.openedFrame = true
      },

      closeFrame() {
        this.openedFrame = false
      },

      handelDetermine(){
        // 保存
        this.data = this.data.map(item => ({
          ...item,
          subend:number(item.subend),
          substart:number(item.substart)
        })) 

        let params = {
          prmASAnalyseSettingList:JSON.stringify(this.data)
        }
        this.$http.post(this.URL.SaveASAnalyseSetting, qs.stringify(params) ).then(res => {

          if(res.data.ResponseCode == 'Success'){
            console.log(res)
          }

        }).catch(error => {
          this.fullscreenLoading = false
        })
      },

      removeOutline(item){
        // 删除
        let params = {
          asid:item.asid
        }
        this.$http.post(this.URL.DeleteASAnalyseSetting, qs.stringify(params) ).then(res => {

          if(res.data.ResponseCode == 'Success'){
            this.data = this.data.filter(element => element.asid != item.asid)
          }

        }).catch(error => {
          this.fullscreenLoading = false
        })
      },

      plusOutline(item){
        // 追加
        this.data.push(item)
        this.isdisabledFn = true
      },

      verifyChange(verify){
        this.isdisabledFn = verify
      }
    },
  }
</script>

<style lang="less">
  .el-input__inner{
    padding: 0;
  }
</style>
