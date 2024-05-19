import { ApiBody } from '@nestjs/swagger';

export const ApiMultiFiles =
  (fileName: string = 'files'): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      type: 'multipart/form-data',
      description: 'Upload file',
      required: true,
      schema: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            items: {
              description: 'File',
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
