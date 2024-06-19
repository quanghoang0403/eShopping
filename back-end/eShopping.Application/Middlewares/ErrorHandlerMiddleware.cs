using eShopping.Common.Exceptions;
using eShopping.Common.Exceptions.ErrorModel;
using eShopping.Common.Extensions;
using eShopping.Notify.Line;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Diagnostics;

namespace eShopping.Application.Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(
            RequestDelegate next,
            IWebHostEnvironment hostingEnvironment,
            ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _hostingEnvironment = hostingEnvironment;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                await HandleExceptionAsync(context, ex, _hostingEnvironment);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception, IWebHostEnvironment hostingEnvironment)
        {
            var httpStatusCode = HttpStatusCode.InternalServerError; // 500 if unexpected
            string message = string.Empty;
            List<ErrorItemModel> errors = new();
            var keys = exception.Data.Keys;
            foreach (var key in keys)
            {
                errors.Add(new ErrorItemModel()
                {
                    Type = key.ToString(),
                    Message = exception.Data[key].ToString()
                });
            }

            string stackTrace = string.Empty;
            //if (hostingEnvironment.IsDevelopment())
            //{
            stackTrace = exception.StackTrace;
            //}

            if (exception is HttpStatusCodeException statusCodeException)
            {
                httpStatusCode = statusCodeException.HttpStatusCode;
                message = statusCodeException.Message;
                errors = statusCodeException.Errors;
            }

            if (message.IsBlank())
            {
                message = exception?.Message;
            }

            // Get the method name where the exception occurred
            string methodName = GetMethodNameFromException(exception);

            // Construct the full request URL
            string requestUrl = $"{context.Request.Scheme}://{context.Request.Host}{context.Request.Path}";


            NotifyLine.SendNotifyLine(requestUrl, methodName, message, stackTrace);

            var result = JsonConvert.SerializeObject(
                new ErrorModel
                {
                    Error = "An error occurred.",
                    ErrorTime = DateTime.Now,
                    Message = message,
                    StackTrace = stackTrace,
                    Errors = errors,
                },
                new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }
            );

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)httpStatusCode;
            return context.Response.WriteAsync(result);
        }

        private static List<ErrorItemModel> HtmlEncode(List<ErrorItemModel> errors)
        {
            return errors.Select(err =>
                new ErrorItemModel
                {
                    Type = HttpUtility.HtmlEncode(err.Type),
                    Message = HttpUtility.HtmlEncode(err.Message)
                }).ToList();
        }

        private static string GetMethodNameFromException(Exception exception)
        {
            var st = new StackTrace(exception, true);
            foreach (var frame in st.GetFrames())
            {
                if (frame.GetMethod().DeclaringType != typeof(ErrorHandlingMiddleware))
                {
                    return frame.GetMethod().Name;
                }
            }
            return "UnknownMethod";
        }
    }
}