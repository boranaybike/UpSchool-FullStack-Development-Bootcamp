﻿using System;
namespace PasswordGenerator.Console
{
    class RandomPasswordGenerator
    {        
        private const string numbers = "0123456789";
        private const string upperCase = "QWERTYUIOPASDFGHJKLZXCVBNM";
        private const string lowerCase = "qwertyuopasdfghjklizxcvbnm";
        private const string specials = "!'^+%&/()=?_.€@~$*-";
        public string GeneratePassword(bool _numbers, bool _uppercase, bool _lowercase, bool _special,
            int passwordSize)
        {
            char[] _password = new char[passwordSize];
            string charSet = "";
            System.Random _random = new Random();

            if (_numbers) charSet += numbers;
            if (_uppercase) charSet += upperCase;
            if (_lowercase) charSet += lowerCase;
            if (_special) charSet += specials;
            if (charSet.Length==0) return charSet;

            for (int i = 0; i < passwordSize; i++)
            {
                _password[i] = charSet[_random.Next(charSet.Length)];
            }

            return String.Join(null, _password);
        }
    }
}