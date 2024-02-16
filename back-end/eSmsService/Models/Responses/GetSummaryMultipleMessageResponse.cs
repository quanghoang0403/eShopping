﻿using System.Collections.Generic;

namespace eSmsService.Models.Responses
{
    public class GetSummaryMultipleMessageResponse
    {
        public GetSummaryMultipleMessageResponse()
        {
        }

        public GetSummaryMultipleMessageResponse(string codeResult, string errorMessage, float totalPrice, int totalReceiver)
        {
            CodeResult = codeResult;
            ErrorMessage = errorMessage;
            TotalPrice = totalPrice;
            TotalReceiver = totalReceiver;
        }

        public string CodeResult { get; set; }
        public string ErrorMessage { get; set; }
        public float TotalPrice { get; set; }
        public int TotalReceiver { get; set; }
    }
}