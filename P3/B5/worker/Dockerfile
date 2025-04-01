FROM maven:3.8.6-openjdk-11 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package

FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=build /app/target/worker-1.0-SNAPSHOT-jar-with-dependencies.jar worker.jar
CMD ["java", "-jar", "worker.jar"]