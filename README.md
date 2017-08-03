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

1. TODO 工程简介。
1. TODO 开发流程简介。



-------------------------------------------------

活动需要修改：

1. 给每个system创建一个人的库。这个库有一些基础信息，也可以关联到aminer；

tob_person:

```javascript
tob_person_item_example = {
  id: 123456,       // db object id.
  sid: '0000001S'   // system source ID.
  aid: 34234234234, // linked aminer id.

  // 以下信息是来自于客户，比如ccf。
  name: 'name in client system', 
  name_zh: '中文名',
  gender: 'male',
  title: '职位',
  level: '级别/头衔，在客户系统中的级别',
  affiliation: '工作单位',
  address: '地址',
  email: '',
  phone: '',
  
  
}

```

1. person

活动功能需要重新做了。
设置大会主席：有专门的贡献度，大会主席不用演讲标题，要有个人简介。
大会主席也放到人里面，
每个人添加一个角色（在此活动中的角色，比如大会主席，演讲者等），

