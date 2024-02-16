using System.Collections.Generic;

namespace eShopping.Hangfire.Options
{
    public class GlobalAppSetting
    {
        public Logging Logging { get; set; }
        public ConnectionString ConnectionString { get; set; }
        public Hangfire Hangfire { get; set; }
        public HttpClientSetting HttpClientSetting { get; set; }
        public InternalAuthenticate InternalAuthenticate { get; set; }
        public List<JobSetting> JobSettings { get; set; }
        public Serilog Serilog { get; set; }
    }

    public class Logging
    {
        public LogLevel LogLevel { get; set; }
    }

    public class LogLevel
    {
        public string Default { get; set; }
        public string Microsoft { get; set; }
    }

    public class ConnectionString
    {
        public string Hangfire { get; set; }
    }

    public class Hangfire
    {
        public string User { get; set; }
        public string Pass { get; set; }
    }

    public class HttpClientSetting
    {
        public string Admin { get; set; }
        public string POS { get; set; }
    }

    public class InternalAuthenticate
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class JobSetting
    {
        public string JobName { get; set; }
        public string CronExpression { get; set; }
        public string EndPoint { get; set; }
    }

    public class Serilog
    {
        public string EnableSqlCommandText { get; set; }
        public List<string> Using { get; set; }
        public MinimumLevelModel MinimumLevel { get; set; }
        public List<WriteToModel> WriteTo { get; set; }

        public class MinimumLevelModel
        {
            public string Default { get; set; }
            public OverrideModel Override { get; set; }

            public class OverrideModel
            {
                public string Microsoft { get; set; }
            }
        }

        public class WriteToModel
        {
            public string Name { get; set; }
            public ArgsModel Args { get; set; }

            public class ArgsModel
            {
                public string roleName { get; set; }
                public string roleInstance { get; set; }
                public string instrumentationKey { get; set; }
                public string telemetryConverter { get; set; }
            }
        }
    }
}