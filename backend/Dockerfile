# Stage 1: Build with Maven
FROM maven:3.8.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run with JRE
FROM eclipse-temurin:17-jre-focal
WORKDIR /app
COPY --from=build /app/target/feedback-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
