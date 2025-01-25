using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using StudyProductivityApp.Core.Interfaces.RepositoryInterfaces;
using StudyProductivityApp.Core.Models.Dtos;

public class DocumentHub : Hub
{
    private readonly IDocumentRepository _documentRepository; // Repository to handle database operations

    public DocumentHub(IDocumentRepository documentRepository)
    {
        _documentRepository = documentRepository;
    }

   public async Task GetDocument(string documentId, string userId)
{
    try
    {
        if (string.IsNullOrEmpty(documentId))
        {
            Console.WriteLine("Document ID is null or empty.");
            // Send empty document structure
            await Clients.Caller.SendAsync("LoadDocument", JsonSerializer.Serialize(new { content = "" }));
            return;
        }

        var document = await _documentRepository.GetDocumentByIdAsync(documentId, userId);
        if (document == null)
        {
            Console.WriteLine($"Document with ID {documentId} not found.");
            // Send empty document structure
            await Clients.Caller.SendAsync("LoadDocument", JsonSerializer.Serialize(new { content = "" }));
            return;
        }

        // Create a proper document structure
        var documentData = new
        {
            content = string.IsNullOrEmpty(document.Data) ? "" : document.Data,
            id = document.Id,
            name = document.Name,
            ownerId = document.OwnerId
        };

        await Groups.AddToGroupAsync(Context.ConnectionId, documentId);
        
        // Serialize the document data
        var serializedData = JsonSerializer.Serialize(documentData);
        Console.WriteLine($"Sending document data: {serializedData}"); // Debug log
        
        await Clients.Caller.SendAsync("LoadDocument", serializedData);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error in GetDocument: {ex.Message}");
        // Send empty document structure in case of error
        await Clients.Caller.SendAsync("LoadDocument", JsonSerializer.Serialize(new { content = "" }));
    }
}


    public async Task SendChanges(string documentId, object delta)
    {
        // If 'delta' is an object, ensure that the client and server use the same type
        await Clients.OthersInGroup(documentId).SendAsync("ReceiveChanges", delta);
    }


    public async Task SaveDocument(string documentId, string data)
    {
        await _documentRepository.SaveDocumentAsync(documentId, data);
    }

    public async Task UpdateCursorPosition(string documentId, string userId, int index)
    {
        await Clients.OthersInGroup(documentId).SendAsync("ReceiveCursorPosition", userId, index);
    }

    public async Task GetAccessibleDocuments(string userId)
    {
        var documents = await _documentRepository.GetUserAccessibleDocumentsAsync(userId);

        var documentDtos = documents.Select(d => new DocumentDto
        {
            Id = d.Id,
            Name = d.Name,
            // Add any other properties you want to expose in the DTO
        }).ToList();

        await Clients.Caller.SendAsync("LoadAccessibleDocuments", documentDtos);
    }


}
