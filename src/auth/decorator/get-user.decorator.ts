import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Copied from: https://docs.nestjs.com/custom-decorators#custom-route-decorators
// Alows to optionaly return only a single field instead of the whole User object.
export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  // Return the specified field
  if (data) {
    return request.user[data];
  }

  // Return the complete object
  return request.user;
});
