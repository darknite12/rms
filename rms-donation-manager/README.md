# RMS Donation Manager
This is a donation management system. It features:
  * An event manager for organizing fundraising events
   * Tickets
   * Sitting Tables
  * Donation manager
  * Receipt manager

## Usage
### Build
```
mvn clean install -Ddocker.host=http://localhost:2375 -Ddocker.image.prefix=dockerhubusername docker:build
```

### Push to [Docker Hub](https://hub.docker.com)
```
mvn -Ddocker.host=http://localhost:2375 -Ddocker.username=dockerhubusername -Ddocker.password=dockerhubpassword -Ddocker.image.prefix=dockerhubusername docker:push
```

### Deploying
First, Docker has to be setup in the host machine. Then two services need to be deployed.
1. Maria DB
2. RMS Donation Manager

#### Getting Docker Ready
First install Oracle's jre. Access to Oracle's docker repository will be needed (ie. a username and password)

```
docker login container-registry.oracle.com
docker pull container-registry.oracle.com/java/serverjre:8
```

Next, create docker networks for dev, qa, ppe, prod environments

```
docker network create -d overlay dev
docker network create -d overlay qa
```

#### Deploying Maria DB
The end result will be to create a Maria DB docker service. That has all the required databases with their respective schemas and initial data.

pull the maria db docker image
```
docker pull mariadb:10.3.5
```

create the database root password as docker secret.
```
echo "mysql" | docker secret create mysql-root-password -
```

create the database and users in a file called 01-create-databases-and-users.sql
```
CREATE DATABASE rmsdbdev;
CREATE USER 'rmsuserdev'@'%' IDENTIFIED BY 'rmspassworddev';
GRANT ALL PRIVILEGES ON rmsdbdev.* TO 'rmsuserdev'@'%' IDENTIFIED BY 'rmspassworddev';

CREATE DATABASE rmsdbqa;
CREATE USER 'rmsuserqa'@'%' IDENTIFIED BY 'rmspasswordqa';
GRANT ALL PRIVILEGES ON rmsdbqa.* TO 'rmsuserqa'@'%' IDENTIFIED BY 'rmspasswordqa';
```

create a docker config out of the previously created sql script.
```
docker config create databases-and-users 01-create-databases-and-users.sql
```

create the database schema for all the created databases. The schema is found in the source code `/src/main/resources/db/schma-mysql.sql`
```
dev-schema.sql
qa-schema.sql
```

create docker configs out of the above schemas
```
docker config create dev.schema.sql dev-schema.sql
docker config create qa.schema.sql qa-schema.sql
```

create the initialized data for all the created databases
```
dev-data.sql
qa-data.sql
```

create docker configs out of the above data
```
docker config create dev.data.sql dev-data.sql
docker config create qa.data.sql qa-data.sql
```

create a docker volume for the maria db service
```
docker volume create mysql-data
```

create the Maria DB docker service
```
docker service create --name mariadb --replicas=1 --network dev --network qa \
--config src=databases-and-users,target=/docker-entrypoint-initdb.d/01-create-databases-and-users.sql \
--config src=dev.schema.sql,target=/docker-entrypoint-initdb.d/02-dev-schema.sql \
--config src=dev.data.sql,target=/docker-entrypoint-initdb.d/03-data-schema.sql \
-e MYSQL_ROOT_PASSWORD_FILE=/run/secrets/mysql-root-password \
--secret mysql-root-password \
--mount type=volume,src=mysql-data,dst=/var/lib/mysql \
mariadb:10.3.5
```
*NOTE: The target name of the config files matter. The files need to be in alphabetical order, 01-create-databases-and-users.sql needs to run before 02-dev-schema.sql and it needs to run before 03-data-schema.sql*

#### Deploying RMS Donation Manager
