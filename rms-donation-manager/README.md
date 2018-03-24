# RMS Donation Manager
This is a donation management system. It features:
  * An event manager for organizing fundraising events
   * Tickets
   * Sitting Tables
  * Donation manager
  * Receipt manager

## Usage
### Build
`mvn clean install -Ddocker.host=http://localhost:2375 -Ddocker.image.prefix=dockerhubusername docker:build`

### Push to [Docker Hub](https://hub.docker.com)
`mvn -Ddocker.host=http://localhost:2375 -Ddocker.username=dockerhubusername -Ddocker.password=dockerhubpassword -Ddocker.image.prefix=dockerhubusername docker:push`
