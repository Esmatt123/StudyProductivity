using System.Security.Cryptography;
using Microsoft.Extensions.Configuration;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;

namespace StudyProductivityApp.Core.Services
{
    public class EncryptionService : IEncryptionService
{
    private readonly byte[] _key;
    private readonly byte[] _iv;

    public EncryptionService(IConfiguration configuration)
    {
        string configKey = configuration["encryption-key"];
        string configIV = configuration["encryption-iv"];

        _key = DeriveKey(configKey, 32);
        _iv = DeriveKey(configIV, 16);
    }

    private byte[] DeriveKey(string input, int bytes)
    {
        // Using a fixed salt - you might want to make this configurable
        byte[] salt = new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 };
        
        using (var deriveBytes = new Rfc2898DeriveBytes(input, salt, 1000, HashAlgorithmName.SHA256))
        {
            return deriveBytes.GetBytes(bytes);
        }
    }

    public static class KeyGenerator
    {
        public static string GenerateRandomKey(int bytes)
        {
            byte[] key = new byte[bytes];
            RandomNumberGenerator.Fill(key); // Modern API
            return Convert.ToBase64String(key);
        }
    }

    public string Encrypt(string plainText)
    {
        try
        {
            using (Aes aes = Aes.Create())
            {
                aes.Key = _key;
                aes.IV = _iv;
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;

                ICryptoTransform encryptor = aes.CreateEncryptor();

                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                    {
                        swEncrypt.Write(plainText);
                    }

                    return Convert.ToBase64String(msEncrypt.ToArray());
                }
            }
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Encryption failed", ex);
        }
    }

    public string Decrypt(string cipherText)
    {
        try
        {
            using (Aes aes = Aes.Create())
            {
                aes.Key = _key;
                aes.IV = _iv;
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;

                ICryptoTransform decryptor = aes.CreateDecryptor();

                using (MemoryStream msDecrypt = new MemoryStream(Convert.FromBase64String(cipherText)))
                using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                {
                    return srDecrypt.ReadToEnd();
                }
            }
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Decryption failed", ex);
        }
    }
}
}