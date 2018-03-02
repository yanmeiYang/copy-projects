import { sysconfig } from 'systems';
import { request, nextAPI, config } from 'utils';
import { apiBuilder, F } from 'utils/next-api-builder';

const LabelDimension = 'systag';
let followTestData ;

export async function updateLabelToEntity(payload) {
  // const { followId, follow } = payload;
  // console.log('===============!!!!!!$##', payload);
  followTestData.push(payload);
  console.log('===============!!!!!!$##', followTestData);
  // const nextapi = apiBuilder.alter(F.alters.dims, 'updateLabelFromEntity')
  //   .param({
  //     ids: [targetId],
  //     type: entity,
  //     dims: {
  //       [LabelDimension]: { op: F.alterop.delete, value: tag },
  //     },
  //   });
  return { data: followTestData };
}

// export async function addLabelToEntity(payload) {
//   const { targetId, tag, entity } = payload;
//   const nextapi = apiBuilder.alter(F.alters.alter, 'addLabelToEntity')
//     .param({
//       ids: [targetId],
//       type: entity,
//       dims: {
//         [LabelDimension]: { op: F.alterop.upsert, value: tag },
//       },
//     });
//   return nextAPI({ type: 'alter', data: [nextapi.api] });
// }
//
// export async function removeLabelFromEntity(payload) {
//   const { targetId, tag, entity } = payload;
//   const nextapi = apiBuilder.alter(F.alters.dims, 'removeLabelFromEntity')
//     .param({
//       ids: [targetId],
//       type: entity,
//       dims: {
//         [LabelDimension]: { op: F.alterop.delete, value: tag },
//       },
//     });
//   return nextAPI({ type: F.Type.Alter, data: [nextapi.api] });
// }

export async function fetchLabelsByIds(payload) {
  const test = [
    {
      id: '53f42f36dabfaedce54dcd0c',
      follow: ['Red', 'Yellow', 'Cyan', 'Green', 'Blue'],
    },
    {
      id: '53f47977dabfae8a6845b643',
      follow: ['Red', 'Yellow', 'Cyan', 'Green', 'Blue'],
    },
    {
      id: '53f4ab9cdabfaecc2877b55a',
      follow: ['Red', 'Yellow', 'Cyan', 'Green', 'Blue'],
    },
    {
      id: '53f437bedabfaec09f189843',
      follow: ['Red', 'Yellow', '', 'Green', 'Blue'],
    },
    {
      id: '53f46185dabfaee2a1d9b892',
      follow: ['Red', 'Yellow', '', '', 'Blue'],
    },
    {
      id: '53f4718edabfaeb22f559444',
      follow: ['Red', 'Yellow', '', '', 'Blue'],
    },
  ];
  // const { ids } = payload;
  // const nextapi = apiBuilder.query(F.queries.search, 'fetchLabelsByIds')
  //   .param({
  //     ids,
  //     haves: { [LabelDimension]: [] },
  //     switches: ['master'],
  //   })
  //   .schema({ person: ['id'] });
  // console.log('==========aaa', followTestData);
  followTestData = test;
  return { data: test };
}
