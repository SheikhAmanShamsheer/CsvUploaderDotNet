using api;
using api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace worker.Service
{
    public class LogService
    {
        private readonly IMongoCollection<Log> _logCollection;

    public LogService(LogDatabaseSetting bookStoreDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            bookStoreDatabaseSettings.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            bookStoreDatabaseSettings.DatabaseName);

        _logCollection = mongoDatabase.GetCollection<Log>(
            bookStoreDatabaseSettings.LogCollectionName);
    }

    public async Task<List<Log>> GetAsync() =>
        await _logCollection.Find(_ => true).ToListAsync();

    public async Task<Log?> GetAsync(string id) =>
        await _logCollection.Find(x => x.fileId == id).FirstOrDefaultAsync();

    public async Task<Log?> FindByFileName(string fileName) =>
        await _logCollection.Find(x => x.fileName == fileName).FirstOrDefaultAsync();

    public async Task CreateAsync(Log newBook) =>
        await _logCollection.InsertOneAsync(newBook);

    public async Task UpdateAsync(string id, Log updatedBook) {
        var filter = Builders<Log>.Filter
                    .Eq(x => x.fileName, id);
        var update = Builders<Log>.Update
        .Set(x => x.status, updatedBook.status)
        .Set(x => x.NoOfBatchesCreated, updatedBook.NoOfBatchesCreated)
        .Set(x => x.BatchData, updatedBook.BatchData);
        await _logCollection.UpdateOneAsync(filter, update);
    }

    public async Task RemoveAsync(string id) =>
        await _logCollection.DeleteOneAsync(x => x.fileId == id);
    }
}