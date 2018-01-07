/**
 * Created by bogao on 17/11/2.
 */
import { sysconfig } from 'systems';
import { request, nextAPI, config } from 'utils';
import { apiBuilder, F } from 'utils/next-api-builder';

const LabelTagName = F.Tags.systag;

/**
 * Add Label to any Entity.
 */
export async function addLabelToEntity(payload) {
  const { targetId, tag, entity } = payload;
  // assert.notNull(tag);
  const nextapi = apiBuilder.alter(F.alters.dims, 'addLabelToEntity')
    .param({
      ids: [targetId],
      type: entity,
      opts: [
        {
          operator: F.alterop.upsert,
          fields: [
            {
              field: LabelTagName,
              value: tag,
            },
          ],
        },
      ],
      // dims: {
      //   [LabelTagName]: { op: F.alterop.upsert, value: tag },
      // },
    });
  return nextAPI({ type: 'alter', data: [nextapi.api] });
}

export async function removeLabelFromEntity(payload) {
  const { targetId, tag, entity } = payload;
  const nextapi = apiBuilder.alter(F.alters.dims, 'removeLabelFromEntity')
    .param({
      ids: [targetId],
      type: entity,
      opts: [
        {
          operator: F.alterop.delete,
          fields: [
            {
              field: LabelTagName,
              value: tag,
            },
          ],
        },
      ],
      // dims: {
      //   [LabelDimension]: { op: F.alterop.delete, value: tag },
      // },
    });
  return nextAPI({ type: F.Type.Alter, data: [nextapi.api] });
}

export async function fetchLabelsByIds(payload) {
  const { ids } = payload;
  const nextapi = apiBuilder.query(F.queries.search, 'fetchLabelsByIds')
    .param({
      ids,
      haves: { [LabelTagName]: [] },
      switches: ['master'],
    })
    .schema({ person: ['id'] });
  return nextAPI({ data: [nextapi.api] });
}
