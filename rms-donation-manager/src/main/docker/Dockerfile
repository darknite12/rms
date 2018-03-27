FROM container-registry.oracle.com/java/serverjre:8
VOLUME /tmp
EXPOSE 80
ADD maven/${project.build.finalName}.jar app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]