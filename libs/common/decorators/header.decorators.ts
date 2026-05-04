// export function Headers() {
//     return applyDecorators(
//         ApiHeader({
//             name: 'header1',
//             description: "description"
//         }),
//         ApiHeader({
//             name: 'header2',
//             description: "description"
//         }),
//         ApiHeader({
//             name: 'header3',
//             description: "description"
//         })
//     );
// }

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { LANG_HEADER } from "../constants";
// Ensure this points to your header key

export const CurrentLang = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    let request;

    // Check if it's a GraphQL request
    if (context.getType<string>() === "graphql") {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    } else {
      // Regular REST request
      request = context.switchToHttp().getRequest();
    }

    // Try to get the language from the header, default to "EN"
    return request?.headers?.[LANG_HEADER] || "EN";
  },
);
