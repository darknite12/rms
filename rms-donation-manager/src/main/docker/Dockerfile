FROM container-registry.oracle.com/java/serverjre:8
VOLUME /tmp
ARG JAR_FILE
ADD maven/${project.build.finalName}.jar app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]