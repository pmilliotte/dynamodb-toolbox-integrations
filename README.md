# Welcome to your CDK TypeScript Construct Library project

You should explore the contents of this project. It demonstrates a CDK Construct Library that includes a construct (`DynamodbToolboxIntegrationsLib`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The construct defines an interface (`DynamodbToolboxIntegrationsLibProps`) to configure the visibility timeout of the queue.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests

## Available DynamoDB-toolbox entity features

### Entity definitions

| DDB-toolbox entity options | GetItem            | GetItem            | PutItem            |
| -------------------------- | ------------------ | ------------------ | ------------------ |
| name                       | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| timestamps                 | :x:                | :x:                | :x:                |
| created                    | :x:                | :x:                | :x:                |
| modified                   | :x:                | :x:                | :x:                |
| createdAlias               | :x:                | :x:                | :x:                |
| modifiedAlias              | :x:                | :x:                | :x:                |
| typeAlias                  | :x:                | :x:                | :x:                |
| typeHidden                 | :x:                | :x:                | :x:                |
| attributes                 | :x:                | :x:                | :x:                |
| autoExecute                | :x:                | :x:                | :x:                |
| autoParse                  | :x:                | :x:                | :x:                |
| table                      | :x:                | :x:                | :x:                |

### Entity attributes

This package only relates to entity definition based on `object` definitions.

> :warning: Entity definitions by string or array are not supported.

| DDB-toolbox attribute feature | GetItem | UpdateItem         | PutItem                               |
| ----------------------------- | ------- | ------------------ | ------------------------------------- |
| type                          | :x:     | `string`, `number` | `string`, `number`, `boolean`         |
| coerce                        | :x:     | :x:                | :x:                                   |
| default                       | :x:     | :x:                | :white_check_mark: for `static value` |
| dependsOn                     | :x:     | :x:                | :x:                                   |
| onUpdate                      | :x:     | :x:                | :x:                                   |
| save                          | :x:     | :x:                | :x:                                   |
| hidden                        | :x:     | :x:                | :x:                                   |
| required                      | :x:     | :white_check_mark: | :white_check_mark:                    |
| alias                         | :x:     | :x:                | :white_check_mark:                    |
| map                           | :x:     | :x:                | :white_check_mark:                    |
| setType                       | :x:     | :x:                | :x:                                   |
| delimiter                     | :x:     | :x:                | :x:                                   |
| prefix                        | :x:     | :x:                | :white_check_mark:                    |
| suffix                        | :x:     | :x:                | :white_check_mark:                    |
| transform                     | :x:     | :x:                | :x:                                   |
| format                        | :x:     | :x:                | :x:                                   |
| partitionKey                  | :x:     | :white_check_mark: | :white_check_mark:                    |
| sortKey                       | :x:     | :white_check_mark: | :white_check_mark:                    |
