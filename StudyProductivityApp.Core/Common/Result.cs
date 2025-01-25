namespace StudyProductivityApp.Core.Common
{
    public class Result<T>
    {
        public OperationStatus Status { get; set; }
        public T Data { get; set; }
        public string ErrorMessage { get; set; }
    }

    public class Result : Result<object>
    {
    }
}
