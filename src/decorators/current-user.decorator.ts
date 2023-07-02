import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const CurrentUserId = createParamDecorator(
  (_: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    return request.userId
  },
)
