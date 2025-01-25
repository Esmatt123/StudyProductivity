using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;

public class SasTokenRefreshService : IHostedService, IDisposable
{
    private readonly IServiceProvider _services;
    private Timer _timer;

    public SasTokenRefreshService(IServiceProvider services)
    {
        _services = services;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _timer = new Timer(DoWork, null, TimeSpan.Zero, 
            TimeSpan.FromHours(6)); // Refresh every 6 hours

        return Task.CompletedTask;
    }

    private async void DoWork(object state)
    {
        using (var scope = _services.CreateScope())
        {
            var userService = scope.ServiceProvider
                .GetRequiredService<IUserService>();

            await userService.RefreshProfileImageSasTokens();
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}