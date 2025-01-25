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
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5193
ENV ASPNETCORE_ENVIRONMENT=Production
ENV TZ=UTC

# Create volume for logs
VOLUME /app/logs

# Expose port 5193
EXPOSE 5193

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --fail http://localhost:5193/health || exit 1

ENTRYPOINT ["dotnet", "StudyProductivityApp.Api.dll"]