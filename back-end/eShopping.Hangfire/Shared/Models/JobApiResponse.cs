namespace eShopping.Hangfire.Shared.Models
{
    public class JobApiResponse
    {
        public JobApiResponse(bool success, string jobId = null, string errorMessage = null)
        {
            Success = success;
            ErrorMessages = new string[] { errorMessage };
            JobId = jobId;
        }

        public JobApiResponse(bool success, string jobId = null, string[] errorMessages = null)
        {
            Success = success;
            ErrorMessages = errorMessages;
            JobId = jobId;
        }

        public bool Success { get; set; }
        public string[] ErrorMessages { get; set; }
        public string JobId { get; set; }
    }
}