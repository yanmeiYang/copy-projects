/**
 * Created by bogao on 17/11/2.
 */
import { sysconfig } from 'systems';
import { request, nextAPI, config } from 'utils';
import { apiBuilder, F } from 'utils/next-api-builder';

const LabelDimension = 'systag';

/**
 * Add Label to any Entity.
 */
export async function addLabelToEntity(payload) {
  const { targetId, tag, entity } = payload;
  const nextapi = apiBuilder.alter(F.alters.alter)
    .param({
      ids: [targetId],
      type: entity,
      dims: {
        [LabelDimension]: { op: F.alterop.upsert, value: tag },
      },
    });
  return nextAPI({ type: 'alter', data: [nextapi.api] });
}
