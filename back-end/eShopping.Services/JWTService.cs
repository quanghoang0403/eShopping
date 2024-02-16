using eShopping.Common.Constants;
using eShopping.Common.Models.User;
using eShopping.Domain.Settings;
using eShopping.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace eShopping.Services
{
    public class JWTService : IJWTService
    {
        private readonly JWTSettings _jwtSettings;

        public JWTService(IOptions<JWTSettings> jwtSettings)
        {
            _jwtSettings = jwtSettings.Value;
        }


        /// <summary>
        /// This method is used to generate a new string of tokens to access our API(s).
        /// </summary>
        /// <returns>The token string</returns>
        public string GenerateAccessToken(LoggedUserModel user)
        {

            if ((string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password)) &&
                string.IsNullOrWhiteSpace(user.PhoneNumber)
             )
            {
                return null;
            }

            var tokenExpires = _jwtSettings.AccessTokenExpirationInMinutes;

            if (user.NeverExpires)
            {
                // 10 years.
                tokenExpires = 5256000;
            }

            // 1. Create Security Token Handler
            var tokenHandler = new JwtSecurityTokenHandler();

            // 2. Private Key to Encrypted
            var tokenKey = _jwtSettings.SecretBytes;

            // 3. Create JwtSecurityToken
            var claims = new List<Claim>
            {
                new Claim(ClaimTypesConstants.ID, user.Id.ToString()),
                new Claim(ClaimTypesConstants.ACCOUNT_ID, user.AccountId.ToString()),
            };

            if (!string.IsNullOrWhiteSpace(user.FullName))
            {
                claims.Add(new Claim(ClaimTypesConstants.FULL_NAME, user.FullName));
            }

            if (!string.IsNullOrWhiteSpace(user.AccountType))
            {
                claims.Add(new Claim(ClaimTypesConstants.ACCOUNT_TYPE, user.AccountType));
            }

            if (!string.IsNullOrWhiteSpace(user.Email))
            {
                claims.Add(new Claim(ClaimTypesConstants.EMAIL, user.Email));
            }

            if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
            {
                claims.Add(new Claim(ClaimTypesConstants.PHONE_NUMBER, user.PhoneNumber));
            }

            var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature);
            var twtToken = new JwtSecurityToken(
                _jwtSettings.Issuer,
                _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(tokenExpires),
                signingCredentials: signingCredentials);

            // 4. Return Token from method
            var jwtToken = tokenHandler.WriteToken(twtToken);
            return jwtToken;

        }

        /// <summary>
        /// ValidateToken
        /// </summary>
        /// <param name="token"></param>
        /// <returns>JwtSecurityToken</returns>
        public JwtSecurityToken ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityKey = new SymmetricSecurityKey(_jwtSettings.SecretBytes);

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = securityKey,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                return jwtToken;
            }
            catch (Exception)
            {
                return null;
            }

        }

    }
}
