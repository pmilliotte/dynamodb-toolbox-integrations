import { App } from "aws-cdk-lib";
import { PutItemTestStack } from "../PutItemTest/TestStack";
import { TestStack } from "./TestStack";

const app = new App();

new TestStack(app, "UpdateTestStack");
// new PutItemTestStack(app, "PutTestStack");
