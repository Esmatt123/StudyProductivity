
using HotChocolate;
using Microsoft.Extensions.DependencyInjection;
using StudyProductivityApp.Core.Graphql.Queries;
namespace StudyProductivityApp.Core.Graphql.Schemas
{

public static class SchemaRegistration
{
    public static void AddGraphQL(this IServiceCollection services)
    {
        services
            .AddGraphQLServer()
            .AddQueryType<Query>(); // Register query types
    }
}
}