/**
 *  Created by BoGao on 2017-07-27;
 */
const TopExpertBase = {
  ACMFellow: [
    { id: '5976aa479ed5dbca0866aa4a', name: 'ACM Fellows<2015' },
    { id: '596c130f9ed5db449d3fbe83', name: 'ACM Fellows 53 2016' },
  ],
  IEEEFellow: [
    {
      id: '595208bd9ed5dbf9cd563c60.593e4ac29ed5db77fc7be728.593beddb9ed5db23ccac7dbf.593b7c889ed5db23ccac68e6',
      name: 'IEEE Fellow',
    },
  ],
  TopUniversity2015: [
    { index: 1, name: 'Massachusetts Institute of Technology', id: '58f4b0ab9ed5dbe8d7c85803', abbr: 'MIT' },
    { index: 2, name: 'Tsinghua University', id: '58f46d249ed5dbe8d7c841f1', abbr: '清华大学计算机科学与技术系' },
    { index: 3, name: 'Stanford University', id: '58ef2b1d9ed5dbe8d7c7e6f2', abbr: '' },
    { index: 4, name: 'Nanyang Technological University', id: '58f473b99ed5dbe8d7c84408', abbr: '' },
    { index: 5, name: 'University of Texas--Austin', id: '58f5ac8b9ed5dbe8d7c8a001', abbr: 'University of Texas--Austin' },
    { index: 6, name: 'Harvard University', id: '58edeb5e9ed5db4bf7e85b14', abbr: 'Harvard University Computer Science' },
    { index: 7, name: 'University of California--Berkeley', id: '58ede6489ed5db4bf7e85712', abbr: 'Berkeley EECS' },
    { index: 8, name: 'National University of Singapore', id: '58f471559ed5dbe8d7c843a1', abbr: '' },
    { index: 9, name: 'City University Hong Kong', id: '58ef41a59ed5dbe8d7c7f0ef', abbr: 'City University Hong Kong Computer Science' },
    { index: 10, name: 'Princeton University', id: '58ef324c9ed5dbe8d7c7e96c', abbr: 'Princeton University Computer Science' },
    { index: 11, name: 'Huazhong University of Science and Technology', id: '58f474ba9ed5dbe8d7c84437', abbr: '' },
    { index: 12, name: 'Hong Kong University of Science and Technology', id: '58ef4cd09ed5dbe8d7c7f2c0', abbr: '' },
    { index: 13, name: 'Shanghai Jiao Tong University', id: '58f6c9f69ed5dbe8d7c8c8dc', abbr: '' },
    { index: 14, name: 'University of Southern California', id: '58f39ebf9ed5dbe8d7c82d81', abbr: '' },
    { index: 15, name: 'Zhejiang University', id: '58f461059ed5dbe8d7c83e5e', abbr: '' },
    { index: 16, name: 'Georgia Institute of Technology', id: '58f4831a9ed5dbe8d7c851fd', abbr: '' },
    { index: 17, name: 'University of California--San Diego', id: '58f5f93d9ed5dbe8d7c8b412', abbr: '' },
    { index: 18, name: 'University of Waterloo', id: '58f33b329ed5dbe8d7c8275b', abbr: '' },
    { index: 19, name: 'Swiss Federal Institute of Technology Zurich', id: '58f081639ed5dbe8d7c80ee2', abbr: '' },
    { index: 20, name: 'University of Toronto', id: '58f0496c9ed5dbe8d7c802b5', abbr: '' },
    { index: 21, name: 'University College London', id: '58f70be89ed5db397ba2860d', abbr: '' },
    { index: 22, name: 'Chinese University Hong Kong', id: '58f6c9f09ed5dbe8d7c8c8db', abbr: '' },
    { index: 23, name: 'University of British Columbia', id: '58f57dc49ed5dbe8d7c8958e', abbr: '' },
    { index: 24, name: 'Carnegie Mellon University', id: '58f58d639ed5dbe8d7c89bc5', abbr: '' },
    { index: 25, name: 'University of Cambridge', id: '58f5f93a9ed5dbe8d7c8b411', abbr: '' },
    { index: 26, name: 'University of California--Los Angeles', id: '58f9c6729ed5db9818622249', abbr: '' },
    { index: 27, name: 'École Polytechnique Federale of Lausanne', id: '58f9c6769ed5db981862224a', abbr: '' },
    { index: 28, name: 'Imperial College London', id: '58fc9b0d9ed5db981862ab4c', abbr: '' },
    { index: 29, name: 'Southeast University', id: '58fe076a9ed5dbf4cae31583', abbr: '' },
    { index: 30, name: 'Technical University of Munich', id: '58fb306d9ed5db9818624255', abbr: '' },
    { index: 31, name: 'Hong Kong Polytechnic University', id: '590ad13a9ed5dbd22727c8cb', abbr: '' },
    { index: 32, name: 'Catholic University of Leuven', id: '58fe08d79ed5dbf4cae315ad', abbr: '' },
    { index: 33, name: 'University of Oxford', id: '58ff328a9ed5db9a7cfdc11d', abbr: '' },
    { index: 34, name: 'University of Edinburgh', id: '590062299ed5db9a7cfe03cf', abbr: '' },
    { index: 35, name: 'Korea Advanced Institute of Science and Technology', id: '58ff2c2d9ed5db9a7cfdbfed', abbr: '' },
    { index: 36, name: 'University of Illinois--Urbana-Champaign', id: '590c882c9ed5dbd22727ef01', abbr: '' },
    { index: 37, name: 'Polytechnic University of Catalonia', id: '5901c2ab9ed5db9bbf53e587', abbr: '' },
    { index: 38, name: 'University of Maryland--College Park', id: '5901cce09ed5db9bbf53e680', abbr: '' },
    { index: 39, name: 'National Taiwan University', id: '590d65159ed5db67cf85810e', abbr: '' },
    { index: 40, name: 'Beijing University of Posts and Telecommunications', id: '5902fab79ed5db9bbf54128d', abbr: '' },
    { index: 41, name: 'University of Hong Kong', id: '591d5c879ed5db5ef6157a28', abbr: '' },
    { index: 42, name: 'Peking University', id: '590729fd9ed5dbd2272757e5', abbr: '' },
    { index: 43, name: 'University of Melbourne', id: '5903fe309ed5dbd227272684', abbr: '' },
    { index: 44, name: 'Columbia University', id: '5903fdc19ed5dbd22727267b', abbr: '' },
    { index: 45, name: 'Harbin Institute of Technology', id: '590855b69ed5dbd22727849f', abbr: '' },
    { index: 46, name: 'University of California--Irvine', id: '59069e479ed5dbd227274c04', abbr: '' },
    { index: 47, name: 'University of Michigan--Ann Arbor', id: '5906fb049ed5dbd22727551e', abbr: '' },
    { index: 48, name: 'National Cheng Kung University', id: '5907298c9ed5dbd2272757d2', abbr: '' },
    // where is 49?
    { index: 50, name: 'University of Washington', id: '590948709ed5dbd227279fcc', abbr: '' },
  ],
};

const ACMFellowExpertBaseIndex = {
  '5976aa479ed5dbca0866aa4a': { name: 'ACM Fellows<2015' },
  '596c130f9ed5db449d3fbe83': { name: 'ACM Fellows 53 2016' },
};

const TopUnivExpertBaseIndex = {};
TopExpertBase.TopUniversity2015.map((eb) => {
  TopUnivExpertBaseIndex[eb.id] = eb;
  return null;
});

// tools. TODO 支持多个库的 concat.
function toIDDotString(ebs) {
  return ebs.reduce((result, eb) => {
    return `${result.id}.${eb.id}`;
  });
}

module.exports = {
  TopExpertBase,
  ACMFellowExpertBaseIndex,
  TopUnivExpertBaseIndex,
  toIDDotString,
};
