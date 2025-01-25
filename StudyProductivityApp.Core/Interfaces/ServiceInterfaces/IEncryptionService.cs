

namespace StudyProductivityApp.Core.Interfaces.ServiceInterfaces
{
    public interface IEncryptionService
    {
        string Encrypt(string plainText);
        string Decrypt(string cipherText);
    }
}