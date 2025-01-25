namespace StudyProductivityApp.Api
{
    public class GraphQLErrorFilter : IErrorFilter
{
    public IError OnError(IError error)
    {
        return error.WithMessage(error.Exception?.Message ?? error.Message);
    }
}
}