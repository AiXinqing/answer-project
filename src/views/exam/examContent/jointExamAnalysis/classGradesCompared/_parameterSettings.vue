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
        :item-index="i"
        @remove-outline="removeOutline"
        @plus-outline="plusOutline"
        @verify-change="verifyChange"
      />
    </div>
    <div 
      v-if="isdisabledFn"
      class="verify_style"
    >得分率名称 最低分 最高分不能为空</div>

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
        parameter:{},
        tid:''
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
        const {tid,tsid,type} = obj.parameter
        this.parameter = {
          tid:tid,
          tsid:tsid,
          type:type
        }
        this.tid = tid
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
          subend:Number(item.subend),
          substart:Number(item.substart)
        })) 

        let params = {
          prmASAnalyseSettingList:JSON.stringify(this.data)
        }
        this.$http.post(this.URL.SaveComparedASAnalyseSetting, qs.stringify(params) ).then(res => {

          if(res.data.ResponseCode == 'Success'){
            this.openedFrame = false
            this.$emit('change-set')
          }

        }).catch(error => {
          this.fullscreenLoading = false
        })
      },

      removeOutline(item){
        const {obj,index} = item
        // 删除
        let params = {
          asid:obj.asid
        }
        if(obj.asid == undefined){
          this.data = this.data.filter((element,i) => i != index)
          this.isdisabledFn = false
        }else{
          this.$http.post(this.URL.DeleteASAnalyseSetting, qs.stringify(params) ).then(res => {
            if(res.data.ResponseCode == 'Success'){
              this.data = this.data.filter(element => element.asid != obj.asid)
              this.isdisabledFn = false
            }
          }).catch(error => {
            this.fullscreenLoading = false
          })
        }
        
      },

      plusOutline(item){
        // 追加
        let vacant = this.data.filter((itme) => itme.subend == '' || itme.substart == '' || itme.subname == '')

        if(vacant.length <= 1){
          this.data.push({...item,...this.parameter})
        }
        this.isdisabledFn = true
      },

      verifyChange(verify){
        this.isdisabledFn = verify
      }
    },
  }
</script>

<style lang="less">
  @import '~@/assets/css/variables.less';
  .el-input__inner{
    padding: 0;
  }
  .verify_style{
    color:@error;
    font-size:14px;
    padding-left: 14px;
    margin-top: 10px;
  }
</style>
