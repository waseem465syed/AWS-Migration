import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';


interface RDSStackProps extends cdk.StackProps {
    vpc: ec2.Vpc;
    ec2SecurityGroupAccess: ec2.SecurityGroup;
}


export class RDSStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: RDSStackProps) {
        super(scope, id, props);


        // RDS Security Group
        const rdsSecurityGroup = new ec2.SecurityGroup(this, 'RDSSecurityGroup', {
            vpc: props.vpc,
            description: 'Security Group for RDS Instance',
            allowAllOutbound: false,
        });

        // Allow inbound traffic from EC2 Instance Security Group
        rdsSecurityGroup.addIngressRule(
            ec2.Peer.securityGroupId(props.ec2SecurityGroupAccess.securityGroupId),
            ec2.Port.tcp(3306), // MySQL default port
            'Allow MySQL access from EC2 Instance in Public Subnet AZ1'
        );
        
        cdk.Tags.of(rdsSecurityGroup).add('Name', 'RDS-Security-Group');


        // RDS Instance
        const rdsInstance = new rds.DatabaseInstance(this, 'MyRDSDatabase', {
            vpc: props.vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                availabilityZones: [props.vpc.availabilityZones[0], props.vpc.availabilityZones[1]], // RDS placed in the first two AZs
            },

            engine: rds.DatabaseInstanceEngine.mysql({
                version: rds.MysqlEngineVersion.VER_8_0,
            }),

            securityGroups: [rdsSecurityGroup], // Attach defined security group to RDS instance
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
            allocatedStorage: 20,
            maxAllocatedStorage: 30,
            multiAz: true, // Failover support 
            publiclyAccessible: false,

            deletionProtection: false, // Disable deletion protection for testing purposes
            removalPolicy: cdk.RemovalPolicy.DESTROY, // Destroy the instance when the stack is deleted

            databaseName: 'MyDatabase',
        });

        cdk.Tags.of(rdsInstance).add('Name', 'My-RDS-Instance');
    }
}