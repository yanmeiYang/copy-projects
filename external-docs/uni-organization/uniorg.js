const uni_org = {

  // 组织的名字，可能有多个别名，默认显示第一个。其余的备用。
  names: ['Stanford University', 'Stanford', 'Leland Stanford Junior University'],
  name_zh: '', // 组织的中文名.

  // 枚举类型：表示当前组织的类型; [department | institute | 学会 | 期刊 | 等]
  type: '',
  parent: '', // 上一级组织

  // 结构化的地理位置信息。原始的数据 TODO 需要映射到 geo_address 和 geo_city
  address: {
    city: "Huntsville",
    city_id: 0, // 对应 geo_city
    region: "AL",
    region_id: 0,
    country: {
      text: "USA",
      key: "US",
    },
    country_id: 0,
    addr: [
      "2307 Spring Branch Road"
    ],
    postcode: "35801",
  },
  geo_location: 'ObjectID(xxxx)', // TODO 映射到邵洲的GeoLocation

  // 用来描述数据源信息:

  // source描述了数据来源，应该是个mongo的枚举类型，这样应该比字符串节省空间.
  // [extract_from_pub | scei | manually | 2b customer | 2c customer | ...]
  source: ['scei', 'extract'],

  // TODO sonchi, 我想了一下应该有两部分数据，一部分是original，导入进来时候的原始数据；
  // TODO 另一部分是后来添加的非标准化的2b数据，你觉得是像下面这样写？还是讲original和tob分别提到上层？
  raw: {
    // 额外信息，结构自由，不能建立索引。
    original: {}, // 数据导入时候的原始数据结构。
    tob: {}, // 2b相关的额外数据，可以存储到这里。
  },

  // 其他一些需要索引的数据。

  // 人员组织结构。
  staff: [
    {
      profileId: 0, // 对应2b_profile的id。
      aid: 0, // 对应aminer的ID， TODO 这个需要在这里么？因为2bprofile里面也有对应aminer的ID，你看怎么方便以后使用？
      type: '主席',
      name: '吕健',
      pa: [
        {
          position: '党委书记',
          affiliation: '全国农业展览馆',
        },
        {
          position: '研究员',
          affiliation: '全国农业展览馆',
        }
      ],
    },
    {
      profileId: 0,
      aid: 0,
      type: '理事长',
      name: '吕健',
      pa: [
        {
          position: '院士',
          affiliation: '中国工程院',
        },
      ],
    }
  ],
  members: 9999, // 会员数量。

  // 其他信息。
  creator: 123, // 创建者， 用户ID
  create_time: '2018-01-01', // 创建时间。
  update_time: '2018-01-01', // 元数据更新时间。
};
