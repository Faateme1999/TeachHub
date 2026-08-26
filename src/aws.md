- AWS: Amazon Web Services
- Amazon S3 stands for Simple Storage Service.
  - It is AWS's service for storing files and objects in the cloud. (Basically, if it's a file, S3 can store it.)
- S3: the storage service
- Bucket = the container inside S3
- S3 is the service.
- A bucket is something you create inside S3.

- You don't create S3. AWS already provides the S3 service. You only create buckets inside S3.
- Amazon S3
  │
  └── My Bucket
  │
  ├── photo.jpg
  ├── resume.pdf
  └── movie.mp4

- S3 is the storage service that AWS provides.
- A bucket is a storage container that you create inside the S3 service.
- Technically, the file always goes into a bucket, because S3 requires every object to be stored in a bucket.
- Objects (files) are stored inside buckets.
- AWS
  │
  ├── EC2 → Computing service
  ├── S3 → Storage service
  ├── RDS → Database service
  ├── SQS → Queue service
  └── IAM → Security service

- Inside S3
  │
  ├── Bucket 1
  ├── Bucket 2
  └── Bucket 3

- S3
  │
  └── Bucket: student-notes
  │
  ├── aws.pdf
  ├── notes.docx
  └── exam.txt

- User uploads a photo.
- Your application sends it to S3.
- S3 stores it.
- Your database stores only information about the photo, such as its S3 location.

- cloud computing: The cloud is renting someone else's computers over the Internet.
  - With AWS Today, instead of buying hardware, you simply rent computing resources.(servers, storage, databases, etc.)
    - If you need:
      - one virtual computer → use EC2
      - file storage → use S3
      - a database → use RDS
      - a queue → use SQS
  - AWS provisions them in minutes, and you generally pay only for what you use.
  - As a developer, your focus shifts from managing hardware to building software.
    - Instead of asking: "Which server should I buy?" you ask: "Which AWS service best fits my application?"
  - Instead of spending thousands (or millions) on servers, companies generally pay only for the resources they use.
  - Cloud (AWS) gives companies flexibility. They can quickly increase or decrease resources based on demand without buying new hardware. They also avoid maintaining physical servers and generally pay only for the resources they use.

- on-premises:
  - On-premises means the computers are owned and managed by the company itself, either in its own building or in a rented data center.
  - This setup is called on-premises (often shortened to on-prem).

- Inside a Region are Availability Zones (AZs)
- A Region is not a single building.
- A Region contains multiple Availability Zones (AZs).
  - Each Availability Zone is one or more physically separate data centers with independent power, cooling, and networking.

- This division of responsibilities is what AWS calls the Shared Responsibility Model.
  - AWS secures the cloud, while you secure what you build in the cloud.
  - | AWS is responsible for    | You are responsible for                                    |
    | ------------------------- | ---------------------------------------------------------- |
    | Data centers              | Your application                                           |
    | Physical servers          | Your data                                                  |
    | Networking hardware       | Your IAM users and permissions                             |
    | Storage hardware          | Your passwords                                             |
    | Power and cooling         | Your operating system updates (for many services like EC2) |
    | Replacing failed hardware | Your bucket permissions                                    |

- AWS service categories:
  - | Category                | Purpose                                                 | Example Services               |
    | ----------------------- | ------------------------------------------------------- | ------------------------------ |
    | **Compute**             | Run your code and applications                          | EC2, Lambda, Elastic Beanstalk |
    | **Storage**             | Store files                                             | S3, EFS                        |
    | **Databases**           | Store structured data                                   | RDS, DynamoDB                  |
    | **Networking**          | Connect resources securely                              | VPC, Route 53                  |
    | **Security & Identity** | Control access (permissions)                            | IAM, KMS                       |
    | **Messaging**           | Communication between applications (Send jobs/messages) | SQS, SNS , Security Groups     |
    | **Monitoring**          | Logs and metrics                                        | CloudWatch                     |
    | **Identify & Secutity** | To control who can do what                              | IAM, SSM, KMS, Cognito         |
    | **Observability**       | To see what's going on                                  | CloudWatch                     |

- Well-Architected Framework:
  - It is AWS's guide to designing good cloud applications.
  - We've learned what works and what doesn't. Here are the best practices.
  - It's a set of recommendations.
  - AWS says a good cloud application should stand on six pillars:
    1. Operational Excellence: (Can you operate and improve your application easily?)
    - Questions include:
      - Can you deploy updates safely?
      - Can you find problems quickly?
      - Can you automate repetitive work?
      - Can you recover from mistakes?
    2. Security
    - Strong passwords
    - IAM permissions
    - Encryption
    - Logging
    - Protecting customer data
    3. Reliability (Will it keep working if something fails?)
    - This is why the PDF introduced Availability Zones earlier.Running across multiple Availability Zones improves reliability because if one has a problem, another can continue serving requests.
    - Recover from failures.
    - Handle increased traffic.
    - Continue serving users.
    4. Performance Efficiency
    - Are you using AWS resources efficiently? Suppose your website has only 10 visitors, Do you need a huge, expensive server?
    - As demand changes, you can adjust your resources.
    5. Cost Optimization (Am I spending more money than necessary?)
    - Good cloud design isn't just about making things work—it's also about avoiding unnecessary costs.
    - Delete unused resources.s
    - Choose the right instance sizes.
    - Scale resources based on demand.
    6. Sustainability
    - If your application can do the same job with fewer servers, that's generally better
    - Can you build applications that use computing resources efficiently and reduce unnecessary energy consumption?
    - Efficient systems are often both cheaper and more environmentally friendly.

- S3 stores: vacation.jpg (image)
- Database stores: User ID: 15, Photo: vacation.jpg, Uploaded: Today
  - The database stores information about the file, while S3 stores the file itself.

- AWS Security: IAM & the Access Model (Shared Responsibility Model.):
  - on the half we own.
  - AWS Identity and Access Management (IAM) is the control plane for every API call.
    - Identity means:Who are you?
    - Access Management means:What are you allowed to do?

- AWS has two concepts:
  - Control Plane:
    - Operations that manage AWS resources.
    - Examples:
      - Create EC2
      - Delete S3 bucket
      - Launch Lambda
      - Create SQS queue
      - Attach IAM Role
        These are management operations.
  - Data Plane:
    - Using the resource after it exists.
    - Example:
      - Reading a file from S3
      - Uploading an image
      - Sending an SQS message
      - Reading from DynamoDB
- IAM is the control plane for every API call.
  - Every interaction with AWS eventually becomes an API request.
  - Think of IAM as the security guard standing in front of every AWS API.
  - No request gets through without IAM evaluating it.Before AWS performs any action, IAM checks the permissions.
  - It sits in front of every AWS service call.

- Policy answers: "What is this identity allowed to do?"
  - A policy is a JSON document.

  ```ts
  -{
    Effect: 'Allow',
    Action: 's3:GetObject',
    Resource: 'arn:aws:s3:::my-bucket/*',
  };
  ```

  - Meaning:
    - Allow:
      - Action: read objects from S3
      - Resource: only this bucket

- STS: temporary credentials
  - Security Token Service
  - Its job:
    - Create temporary AWS credentials.
  - Normally credentials look like:
    - Access key
    - Secret key
  - These are long-lived credentials. If someone steals them, they may use them for a long time.
  - STS solves this. Instead of permanent credentials:
    - You get:
      - AccessKeyId
      - SecretAccessKey
      - SessionToken
    - with an expiration time.
