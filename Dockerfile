FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY *.sln .
COPY ["StudyProductivityApp.Api/StudyProductivityApp.Api.csproj", "StudyProductivityApp.Api/"]
COPY ["StudyProductivityApp.Application/StudyProductivityApp.Application.csproj", "StudyProductivityApp.Application/"]
COPY ["StudyProductivityApp.Core/StudyProductivityApp.Core.csproj", "StudyProductivityApp.Core/"]
COPY ["StudyProductivityApp.Persistence/StudyProductivityApp.Persistence.csproj", "StudyProductivityApp.Persistence/"]
COPY ["StudyProductivityApp.Persistence.Tests/StudyProductivityApp.Persistence.Tests.csproj", "StudyProductivityApp.Persistence.Tests/"]

# Restore as distinct layers
RUN dotnet restore "StudyProductivityApp.Api/StudyProductivityApp.Api.csproj"

# Copy everything else
COPY . .

# Build and publish
RUN dotnet build "StudyProductivityApp.Api/StudyProductivityApp.Api.csproj" -c Release -o /app/build
RUN dotnet publish "StudyProductivityApp.Api/StudyProductivityApp.Api.csproj" -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5193
ENV DOTNET_URLS=http://+:5193
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish .
EXPOSE 5193

ENTRYPOINT ["dotnet", "StudyProductivityApp.Api.dll"]