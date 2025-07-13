import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';


interface IAMStackProps extends cdk.StackProps {
    vpc: ec2.Vpc;
}


export class IAMStack extends cdk.Stack {

    // Export IAM role for EC2 instances
    public readonly ec2Role: iam.Role;

    constructor(scope: Construct, id: string, props: IAMStackProps) {
        super(scope, id, props);

        // IAM Role for EC2 instances
        this.ec2Role = new iam.Role(this, 'EC2Role', {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            description: "Role for EC2 instances to access AWS services"
        });

        // Allows EC2 instances to be managed by AWS Systems Manager
        this.ec2Role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));

    }
}