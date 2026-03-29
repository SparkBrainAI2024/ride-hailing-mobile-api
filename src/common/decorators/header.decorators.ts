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
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentLang = createParamDecorator((data: string, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.lang || "EN";
});

