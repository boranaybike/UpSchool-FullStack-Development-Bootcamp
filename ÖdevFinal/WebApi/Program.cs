using WebApi.Hubs;
using Infrastructure;
using Application;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();


// Add services to the container.

builder.Services.AddControllers();

Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddApplicationServices();
builder.Services.AddInfrastructure(builder.Configuration, builder.Environment.WebRootPath);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.UseCors(builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();
});

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.MapHub<SeleniumLogHub>("/Hubs/SeleniumLogHub");

app.Run();
