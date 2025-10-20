# First stage i made which is build
#So, before making compose yml i first made this container to verify its working then i made the neccessary changes to db url and also implemented docker compose
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app


COPY pom.xml .
RUN mvn dependency:go-offline -B


COPY src ./src
RUN mvn clean package -DskipTests

# this is the 2nd stage of running
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app


COPY --from=build /app/target/*.jar app.jar


EXPOSE 8080


ENV DB_URL=jdbc:mysql://db:3306/hackathondb \
    DB_USERNAME=root \
    DB_PASSWORD=root

# run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
