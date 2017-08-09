# Aminer2b

## Development Environment

IDE：WebStrom Latest version.

### IDE Settings
1. Open webstrom preference page: WebStrom -> Preferences -> Languages & Frameworks -> JavaScript: 
1. Under [JavaScript language version], select "React JSX".
1. Under [Node.js and NPM] Enable Node.js Core library.
1. Under "Code Quality Tools", Enable "ESLint".


### Development Guides

1. #### 开发流程规范：
1. 所有实习生所作的工作都要fork一个工程，然后提交MergeRequest由管理员来审核。
1. 前端代码我需要

1. TODO 工程简介。
1. TODO 开发流程简介。



-------------------------------------------------

AMiner2b系统需要一个独立的存储person信息的表格。

1. 给每个system创建一个Person的库。这个库有一些基础信息，可以与Aminer 的Person关联。（格式见下面JSON）
1. 需要索引的字段大概有：id, system, sid, aid, status, type, name, name_zh, email, level, title.
1. 需要的API:
    1. /api/2b/person/:system/create/ -- data:<tob_person>
    1. /api/2b/person/:system/get/:id(tob_person id)
    1. /api/2b/person/:system/get/:id.id.id.id
    1. /api/2b/person/:system/getByAid/:id(aminer id)
    1. /api/2b/person/:system/getByAid/:id.id.id.id(aminer id)
    1. /api/2b/person/:system/edit/:id -- data:<tob_person>
    1. /api/2b/person/:system/delete/:id
    1. /api/2b/person/:system/search?name=?&name_zh=?&..... // 可以不传任何参数。就是返回所有数据，你自己加上分页page,size吧。
    1. 


Appendix A - tob_person:

```javascript
tob_person_item_example = {
  id: 123456,       // db object id.
  system: 'ccf',    // [ccf|huawei|...]
  sid: '0000001S'   // system source ID.
  aid: 34234234234, // linked aminer id.

  status: '',       // 字符串型，预留
  type: '',         // 字符串型，预留

  // 以下信息是来自于客户，比如ccf。
  name: 'name in client system', 
  name_zh: '中文名',
  gender: 'male',
  title: '职位',
  level: '级别/头衔，在客户系统中的级别',
  affiliation: '工作单位',
  address: '地址',
  email: 'elivoa@gmail.com',
  phone: '',

  // 额外的功能，我可以自定义存储什么数据。
  extra_data:{
    extra_data1:'',
    age: '' ,
  }

  create_time: '2015-09-09' // 时间类型，创建时间；
  update_time: '2015-09-09' // 时间类型，修改时间；

}

```

