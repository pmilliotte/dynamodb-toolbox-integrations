# Welcome to your CDK TypeScript Construct Library project

You should explore the contents of this project. It demonstrates a CDK Construct Library that includes a construct (`DynamodbToolboxIntegrationsLib`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The construct defines an interface (`DynamodbToolboxIntegrationsLibProps`) to configure the visibility timeout of the queue.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests

## Available DynamoDB-toolbox entity features

### Entity definitions

These entity properties are taken into account when doing the following operations:

| DDB-toolbox entity options | GetItem | UpdateItem | PutItem | Query              |
| -------------------------- | ------- | ---------- | ------- | ------------------ |
| attributes                 | :x:     | :x:        | :x:     | :x:                |
| autoExecute                | :x:     | :x:        | :x:     | :x:                |
| autoParse                  | :x:     | :x:        | :x:     | :x:                |
| created                    | :x:     | :x:        | :x:     | :white_check_mark: |
| createdAlias               | :x:     | :x:        | :x:     | :x:                |
| modified                   | :x:     | :x:        | :x:     | :white_check_mark: |
| modifiedAlias              | :x:     | :x:        | :x:     | :x:                |
| name                       | :x:     | :x:        | :x:     | :white_check_mark: |
| table                      | :x:     | :x:        | :x:     | :white_check_mark: |
| timestamps                 | :x:     | :x:        | :x:     | :white_check_mark: |
| typeAlias                  | :x:     | :x:        | :x:     | :x:                |
| typeHidden                 | :x:     | :x:        | :x:     | :x:                |

### Entity attributes

This package only relates to entity definition based on `object` definitions.

> :warning: Entity definitions by string or array are not supported.

| DDB-toolbox attribute feature | GetItem | UpdateItem | PutItem | Query                                 |
| ----------------------------- | ------- | ---------- | ------- | ------------------------------------- |
| alias                         | :x:     | :x:        | :x:     | :x:                                   |
| coerce                        | :x:     | :x:        | :x:     | :x:                                   |
| default                       | :x:     | :x:        | :x:     | :white_check_mark: for `static value` |
| delimiter                     | :x:     | :x:        | :x:     | :x:                                   |
| dependsOn                     | :x:     | :x:        | :x:     | :x:                                   |
| format                        | :x:     | :x:        | :x:     | :x:                                   |
| hidden                        | :x:     | :x:        | :x:     | :x:                                   |
| map                           | :x:     | :x:        | :x:     | :x:                                   |
| onUpdate                      | :x:     | :x:        | :x:     | :x:                                   |
| prefix                        | :x:     | :x:        | :x:     | :x:                                   |
| partitionKey                  | :x:     | :x:        | :x:     | :white_check_mark:                    |
| required                      | :x:     | :x:        | :x:     | :white_check_mark:                    |
| save                          | :x:     | :x:        | :x:     | :x:                                   |
| setType                       | :x:     | :x:        | :x:     | :x:                                   |
| sortKey                       | :x:     | :x:        | :x:     | :white_check_mark:                    |
| suffix                        | :x:     | :x:        | :x:     | :x:                                   |
| transform                     | :x:     | :x:        | :x:     | :x:                                   |
| type                          | :x:     | :x:        | :x:     | `string`, `number`, `boolean`         |

### Query

The Query operation finds items based on primary key values. You can query any entity that has a composite primary key (a partition key and a sort key).

### How to use Query

You must provide the name of the partition key attribute and a single value for that attribute. Query returns all items with that partition key value.

Initialize your Query construct with a name and en entity.

1/ Define your entity (check supported entity attributes)

```
import { Entity } from "dynamodb-toolbox";
const MyEntity = new Entity({
    name: "Query",
    attributes: {
        pk: {
            partitionKey: true,
            type: "string",
        },
        sk: { sortKey: true, type: "string" },
        },
    table: TestQueryTable,
    });
```

2- In the constructor of the Construct where you want to use the query command, initialize your Query construct with a name and en entity

```
import { App, Stack } from '@aws-cdk/core';
import {DynamodbToolboxQuery} from 'dynamodb-toolbox-integrations';

const app = new App();
const stack = new Stack(app);

const { chain } = new DynamodbToolboxQuery(stack, 'nameId',
    entity: MyEntity,
    tableArn: MyTableArn,
    });
```

The chain can then be used in the definition of a state machine.

```
import { LogGroup } from "aws-cdk-lib/aws-logs";
import {
  StateMachine,
  Succeed,
} from "aws-cdk-lib/aws-stepfunctions";


const stateMachine = new StateMachine(stack, "QueryStepFunction", {
    definition: chain.next(new Succeed(scope, "QuerySuccessTask")),
});
```

Give your stateMachine the rights to query your table:

```
stateMachine.addToRolePolicy(
      new PolicyStatement({
        actions: ["dynamodb:Query"],
        resources: [tableArn],
      })
    );
```
