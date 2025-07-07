import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as iam from 'aws-cdk-lib/aws-iam';
import {Stack, StackProps} from 'aws-cdk-lib';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

   // Create a VPC with 2 availability zones, 1 public subnet and 1 private subnet per availability zone
    const vpc = new ec2.Vpc(this, 'MigrationVpc', {
      maxAzs: 2, // Default is all AZs in the region
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'PrivateSubnet',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });


    // Create Security Group for ec2 instances and allow
    // SSH access and App Traffic
    const ec2SecurityGroup = new ec2.SecurityGroup(this, 'EC2SecurityGroup', {
      vpc,
      description: 'Allow SSH and app traffic',
      allowAllOutbound: true,
    });
    ec2SecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH access');
    ec2SecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP traffic');
    ec2SecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS traffic');

    // Create a Security Group for RDS and allow access from the EC2 Security Group
    const rdsSecurityGroup = new ec2.SecurityGroup(this, 'RDSSecurityGroup', {
      vpc,
      description: 'Allow access from EC2 instances',
      allowAllOutbound: true,
    });
    rdsSecurityGroup.addIngressRule(ec2SecurityGroup, ec2.Port.tcp(3306), 'Allow MySQL access from EC2 instances');

    // Create an IAM role for the EC2 instances
    const ec2Role = new iam.Role(this, 'EC2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });
    ec2Role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));

    //create ec2 instances in the public subnet
    const ec2Instance = new ec2.Instance(this, 'MigrationEC2Instance', {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
      securityGroup: ec2SecurityGroup,
      role: ec2Role,
    });

    // create rds in the private subnet
    const rdsInstance = new rds.DatabaseInstance(this, 'MigrationRDSInstance',
      {engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0,
      }),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [rdsSecurityGroup],
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      allocatedStorage: 20, // Minimum storage for MySQL 8.0
      removalPolicy: cdk.RemovalPolicy.DESTROY, // delete the database when the stack is deleted
    });
  }
}
