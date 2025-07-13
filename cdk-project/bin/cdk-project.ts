#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkProjectStack } from '../lib/cdk-project-stack';
import { IAMStack } from '../lib/iam-stack';
import { EC2Stack } from '../lib/ec2-stack';
import { RDSStack } from '../lib/rds-stack';
import { Construct } from 'constructs'; 
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam'; 




const app = new cdk.App();
const vpcstack = new CdkProjectStack(app, 'CdkProjectStack', {

});

const iamStack = new IAMStack(app, "MyIAMStack", {
  vpc: vpcstack.vpc,
});

const ec2Stack = new EC2Stack(app, "MyEC2Stack", {
  vpc: vpcstack.vpc,
  ec2Role: iamStack.ec2Role, // Role for EC2 instances to access AWS services
});

new RDSStack(app, "MyRDSStack", {
  vpc: vpcstack.vpc,
  ec2SecurityGroupAccess: ec2Stack.ec2SecurityGroup, // Security group for EC2 instance
});

app.synth();