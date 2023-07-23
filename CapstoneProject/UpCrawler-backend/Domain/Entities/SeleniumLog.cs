namespace Domain.Entities
{
    public class SeleniumLog
    {
        public Guid Id { get; set; }
        public Guid? OrderId { get; set; }
        public string Message { get; set; }
        public DateTimeOffset SentOn { get; set; }
        public Order? Order { get; set; }

    }
}
