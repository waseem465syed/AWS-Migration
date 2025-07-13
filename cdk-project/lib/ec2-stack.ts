import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';


interface EC2StackProps extends cdk.StackProps {
    vpc: ec2.Vpc;
    ec2Role: iam.Role; // Role for EC2 instances to access AWS services
}


export class EC2Stack extends cdk.Stack {

    // Export security group for RDS stack
    public readonly ec2SecurityGroup: ec2.SecurityGroup;

    constructor(scope: Construct, id: string, props: EC2StackProps) {
        super(scope, id, props);


        // Security Group for EC2 instances
        this.ec2SecurityGroup = new ec2.SecurityGroup(this, 'EC2SecurityGroup', {
            vpc: props.vpc,
            description: 'Security Group for EC2 Instance',
            allowAllOutbound: true,
        });

        /* Allow inbound SSH traffic from any IPv4 to EC2 instances
         * Added for emergency access; restrict in production
        */
        this.ec2SecurityGroup.addIngressRule(
            ec2.Peer.anyIpv4(), 
            ec2.Port.tcp(22), // SSH port
            'Allow SSH access from from any IPv4 address'
        );

        // Allow inbound HTTP traffic from any IPv4 to EC2 instances
        this.ec2SecurityGroup.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(80), // HTTP port
            'Allow HTTP access from any IPv4 address'
        );

        cdk.Tags.of(this.ec2SecurityGroup).add('Name', 'Public-EC2-SG');


        // EC2 instance in AZ1
        const instanceAZ1 = new ec2.Instance(this, 'Public-EC2-Instance-AZ1', {
            vpc: props.vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
                availabilityZones: [props.vpc.availabilityZones[0]], // EC2 placed in the first AZ
            },
            machineImage: new ec2.AmazonLinuxImage({
                generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
            }),
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO), // t2.micro 
            securityGroup: this.ec2SecurityGroup, // Attach defined security group to the instance
            role: props.ec2Role, // Attach the IAM role to the instance
        
        });   
        
        cdk.Tags.of(instanceAZ1).add('Name', 'Public-EC2-Instance-AZ1');


        // EC2 instance in AZ2
        const instanceAZ2 = new ec2.Instance(this, 'Public-EC2-Instance-AZ2', {
            vpc: props.vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
                availabilityZones: [props.vpc.availabilityZones[1]], // EC2 placed in the second AZ
            },
            machineImage: new ec2.AmazonLinuxImage({
                generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
            }),
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO), // t2.micro 
            securityGroup: this.ec2SecurityGroup, // Attach defined security group to the instance
            role: props.ec2Role, // Attach the IAM role to the instance

        });   
        
        cdk.Tags.of(instanceAZ2).add('Name', 'Public-EC2-Instance-AZ2');
    }
}