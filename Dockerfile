FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Add build arguments
ARG AZURE_TENANT_ID
ARG AZURE_CLIENT_ID
ARG AZURE_CLIENT_SECRET
ARG KEY_VAULT_URL

# Set as environment variables for the build stage
ENV AZURE_TENANT_ID=$AZURE_TENANT_ID
ENV AZURE_CLIENT_ID=$AZURE_CLIENT_ID
ENV AZURE_CLIENT_SECRET=$AZURE_CLIENT_SECRET
ENV KEY_VAULT_URL=$KEY_VAULT_URL

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

# Copy environment variables from build stage
ENV AZURE_TENANT_ID=$AZURE_TENANT_ID
ENV AZURE_CLIENT_ID=$AZURE_CLIENT_ID
ENV AZURE_CLIENT_SECRET=$AZURE_CLIENT_SECRET
ENV KEY_VAULT_URL=$KEY_VAULT_URL

COPY --from=build /app/publish .

# Create volume for logs
VOLUME /app/logs

# Expose port 5193
EXPOSE 5193

ENTRYPOINT ["dotnet", "StudyProductivityApp.Api.dll"]