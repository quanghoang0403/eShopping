﻿using System.Text;

namespace eShopping.Domain.Settings
{
    public class JWTSettings
    {
        public string Key { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public long AccessTokenExpirationInMinutes { get; set; }
        public long RefreshTokenExpirationInMinutes { get; set; }
        public byte[] SecretBytes => Encoding.UTF8.GetBytes(Key);
    }
}
