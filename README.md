# Cypher Cloud
Cypher-Cloud is a secure distributed cloud storage system that uses hybrid encryption (AES-256 + RSA) and application-level sharding to store encrypted file fragments across multiple Amazon S3 buckets, ensuring zero single-point data exposure and strong end-to-end confidentiality.

## Encryption & Storage Workflow
1. Generate a random AES-256 data encryption key (DEK) and encrypt the file.
2. Encrypt (wrap) the DEK using the RSA public key (hybrid encryption).
3. Shard the encrypted file into ordered parts.
4. Store shards in separate S3 buckets and persist encryption metadata.

## Retrieval & Decryption Workflow
1. Fetch all shards and reconstruct the encrypted file.
2. Unwrap the DEK using the RSA private key.
3. Decrypt the file using the AES DEK.
4. Return the original file.

## AWS guide

### Creating an S3 bucket
1. Go to `Amazon S3 > Buckets > Create bucket`.
2. On the top right, choose your closest AZ.
3. Type a bucket name which should be globally unique.
4. Go with all the default settings.
5. Click on `Create bucket` at the bottom.

### Deleting an S3 bucket
1. Go to `Amazon S3 > Buckets > your_bucket_name`.
2. Select all files.
3. Click on `Delete` and confirm.
4. Go to `Amazon S3 > Buckets`.
5. Select the S3 bucket you want to delete.
6. Click on `Delete` and confirm.

### Creating an IAM user
1. Go to `IAM > Users > Create user`.
2. Type a user name (do NOT check on "Provide user access to AWS Management Console").
3. Click on `Next`.
4. Select `Attach policies directly`.
5. Search `AmazonS3FullAccess` and select that policy.
6. Click on `Next`.
7. Review the fields and click on `Create user`.

### Creating an access key for the IAM user
1. Go to `IAM > Users > your_user_name > Create access key`.
2. Select `Application running outside AWS`.
3. Click on `Next`.
4. Add a description (optional).
5. Click on `Create access key`.
6. Copy or download the keys as you can't see them on site again.

## Connect to Atlas using Mongosh
Run the command:
```bash
mongosh mongodb+srv://cluster0.46qvyb6.mongodb.net --username atlas_db_user
```