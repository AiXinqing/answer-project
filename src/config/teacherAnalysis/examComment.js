import  request from '@/utils/http'

// 试卷讲评
export function getExamComment({ tid,tsid,cid, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid,tsid,cid }
  })
}

// 试卷讲评单项学生名单
export function getExamCommentDetail({ tid,tsid,cid,tqid,scoreOrOptions, url }) {
  return request({
    url: url,
    method: 'get',
    params: { tid,tsid,cid,tqid,scoreOrOptions }
  })
}