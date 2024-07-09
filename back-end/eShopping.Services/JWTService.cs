using eShopping.Common.Constants;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Settings;
using eShopping.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;

namespace eShopping.Services
{
    public class JWTService : IJWTService
    {
        private readonly JWTSettings _jwtSettings;
        private readonly IUnitOfWork _unitOfWork;

        public JWTService(IOptions<JWTSettings> jwtSettings, IUnitOfWork unitOfWork)
        {
            _jwtSettings = jwtSettings.Value;
            _unitOfWork = unitOfWork;
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

            // 1. Create Security Token Handler
            var tokenHandler = new JwtSecurityTokenHandler();

            // 2. Private Key to Encrypted
            var tokenKey = _jwtSettings.SecretBytes;

            // 3. Create JwtSecurityToken
            var claims = new List<Claim>
            {
                new(ClaimTypesConstants.ID, user.Id.ToString()),
                new(ClaimTypesConstants.ACCOUNT_ID, user.AccountId.ToString()),
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
            if (!string.IsNullOrWhiteSpace(user.Thumbnail))
            {
                claims.Add(new Claim(ClaimTypesConstants.THUMBNAIL, user.Thumbnail));
            }

            var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature);
            var twtToken = new JwtSecurityToken(
                _jwtSettings.Issuer,
                _jwtSettings.Audience,
                claims: claims,
                //expires: DateTime.Now.AddSeconds(30),
                expires: DateTime.Now.AddMinutes(_jwtSettings.AccessTokenExpirationInMinutes),
                signingCredentials: signingCredentials);

            // 4. Return Token from method
            var jwtToken = tokenHandler.WriteToken(twtToken);
            return jwtToken;
        }

        public async Task<string> GenerateRefreshToken(Guid accountId, string token)
        {
            var refreshToken = await _unitOfWork.RefreshTokens.GetRefreshToken(accountId);
            if (refreshToken == null)
            {
                refreshToken = new RefreshToken
                {
                    AccountId = accountId,
                    Token = token,
                    IsInvoked = false,
                    CreatedDate = DateTime.Now,
                    ExpiredDate = DateTime.Now.AddDays(_jwtSettings.RefreshTokenExpirationInDays)
                };
                refreshToken = await _unitOfWork.RefreshTokens.AddAsync(refreshToken);
            }
            else
            {
                refreshToken.CreatedDate = DateTime.Now;
                refreshToken.ExpiredDate = DateTime.Now.AddDays(30);
                refreshToken.Token = Guid.NewGuid().ToString();
                await _unitOfWork.RefreshTokens.UpdateAsync(refreshToken);
            }
            return refreshToken.Token;
        }

        /// <summary>
        /// ValidateToken
        /// </summary>
        /// <param name="token"></param>
        /// <returns>JwtSecurityToken</returns>
        public bool ValidateToken(string token)
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
                    //ValidateLifetime = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
